const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const connectdb = require("./db");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
connectdb();

const userRoute = require("./routes/user");
app.use("/api/user", userRoute);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
