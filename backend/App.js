import express from "express";
import mongoose from "mongoose";
import { UserModel } from "./model/userModel.js";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "https://huluschooltutorapp-3zy4.vercel.app/",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.post("/signup", (req, res) => {
  const { email } = req.body;

  UserModel.findOne({ email: email }).then((existingUser) => {
    if (existingUser) {
      res.json({ message: "User Already Exists" });
    }
    UserModel.create(req.body)
      .then((newUser) => res.json(newUser))

      .catch((err) => res.status(500).json({ error: err.message }));
  });
  // .catch(() => res.status(500).json({ error: "Yo you are doing shit mf" }));
});

// Connect to MongoDB

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.status(200).json("Successfully logged in");
      } else {
        res.status(401).json("Incorrect password");
      }
    } else {
      res.status(500).json("You haven't been registered");
    }
  });
});
app.get("/dashboard", (req, res) => {
  res.send({ message: "get to home route" });
});
app.get("/signup", async (req, res) => {
  const newget = await UserModel.find({});
  try {
    return res.status(204).json(newget);
  } catch (error) {
    return console.log(error);
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/netxjsApp")
  .then(() => {
    app.listen(PORT, () => {
      console.log("MongoDB Connected,the server is responding good mf");
    });
  })
  .catch((error) => {
    console.log(error);
  });
