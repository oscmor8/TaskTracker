const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/requestDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const requestSchema = mongoose.Schema({
  item: String,
});

const Request = mongoose.model("Request", requestSchema);

app.get("/", async (req, res) => {
  try {
    const foundRequests = await Request.find();
    res.render("home", { items: foundRequests });
  } catch (err) {
    console.log(err);
    res.render("error"); // Render an error page or handle the error appropriately
  }
});

app.post("/", async (req, res) => {
  const input = req.body.input;
  const newList = new Request({ item: input });

  try {
    await newList.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("error"); // Render an error page or handle the error appropriately
  }
});

app.post("/delete", async (req, res) => {
  const item = req.body.deletebtn;
  try {
    await Request.findByIdAndRemove(item);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("error"); // Render an error page or handle the error appropriately
  }
});

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
