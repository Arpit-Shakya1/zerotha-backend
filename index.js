
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("./model/UserModel");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require("cors")

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
 const {OrdersModel} = require('./model/OrdersModel');
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
app.use(cors());
app.use(bodyParser.json());



// SEND OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        message: "Enter a valid 10 digit mobile number",
      });
    }

    // 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP 5 minutes ke liye valid
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await UserModel.findOne({ phone });

    if (!user) {
      user = new UserModel({
        phone,
        otp,
        otpExpiry,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    // Development ke liye console me OTP
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


// VERIFY OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await UserModel.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        message: "Please request OTP first",
      });
    }

    // OTP expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // OTP incorrect
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // User verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});




app.get("/me", authMiddleware, async(req, res) =>{
    try{
        const user = await UserModel.findById(req.user.userId).select("-otp -otpExpiry");

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            success: true,
            user,
        });
    } catch (error){
        console.log(error);

        res.status(5000).json({
            message: "Server error",
        });
    }
});





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