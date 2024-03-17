const db_connection = require('../../db_connection.js');

const getDashboardInfo = async (req, res) => {
    
    const querydate = req.params.date;

    const productsSoldQuery = `select od.product_id, p.sku, p.image, p.name, SUM(od.quantity) as total_sold, o.order_date FROM 
    orders_details od 
    INNER JOIN products p ON od.product_id = p.product_id 
    INNER JOIN orders o ON od.order_id = o.order_id 
    WHERE o.order_date BETWEEN '${querydate}' AND '${querydate} 23:59:59 ' 
    GROUP BY od.product_id, o.order_date
    ORDER BY total_sold DESC`

    const totalProductsSoldQuery = `select SUM(od.quantity) as total_sold FROM 
    orders_details od 
    INNER JOIN orders o ON od.order_id = o.order_id 
    WHERE o.order_date BETWEEN '${querydate}' AND '${querydate} 23:59:59' `

    const cashRegistersInfoQuery = `SELECT cr.cash_register_id, cr.name, u.first_name, u.last_name, 
    SUM(CASE WHEN m.movement_type = 'deposito' THEN m.amount ELSE 0 END) AS deposits_total, 
    SUM(CASE WHEN m.movement_type = 'retiro' THEN m.amount ELSE 0 END) AS withdrawals_total, 
    (SUM(CASE WHEN m.movement_type = 'deposito' THEN m.amount ELSE 0 END) - SUM(CASE WHEN m.movement_type = 'retiro' THEN m.amount ELSE 0 END)) AS balance 
    FROM open_close_details ocd 
    INNER JOIN cash_registers cr ON ocd.cash_register_id = cr.cash_register_id 
    INNER JOIN users u ON ocd.user_id = u.user_id 
    LEFT JOIN cash_movements m ON cr.cash_register_id = m.cash_register_id WHERE cr.is_open = 1 AND ocd.close_date IS NULL AND m.movement_date >= ocd.open_date 
    GROUP BY cr.name, u.first_name, u.last_name, cr.cash_register_id`
    const ordersTotalQuery = `SELECT COUNT(order_id) as orders_total, SUM(total) as income FROM orders WHERE order_date >= '${querydate}' AND status='completado'`
  
    try{
        const productsSold = await queryAsync(productsSoldQuery)
        const totalProductsSold = await queryAsync(totalProductsSoldQuery)
        const cashRegistersInfo = await queryAsync(cashRegistersInfoQuery)
        const orderTotals = await queryAsync(ordersTotalQuery)
        orderTotals[0].products = totalProductsSold[0].total_sold
        return res.status(200).json({ productsSold, cashRegistersInfo, orderTotals});
    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
}

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

module.exports= {
    getDashboardInfo
}