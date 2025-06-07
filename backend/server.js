const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const routes = require("./routes/routes");

const port = process.env.PORT || 5000;

dotenv.config();

connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res
    .status(200)
    .json({ message: "Anonymous Mesaging App's server is Live✅" });
});

app.use("/", routes);

app.listen(port, () => {
  console.log(
    `Anonymous messaging app's server is running on http://localhost:${port}`
  );
});
