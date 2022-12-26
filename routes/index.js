import authRoutes from './authRouter';
import productRoute from './productRoute';


const indexRoutes = [{route:'auth',router:authRoutes},{route:'product',router:productRoute}]

export default indexRoutes
