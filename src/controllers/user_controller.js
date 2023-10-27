const db_connection = require('../../db_connection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const getAllUsers = (req, res) => {

    jwt.verify(req.token, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(403).json({ errorMessage: 'invalid token' });
        } else {
            const query = 'select * from users;'
            db_connection.query(query, (error, result) => {
                if (error) {
                    return res.status(500).json('Server Error: ' + error);
                } else {
                    return res.status(200).json({ message: 'Success', data: result });
                }
            })
        }
    })


}

const getUserById = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(403).json({ errorMessage: 'invalid token' });
        } else {
            const userId = parseInt(req.params.userId.trim());
            const query = `select * from users where user_id=${userId}`;
            if (isNaN(userId) && !Number(userId)) {
                return res.status(400).json({ ErrorMessage: 'The id param must be an integer' });
            } else {
                db_connection.query(query, (error, result) => {
                    if (error) {
                        return res.status(500).json('Server Error: ' + error);
                    } else {
                        const data = { message: 'Succes', data: result }
                        return res.status(200).json({ data, userData });
                    }
                })
            }
        }
    })

}

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //console.log(req);
    if (username == "" || password == "") {
        return res.status(404).json({ ErrorMessage: 'Password or username field is empty' });
    } else {
        const query = `select * from users where user_name='${username}' AND is_active = 1`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                if (result.length > 0) {
                    if (bcrypt.compareSync(password, result[0].password)) {
                        delete result[0].password;
                        jwt.sign({ user: result }, process.env.SECRET_KEY, (error, token) => {
                            if (error) {
                                return res.status(500).json({ errorMessage: 'Unexpected error generating token ' + error })
                            } else {
                                return res.status(200).json({ message: 'Succes', token: token, user:result[0]});
                            }
                        });
                    } else {
                        return res.status(401).json({ errorMessage: 'incorrect credentials' });
                    }
                } else {
                    return res.status(401).json({ errorMessage: 'incorrect credentials' });
                }
            }
        })
    }
}

const createUser = (req, res) => {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const password = bcrypt.hashSync(req.body.password.trim(), 10)
    const profile = req.body.profile.trim();
    const position = req.body.position.trim();
    const adress = req.body.adress.trim();
    const zipCode = req.body.zipCode.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const phoneNumber = req.body.phoneNumber.trim();
    //formateado de fecha.
    // const fecha = new Date();
    // const año = fecha.getFullYear();
    // const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    // const dia = fecha.getDate().toString().padStart(2, '0');
    // const hora = fecha.getHours().toString().padStart(2, '0');
    // const minutos = fecha.getMinutes().toString().padStart(2, '0');
    // const segundos = fecha.getSeconds().toString().padStart(2, '0');
    // const fechaFormateada = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
    const query =`insert into users (first_name, last_name, user_name, password, profile, position, adress, zip_code, state, city, phone_number)
    values('${firstName}','${lastName}','${userName}','${password}','${profile}','${position}','${adress}','${zipCode}','${state}','${city}','${phoneNumber}')`

    db_connection.query(query,(error,result)=>{
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
           
            return res.status(201).json({ message: 'User created successfully'});
        }
    })
}
const updateUser = (req, res) => {
    const userId = req.params.userId;
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const password = req.body.password.trim();
    const profile = req.body.profile.trim();
    const position = req.body.position.trim();
    const adress = req.body.adress.trim();
    const zipCode = req.body.zipCode.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const phoneNumber = req.body.phoneNumber.trim();
    let query='';

    if(password!=''){
        const newPassword = bcrypt.hashSync(password, 10);
        query =`update users set first_name='${firstName}', last_name='${lastName}', user_name='${userName}', password='${newPassword}', profile='${profile}', position='${position}', 
        adress='${adress}', zip_code='${zipCode}', state='${state}', city='${city}', phone_number='${phoneNumber}' where user_id=${userId}`
    }else{
        query =`update users set first_name='${firstName}', last_name='${lastName}', user_name='${userName}', profile='${profile}', position='${position}', 
        adress='${adress}', zip_code='${zipCode}', state='${state}', city='${city}', phone_number='${phoneNumber}' where user_id=${userId}`
    }
    db_connection.query(query,(error,result)=>{
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
           
            return res.status(200).json({ message: 'User updated successfully'});
        }
    })
}
const deleteUser = (req, res) => {
    const userId = req.params.userId;
    
    const query=`update users set is_active=0 where user_id=${userId}`;
    db_connection.query(query,(error,result)=>{
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
           
            return res.status(200).json({ message: 'User deleted successfully'});
        }
    })
}

module.exports = { getAllUsers, getUserById, login, createUser, updateUser, deleteUser }