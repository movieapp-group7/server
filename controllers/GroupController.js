import {pool} from '../helpers/db.js'
import multer from 'multer';

import { getAllGroups,addGroup,isGroupOwner,isGroupMember,addMember,approveMember,selectGroupMembers, rejectMember, selectGroupById,selectJoinRequests, deleteGroup,deleteMember,updateGroupInfo,selectUserGroups,insertContentToGroup,selectContentByGroup,insertShowtimeToGroup,selectShowtimeContentByGroup } from '../models/Group.js';


const getGroups = async (req, res) => {
  try {
    // get all group info
    const result = await getAllGroups();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

const createGroup = async (req, res) => {
  const { name, ownerId } = req.body;

  // check
  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Group name and owner ID are required' });
  }

  try {
    // create new group
    const result = await addGroup(name, ownerId)

    const groupId = result.rows[0].id;

    // add owner to groupmembers 
    await addMember(groupId, ownerId, true, true);

    // return new group info
    res.status(201).json({
      message: 'Group created successfully',
      group: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating group:', error);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'Group name already exists' });
    }

    res.status(500).json({ error: 'Failed to create group' });
  }
};


const removeGroup = async (req, res) => {
  const { groupId } = req.params;
  // const userId = req.user.id;

  try {
    // const owner = await isGroupOwner(groupId, userId);
    // if (!owner) {
    //   return res.status(403).json({ error: 'You are not the owner of this group' });
    // }

    await deleteGroup(groupId);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

const requestToJoin = async (req, res) => {
  const { groupId,accountId } = req.body;

  try {
    // const checkMember = await pool.query(
    //   `SELECT * FROM groupmembers WHERE group_id = $1 AND account_id = $2`,
    //   [groupId, accountId]
    // );

    // if (checkMember.account_id) {
    //   return res.status(400).json({ error: 'User is already a member of this group' });
    // }

    await pool.query(
      `INSERT INTO groupmembers (group_id, account_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [groupId, accountId]
    );

    res.status(201).json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send join request' });
  }
};

// const manageRequest = async (req, res) => {
//   const { groupId, memberId } = req.params;
//   const { approve } = req.body;
//   const ownerId = req.user.id;

//   try {
//     const group = await pool.query(`SELECT owner_id FROM groups WHERE id = $1`, [groupId]);

//     if (!group.rows[0] || group.rows[0].owner_id !== ownerId) {
//       return res.status(403).json({ error: 'Only the owner can manage membership requests' });
//     }

//     await pool.query(
//       `UPDATE groupmembers SET is_approved = $1 WHERE group_id = $2 AND account_id = $3`,
//       [approve, groupId, memberId]
//     );

//     res.status(200).json({ message: 'Membership updated' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update membership' });
//   }
// };

const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
   
    // const groupMember = await isGroupMember()

    // if (!groupMember) {
    //   // 如果当前用户不是该群组的成员，返回403错误
    //   return res.status(403).json({ error: 'You are not a member of this group' });
    // }

    //check group
    const group = await selectGroupById(groupId);
    if (group.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }
    //get members
    const members = await selectGroupMembers(groupId);

    res.status(200).json({
      groupDetails: group.rows[0],
      members: members.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve group details' });
  }
};


const getJoinRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const requests = await selectJoinRequests(groupId);
    res.status(200).json(requests.rows);
  } catch (error) {
    console.error("Error fetching join requests:", error);
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
};

//
const manageRequest = async (req, res) => {
  const { groupId, accountId, action } = req.body; 

  try {
    /*//check owner
    const isOwner = await isGroupOwner(groupId,accountId);
    if (isOwner == false) {
      return res.status(403).json({ error: "Only the group owner can manage requests" });
    }*/

    if (action === "approve") {
      await approveMember(groupId, accountId);
      return res.json({ message: "Member approved successfully" });
    } else if (action === "reject") {
      await rejectMember(groupId, accountId);
      return res.json({ message: "Member rejected and removed" });
    } 

    res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Error managing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeMember = async (req, res) => {
  const { groupId, accountId } = req.params;
  //const userId = req.user.id;

  try {
    // // check owner
    // const owner = await isGroupOwner(groupId, userId);
    // if (!owner) {
    //   return res.status(403).json({ error: 'Only the group owner can remove members' });
    // }

    // delete
    await deleteMember(groupId, accountId);
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

const editGroupDetails = async (req, res) => {
  const { groupId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  try {
    // update the group details
    await updateGroupInfo(groupId, name, description);

    res.status(200).json({ message: 'Group details updated successfully' });
  } catch (error) {
    console.error('Error updating group details:', error);
    res.status(500).json({ error: 'Failed to update group details' });
  }
};


// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // You can choose your directory here
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload group image
const uploadGroupImage = async (req, res) => {
  const { groupId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Adjust the URL as needed for serving

  try {
    await pool.query(
      `UPDATE groups SET picture = $1 WHERE id = $2`,
      [imageUrl, groupId]
    );

    res.status(200).json({ message: 'Group image updated successfully' });
  } catch (error) {
    console.error('Error updating group image:', error);
    res.status(500).json({ error: 'Failed to update group image' });
  }
};

const leaveGroup = async (req, res) => {
  const { groupId,userId } = req.params; 
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
}
  try {
      // 检查用户是否属于该组
      // const { rowCount } = await pool.query(
      //     "SELECT * FROM GroupMembers WHERE group_id = $1 AND user_id = $2",
      //     [groupId, userId]
      // );

      // if (rowCount === 0) {
      //     return res.status(400).json({ message: "You are not a member of this group" });
      // }

      // 删除用户与组的关联
      await pool.query(
          "DELETE FROM groupmembers WHERE group_id = $1 AND account_id = $2",
          [groupId, userId]
      );

      res.status(200).json({ message: "You have successfully left the group" });
  } catch (error) {
      console.error("Error leaving group:", error);
      res.status(500).json({ message: "An error occurred" });
  }
};

const getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    // all the group joined
    const result = await selectUserGroups(userId)

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
};

const addContentToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId,contentType, contentId, description } = req.body;

  try {
    // insert into groupcustom
    const result = await insertContentToGroup(groupId, userId, contentType, contentId, description);
    res.status(201).json(result.rows[0] );
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({ error: 'Failed to add to group'});
  }
};

const getGroupContent = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await selectContentByGroup(groupId)
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching group content:', error);
    res.status(500).json({ error: 'Failed to fetch group content' });
  }
};

const addShowtimeToGroup = async (req, res) =>{
  const { groupId } = req.params;
  const { userId, movieTitle, showTime, theatre, description } = req.body;

  if (!groupId || !userId || !movieTitle || !showTime || !theatre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await insertShowtimeToGroup(groupId, userId, movieTitle, showTime, theatre, description);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding showtime to group:', error);
    res.status(500).json({ error: 'Failed to add showtime to group' });
  }
}

const getGroupShowtimesContent = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await selectShowtimeContentByGroup(groupId)
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching group showtimes content:', error);
    res.status(500).json({ error: 'Failed to fetch group showtimes content' });
  }
};

export {getGroups, createGroup, removeGroup, requestToJoin,getJoinRequests, manageRequest,getGroupDetails,removeMember,editGroupDetails,uploadGroupImage,leaveGroup,getUserGroups,addContentToGroup,getGroupContent,addShowtimeToGroup,getGroupShowtimesContent}

// import { pool } from '../helpers/db.js'; // Import pool from db.js

// // Create a group
// export const createGroup = async (req, res) => {
//     const { name, description, created_by } = req.body;
    
//     // Log incoming request data
//     console.log('Creating group:', { name, description, created_by });
    
//     try {
//         const result = await pool.query(
//             'INSERT INTO Groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
//             [name, description, created_by]
//         );
//         console.log('Group created successfully:', result.rows[0]);
//         res.status(201).json({ success: true, group: result.rows[0] });
//     } catch (err) {
//         console.error('Error creating group:', err.message);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Get all groups
// export const getAllGroups = async (req, res) => {
//     // Log incoming request
//     console.log('Fetching all groups...');
    
//     try {
//         const result = await pool.query('SELECT * FROM Groups');
//         console.log('Groups fetched successfully:', result.rows);
//         res.status(200).json({ success: true, groups: result.rows });
//     } catch (err) {
//         console.error('Error fetching groups:', err.message);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Add a member to a group
// export const addGroupMember = async (req, res) => {
//     const { group_id, user_id } = req.body;
    
//     // Log incoming request
//     console.log('Adding member to group:', { group_id, user_id });
    
//     try {
//         const result = await pool.query(
//             'INSERT INTO GroupMembers (group_id, user_id) VALUES ($1, $2) RETURNING *',
//             [group_id, user_id]
//         );
//         console.log('Member added successfully:', result.rows[0]);
//         res.status(201).json({ success: true, member: result.rows[0] });
//     } catch (err) {
//         console.error('Error adding group member:', err.message);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Remove a member from a group
// export const removeGroupMember = async (req, res) => {
//     const { group_id, user_id } = req.body;
    
//     // Log incoming request
//     console.log('Removing member from group:', { group_id, user_id });
    
//     try {
//         await pool.query(
//             'DELETE FROM GroupMembers WHERE group_id = $1 AND user_id = $2',
//             [group_id, user_id]
//         );
//         console.log('Member removed successfully');
//         res.status(200).json({ success: true, message: 'Member removed successfully' });
//     } catch (err) {
//         console.error('Error removing group member:', err.message);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Get group details (including members)
// export const getGroupDetails = async (req, res) => {
//     const { group_id } = req.params;
    
//     // Log incoming request
//     console.log('Fetching details for group ID:', group_id);
    
//     try {
//         const groupResult = await pool.query('SELECT * FROM Groups WHERE id = $1', [group_id]);
//         const membersResult = await pool.query(
//             'SELECT account.id, account.username, account.email FROM GroupMembers INNER JOIN account ON GroupMembers.user_id = account.id WHERE GroupMembers.group_id = $1',
//             [group_id]
//         );
        
//         if (groupResult.rows.length === 0) {
//             console.log('Group not found for ID:', group_id);
//             return res.status(404).json({ success: false, message: 'Group not found' });
//         }
        
//         console.log('Group details fetched successfully:', groupResult.rows[0]);
//         console.log('Group members fetched successfully:', membersResult.rows);
        
//         res.status(200).json({
//             success: true,
//             group: groupResult.rows[0],
//             members: membersResult.rows,
//         });
//     } catch (err) {
//         console.error('Error fetching group details:', err.message);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };
