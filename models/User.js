import {pool} from '../helpers/db.js'

export const insertUser = async (email, hashedPassword) => {
  return await pool.query('insert into account (email,password) values ($1,$2) returning *',[email,hashedPassword])
}
export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}