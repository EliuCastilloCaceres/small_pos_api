const db_connection = require('../../db_connection.js');

//--------------------------------------------------*** Order Section *---------------------------------------/

const getAllorders = (req, res) => {

    const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id 
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id 
    INNER JOIN users on orders.user_id = users.user_id`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const getproductsSold = async (req, res) => {
    const productSku= req.params.sku
    const startDate= req.params.startDate
    const endDate= req.params.endDate
    let skuPatch = ''
    if(productSku){
        skuPatch = `(p.sku = '${productSku}' OR s.sku = '${productSku}') AND `
    }
    const productsSoldQuery = `SELECT od.orders_details_id, o.order_id, p.sku, p.name, s.size, s.sku as sku_size, od.quantity, o.order_date 
    FROM orders_details od 
    INNER JOIN orders o ON od.order_id = o.order_id 
    INNER JOIN products p ON od.product_id = p.product_id 
    LEFT JOIN sizes s ON od.size_id = s.size_id 
    WHERE ${skuPatch} o.order_date BETWEEN '${startDate}' AND '${endDate} 23:59:59' AND o.status = 'completado' ORDER BY o.order_date DESC`

    const productsSoldTotalQuery = `SELECT SUM(od.quantity) as total 
    FROM orders_details od 
    INNER JOIN orders o ON od.order_id = o.order_id 
    INNER JOIN products p ON od.product_id = p.product_id 
    LEFT JOIN sizes s ON od.size_id = s.size_id 
    WHERE ${skuPatch} o.order_date BETWEEN '${startDate}' AND '${endDate} 23:59:59' AND o.status = 'completado' ORDER BY o.order_date DESC`
    try{
        const productsSold = await queryAsync(productsSoldQuery)
        const productsSoldTotal = await queryAsync(productsSoldTotalQuery)
        console.log(productsSold,productsSoldTotal[0])
       
        return res.status(200).json({ products:productsSold, total:productsSoldTotal[0].total});
    }catch(e){
        return res.status(500).json('Server Error: ' + error);
    }
}

const getOrderDetails = async (req, res) => {
    const orderId= req.params.orderId
    const orderQuery = `select * from orders where order_id = ${orderId}`
    const orderDetailsQuery = `select od.orders_details_id, od.order_id, od.product_id, od.size_id, p.sku, p.name, s.size, s.sku as sku_size, p.sale_price, p.uom, od.final_price, od.quantity 
    FROM orders_details od 
    INNER JOIN products p ON od.product_id = p.product_id 
    LEFT JOIN sizes s ON od.size_id = s.size_id where od.order_id = ${orderId}`

    try{
        const order = await queryAsync(orderQuery)
        const orderDetails = await queryAsync(orderDetailsQuery)
        return res.status(200).json({ message: `Success query`, order, orderDetails });
    }catch(e){
        return res.status(500).json('Server Error: ' + error);
    }
}
const getDayOrders = (req, res) => {

    const today = req.params.today
    //console.log(today)
    const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id, cash_registers.name
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id
    inner join cash_registers on orders.cash_register_id = cash_registers.cash_register_id
    INNER JOIN users on orders.user_id = users.user_id where orders.order_date >= '${today}' order by orders.order_date desc`
    // const query = `select * from orders where order_date >= '${today}'`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            //console.log(result)
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const getOrdersByDateRange = (req, res) => {
    // console.log(req.params)
    const startDate = req.params.startDate
    const endDate = req.params.endDate
    const order = req.params.order
    let queryPatch
    let query
    if (startDate == 'undefined') {
        queryPatch = `<= '${endDate} 23:59:59'`

    } else if (endDate == 'undefined') {
        queryPatch = `>= '${startDate}'`
    } else {
        queryPatch = `between '${startDate}' and '${endDate} 23:59:59'`
    }
    query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id, cash_registers.name
   FROM orders 
   inner join customers on orders.customer_id = customers.customer_id 
   inner join cash_registers on orders.cash_register_id = cash_registers.cash_register_id
   INNER JOIN users on orders.user_id = users.user_id where orders.order_date ${queryPatch} order by orders.order_date ${order}`
    //console.log(query)
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            //console.log(result)
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const getOrderById = (req, res) => {

    const orderId = parseInt(req.params.orderId);

    const query = `SELECT order_id, sub_total,discount,total,payment_method,information,status,order_date, customers.first_name as customer_firstname,customers.last_name as customer_lastname,users.first_name as user_firstname, users.last_name as user_lastname, orders.customer_id, orders.user_id
    FROM orders 
    inner join customers on orders.customer_id = customers.customer_id 
    INNER JOIN users on orders.user_id = users.user_id where order_id =${orderId}`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            //console.log(result)
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const createOrder = async (req, res) => {

    const subTotal = req.body.subTotal
    const discount = req.body.discount
    const total = req.body.total
    const paymentMethod = req.body.paymentMethod
    const cashReceived = req.body.cashReceived
    const cashChange = req.body.cashChange
    const information = req.body.information
    const customerId = req.body.customerId
    const userId = req.body.userId
    const cashRegId = req.body.cashRegId
    const products = req.body.products

    const values = [subTotal, discount, total,
        paymentMethod, cashReceived, cashChange, information, customerId, userId, cashRegId];

    const query = 'insert into orders (sub_total, discount, total, payment_method, cash_received, cash_change, information, customer_id, user_id, cash_register_id) values (?,?,?,?,?,?,?,?,?,?)'
    try {
        await reduceStock(products)
        await queryAsync(query, values)
        const lastOrderId = await findLastOrder()
        // console.log(lastOrderId)
        await createOrderDetails(products, lastOrderId)
        const prods = await getAllProducts()
        const sizes = await getAllSizes()
        if(paymentMethod==='efectivo'){
            await createCashMovement(total,cashRegId,userId,lastOrderId)
        }
    
        return res.status(201).json({ message: `Order created successfully`, orderId:lastOrderId, updatedProducts:prods, updatedSizes:sizes });
    } catch (error) {
        return res.status(500).json('Server Error: ' + error);
    }

}
const updatedOrder = async (req, res) => {
    // console.log(req.body)
    const orderId = parseInt(req.params.orderId);
    const subTotal = req.body.subTotal;
    const discount = req.body.discount;
    const total = req.body.total;
    const paymentMethod = req.body.paymentMethod;
    const information = req.body.information;
    const customerId = req.body.customerId;
    const status = req.body.status;
    const userId = req.body.userId;

    const values = [subTotal, discount, total,
        paymentMethod, information, status, customerId, userId];

    const query = `update orders set sub_total=?, discount=?, total=?, payment_method=?, information=?, status=?, customer_id=?, user_id=? where order_id =${orderId} `

    db_connection.query(query, values, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Order updated successfully` });
        }
    })
}
const changeOrderStatus = async (req, res) => {
    //  console.log(req.body)
    const orderId = parseInt(req.body.orderId);
    const status = req.body.status

        const findOrderProductsQuery = `select * from orders_details where order_id = ${orderId}`
        const orderProducts = await queryAsync(findOrderProductsQuery)
       if(status=='cancelado'){
            addStock(orderProducts)
       }else{
            substractStock(orderProducts)
       }
    const query = `update orders set status = '${status}' where order_id = ${orderId}`

    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Order updated successfully` });
        }
    })
}
const addStock  = (products)=>{
    db_connection.getConnection((err,conn)=>{
        if(err){
            return res.status(500).json('Server Error: ' + err);
        }
        conn.beginTransaction()
        products.forEach(pd => {
            const query = `update products set general_stock = general_stock + ${pd.quantity} where product_id = ${pd.product_id} `
            queryAsync(query).then(()=>{
                if(pd.size_id){
                    const variantQuery = `UPDATE sizes SET stock = stock + ${pd.quantity} WHERE size_id = ${pd.size_id}`;
                    queryAsync(variantQuery).then().catch(e=>{
                        conn.rollback()
                        throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
                    })
                }
                conn.commit();
                return { status: 201, message: 'Todos los productos se actualizaron exitosamente' };
            }).catch(e=>{
                conn.rollback()
                throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
            }).finally(()=>{
                conn.release()
            })
            
        });
           
        
    })
}
const substractStock  = (products)=>{
    db_connection.getConnection((err,conn)=>{
        if(err){
            return res.status(500).json('Server Error: ' + err);
        }
        conn.beginTransaction()
        products.forEach(pd => {
            const query = `update products set general_stock = general_stock - ${pd.quantity} where product_id = ${pd.product_id} `
            queryAsync(query).then(()=>{
                if(pd.size_id){
                    const variantQuery = `UPDATE sizes SET stock = stock - ${pd.quantity} WHERE size_id = ${pd.size_id}`;
                    queryAsync(variantQuery).then().catch(e=>{
                        conn.rollback()
                        throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
                    })
                }
                conn.commit();
                return { status: 201, message: 'Todos los productos se actualizaron exitosamente' };
            }).catch(e=>{
                conn.rollback()
                throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
            }).finally(()=>{
                conn.release()
            })
            
        });
           
        
    })
}
//--------------------------------------------------*** END Order Section *---------------------------------------/

//--------------------------------------------------*** Order Details Section *---------------------------------------/
const createOrderDetails = async (products,orderId) => {
    db_connection.getConnection((err,conn)=>{
        if(err){
            return res.status(500).json("Server Error: " + err);
        }
        conn.beginTransaction()
        for (const product of products) {
            const productId = product.product_id
            let sizeId = null
            if (product.size) {
                sizeId = product.size.size_id
            }
            const finalPrice = parseFloat(product.sale_price)
            const quantity = parseFloat(product.qty)

            const query = `insert into orders_details (order_id, product_id, size_id, final_price, quantity) values (${orderId},${productId},${sizeId},${finalPrice},${quantity}) `
            queryAsync(query).then(()=>{
                conn.commit()
                return 'Todos los productos se añadieron a los detalles exitosamente' 
            }).catch(e=>{
                conn.rollback()
                throw 'Se produjo un error inesperado al añadir los detalles: ' + e 
            }).finally(()=>{conn.release()})
        }
        
    })
    // try {
    //     // const values = [orderId, productId, sizeId, finalPrice, quantity];
    //     db_connection.beginTransaction();

    //     for (const product of products) {
    //         const productId = product.product_id
    //         let sizeId = null
    //         if (product.size) {
    //             sizeId = product.size.size_id
    //         }
    //         const finalPrice = parseFloat(product.sale_price)
    //         const quantity = parseFloat(product.qty)

    //         const query = `insert into orders_details (order_id, product_id, size_id, final_price, quantity) values (${orderId},${productId},${sizeId},${finalPrice},${quantity}) `
    //         await queryAsync(query)
    //     }
    //     // Confirmar la transacción si todas las actualizaciones se realizan con éxito
    //     db_connection.commit();
    //     return 'Todos los productos se añadieron a los detalles exitosamente' 

    // } catch (error) {
    //     // Revertir la transacción si ocurre un error
    //     db_connection.rollback();
    //     throw 'Se produjo un error inesperado al añadir los detalles: ' + error 

    // }
}
// const createOrderDetails = (req,res)=>{

//     const orderId = req.body.orderId.trim();
//     const productId = req.body.productId.trim();
//     const productDiscount = req.body.productDiscount.trim();
//     const finalPrice = req.body.finalPrice.trim();
//     const quantity = req.body.quantity.trim();

//     const values = [orderId,productId,productDiscount,finalPrice,quantity];

//     const query = 'insert into orders_details (order_id, product_id, product_discount, final_price, quantity) values (?,?,?,?,?)'

//     db_connection.query(query, values,(error, result)=>{
//         if(error){
//             return res.status(500).json('Server Error: ' + error);
//         }else{
//             return res.status(201).json({message:`Order Details created successfully`});
//         }
//     })
// }
const updatedOrderDetails = (req, res) => {
    const orderDetailsId = req.params.orderDetailsId.trim();
    const orderId = req.body.orderId.trim();
    const productId = req.body.productId.trim();
    const productDiscount = req.body.productDiscount.trim();
    const finalPrice = req.body.finalPrice.trim();
    const quantity = req.body.quantity.trim();

    const updates = [orderId, productId, productDiscount, finalPrice, quantity];

    const query = `update orders_details set order_id=?, product_id=?, product_discount=?, final_price=?, quantity=? where orders_details_id = ${orderDetailsId}`

    db_connection.query(query, updates, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Order Details updated successfully` });
        }
    })
}
const deleteOrderDetails = (req, res) => {
    const orderDetailsId = req.params.orderDetailsId.trim();

    const query = `delete from orders_details where orders_details_id = ${orderDetailsId}`

    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Order Details deleted successfully` });
        }
    })
}
//--------------------------------------------------*** END Order Details Section *---------------------------------------/
const queryAsync = (query, values=null) => {
    return new Promise((resolve, reject) => {
        if(values){
            db_connection.query(query, values, (error, result) => {

                if (error) reject(error)
    
                resolve(result)
    
            })

        }else{
            db_connection.query(query, (error, result) => {

                if (error) reject(error)
    
                resolve(result)
    
            })
        }
       

    })

}
const findLastOrder = async ()=>{
    try{
        const result = await queryAsync('select order_id from orders order by order_id desc limit 1')
        return result[0].order_id
    }catch(e){
        return 'algo salió mal: '+e
    }
}
const getAllProducts = async ()=>{
    try{
        const result = await queryAsync('select * from products where is_active = 1 ORDER BY product_id DESC')
        return result
    }catch(e){
        return 'algo salió mal: '+e
    }
}
const getAllSizes = async ()=>{
    try{
        const result = await queryAsync('select * from sizes')
        return result
    }catch(e){
        return 'algo salió mal: '+e
    }
}
const createCashMovement = async (amount,cashRegisterId,userId,orderId)=>{
    try{
        const movementQuery = `
        insert into cash_movements (movement_type, amount, description, cash_register_id, user_id)
        values ('deposito', ${amount}, 'Venta efectivo #${orderId}', ${cashRegisterId}, ${userId})
        `
        const result = await queryAsync(movementQuery)
        return result
    }catch(e){
        return 'algo salió mal: '+e
    }
}
const reduceStock = async (products) => {
    db_connection.getConnection((err,conn)=>{
        if(err){
            return res.status(500).json('Server Error: ' + err);
        }
        conn.beginTransaction()
            for (const product of products) {
            const query = `update products set general_stock = general_stock - ${product.qty} where product_id = ${product.product_id} `
            queryAsync(query).then(()=>{
                if (product.size) {
                    const variantQuery = `UPDATE sizes SET stock = stock - ${product.qty} WHERE size_id = ${product.size.size_id}`;
                    queryAsync(variantQuery).then().catch(e=>{
                        conn.rollback()
                        throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
                    })
                }
                conn.commit();
                return { status: 201, message: 'Todos los productos se actualizaron exitosamente' };
            }).catch(e=>{
                conn.rollback()
                throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + e };
            }).finally(()=>{
                conn.release()
            })
           
        }
        
    })
    // try {
    //     db_connection.beginTransaction();
    //     for (const product of products) {
    //         const query = `update products set general_stock = general_stock - ${product.qty} where product_id = ${product.product_id} `

    //         await queryAsync(query)
    //         // Si hay una variante, actualizar el stock de la variante
    //         if (product.size) {
    //             const variantQuery = `UPDATE sizes SET stock = stock - ${product.qty} WHERE size_id = ${product.size.size_id}`;
    //             await queryAsync(variantQuery); // Suponiendo que queryAsync es una función que ejecuta la consulta y devuelve una promesa
    //         }

    //     }
    //     // Confirmar la transacción si todas las actualizaciones se realizan con éxito
    //     db_connection.commit();
    //     return { status: 201, message: 'Todos los productos se actualizaron exitosamente' };

    // } catch (error) {
    //     // Revertir la transacción si ocurre un error
    //     db_connection.rollback();
    //     throw { status: 500, message: 'Se produjo un error inesperado al actualizar el stock: ' + error };

    // }
}

module.exports =
{
    createOrderDetails, updatedOrderDetails,
    deleteOrderDetails, createOrder, updatedOrder,
    changeOrderStatus, getAllorders, getOrderById, getDayOrders, getOrdersByDateRange,getOrderDetails,getproductsSold
}