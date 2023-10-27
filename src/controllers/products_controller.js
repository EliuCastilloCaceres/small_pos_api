const db_connection = require('../../db_connection.js');
const {IsANumber} = require('../../helpers.js');

//--------------------------------------------------*** Products Section *---------------------------------------/
const getAllProducts = (req,res)=>{
    
    const query = `select * from products where is_active = 1`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}
const createProduct = (req, res) =>{
    const isVariable = req.body.isVariable.trim();
    let sku = req.body.sku.trim();
    const name = req.body.name.trim();
    const description = req.body.description.trim();
    const color = req.body.color.trim();
    const purchasePrice = req.body.purchasePrice.trim();
    const salePrice = req.body.salePrice.trim();
    const generalStock = req.body.generalStock.trim();
    const uom = req.body.uom.trim();
    const image = req.body.image.trim();
    const providerId = req.body.providerId.trim();

    if(isVariable == 1) sku='';

    const query = `insert into products (is_variable, sku, name, description, color, purchase_price, sale_price, general_stock,
        uom, image, provider_id) values (${isVariable}, '${sku}', '${name}', '${description}', '${color}', ${purchasePrice}, ${salePrice}, ${generalStock},
        '${uom}', '${image}', ${providerId})`;
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Product created successfully`});
        }
    })

}
const updateProduct = (req, res) =>{
    const productId = req.params.productId.trim();
    const isVariable = req.body.isVariable.trim();
    let sku = req.body.sku.trim();
    const name = req.body.name.trim();
    const description = req.body.description.trim();
    const color = req.body.color.trim();
    const purchasePrice = req.body.purchasePrice.trim();
    const salePrice = req.body.salePrice.trim();
    const generalStock = req.body.generalStock.trim();
    const uom = req.body.uom.trim();
    const image = req.body.image.trim();
    const providerId = req.body.providerId.trim();

    if(isVariable == 1) sku='';

    const updates=[isVariable,sku,name,description,color,purchasePrice,salePrice,
        generalStock,uom,image,providerId]

    const query = `update products set is_variable=?, sku=?, name=?, description=?, color=?, purchase_price=?, sale_price=?, general_stock=?,
        uom=?, image=?, provider_id=? where product_id = ${productId}`;
    db_connection.query(query, updates,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Product with id: ${productId} updated successfully`});
        }
    })

}
const deleteProduct = (req, res) =>{
    const productId = req.params.productId.trim();
    
    const query = `update products set is_active=0 where product_id = ${productId}`;
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Product with id: ${productId} deleted successfully`});
        }
    })

}




//--------------------------------------------------*** END Products Section *---------------------------------------/

//--------------------------------------------------*** Returns Section *---------------------------------------/
const deleteReturn = (req, res) =>{
    const returnId = req.params.returnId.trim();
     if(IsANumber(returnId)){
         const query = `update returns set status=0 where return_id=${returnId}`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Return canceled successfully`});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:`the param ${returnId} must be an integer`})
     }

}
const updateReturn = (req, res) =>{
    const returnId = req.params.returnId.trim();
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();
    const reason = req.body.reason.trim();
    const amountRefound = parseFloat(req.body.amountRefound.trim());
     if(IsANumber(returnId)){
         const query = `update returns set reason='${reason}', amount_refound=${amountRefound}, customer_id=${customerId}, user_id=${userId} where return_id=${returnId}`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Return updated successfully`});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:`the param ${returnId} must be an integer`})
     }

}
const createReturn = (req, res) =>{
    const customerId = req.body.customerId.trim();
    const userId = req.body.userId.trim();
    const reason = req.body.reason.trim();
    const amountRefound = parseFloat(req.body.amountRefound.trim());
     if(IsANumber(userId) && IsANumber(customerId)){
         const query = `insert into returns (reason, amount_refound, customer_id, user_id) values ('${reason}', ${amountRefound}, ${customerId}, ${userId})`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Return created successfully`});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:`the param ${userId} or ${customerId} must be an integer`})
     }

}
const createReturnDetails = (req, res) =>{
    const returnId = req.params.returnId.trim();
    const productId = req.params.productId.trim();
    const size = req.body.size.trim();
    const quantity = req.body.quantity.trim();
     if(IsANumber(productId) && IsANumber(returnId)){
         const query = `insert into return_details (return_id, product_id, size, quantity) values (${returnId}, ${productId}, ${size}, ${quantity})`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Return details created successfully`});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:`the productId param ${productId} or ${returnId} must be an integer`})
     }

}
//--------------------------------------------------*** END Returns Section *---------------------------------------/

//--------------------------------------------------*** END Sizes Section *---------------------------------------/
const getSizesByProductId = (req, res)=>{
    
   const productId = req.params.productId.trim();
   
    if(IsANumber(productId)){
        const query = `select * from sizes where product_id=${productId}`;
        db_connection.query(query,(error, result)=>{
            if(error){
                return res.status(500).json('Server Error: ' + error);
            }else{
                return res.status(200).json({message:'Succes Query', data:result});
            }
        })
        
    }else{
        return res.status(404).json({ErrorMessage:'El parametro '+productId+' no es un numero'})
    }
}
const createSizeByProductId = (req, res)=>{
    
    const productId = req.params.productId.trim();
    const size = req.body.size.trim();
    const sku = req.body.sku.trim();
    const stock = parseFloat(req.body.stock.trim());
     if(IsANumber(productId)){
         const query = `insert into sizes (size, sku, stock, product_id) values (${size}, ${sku}, ${stock}, ${productId})`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Size created to product with id: ${productId} successfully`});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:'the productId param '+productId+' must be an integer'})
     }
 }

const updateSizeBySizeId = (req, res)=>{
    
    const sizeId = req.params.sizeId.trim();
    const size = req.body.size.trim();
    const sku = req.body.sku.trim();
    const stock = parseFloat(req.body.stock.trim());
     if(IsANumber(sizeId)){
         const query = `update sizes set size=${size}, sku=${sku}, stock=${stock} where size_id=${sizeId}`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:'Size updated successfully'});
             }
         })
         
     }else{
         return res.status(404).json({ErrorMessage:'the sizeId param '+sizeId+' must be an integer'})
     }
 }
 const deleteSizeBySizeId = (req, res)=>{
    
    const sizeId = req.params.sizeId.trim();
     if(IsANumber(sizeId)){
         const query = `delete from sizes where size_id=${sizeId}`;
         db_connection.query(query,(error, result)=>{
             if(error){
                 return res.status(500).json('Server Error: ' + error);
             }else{
                 return res.status(200).json({message:`Size with id: ${sizeId} deleted successfully`});
             }
         })
     }else{
         return res.status(404).json({ErrorMessage:'the sizeId param '+sizeId+' must be an integer'})
     }
 }

//--------------------------------------------------*** END Sizes Section *---------------------------------------/

module.exports={
    createProduct, updateProduct, deleteProduct,
    getSizesByProductId,updateSizeBySizeId, 
    deleteSizeBySizeId, createSizeByProductId, 
    createReturnDetails, createReturn, updateReturn,
    deleteReturn, getAllProducts
}