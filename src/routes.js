import { Router } from "express";
import signUp from "./controllers/signUp.js";
import signIn from "./controllers/signIn.js";

const router = new Router();
router.post('/signup', signUp);
router.get('/signin', signIn);

export default router;