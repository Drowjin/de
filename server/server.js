import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "https://de-three-mauve.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


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
