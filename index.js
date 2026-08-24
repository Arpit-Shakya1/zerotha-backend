
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require("cors")

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
 const {OrdersModel} = require('./model/OrdersModel')
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
app.use(cors());
app.use(bodyParser.json());


app.get('/allHoldings', async(req,res)=>{
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings)
});

app.get("/allPositions", async(req,res) =>{
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.post('/newOrder',(req, res)=>{
    let newOrder = new OrdersModel({
        name:req.body.name,
        qty:req.body.qty,
        price:req.body.price,
        mode:req.body.mode,
    });

    newOrder.save();
    res.send("order saved");
})

mongoose
    .connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:", err);
    });