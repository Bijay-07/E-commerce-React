const express = require("express");
const app = express();
require('dotenv').config();
const userRoutes = require("./routes/user.route")
const categoryRoutes = require("./routes/category.route")
const productRoutes = require("./routes/product.route")
const cartRoutes = require("./routes/cart.route")
const orderRoutes = require("./routes/order.route")
const authRoutes = require("./routes/auth.route");
const connectDB = require("./config/db")
const cors = require("cors");

const PORT = process.env.PORT;

connectDB();
app.use(cors());

app.use(express.json());

//Allow only your React frontend
app.use(cors({
    origin: process.env.REACT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credential: true
}));

//Route to all the models
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res)=>{
    res.send("Hello");
})

app.listen(PORT, ()=>{
    console.log("Server is running")
})