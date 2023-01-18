import mongoose from 'mongoose';
import app from './app';
import { APP_PORT, DB_URL } from './config';


mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true} );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("DB Connected")
})

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
  
  process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

app.listen(APP_PORT, () => console.log(`port running on ${APP_PORT}`))

export default db;

