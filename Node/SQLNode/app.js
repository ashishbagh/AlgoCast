const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      //   api_key: "",
    },
  }),
);

// transporter
//   .sendMail({
//     to: "ashishbaghel10@gmail.com",
//     from: "ashishjioacco@gmail.com",
//     subject: "Signup Succeed",
//     html: "<h1> Done</h1>",
//   })
//   .then((response) => console.log("message", response))
//   .catch((err) => console.log(err));

// const db = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// db.execute("SELECT * FROM products")
//   .then((result) => {
//     console.log(result[0], result[1]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
  .sync()
  .then((response) => {
    // console.log(response);
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

//app.listen(8080);
