import {Router} from 'express';
import {db} from '../db.js'

const router = Router();

router.get('/ping', async(req, res)=>{
    const [rows] = await db.query('SELECT 1 + 1 AS RESULT')
    console.log(rows[0]);
    res.json(rows[0])
});

export default router;