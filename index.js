const express = require("express");
const { connection } = require("./database/db");
const userRoute = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const { authentication } = require("./middleware/authentication");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute);

app.get("/", authentication, (req, res) => {
  console.log(req.userID);
  res.send("working");
});

connection()
  .then(() => {
    app.listen(8080, () => {
      console.log("App is running on port 8080");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
