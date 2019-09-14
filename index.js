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

mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(result => {
  app.listen(8080);
});
