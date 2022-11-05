//! Imported Modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

//! Created an express app
const app = express();

//! Created a port
const port = 80;

//! Mongoose Stuff

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/SchoolAdmin");
}

//* Defining Mongoose Schema
const studentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  dob: String,
  age: String,
  date: String,
  password: String,
  class: String,
  stream: String,
});

const Students = mongoose.model("students", studentSchema);

const AdminSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  code: String,
  password: String,
});

const Admin = mongoose.model("Admin", AdminSchema);

//! Express Stuff
app.use("/static", express.static("static"));
app.use(express.urlencoded());

//! Pug Stuff
app.set("view engine", "pug"); //* Setting the template engine
app.set("views", path.join(__dirname, "views")); //* Setting the views directory

//! Endpoints
app.get("/", (req, res) => {
  const title = { title: "School Online Portal" };
  res.status(200).render("home.pug", title);
});
app.get("/adlogin", (req, res) => {
  const title = { title: "Admin Login Portal" };
  res.status(200).render("adlogin.pug", title);
});
app.get("/stlogin", (req, res) => {
  const title = { title: "Student's Login Portal" };
  res.status(200).render("stlogin.pug", title);
});
app.get("/stRegister", (req, res) => {
  const title = { title: "School Student Registration" };
  res.status(200).render("stRegister.pug", title);
});
app.get("/register", (req, res) => {
  const title = { title: "Registration Portal" };
  res.status(200).render("register.pug", title);
});
app.get("/schoolPage", (req, res) => {
  const title = { title: "Your School Page" };
  res.status(200).render("schoolPage.pug", title);
});


//* Saving Registered User Data to database
app.post("/register", (req, res) => {
  var myData = new Admin(req.body);
  myData
    .save()
    .then(() => {
      const msg = { msg: "Your school is registered now" };
      res.status(201).render("register.pug", msg);
    })
    .catch(() => {
      res.status(400).send("Server time Out!");
    });
});

//* Admin Login
app.post("/adLogin", async (req, res) => {
  try {
    const code = req.body.code;
    const email = req.body.email;
    const password = req.body.password;
    const userCode = await Admin.findOne({ code: code });
    if (userCode.email === email && userCode.password === password) {
      res.status(201).render("schoolPage.pug");
    } else {
      const msg = { msg: "ID not existed or Incorrect code/password or email" };
      res.status(201).render("adLogin.pug", msg);
    }
  } catch (error) {
    res.status(400).send("Invalid Code");
  }
});

//* Student registration
app.post("/stRegister", (req, res) => {
  var myData = new Students(req.body);
  myData
    .save()
    .then(() => {
      const msg = { msg: "Student Registration Successful" };
      res.status(201).render("stRegister.pug", msg);
    })
    .catch(() => {
      res.status(400).send("Server time Out!");
    });
});

//* Student Login
app.post("/stlogin", async (req, res) => {
  try {
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await Students.findOne({ email: email });
    if (userEmail.phone === phone && userEmail.password === password) {
      let data = {
        name: userEmail.name,
        class1: userEmail.class,
        phone1: userEmail.phone,
        email1: userEmail.email,
        address: userEmail.address,
        stream: userEmail.stream,
        dob: userEmail.dob,
        date: userEmail.date,
      };
      res.status(201).render("stProfile.pug", data);
    } else {
      const msg = { msg: "ID not existed or Incorrect Phone or Password" };
      res.status(201).render("stlogin.pug", msg);
    }
  } catch (error) {
    res.status(400).send("Invalid Email Address");
  }
});

//! Straing the Server
app.listen(port, () => {
  console.log(`The port is started on port ${port}`);
});
