import { Router } from "express"
import {getGroups,createGroup, removeGroup, requestToJoin, getJoinRequests, manageRequest,getGroupDetails, removeMember, editGroupDetails,uploadGroupImage,leaveGroup,getUserGroups,addContentToGroup,getGroupContent,addShowtimeToGroup,getGroupShowtimesContent} from '../controllers/GroupController.js'
import multer from 'multer';

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.get('/', getGroups);
router.post('/newgroup', createGroup);
router.get('/:groupId',getGroupDetails )
router.delete('/:groupId/delete',removeGroup )
router.delete('/:groupId/members/:accountId/delete',removeMember)
router.delete('/:groupId/members/:userId/leave',leaveGroup )
router.post('/:groupId/join',requestToJoin )
router.get('/:groupId/requests',getJoinRequests)
router.patch('/:groupId/members/:accountId',manageRequest )
router.patch('/:groupId', editGroupDetails);
router.get('/user/:userId', getUserGroups);
router.post('/:groupId/addmovie',addContentToGroup)
router.get('/:groupId/movies',getGroupContent)
router.post('/:groupId/addshowtime',addShowtimeToGroup)
router.get('/:groupId/showtimes',getGroupShowtimesContent)
router.post('/:groupId/uploadimage', upload.single('image'), uploadGroupImage);


export default router;

// import { Router } from "express";
// import { createGroup, getAllGroups, addGroupMember, removeGroupMember, getGroupDetails } from "../controllers/GroupController.js";


// const router = Router();

// // Create a new group
// router.post("/create", createGroup);

// // Get all groups
// router.get("/", getAllGroups);

// // Get details of a specific group (including members)
// router.get("/:groupId", getGroupDetails);

// // Add a member to a group
// router.post("/add-member", addGroupMember);

// // Remove a member from a group
// router.delete("/remove-member", removeGroupMember);

// export default router;