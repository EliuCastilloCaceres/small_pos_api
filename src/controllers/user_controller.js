const db_connection = require('../../db_connection.js');

const getAllUsers = (req, res)=>{

    const query = 'select * from users;'
    db_connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json('Error en el servidor: '+error);
        }else{
            const data = {message:'Consulta Exitosa', data:result}
            return res.status(200).json(data);
        }
    })

}

module.exports={getAllUsers}