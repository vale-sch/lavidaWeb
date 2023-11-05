import { CreateUser } from "../typescript/CreateUser";
import { CheckUser } from "../typescript/CheckUser";



const express = require('express');

const router = express.Router();

console.log('routes running on 3000');

router.post('/create', CreateUser);
router.post('/check', CheckUser);

module.exports = router;