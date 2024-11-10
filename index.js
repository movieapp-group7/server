import express from "express";
import cors from "cors";
import pg from "pg";

const port = 3001;
const { Pool } = pkg;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port)