const express = require("express");
const api = require("./api");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors());
// const router = express.Router();
const dbUrl =
  "mongodb+srv://Test:Test123@cluster0.nluje5t.mongodb.net/Insta-DB";
const mongoose = require("mongoose");
app.listen(8080, (err) => {
  if (err) console.log(err);

  console.log("Server started successfully at port 8080");
});
mongoose.set("strictQuery", true);
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log("some error occured " + e);
  });
app.use("/", api);
