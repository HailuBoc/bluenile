// import express from "express";
// import mongoose from "mongoose";
// import { UserModel } from "./model/userModel.js";
// import cors from "cors";
// import dotenv from "dotenv";

// const app = express();
// const PORT = 5000;
// app.use(cors());
// // app.use(
// //   cors({
// //     origin: "https://huluschooltutorapp-3zy4.vercel.app/",
// //     methods: ["GET", "POST"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     credentials: true,
// //     optionsSuccessStatus: 200,
// //   })
// // );

// app.use(express.json());
// app.post("/signup", (req, res) => {
//   const { email } = req.body;

//   UserModel.findOne({ email: email }).then((existingUser) => {
//     if (existingUser) {
//       res.json({ message: "User Already Exists" });
//     }
//     UserModel.create(req.body)
//       .then((newUser) => res.json(newUser))

//       .catch((err) => res.status(500).json({ error: err.message }));
//   });
//   // .catch(() => res.status(500).json({ error: "Yo you are doing shit mf" }));
// });

// // Connect to MongoDB

// // Routes

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   UserModel.findOne({ email: email }).then((user) => {
//     if (user) {
//       if (user.password === password) {
//         res.status(200).json("Successfully logged in");
//       } else {
//         res.status(401).json("Incorrect password");
//       }
//     } else {
//       res.status(500).json("You haven't been registered");
//     }
//   });
// });

// app.get("/signup", async (req, res) => {
//   const newget = await UserModel.find({});
//   try {
//     return res.status(204).json(newget);
//   } catch (error) {
//     return console.log(error);
//   }
// });

// mongoose
//   .connect("mongodb://127.0.0.1:27017/netxjsApp")
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log("MongoDB Connected,the server is responding good mf");
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "./model/userModel.js";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // fallback for development
    credentials: true,
  })
);
app.use(express.json());

// === ROUTES ===

// Signup Route
app.post("/signup", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create(req.body);
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Successfully logged in" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get All Users
app.get("/signup", async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// === MONGOOSE CONNECTION + SERVER START ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Optional: set a timeout for initial connect
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      console.log(
        `✅ MongoDB Connected. Server running at http://${HOST}:${PORT}`
      );
    });

    // Optional: Increase timeout settings
    server.keepAliveTimeout = 120000; // 2 minutes
    server.headersTimeout = 120000; // 2 minutes
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
  });
