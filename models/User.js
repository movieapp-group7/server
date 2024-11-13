import {pool} from '../helpers/db.js'

export const insertUser = async (username,email, hashedPassword) => {
  return await pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3) returning *',
    [username,email,hashedPassword])
}

export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}