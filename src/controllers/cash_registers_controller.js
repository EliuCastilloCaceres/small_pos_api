const db_connection = require('../../db_connection.js');

//--------------------------------------------------*** CashReg Movements Section *---------------------------------------/
const getCashMovements = async  (req, res) => {
    const cashOpenDate = req.params.cashOpenDate;
    const cashRegisterId = req.params.cashRegisterId;
    console.log('the date: ',cashOpenDate)

    const movementsQuery = `SELECT cm.cash_movement_id, cm.movement_type, cm.amount, cm.description, cm.movement_date, cr.name, u.first_name, u.last_name  FROM cash_movements cm
    INNER JOIN cash_registers cr ON cm.cash_register_id = cr.cash_register_id
    INNER JOIN users u ON cm.user_id = u.user_id
    WHERE cm.movement_date >= '${cashOpenDate}' and cr.cash_register_id= ${cashRegisterId} order by cm.movement_date`
    const totalsQuery = `SELECT SUM(CASE WHEN movement_type = 'deposito' THEN amount ELSE 0 END) AS deposits_total, 
    SUM(CASE WHEN movement_type = 'retiro' THEN amount ELSE 0 END) AS withdrawals_total,
    (SUM(CASE WHEN movement_type = 'deposito' THEN amount ELSE 0 END) - SUM(CASE WHEN movement_type = 'retiro' THEN amount ELSE 0 END)) AS balance
    FROM cash_movements WHERE movement_date >= '${cashOpenDate}' and cash_register_id= ${cashRegisterId}`

    try{
        const movements = await queryAsync(movementsQuery)
        const totals = await queryAsync(totalsQuery)
        return res.status(200).json({ message: 'succesQuery', movements, totals });

    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
}
const createCashMovement = (req, res) => {
    const movementType = req.body.movementType;
    const amount = req.body.amount;
    const description = req.body.description;
    const cashRegisterId = req.params.cashRegisterId;
    const userId = req.body.userId;

    const values = [movementType, amount, description, cashRegisterId, userId]
    const query = `insert into cash_movements (movement_type,amount,description,cash_register_id, user_id) values (?,?,?,?,?)`
    db_connection.query(query, values, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(201).json({ message: 'Cash Movement created successfully' });
        }
    })
}
const updateCashMovement = async (req, res) => {
    const cashMovementId = parseInt(req.params.cashMovementId);
    const cashRegisterId = parseInt(req.params.cashRegisterId);
    const movementType = req.body.movementType;
    const amount = parseFloat(req.body.amount);
    const description = req.body.description;
    const userId = req.body.userId;

    const values = [movementType, amount, description, cashRegisterId, userId, cashMovementId]
    const query = `update cash_movements set movement_type=?,amount=?,description=?,cash_register_id=?, user_id=? where cash_movement_id =?`
    try{
        await queryAsync(query, values)
        return res.status(200).json({ message: 'Cash Movement updated successfully' });
    }catch(e){
        return res.status(500).json('Server Error: ' + error);
    }
}
const deleteCashMovement = async (req, res) => {
    const cashMovementId = parseInt(req.params.cashMovementId);
    const query = `delete from cash_movements where cash_movement_id =?`
    try{
        await queryAsync(query,cashMovementId)
        return res.status(200).json({ message: 'Cash Movement deleted successfully' });
    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
}
//--------------------------------------------------*** END CashReg Movements Section *---------------------------------------/

//--------------------------------------------------*** CashReg Section *---------------------------------------/
const getAllCashReg = (req, res) => {
    const query = `select * from cash_registers where is_active = 1`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Success Query', data: result });
        }
    })
}
// const getcashRegsOpenedByUserId = (req, res) => {
//     const userId = req.params.userId
//     const query = `SELECT cash_registers.is_open, cash_registers.name, open_close_details.* 
//     FROM open_close_details
//      INNER JOIN cash_registers on open_close_details.cash_register_id = cash_registers.cash_register_id 
//      WHERE cash_registers.is_open = 1 and open_close_details.user_id = ${userId}`
//     db_connection.query(query, (error, result) => {
//         if (error) {
//             return res.status(500).json('Server Error: ' + error);
//         } else {
//             return res.status(200).json({ message: 'Success Query', data: result });
//         }
//     })
// }
const getcashRegsOpen = (req, res) => {
    const query = `SELECT cash_registers.is_open, cash_registers.name, open_close_details.* 
    FROM open_close_details
     INNER JOIN cash_registers on open_close_details.cash_register_id = cash_registers.cash_register_id 
     WHERE cash_registers.is_open = 1 and open_close_details.close_date IS NULL `
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Success Query', data: result });
        }
    })
}
const getCashRegStatusById = (req, res) => {
    const cashRegId = req.params.cashRegisterId
    const query = `SELECT 
    cr.cash_register_id,
    cr.name,
    cr.is_open,
    ocd.open_close_details_id,
    ocd.open_date,
    ocd.open_amount,
    ocd.close_date,
    ocd.close_amount,
    u.user_name
FROM 
    cash_registers cr
INNER JOIN 
    open_close_details ocd ON cr.cash_register_id = ocd.cash_register_id
INNER JOIN 
    users u ON ocd.user_id = u.user_id
WHERE 
    cr.is_active = 1 and cr.cash_register_id = ${cashRegId} order by ocd.open_close_details_id desc limit 1;
`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Success Query', data: result });
        }
    })
}
const createCashReg = (req, res) => {
    const name = req.body.name.trim();
    const query = `insert into cash_registers (name) values (?)`
    db_connection.query(query, name, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            const selectLastCashReg = 'select * from cash_registers order by cash_register_id desc limit 1'
            db_connection.query(selectLastCashReg, (error, result) => {
                if (error) {
                    return res.status(500).json('Server Error: ' + error);
                } else {
                    return res.status(200).json({ message: 'Success Query', data: result });
                }
            })
        }
    })
}
const updateCashReg = (req, res) => {
    const cashRegisterId = req.params.cashRegisterId ? req.params.cashRegisterId : req.body.cashRegisterId
    const name = req.body.name.trim();
    const query = `update cash_registers set name =? where cash_register_id=${cashRegisterId}`
    db_connection.query(query, name, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Cash Register updated successfully' });
        }
    })
}
const deleteCashReg = (req, res) => {
    const cashRegisterId = req.params.cashRegisterId.trim();
    const query = `update cash_registers set is_active = 0 where cash_register_id=${cashRegisterId}`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Cash Register deleted successfully' });
        }
    })
}
//--------------------------------------------------*** END CashReg Section *---------------------------------------/

//--------------------------------------------------*** Open/Close details Section *---------------------------------------/

const openCashReg = async (req, res) => {
    console.log(req.body)
    const cashRegisterId = req.params.cashRegisterId;
    const openAmount = parseFloat(req.body.openAmount);
    const userId = parseInt(req.body.userId);
    try{
        await setOpenInfo(cashRegisterId, openAmount, userId)
        const openAmountMovementQuery = `
        insert into cash_movements (movement_type, amount, description, cash_register_id, user_id)
        values ('deposito', ${openAmount}, 'Caja inicial', ${cashRegisterId}, ${userId})
        `
        await queryAsync(openAmountMovementQuery)
        const openQuery = `update cash_registers set is_open = 1 where cash_register_id= ${cashRegisterId}`
        await queryAsync(openQuery)
        
        return res.status(200).json({ message: 'Cash Register open successfully' });
    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
    // setOpenInfo(cashRegisterId, openAmount, userId).then(result => {
    //     const query = `update cash_registers set is_open = 1 where cash_register_id= ${cashRegisterId}`
    //     db_connection.query(query, (error, result) => {
    //         if (error) {
    //             return res.status(500).json('Server Error: ' + error);
    //         } else {
    //             return res.status(200).json({ message: 'Cash Register open successfully' });
    //         }
    //     })
    // }).catch(error => {
    //     return res.status(error.status).json({ message: error.message });
    // })



}
const closeCashReg = async (req, res) => {
    const cashRegisterId = req.params.cashRegisterId;
    const closeAmount = parseFloat(req.body.closeAmount);
    const ocdId = parseFloat(req.body.ocdId);
    const query = `update cash_registers set is_open = 0 where cash_register_id= ${cashRegisterId}`
    try{
        await setCloseInfo(ocdId,closeAmount)
        await queryAsync(query)
        return res.status(200).json({ message: 'Cash Register closed successfully' });
    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
   
}

const setOpenInfo = async (cashRegId, openAmount, userId) => {
    const values = [openAmount, cashRegId, userId]
    const query = `insert into open_close_details (open_amount, cash_register_id, user_id) values (?,?,?)`
    try{
        await queryAsync(query,values)
    }catch(e){
        return 'algo salió mal' +e
    }
    // return new Promise((resolve, reject) => {
    //     const values = [openAmount, cashRegId, userId]
    //     const query = `insert into open_close_details (open_amount, cash_register_id, user_id) values (?,?,?)`
    //     db_connection.query(query, values, (error, result) => {

    //         if (error) reject({ status: 500, message: 'An unexpected error has ocurred: ' + error })

    //         resolve({ status: 201, message: 'Open details created successfully' })
    //     })
    // })
}

const setCloseInfo = async (opcdId, closeAmount) => {
    const values = [closeAmount, opcdId]
    console.log(values)
    const query = `update open_close_details set close_date = now(), close_amount=? 
    WHERE 
    open_close_details_id = ?`
    try{
        await queryAsync(query, values)
    }catch(e){
        return 'algo salió mal' +e
    }
    // return new Promise((resolve, reject) => {

    //     db_connection.query(query, closeAmount, (error, result) => {

    //         if (error) reject({ status: 500, message: 'An unexpected error has ocurred: ' + error })

    //         resolve({ status: 200, message: 'Close details updated successfully' })
    //     })
    // })
}
const getCashRegTotals = async (req, res)=>{
    const crId = req.params.cashRegisterId
    const crOpenDate = req.params.cashOpenDate
    console.log('diop: ',crOpenDate)
    const query = `SELECT SUM(CASE WHEN payment_method = 'tarjeta' THEN total ELSE 0 END) AS card_total, SUM(CASE WHEN payment_method = 'efectivo' THEN total ELSE 0 END) AS cash_total FROM orders WHERE order_date >= '${crOpenDate}' and cash_register_id= ${crId}`
    try{
         const result = await queryAsync(query)
        return res.status(200).json({ message: 'success query', data:result});
    }catch(e){
        return res.status(500).json({ message: e.message });
    }
}

//--------------------------------------------------***END Open/Close details Section *---------------------------------------/
//--------------------------------------------------***Receipt Section *---------------------------------------/
const getReceipt= (req,res)=>{
    const query = `select * from receipt where is_active = 1`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Success Query', data: result });
        }
    })

}
const updateReceipt= (req,res)=>{
    const receiptId =  req.body.receiptId
    const address =  req.body.address
    const rfc =  req.body.rfc
    let image = ''
    let query = `update receipt set address = '${address}', rfc='${rfc}' where receipt_id =${receiptId}`
    if (req.file) {
        image = req.file.filename
         query = `update receipt set image='${image}', address = '${address}', rfc='${rfc}' where receipt_id =${receiptId}`
    }
    
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Success Query'});
        }
    })

}
//--------------------------------------------------***END ReceiptSection *---------------------------------------/
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
module.exports =
{
    openCashReg, closeCashReg, createCashReg, updateCashReg, deleteCashReg,getCashMovements,
    createCashMovement, updateCashMovement, deleteCashMovement, getAllCashReg, getCashRegStatusById,getcashRegsOpen, getReceipt,updateReceipt,
    getCashRegTotals
}