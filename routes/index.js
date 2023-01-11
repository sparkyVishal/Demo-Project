import authRoutes from './authRouter';
import productRoute from './productRoute';

import categoryRoute from './categoryRoute';
import taskRoute from './taskRoute';

import blogRoute from './blogRoute'


const indexRoutes = [{route:'auth',router:authRoutes},{route:'product',router:productRoute}, {route:'category', router:categoryRoute}, {route:'task', router: taskRoute}, {route:'blog', router:blogRoute }]

export default indexRoutes
