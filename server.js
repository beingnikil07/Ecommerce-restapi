import express from 'express';
const app = express();
import { APP_PORT } from './config';
import routes from './routes';  //importing all routes 

// '/api' is a default prefix of all requested routes.
app.use("/api", routes);

app.listen(APP_PORT, () => {
    console.log("Listening on port", APP_PORT);
})