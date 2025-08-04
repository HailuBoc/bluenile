import mongoose from "mongoose";
import express from "express";

const app = express();
app.use(express.json());

app.listen(5000, () => {
  console.console.log("server is running");
});
