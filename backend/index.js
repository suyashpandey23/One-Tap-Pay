require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT || 3000;
const dbConnect = require("./db/dbConnect");
const mainRouter = require("./routes/index");

const allowedOrigins = [
  //   'https://temp-money.vercel.app',
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
dbConnect();

app.use("/api/v1", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (e) => {
    console.error("Error starting server: ", e);
  });
