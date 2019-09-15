const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const MONGO_URI = "mongodb://localhost/rest_social";

const authRoutes = require("./routes/authRoutes");
app.use(cors());
app.use(bodyParser.json()); // application/json
app.use(authRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(result => {
  app.listen(8080);
});
