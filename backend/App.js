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

// Load correct .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// SIGNUP
app.post("/signup", (req, res) => {
  const { email } = req.body;

  UserModel.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.json({ message: "User Already Exists" });
    }

    UserModel.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json({ error: err.message }));
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email }).then((user) => {
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

// GET USERS
app.get("/signup", async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// CONNECT TO MONGO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB Connected. Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed:", error);
  });
