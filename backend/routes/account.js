const express = require("express");
const { authMiddleware } = require("../middleware");
const Account = require("../db/accountModel");
const Transaction = require("../db/transactionModel");
const { z } = require("zod");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const accountSchema = z.object({
  balance: z.number().nonnegative(),
});

const TransferSchema = z.object({
  amount: z.number().positive(),
  to: z.string(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    //validate account data using zod schema
    const validation = accountSchema.safeParse(account);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid account data",
        errors: validation.error.issues,
      });
    }

    res.json({
      balance: account.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  //to handle proper transactin logic
  const session = await mongoose.startSession();
  try {
    const validation = TransferSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const { amount, to } = req.body;

    // Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({
        message: "Invalid destination account ID format",
      });
    }

    session.startTransaction();
    //sender account
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    //check if even the sender account exists or not and if the sender account
    //balance is enough to tranfer such amount from their respective account to some other
    if (!account || account.balance < amount) {
      //abort the transaction
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    //if everything okay then procees ->get the account you are transfering
    const recipient = await Account.findOne({ userId: to }).session(session);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid destination account" });
    }

    //updae the sender and recievers account balance
    //How $inc Works
    //$inc automatically adds the specified value to the field.
    //To increment (add to the balance):
    //{ $inc: { balance: amount } }  // Implicitly adds (+)
    //To decrement (subtract from the balance):
    //{ $inc: { balance: -amount } } // Negative value subtracts

    //1-> deduct from sender balance
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    //2->increase to recievers account
    await Account.updateOne(
      {
        userId: to,
      },
      { $inc: { balance: amount } }
    ).session(session);

    //-----------transactionlog
    // CREATE TRANSACTION RECORD - THIS IS NEW
    const transaction = new Transaction({
      senderId: req.userId,
      receiverId: to,
      amount: amount,
      status: "completed",
      timestamp: new Date(),
    });

    await transaction.save({ session });
    //-----------transactionlog
    //commmit the transaction to finally update the changes
    await session.commitTransaction();

    res.json({
      message: "Transfer Successful!",
      transactionId: transaction._id,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

//-------transactionlog
// NEW ROUTE - GET TRANSACTION HISTORY
router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type = "all" } = req.query;
    const userId = req.userId;

    let query = {};
    if (type === "sent") {
      query = { senderId: userId };
    } else if (type === "received") {
      query = { receiverId: userId };
    } else {
      query = {
        $or: [{ senderId: userId }, { receiverId: userId }],
      };
    } 

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .populate("senderId", "firstName lastName username")
      .populate("receiverId", "firstName lastName username")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments(query);

    const formattedTransactions = transactions.map((transaction) => {
      const isSent = transaction.senderId._id.toString() === userId.toString();

      return {
        id: transaction._id,
        amount: transaction.amount,
        type: isSent ? "sent" : "received",
        timestamp: transaction.timestamp,
        status: transaction.status,
        description: transaction.description,
        otherParty: {
          id: isSent ? transaction.receiverId._id : transaction.senderId._id,
          name: isSent
            ? `${transaction.receiverId.firstName} ${transaction.receiverId.lastName}`
            : `${transaction.senderId.firstName} ${transaction.senderId.lastName}`,
          username: isSent
            ? transaction.receiverId.username
            : transaction.senderId.username,
        },
      };
    });

    res.json({
      transactions: formattedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
        totalTransactions,
        hasMore: skip + transactions.length < totalTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// NEW ROUTE - GET TRANSACTION SUMMARY
router.get("/transaction-summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const sentStats = await Transaction.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const receivedStats = await Transaction.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const recentTransactions = await Transaction.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "firstName lastName")
      .populate("receiverId", "firstName lastName")
      .sort({ timestamp: -1 })
      .limit(5);

    const summary = {
      sent: {
        totalAmount: sentStats.length > 0 ? sentStats[0].totalAmount : 0,
        count: sentStats.length > 0 ? sentStats[0].count : 0,
      },
      received: {
        totalAmount:
          receivedStats.length > 0 ? receivedStats[0].totalAmount : 0,
        count: receivedStats.length > 0 ? receivedStats[0].count : 0,
      },
      recentTransactions: recentTransactions.map((transaction) => {
        const isSent =
          transaction.senderId._id.toString() === userId.toString();
        return {
          id: transaction._id,
          amount: transaction.amount,
          type: isSent ? "sent" : "received",
          timestamp: transaction.timestamp,
          otherParty: isSent
            ? `${transaction.receiverId.firstName} ${transaction.receiverId.lastName}`
            : `${transaction.senderId.firstName} ${transaction.senderId.lastName}`,
        };
      }),
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
//-------transactionlog

module.exports = router;

// POST http://localhost:3000/api/v1/user/signup
// {
//   "username": "alice@example.com",
//   "firstName": "Alice",
//   "lastName": "Smith",
//   "password": "password123"
// }
// User 2 (Receiver):
// jsonPOST http://localhost:3000/api/v1/user/signup
// {
//   "username": "bob@example.com",
//   "firstName": "Bob",
//   "lastName": "Johnson",
//   "password": "password123"
// }

// testing postman
