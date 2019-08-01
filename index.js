require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate');


var app = express()

app.set("view engine", "ejs");
 
// Passport Password
app.use(session({
  secret: "master password",
  saveUninitialized: true,
  resave: true
}));



//mongoose.connect("mongod://localhost:27017/insurancePrototype

app.use(passport.initialize());
app.use(passport.session());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/insurance"
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
})
mongoose.set("useCreateIndex", true);

// User information Serup
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Client information
const acordSchema = new mongoose.Schema({
  userID: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  ein_ssn: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  businessName: String,
  revenue: String,
  payroll: String,
  fullEmployee: String,
  partEmployee: String,
  businessDescription: String,
  locationAddress: String,
  locationAddress2: String,
  locationCity: String,
  locationState: String,
  locationZip: String,
  lossRun: String,
  insuranceHist: String,
  generalLiability: String,
  workersComp: String,
  commercialAuto: String,
  dob: String,
  estDate: String,
  effDate: String,
  expDate: String
});

const Acord = mongoose.model("Acord", acordSchema);

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));
require('pdfjs-dist')


// VARIABLES

//Login
var userID

//Contact page
var firstName
var lastName
var email
var phone
var dob
var ein_ssn
var address1
var address2
var city
var state
var zip


//Business page
var businessName
var estDate
var businessDescription
var locationNumber
var revenue
var payroll
var fullEmployee
var partEmployee
var locationAddress
var locationAddress2
var locationCity
var locationState
var locationZip

// Insurance page
var effDate
var expDate
var lossRun
var lossDescription
var insuranceHist
var insuranceHistDate
var generalLiability
var commercialAuto
var workersComp

//WELCOME PAGE
app.get("/", (req, res) => {
  console.log("hello world")
  res.render('index')

});

app.post("/", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local",{failureRedirect: '/' })(req, res, function(){
        userID = req.body.username
        res.redirect("/database");
      });
    }
  });

});


// REGISTER PAGE
app.get("/register", function(req, res) {
  res.render("register")
});

// grab sign in info


app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log("looks good here")
        userID = req.body.username
        res.redirect("/database");
      });
    }
  });
});


//ABOUT PAGE
app.get("/about", (req, res) => {
  console.log("directing to aobut page")
  res.render('about')

});



//CONTACT PAGE
app.get("/contact", function(req, res) {
  res.render("contact")
});

app.post("/contact", function(req, res) {
  firstName = req.body.inputFirstName;
  lastName = req.body.inputLastName;
  email = req.body.inputEmail;
  phone = req.body.inputPhone;
  dob = new Date(req.body.inputDOB).toLocaleDateString('en-US');
  ein_ssn = req.body.inputEIN_SSN;
  address1 = req.body.inputAddress;
  address2 = req.body.inputAddress2;
  city = req.body.inputCity;
  state = req.body.inputState;
  zip = req.body.inputZip;
  console.log(firstName + lastName)
  res.redirect('/business')
});

//
// });

// // BUSINESS PAGE
app.get("/business", function(req, res) {
  res.render("business");
});

app.post("/business", function(req, res) {
  businessName = req.body.inputBusinessName;
  //$('#submit').on('click', function(){
  estDate = new Date(req.body.inputEstDate).toLocaleDateString('en-US')
  //});
  businessDescription = req.body.inputBusinessDescription;
  locationNumber = req.body.inputLocationNumber;
  revenue = req.body.inputRevenue;
  payroll = req.body.inputPayroll;
  fullEmployee = req.body.inputFullEmployee;
  partEmployee = req.body.inputPartEmployee;
  locationAddress = req.body.inputLocationAddress;
  locationAddress2 = req.body.inputLocationAddress2;
  locationCity = req.body.inputLocationCity;
  locationState = req.body.inputLocationState;
  locationZip = req.body.inputLocationZip;
  console.log(estDate)
  res.redirect('/insurance')
})

//
// // INSURANCE PAGE
app.get("/insurance", function(req, res) {
  res.render("insurance");
});

app.post("/insurance", function(req, res) {
  effDate = new Date(req.body.inputEffDate)
  expDate = new Date(req.body.inputEffDate)
  expDate.setDate(effDate.getDate() + 365)
  expDate = expDate.toLocaleDateString('en-US')
  effDate = effDate.toLocaleDateString('en-US')


  lossRun = req.body.inputLossRun;
  lossDescription = req.body.inputLossDescription;
  insuranceHist = req.body.inputInsuranceHist;
  insuranceHistDate = req.body.inputInsuranceHistDate;
  generalLiability = req.body.inputGeneralLiability;
  commercialAuto = req.body.inputCommercialAuto;
  workersComp = req.body.inputWorkersComp;

  console.log(effDate)
  console.log(expDate)
  res.redirect('/review')
})


//
// // REVIEW PAGE
app.get("/review", function(req, res) {
  console.log("not borken")
  res.render("review");
});

app.post("/review", function(req, res) {
  const newEntry = new Acord({
    userID: userID,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    ein_ssn: ein_ssn,
    address1: address1,
    address2: address2,
    city: city,
    state: state,
    zip: zip,
    businessName: businessName,
    revenue: revenue,
    payroll: payroll,
    fullEmployee: fullEmployee,
    partEmployee: partEmployee,
    businessDescription: businessDescription,
    locationAddress: locationAddress,
    locationAddress2: locationAddress2,
    locationCity: locationCity,
    locationState: locationState,
    locationZip: locationZip,
    lossRun: lossRun,
    insuranceHist: insuranceHist,
    generalLiability: generalLiability,
    workersComp: workersComp,
    commercialAuto: commercialAuto,
    dob: dob,
    estDate: estDate,
    effDate: effDate,
    expDate: expDate

  })

  Acord.insertMany(newEntry, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("NEW ENTRY ADDED SUCCESS")
    }
  })
  res.redirect('/demoAcord')

})
//
// // ACORD PAGE
app.get("/demoAcord", function(req, res) {
  console.log(firstName + lastName)

  //res.document.getElementById("outputFirstName") = firstName;
  //res.document.getElementById("outputLastName") = lastName;
  let today = new Date();
  let todayDate = today.toLocaleDateString("en-US");


  res.render("demoAcord", {
    todayDate: todayDate,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    ein_ssn: ein_ssn,
    address1: address1,
    address2: address2,
    city: city,
    state: state,
    zip: zip,
    businessName: businessName,
    revenue: revenue,
    payroll: payroll,
    fullEmployee: fullEmployee,
    partEmployee: partEmployee,
    businessDescription: businessDescription,
    locationAddress: locationAddress,
    locationAddress2: locationAddress2,
    locationCity: locationCity,
    locationState: locationState,
    locationZip: locationZip,
    lossRun: lossRun,
    insuranceHist: insuranceHist,
    generalLiability: generalLiability,
    workersComp: workersComp,
    commercialAuto: commercialAuto,
    dob: dob,
    estDate: estDate,
    effDate: effDate,
    expDate: expDate
  });


})


// // DATABASE PAGE
app.get("/database", function(req, res) {
  console.log("AUTHENITCATED")
  console.log(userID)
  if (req.isAuthenticated()) {
    console.log("AUTHENITCATED")
    Acord.find({
      userID
    }, function(err, entries) {
      res.render("database", {
        entries: entries
      });
    });
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is Running on port 3000");
});
