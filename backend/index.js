const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;
//mongodb connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connect to Database"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
});
//
const userModel = mongoose.model("users", userSchema);

//api req,res are call back function
app.get("/", (req, res) => {
  res.send("server is running ");
});
//api signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: email }).then((err, result) => {
    console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  });
});
//login api
app.post("/Login", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: email }).then((result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: " This email is not available ",
        alert: false,
      });
    }
  });
});

//product section

//Schema =It defines the structures of the documents
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
  decription: String,
});

//Model
const productModel = mongoose.model("product", schemaProduct);
//save product in data
//api

app.post("/uploadproduct", async (req, res) => {
  console.log(req.body);
  const data = await productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "Upload Successfully" });
});

//Api for getting all this mongodb data which i was saved
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

app.listen(PORT, () => console.log("server is running at port : " + PORT));
