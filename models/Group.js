import {pool} from '../helpers/db.js'

export const getAllGroups = async() => {
  return await pool.query(`
    SELECT g.id AS group_id,g.name AS group_name,g.owner_id,a.username AS owner_name,g.created_at FROM groups g 
    JOIN account a ON g.owner_id = a.id
    ORDER BY g.created_at DESC
  `);
}

export const addGroup = async(name, ownerId) => {
  return await pool.query(
    `INSERT INTO groups (name, owner_id) 
     VALUES ($1, $2) 
     RETURNING id, name, owner_id, created_at`,
    [name, ownerId]
  );
}

export const selectGroupById = async(groupId) => {
  return await pool.query(`SELECT g.* , a.username AS owner_name FROM groups g 
    JOIN account a ON g.owner_id = a.id 
    WHERE g.id = $1`, [groupId]);
}

// check if a user is the owner of the group
export const isGroupOwner = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT 1 
     FROM groups 
     WHERE id = $1 AND owner_id = $2`,
    [groupId, userId]
  );
  return result.rowCount > 0;
};

// check if a user is a member of the group
export const isGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT 1 
     FROM groupmembers 
     WHERE group_id = $1 AND account_id = $2 AND is_approved = TRUE`,
    [groupId, userId]
  );
  return result.rowCount > 0;
};

export const deleteGroup = async(groupId) => {
  return await pool.query(`DELETE FROM groups WHERE id = $1`, [groupId]);
}

export const addMember = async(groupId, accountId,isOwner,isApproved) => {
  return await pool.query(
    `INSERT INTO groupmembers (group_id, account_id, is_owner, is_approved) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    [groupId, accountId, isOwner, isApproved]
  );
}

export const selectGroupMembers = async(groupId) => {
  return await pool.query(`
    SELECT * FROM account 
    WHERE id IN (SELECT account_id FROM groupmembers WHERE group_id = $1 AND is_approved = true AND is_owner = false)
  `, [groupId]);
}

//get groupmember who send requist
export const selectJoinRequests = async(groupId) => {
  return await pool.query(`
    SELECT gm.account_id, a.username
    FROM groupmembers gm
    JOIN account a ON gm.account_id = a.id
    WHERE gm.group_id = $1 AND gm.is_approved = FALSE
  `, [groupId]);
}

export const approveMember = async(groupId, accountId) => {
  return await pool.query(
    "UPDATE groupmembers SET is_approved = TRUE WHERE group_id = $1 AND account_id = $2",
    [groupId, accountId]
  );
}

export const rejectMember = async(groupId, accountId) => {
  return await pool.query(
    "DELETE FROM groupmembers WHERE group_id = $1 AND account_id = $2",
    [groupId, accountId]
  );
}

//remove member
export const deleteMember = async (groupId, accountId) => {
  return await pool.query('DELETE FROM groupmembers WHERE group_id = $1 AND account_id = $2', [groupId, accountId]);
};

export const updateGroupInfo = async (groupId, name, description) => {
  return await pool.query(
    `UPDATE groups
     SET name = $1, description = $2
     WHERE id = $3`,
    [name, description, groupId]
  );
};

export const selectUserGroups = async (userId) =>{
  return await pool.query(
    `SELECT g.*, a.username as ownername from groups g
	   JOIN account a ON a.id=g.owner_id
	   JOIN groupmembers gm ON g.id = gm.group_id
     WHERE gm.account_id = $1 AND gm.is_approved=true`,
    [userId]
  );
}


export const insertContentToGroup = async (groupId, userId, contentType, contentId, description) => {
  return await pool.query(
    `INSERT INTO groupcustom (group_id, added_by,content_type, content_id, description)
     VALUES ($1, $2, $3, $4,$5) ON CONFLICT DO NOTHING`,
    [groupId, userId,contentType, contentId, description]
  );
}

export const insertShowtimeToGroup = async (groupId, userId, movieTitle, showTime, theatre, description) => {
  return await pool.query(
    `INSERT INTO groupshowtimes (group_id, added_by, movie_title, show_time, theatre, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [groupId, userId, movieTitle, showTime, theatre, description]
  );
}

export const selectContentByGroup = async(groupId) => {
  return await pool.query(
    `SELECT gm.* ,a.username 
    FROM groupcustom gm
    JOIN account a ON a.id=gm.added_by
    WHERE group_id = $1
    ORDER BY created_at DESC`,[groupId]
  );
}

export const selectShowtimeContentByGroup = async(groupId) => {
  return await pool.query(
    `SELECT gs.* ,a.username 
    FROM groupshowtimes gs
    JOIN account a ON a.id=gs.added_by
    WHERE group_id = $1
    ORDER BY created_at DESC`,[groupId]
  );
}