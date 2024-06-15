const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const path = require('path');

const cookieParser = require('cookie-parser')
const dashboardRoutes = require('./src/routes/dashboard_routes.js')
const userRoutes = require('./src/routes/user_routes.js')
const productsRoutes = require('./src/routes/products_routes.js')
const providersRoutes = require('./src/routes/providers_routes.js')
const ordersRoutes = require('./src/routes/orders_routes.js')
const cashRegistersRoutes = require('./src/routes/cash_registers_routes.js')
const customersRoutes = require('./src/routes/customers_routes.js')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use('/api/product/images',express.static(path.join(__dirname,'/public/images/products')))
app.use('/api/receipt/images',express.static(path.join(__dirname,'/public/images/receipt')))


app.get('/',(req, res)=>{
   res.send('Welcome to the small pos api');
})
app.use('/api',dashboardRoutes);
app.use('/api',userRoutes);
app.use('/api',productsRoutes);
app.use('/api',providersRoutes);
app.use('/api',ordersRoutes);
app.use('/api',cashRegistersRoutes);
app.use('/api',customersRoutes);
const port = process.env.SERVER_PORT || 3001;

app.listen(port,()=>{
    console.log(`Application running on port: ${port}`);
})