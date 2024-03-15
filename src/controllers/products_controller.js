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
const createProduct = async (req, res) => {
    //  console.log(req.body)
    //console.log(req.file)
    const sizes = JSON.parse(req.body.sizes)
     //console.log(sizes)
    let isVariable = req.body.isVariable ? 1 : 0;
    let sku = req.body.sku;
    const name = req.body.name;
    const description = req.body.description;
    const color = req.body.color;
    const purchasePrice = req.body.purchasePrice;
    const salePrice = req.body.salePrice;
    // const generalStock = req.body.generalStock;
    const generalStock = 0
    const uom = req.body.uom ?? "";
    const providerId = req.body.providerId;
    let image = ''
    if (req.file) {
        image = req.file.filename
    }
    const findSkuQuery = `select * from products where sku ='${sku}'`
    try {
        db_connection.beginTransaction();
        const skuResult = await queryAsync(findSkuQuery)
        if (skuResult.length > 0 && skuResult[0].sku != '') {
            return res.status(400).json({ message: `the sku already exists in the database` });
        } else {
            const insertProductQuery = `insert into products (is_variable, sku, name, description, color, purchase_price, sale_price, general_stock,
                uom, image, provider_id) values (${isVariable}, '${sku}', '${name}', '${description}', '${color}', ${purchasePrice}, ${salePrice}, ${generalStock},
                '${uom}', '${image}', ${providerId})`;
            await queryAsync(insertProductQuery)
            const findLastProductQuery = 'select product_id from products order by product_id desc limit 1'
            const productId = await queryAsync(findLastProductQuery)
            const lastId = productId[0].product_id
            if (sizes && sizes.length > 0) {
                for (const size of sizes) {
                    const query = `insert into sizes (size, sku, stock, product_id) values ('${size.size}','${size.sku}',${size.stock},${lastId})`
                    await queryAsync(query)
                }
            }
            db_connection.commit();
            return res.status(200).json({ message: `Product created successfully` });
        }

    } catch (e) {
        return res.status(500).json('Server Error: ' + e);
    }
}
const updateProduct = async (req, res) => {
    // console.log(req.body)
    const productId = parseInt(req.params.productId);
    const updates = JSON.parse(req.body.updates)
    const sizes = JSON.parse(req.body.sizes)
    // console.log(updates)
    // console.log(sizes)
    if (updates.isVariable) updates.isVariable = 1
    else updates.isVariable = 0
    let imagePatch = ''
    const values = [
        updates.isVariable,
        updates.sku,
        updates.name,
        updates.description,
        updates.color,
        updates.purchasePrice,
        updates.salePrice,
        updates.generalStock,
        updates.uom,
        updates.providerId,
        productId
    ];

    if (req.file) {
        updates.image = req.file.filename
        imagePatch = 'image=?,'
        values.splice(9, 0, updates.image); // Insertar la imagen en la posición correcta del arreglo
    }
    // console.log('values:', values)
    let updateProductQuery = `update products set is_variable=?, sku=?, name=?, description=?, color=?, purchase_price=?, sale_price=?, general_stock=?,
    uom=?,${imagePatch} provider_id=? where product_id = ?`;
    try {
        db_connection.beginTransaction();
        await queryAsync(updateProductQuery, values)
        if (updates.isVariable === 1) {
            if (sizes && sizes.length > 0) {
                for (const s of sizes) {
                    if (s.size_id) {
                        const sizeValues = [
                            s.size,
                            s.sku,
                            s.stock,
                            s.size_id
                        ]
                        // console.log('u',sizeValues)
                        const updateSizeQuery = `UPDATE sizes SET size=?, sku=?, stock=? WHERE size_id=?`
                        await queryAsync(updateSizeQuery, sizeValues)
                    } else {
                        const sizeValues = [
                            s.size,
                            s.sku,
                            s.stock,
                            productId
                        ]
                        // console.log('s',sizeValues)
                        const insertSizeQuery = `INSERT INTO sizes (size,sku,stock,product_id) VALUES (?,?,?,?) `
                        await queryAsync(insertSizeQuery, sizeValues)
                    }

                }
            }
        }

        db_connection.commit()

        return res.status(200).json({ message: `Product with id: ${productId} updated successfully` });
    } catch (e) {
        return res.status(500).json('Server Error: ' + e);
    }


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
const getAllSizes = (req, res) => {
    const query = `select * from sizes`;
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Succes Query', data: result });
        }
    })


}
const getSizesByProductId = async (req, res) => {
    const productId = req.params.productId;
    const query = `select * from sizes where product_id=${productId}`;
    try {
        const sizes = await queryAsync(query)
        // console.log(sizes)
        return res.status(200).json({ message: 'Succes Query', data: sizes });
    } catch (e) {
        return res.status(500).json('Server Error: ' + e);
    }

}
const createSizeByProductId = (req, res) => {
    // console.log(req.body)
    const productId = parseInt(req.params.productId)
    const size = req.body.size
    const sku = req.body.sku
    const stock = parseFloat(req.body.stock)
    // console.log(productId)
    // console.log(size)
    // console.log(sku)
    // console.log(stock)
    const skuQuery = `select * from sizes where sku ='${sku}'`
    if (IsANumber(productId)) {
        db_connection.query(skuQuery, (error, result) => {
            if (error) {

                return res.status(500).json('Server Error: ' + error);
            } else {
                if (result.length > 0 && result[0].sku != '') {
                    return res.status(400).json({ message: `the sku already exists in the database` });
                } else {
                    const values = [size, sku, stock, productId]
                    const query = `insert into sizes (size, sku, stock, product_id) values (?,?,?,?)`;
                    db_connection.query(query, values, (error, result) => {
                        if (error) {

                            return res.status(500).json('Server Error: ' + error);
                        } else {
                            const findLastSizeIdQuery = 'SELECT size_id FROM sizes order by size_id DESC LIMIT 1'
                            db_connection.query(findLastSizeIdQuery, (error, result) => {
                                if (error) {
                                    return res.status(500).json('Server Error finding last id: ' + error);
                                } else {
                                    return res.status(200).json({ lastSizeIdCreated: result[0].size_id, message: `Size created to product with id: ${productId} successfully` });
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

    // console.log(req.body)
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
//--------------------------------------------------***  Inventory Section *---------------------------------------/
const getAllProductInventory = async (req, res) => {
    // console.log(req.body)
    const satrtDate = req.params.startDate;
    const endDate = req.params.endDate;
    const operationType = req.params.operationType;


    const getOperations = `SELECT i.inventory_id, i.operation_type, i.quantity, i.reason, i.operation_date, p.sku as product_sku, p.name as product_name, s.sku as size_sku, s.size, u.first_name, u.last_name FROM inventory i INNER JOIN products p ON i.product_id = p.product_id LEFT JOIN sizes s ON i.size_id = s.size_id
    INNER JOIN users u ON i.user_Id = u.user_id
    WHERE i.operation_date BETWEEN '${satrtDate}' AND '${endDate} 23:59:59' AND i.operation_type = '${operationType}' ORDER BY i.inventory_id DESC`

    try {
        const result = await queryAsync(getOperations)
        return res.status(200).json({ message: 'Operación Exitosa', data: result });
    } catch (e) {
        return res.status(500).json('Server Error: ' + e);
    }

}
const createProductInventory = async (req, res) => {
    const product = req.body.product;
    const sizes = req.body.sizes;
    const operationType = req.body.operationType;
    const reason = req.body.reason;
    const quantity = req.body.quantity;
    const userId = req.body.userId
    let sign = '+'
    if (operationType != 'entry') {
        sign = '-'
    }

    const updateGeneralStockQuery = `update products set general_stock = general_stock ${sign} ${quantity} where product_id = ${product.product_id}`

    try {
        db_connection.beginTransaction();
        await queryAsync(updateGeneralStockQuery)
        if (product.is_variable === 1 && sizes.length > 0) {
            for (const size of sizes) {

                if (size.qty > 0) {
                    const updateSizeStockQuery = `UPDATE sizes SET stock = stock ${sign} ${parseFloat(size.qty)} WHERE size_id = ${size.size_id}`;
                    await queryAsync(updateSizeStockQuery); // Suponiendo que queryAsync es una función que ejecuta la consulta y devuelve una promesa
                    const isertInventoryQuery = `INSERT INTO inventory (operation_type,quantity,reason,product_id,size_id,user_id) values ('${operationType}',${parseFloat(size.qty)},'${reason}',${product.product_id},${size.size_id},${userId})`;
                    await queryAsync(isertInventoryQuery); // Suponiendo que queryAsync es una función que ejecuta la consulta y devuelve una promesa
                }

            }
        } else {
            const isertInventoryQuery = `INSERT INTO inventory (operation_type, quantity, reason, product_id, size_id, user_id) values ('${operationType}', ${quantity}, '${reason}', ${product.product_id}, ${null}, ${userId})`;
            await queryAsync(isertInventoryQuery); // Suponiendo que queryAsync es una función que ejecuta la consulta y devuelve una promesa

        }

        db_connection.commit();
        return res.status(200).json({ message: 'Operación Exitosa' });
    } catch (e) {
        return res.status(500).json('Server Error: ' + e);
    }

}
//--------------------------------------------------***  END Inventory Section *---------------------------------------/

const queryAsync = (query, values = null) => {
    return new Promise((resolve, reject) => {
        if (values) {
            db_connection.query(query, values, (error, result) => {

                if (error) reject(error)

                resolve(result)

            })

        } else {
            db_connection.query(query, (error, result) => {

                if (error) reject(error)

                resolve(result)

            })
        }


    })

}

module.exports = {
    createProduct, updateProduct, deleteProduct,
    getSizesByProductId, updateSizeBySizeId,
    deleteSizeBySizeId, createSizeByProductId,
    createReturnDetails, createReturn, updateReturn,
    deleteReturn, getAllProducts, getProductById, updateGeneralStock, getAllSizes,
    createProductInventory, getAllProductInventory
}