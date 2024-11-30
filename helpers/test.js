import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { sign } = jwt;

 



//for testing insert user
const insertTestUser = (username,email, password) => {
    hash(password, 10, (error, hashedPassword) => {
        pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3)',
            [username,email,hashedPassword])
        
    })
}


//for testing token
const getToken = (email) => {
    //console.log(process.env.JWT_SECRET_KEY);
    return sign({user:email}, process.env.JWT_SECRET_KEY)
}



export {insertTestUser, getToken}