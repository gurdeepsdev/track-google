const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const collectRoute = require("./routes/collect");

app.use("/collect", collectRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
