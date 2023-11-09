const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoUrl =
  "mongodb+srv://mnicokar:BayValleyTech@cluster0.jtu2rd7.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

app.listen(5000, () => {
  console.log("server started");
});

app.post("/post", async (req, res) => {
  console.log(req.body);
  const { data } = req.body;

  try {
    if (data == "Mobin") {
      res.send({ status: "ok" });
    } else {
      res.send({ status: "user not found" });
    }
  } catch (error) {
    res.send({ status: "Something went wrong try again" });
  }
});
