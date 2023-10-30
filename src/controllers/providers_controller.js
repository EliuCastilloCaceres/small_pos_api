const db_connection = require('../../db_connection.js');
const {IsANumber} = require('../../helpers.js');

const getAllProviders = (req,res)=>{
    
    const query = `select * from providers`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}

const createProvider = (req, res) =>{

    const name = req.body.name.trim();
    const rfc = req.body.rfc.trim();
    const zipCode = req.body.zipCode.trim();
    const adress = req.body.adress.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const phoneNumber = req.body.phoneNumber.trim();

    const query = `insert into providers (name,rfc,zip_code,adress,state,city,phone_number)
    values ('${name}','${rfc}','${zipCode}','${adress}','${state}','${city}','${phoneNumber}')`

    db_connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Provider created successfully`});
        }
    })
}
const updateProvider = (req, res) =>{
    const providerId = req.params.providerId.trim();
    const name = req.body.name.trim();
    const rfc = req.body.rfc.trim();
    const zipCode = req.body.zipCode.trim();
    const adress = req.body.adress.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const phoneNumber = req.body.phoneNumber.trim();

    const query = `update providers set name='${name}',rfc='${rfc}',zip_code='${zipCode}',adress='${adress}',state='${state}',city='${city}',phone_number='${phoneNumber}' where provider_id = ${providerId}`

    db_connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Provider updated successfully`});
        }
    })
}
const deleteProvider = (req, res) =>{
    const providerId = req.params.providerId.trim();

    const query = `update providers set is_active=0 where provider_id=${providerId}`

    db_connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Provider deleted successfully`});
        }
    })
}

module.exports =
{
    createProvider, updateProvider, deleteProvider,
    getAllProviders
}