const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
var cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override')
const QRCode = require('qrcode');
const dotenv = require('dotenv');
const {connect} = require('./api/cli/publisher')
const {subscriber} = require('./api/cli/subscriber');
const connectMongodb = require('./api/connectMongodb/connect');

const deviceRouter = require('./api/routes/deviceRouter');
const tempHumidityRouter = require('./api/routes/tempHumidityRouter');
const plantRouter = require('./api/routes/PlantRouter')
const auth = require('./api/routes/authRouter');
const attendance = require('./api/routes/AttendanceRouter');
const port = 3100;

dotenv.config();
const fs = require('fs'); // Thêm module này
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

//change text in jason
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(morgan('combined'))


// app.use('/api/room', roomsRoutes)
app.use('/api/devices', deviceRouter);
app.use('/api/tempHumidity', tempHumidityRouter);
app.use('/api/plants',plantRouter)
app.use('/api/auth', auth);
app.use('/api/attendance', attendance);
const apkFilePath = './apk/app-release.apk';
// const flutterAppLink = "https://drive.google.com/file/d/1RLrjZxG9IQwSp1i8bI2O7QJrNg8r8bi6/view?usp=drive_link";

app.get('/download-apk', (req, res) => {
  res.download(apkFilePath); // Tải tệp APK về khi yêu cầu
});

server.listen(port, () => {
  subscriber();
  connect();
  connectMongodb();

  console.log(`Example app listening on port ${port}`);
});
