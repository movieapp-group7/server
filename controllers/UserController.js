import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
const {sign} = jwt
import { insertUser, selectUserByEmail } from '../models/User.js'
import { ApiError } from '../helpers/ApiError.js'
import dotenv from 'dotenv';
import {pool} from '../helpers/db.js'

dotenv.config()

const postRegistration = async (req, res, next) => {
  try {
    console.log("Registration Request Body:", req.body); // Log the incoming data 
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const hashedPassword = await hash(password, 10); // Ensure the password is hashed
    const result = await pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    console.log("User registered:", result.rows[0]); // Log the result of the query

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error("Error during registration:", error.stack); // Log the error stack 
    next(error); // Pass the error to the error handling middleware
  }
};

const createUserObject = (id,email,token=undefined) => {
  return {
    'id': id,
    // 'username': username,
    'email': email,
    ...(token !== undefined) && {'token':token}
  }
}

const postLogin = async(req,res,next) => {
  const invalid_credentials_message = 'Invalid credentials.'
  try {
    const userFromDb = await selectUserByEmail(req.body.email)
    if (userFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message))
    
    const user = userFromDb.rows[0]  
    if (!await compare(req.body.password,user.password)) return next(new ApiError(invalid_credentials_message))

    const token = sign(req.body.email,process.env.JWT_SECRET_KEY)    
    return res.status(200).json(createUserObject(user.id,user.email,token)) 
  } catch (error) {
    return next(error)
  }
}

export {postRegistration, postLogin}