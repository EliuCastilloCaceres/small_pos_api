const express = require('express');
require('dotenv').config();
const app = express();
const userRoutes = require('./src/routes/user_routes.js')

//Index Routes
app.get('/',(req, res)=>{
   res.send('Welcome to the small pos api');
})
app.use(userRoutes);

const port = process.env.SERVER_PORT || 3000;

app.listen(port,()=>{
    console.log(`Application running on port: ${port}`);
})