import express from 'express';
import {APP_PORT,DB_URL} from './config';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import mongoose from 'mongoose';
import path from 'path';


const app = express();


mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true} );
// useFindAndModify: false

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("DB Connected")
})

global.appRoot = path.resolve(__dirname)
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/api', routes);

//images show
app.use('/uploads',express.static('uploads'));

//profile pic
global.appRoot2 = path.resolve(__dirname)
app.use(express.urlencoded({extended: false}));
app.use('/profile_pic',express.static('profile_pic'));

app.use(errorHandler);

app.listen(APP_PORT, () => console.log(`port running on ${APP_PORT}`))