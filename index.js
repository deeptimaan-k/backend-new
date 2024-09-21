const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const Routes = require("./routes/route.js");
const { errorHandler } = require("./middleware/error.middlewares.js");

const PORT = process.env.PORT || 5002;
//config
dotenv.config();


app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Ensure this middleware is used

app.use(express.json({ limit: "10mb" }));
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

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
