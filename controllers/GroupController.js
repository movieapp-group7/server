import { pool } from '../helpers/db.js'; // Import pool from db.js

// Create a group
export const createGroup = async (req, res) => {
    const { name, description, created_by } = req.body;
    
    // Log incoming request data
    console.log('Creating group:', { name, description, created_by });
    
    try {
        const result = await pool.query(
            'INSERT INTO Groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
            [name, description, created_by]
        );
        console.log('Group created successfully:', result.rows[0]);
        res.status(201).json({ success: true, group: result.rows[0] });
    } catch (err) {
        console.error('Error creating group:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all groups
export const getAllGroups = async (req, res) => {
    // Log incoming request
    console.log('Fetching all groups...');
    
    try {
        const result = await pool.query('SELECT * FROM Groups');
        console.log('Groups fetched successfully:', result.rows);
        res.status(200).json({ success: true, groups: result.rows });
    } catch (err) {
        console.error('Error fetching groups:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add a member to a group
export const addGroupMember = async (req, res) => {
    const { group_id, user_id } = req.body;
    
    // Log incoming request
    console.log('Adding member to group:', { group_id, user_id });
    
    try {
        const result = await pool.query(
            'INSERT INTO GroupMembers (group_id, user_id) VALUES ($1, $2) RETURNING *',
            [group_id, user_id]
        );
        console.log('Member added successfully:', result.rows[0]);
        res.status(201).json({ success: true, member: result.rows[0] });
    } catch (err) {
        console.error('Error adding group member:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Remove a member from a group
export const removeGroupMember = async (req, res) => {
    const { group_id, user_id } = req.body;
    
    // Log incoming request
    console.log('Removing member from group:', { group_id, user_id });
    
    try {
        await pool.query(
            'DELETE FROM GroupMembers WHERE group_id = $1 AND user_id = $2',
            [group_id, user_id]
        );
        console.log('Member removed successfully');
        res.status(200).json({ success: true, message: 'Member removed successfully' });
    } catch (err) {
        console.error('Error removing group member:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get group details (including members)
export const getGroupDetails = async (req, res) => {
    const { group_id } = req.params;
    
    // Log incoming request
    console.log('Fetching details for group ID:', group_id);
    
    try {
        const groupResult = await pool.query('SELECT * FROM Groups WHERE id = $1', [group_id]);
        const membersResult = await pool.query(
            'SELECT account.id, account.username, account.email FROM GroupMembers INNER JOIN account ON GroupMembers.user_id = account.id WHERE GroupMembers.group_id = $1',
            [group_id]
        );
        
        if (groupResult.rows.length === 0) {
            console.log('Group not found for ID:', group_id);
            return res.status(404).json({ success: false, message: 'Group not found' });
        }
        
        console.log('Group details fetched successfully:', groupResult.rows[0]);
        console.log('Group members fetched successfully:', membersResult.rows);
        
        res.status(200).json({
            success: true,
            group: groupResult.rows[0],
            members: membersResult.rows,
        });
    } catch (err) {
        console.error('Error fetching group details:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};
