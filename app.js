require('dotenv').config();
express = require('express');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
mongoose = require("mongoose");
cors = require('cors');
fetch = require('node-fetch');
_ = require("lodash");
cron = require('node-cron');
nodemailer = require('nodemailer');
//---- new addition
bodyParser= require('body-parser')
fs = require('fs');
crypto = require("crypto");
multer = require('multer');
GridFsStorage = require('multer-gridfs-storage');
Grid = require('gridfs-stream');
methodOverride = require('method-override');

//MONGOCONNECTION="mongodb+srv://apl:Apl@123@apl.udhzp.mongodb.net/APL";

// mongoose settings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


const { getRootDir, getFileName, fileExist, renameFile, 
  setVersionNumber, getVersionNumber, cleanup} =  require("./routes/functions.js");

gfs = null;


app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'));

PRODUCTION=true;  
ARCHIVEDIR = (PRODUCTION) ? "public/" : "public/" ;      
BINARYDIR  = (PRODUCTION) ? "public/binary/" : "public/binary/" ;       // binary will be stored here


// if (PRODUCTION)
//   PORT = process.env.PORT || 80;
// else
PORT = process.env.PORT || 1989;

http = require('http');
httpServer = http.createServer(app);

// Routers
router = express.Router();
indexRouter = require('./routes/index');
usersRouter = require('./routes/user');
aplRouter = require('./routes/apl');



app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'APL/build/')));
app.use(express.json());

//if (process.env.NODE_ENV === 'production') {
	app.use(express.static('APL/build'));
//}


app.use((req, res, next) => {
	/*
  if (req.url.includes("admin")||req.url.includes("signIn")||req.url.includes("Logout")) {
    req.url = "/";
    res.redirect('/');
  }
  else {
    next();
  }
*/
  if (req.url.includes("viraag") ){
    console.log(req.url);
    res.redirect('/binarylatest/apl');
    console.log("Path is ", req.url);
	}
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/apl', aplRouter);

// ---- start of globals
// connection string for database

//Schema
MasterSettingsSchema = mongoose.Schema ({
  msid: Number,
  trialExpiry: String,
})

UserSchema = mongoose.Schema({
  uid: Number,
  userName: String,
  displayName: String,
  password: String,
  status: Boolean,
  defaultGroup: Number,
  email: String,
  userPlan: Number,
  mobile: String
});

PlayerSchema = mongoose.Schema({
  uid: Number,
  name: String,
  image: { data: Buffer, contentType: String }
});

TeamSchema = mongoose.Schema({
  uid: Number,
  name: String,
  image: { data: Buffer, contentType: String }
})

ProductSchema = mongoose.Schema({
  name: String,
  type: String,           // APK or EXE
  text: String,           // to store what is new
  version: String,        // <major version>.<minor version>.<patch number>
  versionNumber: Number,  // <major version> * 10000 + <minor Version>*100 + <patch number>
  image: { data: Buffer, contentType: String }
})

// models
User = mongoose.model("users", UserSchema);
Player = mongoose.model("playerImage", PlayerSchema);
Team = mongoose.model("teamImage", TeamSchema);
Product = mongoose.model("productImage", ProductSchema);

router = express.Router();

db_connection = false;      // status of mongoose connection
connectRequest = true;

// constant used by routers
minutesIST = 330;    // IST time zone in minutes 330 i.e. GMT+5:30
minutesDay = 1440;   // minutes in a day 24*60 = 1440
MONTHNAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
weekDays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
weekShortDays = new Array("Sun", "Mon", "Tue", "Wedn", "Thu", "Fri", "Sat");

// Error messages
DBERROR = 990;
DBFETCHERR = 991;
CRICFETCHERR = 992;
ERR_NODB = "No connection to APL master database";

// make mogoose connection
mongoose.connect(process.env.MONGOCONNECTION, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});


// CONNECTION EVENTS
// When successfully connected
 
mongoose.connection.on('connected', async function () {
  console.log('Connected to database');
  db_connection = true;
  connectRequest = true;

  console.log("Calliong cleanup");
  // await cleanup();
  
  gfs = Grid(mongoose.connection.db, mongoose.mongo);  
  gfs.collection('uploads');
  // console.log(gfs);
  
  // gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  //   bucketName: 'uploads',
  // });
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error');
  console.log(err);
  db_connection = false;
  connectRequest = false;   // connect request refused
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  db_connection = false;
});



// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  // close mongoose connection
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
  });
  process.exit(0);
});

// schedule task
dummyCount = 0;
MAXDUMMYCOUNT=4; 

cron.schedule('*/15 * * * * *', () => {
    if (!connectRequest) {
      mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
    } else {
      if (++dummyCount >= MAXDUMMYCOUNT) {
        dummyCount = 0;
        //let junk = Product.find({});
        //let x = new Date();
        //console.log(x.toLocaleDateString());
      }
    }


});



// start app to listen on specified port
httpServer.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


// global functions

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};





EMAILERROR="";
CRICDREAMEMAILID='cricketpwd@gmail.com';
sendEmailToUser = async function(userEmailId, userSubject, userText) {
    
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CRICDREAMEMAILID,
    pass: 'Anob@1989#93'
  }
  });
  
  var mailOptions = {
  from: CRICDREAMEMAILID,
  to: userEmailId,
  subject: userSubject,
  text: userText
  };
  
  //mailOptions.to = uRec.email;
  //mailOptions.text = 
  
  var status = true;
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      EMAILERROR=error;
      //senderr(603, error);
      status=false;
    } else {
      //console.log('Email sent: ' + info.response);
      //sendok('Email sent: ' + info.response);
    }
    return(status);
  });
}

// module.exports = app;

