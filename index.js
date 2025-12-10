import express from "express";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import session from "express-session";
import { execFile } from "child_process";
import fs from "fs";
import { parse } from "csv-parse/sync";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }
// console.log(process.env.MDB_URL);

// Routes
import UserRouter from "./routes/UserRouter.js";
import StockRouter from "./routes/StockRouter.js";
// Models
import { Stock } from "./models/Stock.js";

const app = express();

// Database
// const dbUrl = process.env.LDB_URL;
const dbUrl = process.env.MDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Views
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", "views");
// Allows 'view' directory to be run from outside the project
// app.set("views", path.join(__dirname, "/views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret: "notagoodsecret",
  touchAfter: 60 * 60 * 24,
});

app.use(
  session({
    store,
    name: "session",
    secret: "notagoodsecret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Routes
app.use("/", UserRouter);
app.use("/", StockRouter);

// Position Sze Controller
const readCSV = (page) => async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const file = fs.readFileSync("stockData.csv", "utf-8");
  const stockData = parse(file, { columns: true, skip_empty_lines: true });

  const stocks = await Stock.find({ userId: req.session.user_id }).lean();

  // const merge = { ...stocks, ...parsed };
  // const merge = Object.assign({}, stocks, parsed);
  const merge = stocks.map((item1) => {
    const item2 = stockData.find((i) => i["ticker"] === item1["ticker"]) || {};
    // const { ticker, ...rest } = item2;
    return { ...item1, ...item2 };
  });
  // return merge;
  // res.send(merge);
  // res.render("positionSize", { stockData: merge });
  res.render(page, { stockData: merge });
};

// Position Size Route
app.get("/positionSize", readCSV("positionSize"));
app.get("/watchList", readCSV("watchList"));

app.get("/run-python", async (req, res) => {
  // res.send("hello python");
  // if (!req.session.user_id) {
  //   return res.redirect("/login");
  // }

  // Get stocks
  // "lean", converts Mongoose Document object to JS Objects
  //          by stripping the meta data
  // const stocks = await Stock.find({}).lean();

  // Get stock info
  execFile("python3", ["yahoo.py"], () => {
    res.redirect("/positionSize");
  });

  // const process = spawn("python3", ["yahoo.py"]);

  // let result = "";
  // process.stdout.on("data", (data) => {
  //   result += data.toString();
  // });

  // process.on("close", () => {
  //   // const parsed = JSON.parse(result);

  //   // res.render("positionSize", { stockData: merge });
  // });
});

// Server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
