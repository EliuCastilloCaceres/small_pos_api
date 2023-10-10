const db_connection = require('../../db_connection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const getAllUsers = (req, res) => {

    jwt.verify(req.token, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(403).json({ ErrorMessage: 'invalid token' });
        } else {
                const query = 'select * from users;'
                db_connection.query(query, (error, result) => {
                    if (error) {
                        return res.status(500).json('Server Error: ' + error);
                    } else {
                        const data = { message: 'Success', data: result }
                        return res.status(200).json({data,userData});
                    }
                })
            }
    })

    
}

const getUserById = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(403).json({ ErrorMessage: 'invalid token' });
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
                        return res.status(200).json({data, userData});
                    }
                })
            }
        }
    })

}

const login = (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    if (username == "" || password == "") {
        return res.status(404).json({ ErrorMessage: 'Password or username field is empty' });
    } else {
        const query = `select * from users where user_name='${username}'`;
        db_connection.query(query, (error, result) => {
            if (error) {
                return res.status(500).json('Server Error: ' + error);
            } else {
                if (result.length > 0) {
                    if (password == result[0].password) {
                        delete result[0].password;
                        jwt.sign({ user: result }, process.env.SECRET_KEY, (error, token) => {
                            if (error) {
                                return res.status(500).json({ ErrorMessage: 'Unexpected error generating token ' + error })
                            } else {
                                return res.status(200).json({ message: 'Succes', token: token });
                            }
                        });
                    }else{
                        return res.status(401).json({ ErrorMessage: 'incorrect credentials'});
                    }
                }else{
                    return res.status(401).json({ ErrorMessage: 'incorrect credentials'});
                }
            }
        })
    }
}

const createUser = () => {

}

module.exports = { getAllUsers, getUserById, login }