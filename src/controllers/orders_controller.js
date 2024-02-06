const db_connection = require('../../db_connection.js');

//--------------------------------------------------*** Order Section *---------------------------------------/

const getAllorders = (req,res)=>{
    
    const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id 
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id 
    INNER JOIN users on orders.user_id = users.user_id`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}
const getDayOrders = (req,res)=>{
  
   const today = req.params.today
   //console.log(today)
     const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id 
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id 
    INNER JOIN users on orders.user_id = users.user_id where orders.order_date >= '${today}' order by orders.order_date desc`
    // const query = `select * from orders where order_date >= '${today}'`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            //console.log(result)
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}
const getOrdersByDateRange = (req,res)=>{
    console.log(req.params)
    const startDate = req.params.startDate
    const endDate = req.params.endDate
    const order = req.params.order
    let queryPatch
    let query
   if(startDate == 'undefined'){
    queryPatch = `<= '${endDate} 23:59:59'`
    
   }else if(endDate =='undefined'){
    queryPatch = `>= '${startDate}'`
   }else{
    queryPatch=`between '${startDate}' and '${endDate} 23:59:59'`
   }
   query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id 
   FROM orders 
   inner join customers on orders.customer_id = customers.customer_id 
   INNER JOIN users on orders.user_id = users.user_id where orders.order_date ${queryPatch} order by orders.order_date ${order}` 
     //console.log(query)
     db_connection.query(query,(error, result)=>{
         if(error){
             return res.status(500).json('Server Error: ' + error);
         }else{
             //console.log(result)
             return res.status(200).json({message:`Success query`, data:result});
         }
     })
 }
const getOrderById = (req,res)=>{

    const orderId = parseInt(req.params.orderId);
    
    const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id 
    INNER JOIN users on orders.user_id = users.user_id where order_id =${orderId}`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            //console.log(result)
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}
const createOrder = (req,res)=>{
   
    const subTotal = req.body.subTotal.trim();
    const discount = req.body.discount.trim();
    const total = req.body.total.trim();
    const paymentMethod = req.body.paymentMethod.trim();
    const information = req.body.information.trim();
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();

    const values = [subTotal,discount,total,
        paymentMethod,information,customerId,userId];

    const query = 'insert into orders (sub_total, discount, total, payment_method, information, customer_id, user_id) values (?,?,?,?,?,?,?)'

    db_connection.query(query, values,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(201).json({message:`Order created successfully`});
        }
    })
}
const updatedOrder = (req,res)=>{
    console.log(req.body)
    const orderId = parseInt(req.params.orderId);
    const subTotal = req.body.subTotal;
    const discount = req.body.discount;
    const total = req.body.total;
    const paymentMethod = req.body.paymentMethod;
    const information = req.body.information;
    const customerId = req.body.customerId;
    const status = req.body.status;
    const userId = req.body.userId;

    const values = [subTotal,discount,total,
        paymentMethod,information,status,customerId,userId];

    const query = `update orders set sub_total=?, discount=?, total=?, payment_method=?, information=?, status=?, customer_id=?, user_id=? where order_id =${orderId} `

    db_connection.query(query, values,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Order updated successfully`});
        }
    })
}
const changeOrderStatus = (req,res)=>{
    console.log(req.body)
    const orderId = parseInt(req.body.orderId);
    const status = req.body.status
   
    const query = `update orders set status = '${status}' where order_id = ${orderId}`

    db_connection.query(query, (error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Order Canceled successfully`});
        }
    })
}
//--------------------------------------------------*** END Order Section *---------------------------------------/

//--------------------------------------------------*** Order Details Section *---------------------------------------/

const createOrderDetails = (req,res)=>{
   
    const orderId = req.body.orderId.trim();
    const productId = req.body.productId.trim();
    const productDiscount = req.body.productDiscount.trim();
    const finalPrice = req.body.finalPrice.trim();
    const quantity = req.body.quantity.trim();

    const values = [orderId,productId,productDiscount,finalPrice,quantity];

    const query = 'insert into orders_details (order_id, product_id, product_discount, final_price, quantity) values (?,?,?,?,?)'

    db_connection.query(query, values,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(201).json({message:`Order Details created successfully`});
        }
    })
}
const updatedOrderDetails = (req,res)=>{
    const orderDetailsId = req.params.orderDetailsId.trim();
    const orderId = req.body.orderId.trim();
    const productId = req.body.productId.trim();
    const productDiscount = req.body.productDiscount.trim();
    const finalPrice = req.body.finalPrice.trim();
    const quantity = req.body.quantity.trim();

    const updates = [orderId,productId,productDiscount,finalPrice,quantity];

    const query = `update orders_details set order_id=?, product_id=?, product_discount=?, final_price=?, quantity=? where orders_details_id = ${orderDetailsId}`

    db_connection.query(query, updates,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Order Details updated successfully`});
        }
    })
}
const deleteOrderDetails = (req,res)=>{
    const orderDetailsId = req.params.orderDetailsId.trim();
   
    const query = `delete from orders_details where orders_details_id = ${orderDetailsId}`

    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Order Details deleted successfully`});
        }
    })
}
//--------------------------------------------------*** END Order Details Section *---------------------------------------/

module.exports =
{
    createOrderDetails, updatedOrderDetails,
    deleteOrderDetails, createOrder, updatedOrder,
    changeOrderStatus, getAllorders,getOrderById,getDayOrders,getOrdersByDateRange
}