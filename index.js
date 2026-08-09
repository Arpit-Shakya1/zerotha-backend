
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

let tempPositions = [
    {
        product: "CNC",
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "+0.58%",
        day: "-1.24%",
        isLoss: true,
    },
    {
        product: "CNC",
        name: "JUBLFOOD",
        qty: 1,
        avg: 3124.75,
        price: 3082.65,
        net: "+10.04%",
        day: "-1.35%",
        isLoss: true,
    },
];

app.get("/addPositions", async (req, res) => {
    try {
        for (const item of tempPositions) {
            const newPosition = new PositionsModel({
                product: item.product,
                name: item.name,
                qty: item.qty,
                avg: item.avg,
                price: item.price,
                net: item.net,
                day: item.day,
                isLoss: item.isLoss || false,
            });

            await newPosition.save();
        }

        res.send("Positions Added Successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while saving positions.");
    }
});

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