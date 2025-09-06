const router = require('express').Router();

const categories = [
  { group:'A', title:'Home & Property', items:['Plumbing','Electrical','Painting','Cleaning','Carpentry'] },
  { group:'B', title:'Renovation & Build', items:['Kitchen','Bathroom','Roofing','Flooring','Extensions'] },
  { group:'C', title:'Business Services', items:['IT Support','CCTV','Signage','HVAC','Security'] },
  { group:'D', title:'Property Management', items:['End of Lease','Pest Control','Gardening','Waste Removal'] },
  { group:'E', title:'Design & Planning', items:['Architects','Interior Design','3D Renders','Landscape'] },
  { group:'F', title:'Seasonal & Emergency', items:['Storm Repair','Emergency Plumbing','Heating/Cooling'] },
  { group:'G', title:'Rural & Specialty', items:['Fencing','Irrigation','Solar','Bore Pump'] },
];

router.get('/', (req,res)=>{
  res.json({ ok:true, categories });
});

module.exports = router;
