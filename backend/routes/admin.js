
import { Router } from 'express';
const r = Router();
let overrides = []; let id = 1;

r.get('/overrides', (req,res)=>res.json(overrides));
r.post('/overrides', (req,res)=>{ const o={ id: id++, timestamp: new Date().toISOString(), ...req.body }; overrides.push(o); res.json(o); });

export default r;
