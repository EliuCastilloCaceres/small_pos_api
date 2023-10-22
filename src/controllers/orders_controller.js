const db_connection = require('../../db_connection.js');

//--------------------------------------------------*** Order Section *---------------------------------------/

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
    const orderId = req.params.orderId.trim();
    const subTotal = req.body.subTotal.trim();
    const discount = req.body.discount.trim();
    const total = req.body.total.trim();
    const paymentMethod = req.body.paymentMethod.trim();
    const information = req.body.information.trim();
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();

    const values = [subTotal,discount,total,
        paymentMethod,information,customerId,userId];

    const query = `update orders set sub_total=?, discount=?, total=?, payment_method=?, information=?, customer_id=?, user_id=? where order_id =${orderId} `

    db_connection.query(query, values,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Order updated successfully`});
        }
    })
}
const cancelOrder = (req,res)=>{
    const orderId = req.params.orderId.trim();
   
    const query = `update orders set status = 'cancelado' where order_id = ${orderId}`

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
    cancelOrder
}