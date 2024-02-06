const db_connection = require('../../db_connection.js');
const { IsANumber } = require('../../helpers.js');

//--------------------------------------------------*** Products Section *---------------------------------------/
const getAllProducts = (req, res) => {

    const query = `select * from products where is_active = 1 ORDER BY product_id DESC`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const getProductById = (req, res) => {
    const productId = req.params.productId;
    const query = `select * from products where product_id=${productId} AND is_active = 1`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const createProduct = (req, res) => {
    console.log(req.body)
    console.log(req.file)
    let isVariable = req.body.isVariable ? 1 : 0;
    let sku = req.body.sku;
    const name = req.body.name;
    const description = req.body.description;
    const color = req.body.color;
    const purchasePrice = req.body.purchasePrice;
    const salePrice = req.body.salePrice;
    const generalStock = req.body.generalStock;
    const uom = req.body.uom??"";
    const providerId = req.body.providerId;
    let image = ''
    if (req.file) {
        image = req.file.filename
    }
    const skuQuery = `select * from products where sku ='${sku}'`
   
        db_connection.query(skuQuery, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                if (result.length > 0 && result[0].sku!='') {
                        return res.status(400).json({ message: `the sku already exists in the database` });
                }else{
                    const query = `insert into products (is_variable, sku, name, description, color, purchase_price, sale_price, general_stock,
                        uom, image, provider_id) values (${isVariable}, '${sku}', '${name}', '${description}', '${color}', ${purchasePrice}, ${salePrice}, ${generalStock},
                        '${uom}', '${image}', ${providerId})`;
                    db_connection.query(query, (error, result) => {
                        if (error) {
                            return res.status(500).json('Server Error: ' + error);
                        } else {
                            return res.status(200).json({ message: `Product created successfully` });
                        }
                    })
                }
            }
        })

   

}
const updateProduct = (req, res) => {
    const productId = req.params.productId;
    let isVariable = req.body.isVariable ? 1 : 0;
    let sku = req.body.sku.trim();
    const name = req.body.name.trim();
    const description = req.body.description.trim();
    const color = req.body.color.trim();
    const purchasePrice = req.body.purchasePrice;
    const salePrice = req.body.salePrice;
    const generalStock = req.body.generalStock;
    const uom = req.body.uom.trim();
    const providerId = req.body.providerId;
    let image = ''
    let updates = [isVariable, sku, name, description, color, purchasePrice, salePrice,
        generalStock, uom, providerId]
    let query = `update products set is_variable=?, sku=?, name=?, description=?, color=?, purchase_price=?, sale_price=?, general_stock=?,
    uom=?,provider_id=? where product_id = ${productId}`;
    if (req.file) {
        image = req.file.filename

        updates = [isVariable, sku, name, description, color, purchasePrice, salePrice,
            generalStock, uom, image, providerId]
        query = `update products set is_variable=?, sku=?, name=?, description=?, color=?, purchase_price=?, sale_price=?, general_stock=?,
            uom=?, image=?, provider_id=? where product_id = ${productId}`;
    }

    db_connection.query(query, updates, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Product with id: ${productId} updated successfully` });
        }
    })

}
const deleteProduct = (req, res) => {
    const productId = req.params.productId.trim();

    const query = `update products set is_active=0 where product_id = ${productId}`;
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Product with id: ${productId} deleted successfully` });
        }
    })

}
const updateGeneralStock = (req, res) => {
    const productId = req.params.productId.trim();
    const generalStock = req.body.generalStock

    const query = `update products set general_stock = ${generalStock} where product_id = ${productId}`;
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `stock of product with id: ${productId} updated successfully` });
        }
    })

}




//--------------------------------------------------*** END Products Section *---------------------------------------/

//--------------------------------------------------*** Returns Section *---------------------------------------/
const deleteReturn = (req, res) => {
    const returnId = req.params.returnId.trim();
    if (IsANumber(returnId)) {
        const query = `update returns set status=0 where return_id=${returnId}`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: `Return canceled successfully` });
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: `the param ${returnId} must be an integer` })
    }

}
const updateReturn = (req, res) => {
    const returnId = req.params.returnId.trim();
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();
    const reason = req.body.reason.trim();
    const amountRefound = parseFloat(req.body.amountRefound.trim());
    if (IsANumber(returnId)) {
        const query = `update returns set reason='${reason}', amount_refound=${amountRefound}, customer_id=${customerId}, user_id=${userId} where return_id=${returnId}`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: `Return updated successfully` });
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: `the param ${returnId} must be an integer` })
    }

}
const createReturn = (req, res) => {
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();
    const reason = req.body.reason.trim();
    const amountRefound = parseFloat(req.body.amountRefound.trim());
    if (IsANumber(userId) && IsANumber(customerId)) {
        const query = `insert into returns (reason, amount_refound, customer_id, user_id) values ('${reason}', ${amountRefound}, ${customerId}, ${userId})`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: `Return created successfully` });
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: `the param ${userId} or ${customerId} must be an integer` })
    }

}
const createReturnDetails = (req, res) => {
    const returnId = req.params.returnId.trim();
    const productId = req.params.productId.trim();
    const size = req.body.size.trim();
    const quantity = req.body.quantity.trim();
    if (IsANumber(productId) && IsANumber(returnId)) {
        const query = `insert into return_details (return_id, product_id, size, quantity) values (${returnId}, ${productId}, ${size}, ${quantity})`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: `Return details created successfully` });
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: `the productId param ${productId} or ${returnId} must be an integer` })
    }

}
//--------------------------------------------------*** END Returns Section *---------------------------------------/

//--------------------------------------------------*** Sizes Section *---------------------------------------/
const getSizesByProductId = (req, res) => {

    const productId = req.params.productId.trim();

    if (IsANumber(productId)) {
        const query = `select * from sizes where product_id=${productId}`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: 'Succes Query', data: result });
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: 'El parametro ' + productId + ' no es un numero' })
    }
}
const createSizeByProductId = (req, res) => {
    console.log(req.body)
    const productId = parseInt(req.params.productId)
    const size = req.body.size
    const sku = req.body.sku
    const stock = parseFloat(req.body.stock)
    console.log(productId)
    console.log(size)
    console.log(sku)
    console.log(stock)
    const skuQuery = `select * from sizes where sku ='${sku}'`
    if (IsANumber(productId)) {
        db_connection.query(skuQuery, (error, result) => {
            if (error) {
                
                return res.status(500).json('Server Error: ' + error);
            } else {
                if (result.length > 0 && result[0].sku!='') {
                        return res.status(400).json({ message: `the sku already exists in the database` });
                }else{
                    const values =[size,sku,stock,productId]
                    const query = `insert into sizes (size, sku, stock, product_id) values (?,?,?,?)`;
                    db_connection.query(query,values, (error, result) => {
                        if (error) {
                           
                            return res.status(500).json('Server Error: ' + error);
                        } else {
                            const findLastSizeIdQuery = 'SELECT size_id FROM sizes order by size_id DESC LIMIT 1'
                            db_connection.query(findLastSizeIdQuery,(error,result)=>{
                                if(error){
                                    return res.status(500).json('Server Error finding last id: ' + error);
                                }else{
                                    return res.status(200).json({lastSizeIdCreated:result[0].size_id, message: `Size created to product with id: ${productId} successfully` });
                                }
                            })
                            
                        }
                    })
                }
            }
        })

    } else {
        return res.status(404).json({ ErrorMessage: 'the productId param ' + productId + ' must be an integer' })
    }
}

const updateSizeBySizeId = (req, res) => {

    console.log(req.body)
    const sizeId = req.params.sizeId;
    const size = req.body.size;
    const sku = req.body.sku;
    const stock = parseFloat(req.body.stock);
    
        const query = `update sizes set size='${size}', sku='${sku}', stock=${stock} where size_id=${sizeId}`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: 'Size updated successfully' });
            }
        })

    
}
const deleteSizeBySizeId = (req, res) => {

    const sizeId = req.params.sizeId.trim();
    if (IsANumber(sizeId)) {
        const query = `delete from sizes where size_id=${sizeId}`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                return res.status(200).json({ message: `Size with id: ${sizeId} deleted successfully` });
            }
        })
    } else {
        return res.status(404).json({ ErrorMessage: 'the sizeId param ' + sizeId + ' must be an integer' })
    }
}

//--------------------------------------------------*** END Sizes Section *---------------------------------------/

module.exports = {
    createProduct, updateProduct, deleteProduct,
    getSizesByProductId, updateSizeBySizeId,
    deleteSizeBySizeId, createSizeByProductId,
    createReturnDetails, createReturn, updateReturn,
    deleteReturn, getAllProducts, getProductById,updateGeneralStock
}