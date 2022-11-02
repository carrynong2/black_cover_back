const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "black_cover",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database = ", err);
  }
  console.log("MySQL successfully connected");
});

// CREATE Routes
app.post("/create", async (req, res) => {
  const { name, image, detail } = req.body;

  try {
    connection.query(
      "INSERT INTO chrs(name, image, detail) VALUES(?, ?, ?)",
      [name, image, detail],
      (err, results, field) => {
        if (err) {
          console.log("Error while inserting a chrs into database ", err);
          return res.status(400).send();
        } else {
          res.status(201).json({ message: "New chrs successfully created! " });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/characters", async (req, res) => {
  try {
    connection.query("SELECT * FROM chrs", (err, results, filed) => {
      if (err) {
        console.log("Error not found data in database");
        res.status(400).send();
      } else {
        res.status(200).json(results);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
