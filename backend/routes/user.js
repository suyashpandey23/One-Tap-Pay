const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");
const Account = require("../db/accountModel");
const Transaction = require("../db/transactionModel");
const zod = require("zod");
const router = express.Router();
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string().min(1),
  lastName: zod.string().min(1),
  password: zod.string().min(6),
});

router.post("/signup", async (req, res) => {
  //validate user input using zod schema
  const { success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.issues,
    });
  }

  //if validation is passed then check if same username should not exist
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(409).json({
      message: "username/Email already taken",
    });
  }

  try {
    const hashedpasswords = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedpasswords,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    //save the req user in db
    await user.save();

    //once the user is saved, create a account for the same user , to match use the default
    //._id of a user which gets created by its owm in mongodb ans is unique to link with account
    await Account.create({
      userId: user._id,
      balance: 1 + Math.round(Math.random() * 10000),
    });

    //     Create a JWT token using userId as the payload and a secret from .env.
    // Used for authentication later

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    //Fetch the created user again (for returning in response), but:
    // .select('-password') removes the password field from the output for security
    const userTosend = await User.findOne(user._id).select("-passwords");
    if (!userTosend) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(201).json({
      messege: "user created successfully",
      user: userTosend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});

router.post("/signin", async (req, res) => {
  const { success, error } = signinSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Validation failed",
      error: error.issues,
    });
  }

  try {
    //find a user with smae username and password
    //find username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({
        message: "Invalid username or password",
      });
    }
    //match password
    const userpass = await bcrypt.compare(req.body.password, user.password);
    //if anyone does not match
    if (!userpass) {
      return res.status(404).json({
        message: "Invalid username or password",
      });
    }

    // creating (signing) a JWT (JSON Web Token) for a user after successful signup or login.
    // This token is a cryptographically signed string that contains user information (here, userId) and can be safely sent to the frontend or stored in a cookie.
    //  Breakdown:
    // Part	Meaning
    // { userId: user._id }	 Payload — the data you want to store in the token. This gets encoded and is readable after decoding (but not modifiable without breaking the signature).
    // process.env.JWT_SECRET	 Secret Key — this is used to sign the token so that it can't be forged. It's stored securely in your .env file. Only your backend should know this.
    // { expiresIn: '1h' }	 Options — sets token expiration to 1 hour (good security practice). After 1 hour, the token is invalid.
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //excluding the password to avoid insesitive data
    const usertosendtoFrontend = await User.findById(user._id).select(
      "-password"
    );
    if (!usertosendtoFrontend) {
      return res.status(404).json({ message: "User not found" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Signin successful",
      token: token,
      user: usertosendtoFrontend,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success, error } = updateSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "validation failed",
      error: error.issues,
    });
  }

  const updateData = { ...req.body };
  //if you want to update password hash it before updating
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  try {
    await User.updateOne({ _id: req.userId }, updateData);
    res.json({
      message: "User updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

// This route is used to fetch the profile of the currently logged-in user.
// It's commonly used on page load (like a dashboard) when a frontend wants to retrieve the user's info after login using a token.
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(201).json({
      message: "user found",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user information",
      error: error.message,
    });
  }
});

// This defines a GET API endpoint at /bulk
// It’s protected by authMiddleware (meaning only logged-in users can access it).
// It performs a search across user data — useful for features like searching contacts to send money .
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const loggedInUserId = req.userId;

  const users = await User.find({
    $and: [
      {
        $or: [
          { firstName: { $regex: filter, $options: "i" } }, // Add "i" option for case-insensitive search
          { lastName: { $regex: filter, $options: "i" } },
        ],
      },
      { _id: { $ne: loggedInUserId } }, // Exclude the current logged-in user
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

//logout route
router.post("/logout", authMiddleware, (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//-----transactionlog
router.get("/my-transactions", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, type = "all" } = req.query;
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

    const transactionList = transactions.map((transaction) => {
      const isSent = transaction.senderId._id.toString() === userId.toString();

      if (isSent) {
        return {
          id: transaction._id,
          type: "SENT",
          amount: transaction.amount,
          description: `Sent ₹${transaction.amount} to ${transaction.receiverId.firstName} ${transaction.receiverId.lastName}`,
          sentTo: {
            name: `${transaction.receiverId.firstName} ${transaction.receiverId.lastName}`,
            username: transaction.receiverId.username,
            userId: transaction.receiverId._id,
          },
          timestamp: transaction.timestamp,
          status: transaction.status,
          formattedTime: new Date(transaction.timestamp).toLocaleString(
            "en-IN",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
      } else {
        return {
          id: transaction._id,
          type: "RECEIVED",
          amount: transaction.amount,
          description: `Received ₹${transaction.amount} from ${transaction.senderId.firstName} ${transaction.senderId.lastName}`,
          receivedFrom: {
            name: `${transaction.senderId.firstName} ${transaction.senderId.lastName}`,
            username: transaction.senderId.username,
            userId: transaction.senderId._id,
          },
          timestamp: transaction.timestamp,
          status: transaction.status,
          formattedTime: new Date(transaction.timestamp).toLocaleString(
            "en-IN",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
      }
    });

    res.json({
      message: "Transaction history retrieved successfully",
      transactions: transactionList,
      summary: {
        totalTransactions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
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

// NEW ROUTE - MONEY SENT HISTORY
router.get("/money-sent", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sentTransactions = await Transaction.find({ senderId: userId })
      .populate("receiverId", "firstName lastName username")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSent = await Transaction.countDocuments({ senderId: userId });

    const sentList = sentTransactions.map((transaction) => ({
      id: transaction._id,
      amount: transaction.amount,
      sentTo: `${transaction.receiverId.firstName} ${transaction.receiverId.lastName}`,
      username: transaction.receiverId.username,
      timestamp: transaction.timestamp,
      status: transaction.status,
      date: new Date(transaction.timestamp).toLocaleDateString("en-IN"),
      time: new Date(transaction.timestamp).toLocaleTimeString("en-IN"),
    }));

    res.json({
      message: "Money sent history",
      sentTransactions: sentList,
      totalSent,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSent / parseInt(limit)),
        hasMore: skip + sentTransactions.length < totalSent,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// NEW ROUTE - MONEY RECEIVED HISTORY
router.get("/money-received", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const receivedTransactions = await Transaction.find({ receiverId: userId })
      .populate("senderId", "firstName lastName username")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReceived = await Transaction.countDocuments({
      receiverId: userId,
    });

    const receivedList = receivedTransactions.map((transaction) => ({
      id: transaction._id,
      amount: transaction.amount,
      receivedFrom: `${transaction.senderId.firstName} ${transaction.senderId.lastName}`,
      username: transaction.senderId.username,
      timestamp: transaction.timestamp,
      status: transaction.status,
      date: new Date(transaction.timestamp).toLocaleDateString("en-IN"),
      time: new Date(transaction.timestamp).toLocaleTimeString("en-IN"),
    }));

    res.json({
      message: "Money received history",
      receivedTransactions: receivedList,
      totalReceived,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReceived / parseInt(limit)),
        hasMore: skip + receivedTransactions.length < totalReceived,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
//-----transactionlog

module.exports = router;

//testing in postman
// {
//   "username": "john.doe@example.com",
//   "firstName": "John",
//   "lastName": "Doe",
//   "password": "password123"
// }
// {
//   "username": "john.doe@example.com",
//   "password": "password123"
// }
