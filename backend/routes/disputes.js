
import { Router } from 'express';
const r = Router();
let disputes = []; let id = 1;

r.get('/', (req,res)=>res.json(disputes));
r.post('/', (req,res)=>{ const d={ id: id++, status:'open', ...req.body, createdAt: new Date().toISOString() }; disputes.push(d); res.json(d); });
r.patch('/:id', (req,res)=>{ const idx=disputes.findIndex(x=>x.id==req.params.id); if(idx<0) return res.status(404).json({error:'Not found'}); disputes[idx]={...disputes[idx], ...req.body}; res.json(disputes[idx]); });

export default r;
