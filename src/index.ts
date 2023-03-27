import express from 'express';
import mongoose from 'mongoose';
import user from './user';
const bodyParser = require('body-parser')

const app= express()
const port=3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/',user)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


//connecting with database
const dbUrl = 'mongodb://127.0.0.1:27017/Addproducts';
const dbOptions: mongoose.ConnectOptions = Object.assign({ useNewUrlParser: true });
mongoose.set('strictQuery', true);

const connectDb = ():Promise<typeof mongoose> => {
    return mongoose.connect(dbUrl, dbOptions).then((mongoDB: typeof mongoose) => {
        console.info(`Connected to database.`);
        return mongoDB;
    }).catch((err: any) => {
        console.error(`Unable to connect to db.`);
        throw err;
    });
}

connectDb();