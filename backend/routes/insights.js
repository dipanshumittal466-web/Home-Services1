
import { Router } from 'express';
const r = Router();
r.get('/', (req,res)=>{
  // mock values; replace with DB queries
  res.json({ revenue_mtd: 12540, active_providers: 381, new_users_7d: 92 });
});
export default r;
