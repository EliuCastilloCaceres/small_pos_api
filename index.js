const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const userRoutes = require('./src/routes/user_routes.js')
const productsRoutes = require('./src/routes/products_routes.js')
const providersRoutes = require('./src/routes/providers_routes.js')
const ordersRoutes = require('./src/routes/orders_routes.js')
const cashRegistersRoutes = require('./src/routes/cash_registers_routes.js')
const customersRoutes = require('./src/routes/customers_routes.js')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//Index Routes
app.get('/',(req, res)=>{
   res.send('Welcome to the small pos api');
})
app.use(userRoutes);
app.use(productsRoutes);
app.use(providersRoutes);
app.use(ordersRoutes);
app.use(cashRegistersRoutes);
app.use(customersRoutes);
const port = process.env.SERVER_PORT || 3000;

app.listen(port,()=>{
    console.log(`Application running on port: ${port}`);
})