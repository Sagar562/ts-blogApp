import express from "express";
import { addUser, updateUser, getUsers } from "../controllers/userController";

const router = express.Router();

router.post('/adduser', addUser);
router.post('/updateUser', updateUser);
router.get('/allUsers', getUsers);

export default router;