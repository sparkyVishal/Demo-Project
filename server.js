import mongoose from 'mongoose';
import app from './app';
import { APP_PORT, DB_URL } from './config';


mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true} );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("DB Connected")
})

app.listen(APP_PORT, () => console.log(`port running on ${APP_PORT}`))

export default db;

