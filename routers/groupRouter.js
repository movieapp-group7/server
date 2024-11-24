import { Router } from "express";
import { createGroup, getAllGroups, addGroupMember, removeGroupMember, getGroupDetails,getGroupsByUserId } from "../controllers/GroupController.js";


const router = Router();

// Create a new group
router.post("/create", createGroup);

// Get all groups
router.get("/", getAllGroups);

// Get details of a specific group (including members)
router.get("/:groupId", getGroupDetails);

// Add a member to a group
router.post("/add-member", addGroupMember);

// Remove a member from a group
router.delete("/remove-member", removeGroupMember);

router.get('/:group_id', getGroupDetails);
router.get('/user/:user_id', getGroupsByUserId);


export default router;
