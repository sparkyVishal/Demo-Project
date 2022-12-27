import authRoutes from './authRouter';
import productRoute from './productRoute';

import categoryRoute from './categoryRoute';
import taskRoute from './taskRoute';


const indexRoutes = [{route:'auth',router:authRoutes},{route:'product',router:productRoute}, {route:'category', router:categoryRoute}, {route:'task', router: taskRoute}]

export default indexRoutes
