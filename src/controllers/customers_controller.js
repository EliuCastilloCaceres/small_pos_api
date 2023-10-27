const { query } = require('express');
const db_connection = require('../../db_connection.js');

const getAllCustomers = (req,res)=>{
    
    const query = `select * from customers`
    db_connection.query(query,(error, result)=>{
        if(error){
            return res.status(500).json('Server Error: ' + error);
        }else{
            return res.status(200).json({message:`Success query`, data:result});
        }
    })
}
const createCustomer =(req,res)=>{

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const adress = req.body.adress.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const zipCode = req.body.zipCode.trim();
    const phoneNumber = req.body.phoneNumber.trim();
    const rfc = req.body.rfc.trim();

    const values = [firstName,lastName,adress,state,city,zipCode,phoneNumber,rfc];

    const query = `insert into customers (first_name,last_name,adress,state,city,zip_code,phone_number,rfc)
    values(?,?,?,?,?,?,?,?)`

    db_connection.query(query,values,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: An unexpected error has ocurred: '+error);
        }else{
            return res.status(201).json({message:'Customer created successfully'});
        }
    })

}
const updateCustomer =(req,res)=>{

    const customerId = parseInt(req.params.customerId);
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const adress = req.body.adress.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const zipCode = req.body.zipCode.trim();
    const phoneNumber = req.body.phoneNumber.trim();
    const rfc = req.body.rfc.trim();
 

    const values = [firstName,lastName,adress,state,city,zipCode,phoneNumber,rfc];

    const query = `update customers set first_name=?,last_name=?,adress=?,state=?,city=?,zip_code=?,phone_number=?,rfc=? where customer_id=${customerId}`

    db_connection.query(query,values,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: An unexpected error has ocurred: '+error);
        }else{
            return res.status(200).json({message:'Customer updated successfully'});
        }
    })

}
const deleteCustomer =(req,res)=>{

    const customerId = parseInt(req.params.customerId);

    const query = `update customers set is_active = 0 where customer_id=${customerId}`

    db_connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json('Server Error: An unexpected error has ocurred: '+error);
        }else{
            return res.status(200).json({message:'Customer deleted successfully'});
        }
    })

}

module.exports =
{
    createCustomer,updateCustomer,deleteCustomer,getAllCustomers
}