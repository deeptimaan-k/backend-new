const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const Routes = require("./routes/route.js");
const { errorHandler } = require("./middleware/error.middlewares.js");

const PORT = process.env.PORT || 5002;

dotenv.config();

console.log("MONGO_URL:", process.env.MONGO_URL); // Check if MONGO_URL is correctly read

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Ensure this middleware is used

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.use("/", Routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
