import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { sign } = jwt;

 



//for testing insert user
const insertTestUser = async (username, email, password) => {
    const hashedPassword = await hash(password, 10);
    try {
        await pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    } catch (error) {
        if (error.code === '23505') { 
            console.log(`User with email ${email} already exists. Skipping insertion.`);
        } else {
            throw error; 
        }
    }
};


//for testing token
const getToken = (email) => {
    //console.log(process.env.JWT_SECRET_KEY);
    return sign({user:email}, process.env.JWT_SECRET_KEY)
}



export {insertTestUser, getToken}