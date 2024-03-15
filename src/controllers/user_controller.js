const db_connection = require('../../db_connection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const getAllUsers = (req, res) => {

    jwt.verify(req.token, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(403).json({ errorMessage: 'invalid token' });
        } else {
            const query = 'select * from users where is_active = 1 ORDER BY user_id DESC;'
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
            const userId = parseInt(req.params.userId);
            const query = `select * from users where user_id=${userId}`;
            if (isNaN(userId) && !Number(userId)) {
                return res.status(400).json({ ErrorMessage: 'The id param must be an integer' });
            } else {
                db_connection.query(query, (error, result) => {
                    if (error) {
                        return res.status(500).json('Server Error: ' + error);
                    } else {

                        return res.status(200).json({ message: 'Succes', data: result, userData });
                    }
                })
            }
        }
    })

}


const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //console.log(req);
    try{
        const userCountResult = await queryAsync('SELECT COUNT(*) AS userCount FROM users')
        const userCount = userCountResult[0].userCount
        // console.log(userCount)
        if(userCount===0){
            const newUsername = 'admin'
            const newProfile = 'administrador'
            const newPassword = bcrypt.hashSync('admin', 10)
           
            const values = [newUsername,newProfile,newPassword]
            console.log(values)
            const newUserQuery = `INSERT INTO users (user_name,profile,password) VALUES (?,?,?)`
            await queryAsync(newUserQuery,values)
            const result = await queryAsync('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1')
            const userId = result[0].user_id
            await queryAsync(`INSERT INTO permissions (pos, dashboard, orders, products,providers,users,customers,settings, user_id) VALUES(1,1,1,1,1,1,1,1,${userId})`)
            return res.status(201).json({ message: 'Usuario Creado' });

        }else{
            if (username == "" || password == "") {
                return res.status(404).json({ ErrorMessage: 'Password or username field is empty' });
            } else {
                const userQuery = `select * from users where user_name='${username}' AND is_active = 1`;
                const user = await queryAsync(userQuery)
                if (user.length > 0) {
                    if (bcrypt.compareSync(password, user[0].password)) {
                        delete user[0].password;
                        jwt.sign({ user: user }, process.env.SECRET_KEY, (error, token) => {
                            if (error) {
                                return res.status(500).json({ errorMessage: 'Unexpected error generating token ' + error })
                            } else {

                                return res.status(200).json({ message: 'Succes', token: token, user: user[0] });
                            }
                        });
                    } else {
                        return res.status(401).json({ errorMessage: 'incorrect credentials' });
                    }
                }else{
                    return res.status(401).json({ errorMessage: 'incorrect credentials' });
                }
                
                
            }
        }
    }catch(e){
        return res.status(500).json('Server Error: ' + e);
    }
    
}

const createUser = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const password = bcrypt.hashSync(req.body.password, 10)
    const profile = req.body.profile;
    const position = req.body.position;
    const adress = req.body.adress;
    const zipCode = req.body.zipCode;
    const state = req.body.state;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;
    //formateado de fecha.
    // const fecha = new Date();
    // const año = fecha.getFullYear();
    // const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    // const dia = fecha.getDate().toString().padStart(2, '0');
    // const hora = fecha.getHours().toString().padStart(2, '0');
    // const minutos = fecha.getMinutes().toString().padStart(2, '0');
    // const segundos = fecha.getSeconds().toString().padStart(2, '0');
    // const fechaFormateada = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
    const query = `select * from users where user_name='${userName}' AND is_active = 1`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            if(result.length>0){
                return res.status(400).json({message:'Nombre de usuario Existente'});
            }
            const query = `insert into users (first_name, last_name, user_name, password, profile, position, adress, zip_code, state, city, phone_number)
            values('${firstName}','${lastName}','${userName}','${password}','${profile}','${position}','${adress}','${zipCode}','${state}','${city}','${phoneNumber}')`

            db_connection.query(query, (error, result) => {
                if (error) {
                    return res.status(500).json('Server Error: ' + error);
                } else {

                    return res.status(201).json({ message: 'User created successfully' });
                }
            })
        }
    })

}
const updateUser = (req, res) => {
    // console.log(req.body)
    const userId = req.params.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const password = req.body.password;
    const profile = req.body.profile;
    const position = req.body.position;
    const adress = req.body.adress;
    const zipCode = req.body.zipCode;
    const state = req.body.state;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;
    let query = '';

    if (password != '') {
        const newPassword = bcrypt.hashSync(password, 10);
        query = `update users set first_name='${firstName}', last_name='${lastName}', user_name='${userName}', password='${newPassword}', profile='${profile}', position='${position}', 
        adress='${adress}', zip_code='${zipCode}', state='${state}', city='${city}', phone_number='${phoneNumber}' where user_id=${userId}`
    } else {
        query = `update users set first_name='${firstName}', last_name='${lastName}', user_name='${userName}', profile='${profile}', position='${position}', 
        adress='${adress}', zip_code='${zipCode}', state='${state}', city='${city}', phone_number='${phoneNumber}' where user_id=${userId}`
    }
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {

            return res.status(200).json({ message: 'User updated successfully' });
        }
    })
}
const deleteUser = (req, res) => {
    const userId = req.params.userId;

    const query = `update users set is_active=0 where user_id=${userId}`;
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {

            return res.status(200).json({ message: 'User deleted successfully' });
        }
    })
}
//------------------------------Permissions Section-----------------------------------------

const getPermissionsByUserId = (req, res) => {

    const userId = req.params.userId
    const userPermissionsQuery = `select * from permissions where user_Id = ${userId}`
    db_connection.query(userPermissionsQuery, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Succes Query', data: result });
        }
    })
}
const createUserPermissions = (req, res) => {

    const userId = parseInt(req.params.userId)
    const pos = req.body.pos ? 1 : 0
    const dashboard = req.body.dashboard ? 1 : 0
    const orders = req.body.orders ? 1 : 0
    const products = req.body.products ? 1 : 0
    const providers = req.body.providers ? 1 : 0
    const users = req.body.users ? 1 : 0
    const customers = req.body.customers ? 1 : 0
    const settings = req.body.settings ? 1 : 0

    const values = [pos, dashboard, orders, products, providers, users, customers,settings, userId]
    //console.log(values)
    const userPermissionsCreateQuery = 'insert into permissions (pos,dashboard,orders,products,providers,users,customers,settings,user_id) values(?,?,?,?,?,?,?,?,?)'
    db_connection.query(userPermissionsCreateQuery, values, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Succes Query' });
        }
    })
}
const updateUserPermissions = (req, res) => {

    const userId = parseInt(req.params.userId)
    const pos = req.body.pos ? 1 : 0
    const dashboard = req.body.dashboard ? 1 : 0
    const orders = req.body.orders ? 1 : 0
    const products = req.body.products ? 1 : 0
    const providers = req.body.providers ? 1 : 0
    const users = req.body.users ? 1 : 0
    const customers = req.body.customers ? 1 : 0
    const settings = req.body.settings ? 1 : 0

    const values = [pos, dashboard, orders, products, providers, users, customers, settings, userId]
    //console.log(values)
    const userPermissionsUpdateQuery = 'update permissions set pos=?,dashboard=?,orders=?,products=?,providers=?,users=?,customers=?,settings=? where user_id=?'
    db_connection.query(userPermissionsUpdateQuery, values, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: 'Permissions Updated Successfully' });
        }
    })
}
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

const isAuth = (req, res) => {
    if (req.token) {
        try {
            jwt.verify(req.token, process.env.SECRET_KEY, (error, { user }) => {
                if (error) {
                    return res.status(403).json({ isLogged: false, user: {} });
                } else {
                    delete user[0].password;
                    delete user[0].zip_code;
                    delete user[0].city;
                    delete user[0].state;
                    delete user[0].phone_number;
                    delete user[0].password;
                    delete user[0].adress;

                    const userPermissionsQuery = `select * from permissions where user_Id = ${user[0].user_id}`
                    db_connection.query(userPermissionsQuery, (error, result) => {
                        if (error) {
                            return res.status(500).json('Server Error: ' + error);
                        } else {
                            user[0].permissions = result[0]
                            // console.log(user[0])
                            return res.status(200).json({ isLogged: true, user});
                        }
                    })


                }
            })
        } catch (error) {
            return res.status(500).json({ isLogged: false, user: {} })
        }


    } else {
        return res.status(500).json({ isLogged: false })
    }

}


module.exports = { isAuth, getAllUsers, getUserById, login, createUser, updateUser, deleteUser, getPermissionsByUserId, createUserPermissions, updateUserPermissions }