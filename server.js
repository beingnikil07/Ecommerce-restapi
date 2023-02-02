import express from 'express';
const app = express();
import { APP_PORT,DB_URL } from './config';
import routes from './routes';  //importing all routes 
import errorHandler from './Middlewares/errorHandler.js'
import mongoose from 'mongoose';

//Database connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Db connected...");
});





app.use(express.json());
// '/api' is a default prefix of all requested routes.
app.use("/api", routes);

//using error handler middleware 
app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log("Listening on port", APP_PORT);
})