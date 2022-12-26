import express from 'express';
import path from 'path';
import errorHandler from './middlewares/errorHandler';
import indexRoutes from './routes/index';


const app = express();


global.appRoot = path.resolve(__dirname)
app.use(express.urlencoded({extended: false}));


app.use(express.json());

indexRoutes.forEach((el)=>{
    app.use(`/api/${el.route}`,el.router )
})
// app.use('/api', routes);

// app.use('/api',authRoutes )
// app.use('/api', productRoute);

//images show
app.use('/uploads',express.static('uploads'));

//profile pic
global.appRoot2 = path.resolve(__dirname)
app.use(express.urlencoded({extended: false}));
app.use('/profile_pic',express.static('profile_pic'));

app.use(errorHandler);



export default app