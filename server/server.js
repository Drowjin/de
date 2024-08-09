import express from "express";
import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authMiddleWare = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send({ message: "user not authorizerd!" });
    } else {
      const decoToken = jwt.verify(token, "jinsa0349jf3048f54");
      res.userId = decoToken.userId;
      next();
    }
  } catch (error) {}
};

const db = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/drowjin");
    console.log("db is connected!");
  } catch (error) {
    console.log(error.message);
  }
};

db();

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = model("Users", userSchema);

app.post("/login", async (req, res) => {
  try {
    const { userField, password } = req.body;

    if (!userField || !password) {
      return res.status(400).send({ message: "all fields are required!" });
    }

    const whiteSpaceUsername = /\s/.test(userField);

    if (whiteSpaceUsername) {
      return res.status(400).send({ message: "enter valid filed!" });
    }

    const existingOne = await userModel.findOne({
      $or: [{ email: userField }, { username: userField }],
    });

    if (!existingOne) {
      return res.status(400).send({ message: "user not found!" });
    }

    if (existingOne && (await bcrypt.compare(password, existingOne.password))) {
      const token = jwt.sign({ userId: existingOne._id }, "jinsa0349jf3048f54");

      res
        .cookie("token", token, { httpOnly: true })
        .send({ message: "login success!" });
    } else {
      return res.status(400).send({ message: "user credentials are wrong!" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const valTrue = validRegex.test(email);

    if (!username || !email || !password) {
      return res.status(400).send({ message: "all fields are required!" });
    }

    const whiteSpaceUsername = /\s/.test(username);

    if (whiteSpaceUsername) {
      return res.status(400).send({ message: "enter valid filed!" });
    }

    if (valTrue === false) {
      return res
        .status(400)
        .send({ message: "please enter valid email adress!" });
    }

    const existingOne = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingOne) {
      return res.status(400).send({ message: "user already existing" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(200).send({ success: true, user });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/current", authMiddleWare, async (req, res) => {
  try {
    console.log(res.userId);
    const current = await userModel.findById({ _id: res.userId });
    if (current) {
      res.send({ success: true });
    } else {
      res.send({ message: "user not found!" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token").send({ message: "user logged out successfully!" });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/", async (req, res) => {
  try {
    res
      .cookie("jant", req.body, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .send({ message: "cookie set successfully!" });
    console.log(req.cookies);
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/clear", async (req, res) => {
  try {
    res
      .clearCookie("jant", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .send({ message: "cookie clear successfully!" });
    console.log(req.cookies);
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(8080, () => {
  console.log("server is runing!");
});
