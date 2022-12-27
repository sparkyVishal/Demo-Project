import authRoutes from './authRouter';
import productRoute from './productRoute';

import categoryRoute from './categoryRoute';


const indexRoutes = [{route:'auth',router:authRoutes},{route:'product',router:productRoute}, {route:'category', router:categoryRoute}]

export default indexRoutes
