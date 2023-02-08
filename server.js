import express from 'express';
const app = express();
import { APP_PORT, DB_URL } from './config';
import routes from './routes';  //importing all routes 
import errorHandler from './Middlewares/errorHandler.js'
import mongoose from 'mongoose';
import path from 'path';

//Database connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Db connected...");
});

global.appRoot = path.resolve(__dirname);

/* Abhi jaise json data ko receive karne ke liye hum built in express.json middleware
  ka use karte hai thik aaise he hum multipart data ko receive karne ke liye hum
  urlencoded builtin middleware ka use karte hai 
*/

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
// '/api' is a default prefix of all requested routes.
app.use("/api", routes);

//using error handler middleware 
app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log("Listening on port", APP_PORT);
})