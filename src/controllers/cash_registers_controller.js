const db_connection = require('../../db_connection.js');

//--------------------------------------------------*** CashReg Movements Section *---------------------------------------/
const createCashMovement = (req, res) => {
    const movementType = req.body.movementType.trim();
    const amount = req.body.amount.trim();
    const description = req.body.description.trim();
    const cashRegisterId = req.params.cashRegisterId.trim();
    const userId = req.body.userId.trim();

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
const updateCashMovement = (req, res) => {
    const cashMovementId = parseInt(req.params.cashMovementId.trim());
    const movementType = req.body.movementType.trim();
    const amount = parseFloat(req.body.amount.trim());
    const description = req.body.description.trim();
    const cashRegisterId = parseInt(req.params.cashRegisterId.trim());
    const userId = req.body.userId.trim();

    const values = [movementType, amount, description, cashRegisterId, userId, cashMovementId]

    const query = `update cash_movements set movement_type=?,amount=?,description=?,cash_register_id=?, user_id=? where cash_movement_id =?`
    db_connection.query(query, values, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Cash Movement updated successfully' });
        }
    })
}
const deleteCashMovement = (req, res) => {
    const cashMovementId = parseInt(req.params.cashMovementId.trim());

    const query = `delete from cash_movements where cash_movement_id =?`
    db_connection.query(query, cashMovementId, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Cash Movement deleted successfully' });
        }
    })
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
    cr.is_active = 1 and cr.cash_register_id = ${cashRegId} order by cr.cash_register_id desc limit 1;
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

const openCashReg = (req, res) => {
    console.log(req.body)
    const cashRegisterId = req.params.cashRegisterId;
    const openAmount = parseFloat(req.body.openAmount);
    const userId = parseInt(req.body.userId);
    setOpenInfo(cashRegisterId, openAmount, userId).then(result => {
        const query = `update cash_registers set is_open = 1 where cash_register_id= ${cashRegisterId}`
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: 'Cash Register open successfully' });
            }
        })
    }).catch(error => {
        return res.status(error.status).json({ message: error.message });
    })



}
const closeCashReg = (req, res) => {
    const cashRegisterId = req.params.cashRegisterId.trim();
    const closeAmount = parseFloat(req.body.closeAmount.trim());
    setCloseInfo(closeAmount).then(result => {
        const query = `update cash_registers set is_open = 0 where cash_register_id= ${cashRegisterId}`
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: 'Cash Register closed successfully' });
            }
        })
    }).catch(error => {
        return res.status(error.status).json({ message: error.message });
    })



}

const setOpenInfo = (cashRegId, openAmount, userId) => {

    return new Promise((resolve, reject) => {
        const values = [openAmount, cashRegId, userId]
        const query = `insert into open_close_details (open_amount, cash_register_id, user_id) values (?,?,?)`
        db_connection.query(query, values, (error, result) => {

            if (error) reject({ status: 500, message: 'An unexpected error has ocurred: ' + error })

            resolve({ status: 201, message: 'Open details created successfully' })
        })
    })
}

const setCloseInfo = (closeAmount) => {
    return new Promise((resolve, reject) => {
        const query = `update open_close_details set close_date = now(), close_amount=? 
    WHERE 
    open_close_details_id = (SELECT open_close_details_id FROM open_close_details ORDER BY open_close_details_id DESC LIMIT 1)`

        db_connection.query(query, closeAmount, (error, result) => {

            if (error) reject({ status: 500, message: 'An unexpected error has ocurred: ' + error })

            resolve({ status: 200, message: 'Close details updated successfully' })
        })
    })
}

//--------------------------------------------------***END Open/Close details Section *---------------------------------------/

module.exports =
{
    openCashReg, closeCashReg, createCashReg, updateCashReg, deleteCashReg,
    createCashMovement, updateCashMovement, deleteCashMovement, getAllCashReg, getCashRegStatusById,getcashRegsOpen
}