import express from "express";
import { Stock } from "../models/Stock.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const stocks = await Stock.find({ userId: req.session.user_id });
  // const stocks = await Stock.find({});
  // res.send(stocks);
  res.render("index", { stocks });
});

router.post("/createStock", async (req, res) => {
  const { ticker, company, averageCost } = req.body;
  const userId = req.session.user_id;
  const stock = new Stock({
    ticker: ticker.toUpperCase(),
    company,
    averageCost,
    userId,
  });
  // return res.send(stock);
  await stock.save();
  res.redirect("/");
});

router.get("/editStock/:id", async (req, res) => {
  const id = req.params.id;
  const stock = await Stock.findById(id);
  res.render("editStock", { stock });
});

router.post("/updateStock/:id", async (req, res) => {
  // res.send(req.body);
  const id = req.params.id;
  const content = req.body;
  await Stock.findByIdAndUpdate(id, content);
  res.redirect("/positionSize");
});

router.post("/deleteStock/:id", async (req, res) => {
  // res.send(req.params);
  const id = req.params.id;
  await Stock.findByIdAndDelete(id);
  res.redirect("/");
});

router.post("/addPosition/:id", async (req, res) => {
  const id = req.params.id;
  await Stock.findByIdAndUpdate(id, { watchList: false, position: true });
  res.redirect("/watchList");
});

router.post("/addWatchList/:id", async (req, res) => {
  const id = req.params.id;
  await Stock.findByIdAndUpdate(id, {
    averageCost: 0,
    watchList: true,
    position: false,
  });
  res.redirect("/positionSize");
});

export default router;
