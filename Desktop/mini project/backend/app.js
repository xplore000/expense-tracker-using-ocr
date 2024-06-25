const express = require("express");

const cors = require("cors");
const app = express();
const fs = require("fs");
const { db } = require("./db/db");
const morgan = require("morgan");
const colors = require("colors");
require("dotenv").config();

const PORT = process.env.PORT || 3002; // Default to port 3000 if PORT environment variable not set

//middlewares
app.use(express.json());
app.use(cors());

//routes
fs.readdirSync("./routes").map((route) =>
  app.use("/api/v1", require("./routes/" + route))
);

const server = () => {
  db();
  app.listen(PORT, '0.0.0.0', () => { // Listen on all available network interfaces
    console.log(`Server listening on port ${PORT}`.yellow.bold);
  });
};

server();
