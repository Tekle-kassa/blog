const express = require("express");
const dotenv = require("dotenv").config();
const connectdb = require("./db");
const app = express();
connectdb();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
