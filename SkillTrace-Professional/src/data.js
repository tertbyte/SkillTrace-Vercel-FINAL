export const seedCandidates = [
  {id:"ST-1001",name:"Aarav Patil",district:"Pune",training:"Industrial Electrician",skills:["Electrical Wiring","Maintenance","Safety"],status:"Employed",employer:"Nova Manufacturing",role:"Maintenance Technician",salary:32000,joined:"2025-08-14",verified:true,retention:"12 mo",education:"ITI",experience:2},
  {id:"ST-1002",name:"Sana Shaikh",district:"Nashik",training:"Data Analytics",skills:["Excel","SQL","Power BI"],status:"Employed",employer:"AgroVista Foods",role:"MIS Analyst",salary:41000,joined:"2025-10-06",verified:true,retention:"9 mo",education:"B.Com",experience:1},
  {id:"ST-1003",name:"Rohan Jadhav",district:"Nagpur",training:"Solar Technician",skills:["Solar PV","Wiring","Safety"],status:"Self-employed",employer:"RJ Solar Services",role:"Solar Technician",salary:38000,joined:"2025-06-22",verified:true,retention:"15 mo",education:"ITI",experience:3},
  {id:"ST-1004",name:"Meera Kulkarni",district:"Mumbai",training:"Healthcare Assistant",skills:["Patient Care","First Aid"],status:"Employed",employer:"CityCare Hospital",role:"Care Assistant",salary:28500,joined:"2026-01-11",verified:true,retention:"6 mo",education:"HSC",experience:1},
  {id:"ST-1005",name:"Imran Khan",district:"Aurangabad",training:"CNC Operator",skills:["CNC Setup","Measurement","Machine Safety"],status:"Seeking",employer:"—",role:"—",salary:0,joined:"2026-04-18",verified:false,retention:"—",education:"ITI",experience:1},
  {id:"ST-1006",name:"Priya Deshmukh",district:"Kolhapur",training:"Digital Marketing",skills:["SEO","Social Media","Analytics"],status:"Employed",employer:"MarketMint",role:"Digital Executive",salary:36500,joined:"2025-11-03",verified:true,retention:"8 mo",education:"BBA",experience:2},
  {id:"ST-1007",name:"Vivek More",district:"Thane",training:"Plumbing Technician",skills:["Plumbing","Pipe Fitting","Safety"],status:"Self-employed",employer:"VM Home Services",role:"Plumber",salary:44000,joined:"2025-05-19",verified:true,retention:"16 mo",education:"ITI",experience:5},
  {id:"ST-1008",name:"Anjali Pawar",district:"Satara",training:"EV Service Technician",skills:["EV Diagnostics","Battery Safety"],status:"Employed",employer:"VoltDrive",role:"EV Technician",salary:39000,joined:"2026-02-08",verified:true,retention:"5 mo",education:"Diploma",experience:2}
];

export const districtData = [
  ["Pune",86,78,92],["Mumbai",82,74,88],["Nashik",79,71,84],["Nagpur",76,68,81],["Kolhapur",84,75,89],["Thane",81,72,86],["Satara",73,65,79],["Aurangabad",69,61,76]
].map(([district,employment,retention,training])=>({district,employment,retention,training}));

export const skillsData = [
  {skill:"EV Technician",demand:94,supply:57,gap:37,priority:"Critical"},
  {skill:"PLC / Automation",demand:89,supply:54,gap:35,priority:"Critical"},
  {skill:"Solar PV",demand:82,supply:59,gap:23,priority:"High"},
  {skill:"CNC Operations",demand:78,supply:61,gap:17,priority:"High"},
  {skill:"Data Analytics",demand:74,supply:68,gap:6,priority:"Watch"}
];

export const monthlyOutcomes = [
  {month:"Jan",employed:62,self:14,seeking:24},{month:"Feb",employed:66,self:15,seeking:19},
  {month:"Mar",employed:69,self:16,seeking:15},{month:"Apr",employed:72,self:17,seeking:11},
  {month:"May",employed:75,self:17,seeking:8},{month:"Jun",employed:78,self:18,seeking:4}
];

export const activity = [
  ["Today","18 candidates completed 90-day follow-up","Outcome tracking","success"],
  ["Today","7 employment records verified","Verification","info"],
  ["Yesterday","PLC demand crossed critical threshold","Skills Intelligence","warning"],
  ["Yesterday","12 candidates flagged for retention follow-up","Early Warning","warning"],
  ["2 days ago","Pune training cohort reached 86% placement","Training Impact","success"]
];
