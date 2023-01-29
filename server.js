import express from 'express';
const app=express();
import {APP_PORT} from './config';

app.get('/',(req,res)=>{
    res.end("Hello");
})
app.listen(APP_PORT,()=>{
    console.log("Listening on port",APP_PORT);
})