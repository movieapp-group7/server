import {pool} from '../helpers/db.js'

export const insertUser = async (username,email, hashedPassword) => {
  return await pool.query('insert into account (email,password,username) values ($1,$2,$3) returning *',[email,hashedPassword,username])
}

export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}