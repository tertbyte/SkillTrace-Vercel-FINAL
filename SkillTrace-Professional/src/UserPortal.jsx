import React,{useState} from "react";
import {Sparkles,ArrowRight,Target,ShieldCheck,GraduationCap,ChevronLeft,LogIn,UserPlus,LayoutDashboard,User,BookOpen,BrainCircuit,BriefcaseBusiness,Menu,X,LogOut,CheckCircle2,Clock3,TrendingUp,Edit3} from "lucide-react";
export default function UserPortal({onGovernment}){
 const [auth,setAuth]=useState("login"),[logged,setLogged]=useState(false),[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const [step,setStep]=useState(0),[profile,setProfile]=useState({name:"",training:"",skills:"",education:"",goal:"Data Analyst"}),[loading,setLoading]=useState(false),[result,setResult]=useState(""),[analysisNotice,setAnalysisNotice]=useState("");
 const update=(k,v)=>setProfile(p=>({...p,[k]:v}));
 const authSubmit=async e=>{e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/candidate-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:auth,email,password,name})});const d=await r.json();if(!r.ok)throw Error(d.error||"Authentication failed.");setLogged(true);setStep(0);setResult("");setAnalysisNotice("");setProfile(p=>({...p,name:d.name||name}));}catch(e){setError(e.message)}finally{setBusy(false)}};
 const analyze=async()=>{setLoading(true);setAnalysisNotice("Preparing your SkillTrace analysis…");setResult("");setStep(2);const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);const candidate={name:profile.name,training:profile.training,skills,education:profile.education,role:profile.goal};try{const r=await fetch("/api/user-skill-gap",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({candidate})});const d=await r.json();if(!r.ok)throw Error(d.error||"Analysis unavailable.");setResult(d.result||"Analysis completed, but no guidance was returned.");setAnalysisNotice("AI-generated guidance based on your profile.");}catch(e){const topSkills=skills.length?skills.slice(0,3).join(", "):"your current skills";setResult(`LEVEL 1 — PROFILE\n• Your goal is ${profile.goal}.\nLEVEL 2 — GOOD START\n• You already know ${topSkills}.\nLEVEL 3 — NEED TO LEARN\n• Learn more tools for ${profile.goal}.\nLEVEL 4 — NEXT 3 SKILLS\n• Projects, tools, communication.\nLEVEL 5 — CAREER PATH\n• Build a small ${profile.goal} portfolio.\nLEVEL 6 — NEXT STEP\n• Finish one simple project this week.`);setAnalysisNotice("Simple guidance is shown because AI is unavailable.");}finally{setLoading(false)}};
 if(!logged)return <div className="user-portal"><header className="user-top"><div className="user-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div></div><button onClick={onGovernment}>Government portal</button></header><main className="user-main auth-main"><div className="user-kicker">CANDIDATE ACCESS</div><h1>{auth==="login"?"Welcome back.":"Start your skill journey."}</h1><p className="user-sub">{auth==="login"?"Sign in to continue your SkillTrace career journey.":"Create your SkillTrace account and build your career roadmap."}</p><section className="user-card auth-card"><div className="auth-tabs"><button className={auth==="login"?"active":""} onClick={()=>{setAuth("login");setError("")}}><LogIn/> Login</button><button className={auth==="signup"?"active":""} onClick={()=>{setAuth("signup");setError("")}}><UserPlus/> Sign up</button></div><form onSubmit={authSubmit}>{auth==="signup"&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" autoComplete={auth==="login"?"current-password":"new-password"}/></label>{error&&<div className="auth-error">{error}</div>}<button className="user-primary" disabled={busy}>{busy?"Please wait…":auth==="login"?"Login to Candidate Portal":"Create Candidate Account"} <ArrowRight/></button></form><div className="privacy"><ShieldCheck/> Your candidate account is separate from the government workspace.</div></section></main></div>;
 return <CandidateDashboard email={email} profile={profile} update={update} step={step} setStep={setStep} loading={loading} analyze={analyze} result={result} analysisNotice={analysisNotice} onGovernment={onGovernment} onLogout={()=>{setLogged(false);setStep(0);setResult("");}}/>}
}
function CandidateDashboard({email,profile,update,step,setStep,loading,analyze,result,analysisNotice,onGovernment,onLogout}){
 const [page,setPage]=useState("personal"),[mobile,setMobile]=useState(false);
 const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);
 const nav=[["overview","Overview",LayoutDashboard],["profile","My Profile",User],["training","Training",BookOpen],["skills","Skills",BrainCircuit],["career","Career",BriefcaseBusiness]];
 const go=p=>{setPage(p);setMobile(false)};
 if(page==="personal") return <PersonalLanding profile={profile} email={email} onContinue={()=>setPage("overview")} onGovernment={onGovernment} onLogout={onLogout}/>;
 return <div className="candidate-app">
  <aside className={mobile?"candidate-sidebar open":"candidate-sidebar"}>
   <div className="candidate-side-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div><button className="side-close" onClick={()=>setMobile(false)}><X/></button></div>
   <div className="candidate-nav">{nav.map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}</div>
   <div className="candidate-side-bottom"><button onClick={onGovernment}><BriefcaseBusiness/> Government portal</button><button onClick={onLogout}><LogOut/> Sign out</button></div>
  </aside>
  {mobile&&<div className="candidate-overlay" onClick={()=>setMobile(false)}/>}
  <div className="candidate-content">
   <header className="candidate-header"><button className="candidate-menu" onClick={()=>setMobile(true)}><Menu/></button><div><div className="candidate-mobile-kicker">CANDIDATE PORTAL</div><h2>{page==="overview"?"Welcome back":nav.find(x=>x[0]===page)?.[1]}</h2></div><div className="candidate-header-actions"><span className="candidate-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</span></div></header>
   <main className="candidate-main">
    {step===2
      ? <AnalysisPanel result={result} notice={analysisNotice} onEdit={()=>{setStep(1);setPage("skills")}}/>
      : <>
          {page==="overview"&&<Overview profile={profile} skills={skills} setPage={go} setStep={setStep} />}
          {page==="profile"&&<ProfilePage profile={profile} update={update} email={email}/>}
          {page==="training"&&<TrainingPage profile={profile}/>}
          {page==="skills"&&<SkillsPage profile={profile} skills={skills} update={update} setPage={go} setStep={setStep} analyze={analyze} loading={loading}/>}
          {page==="career"&&<CareerPage profile={profile} setPage={go} setStep={setStep}/>}
        </>
    }
   </main>
  </div>
 </div>
}
function PersonalLanding({profile,email,onContinue,onGovernment,onLogout}){
 const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);
 return <div className="personal-page">
  <header className="personal-header"><div className="candidate-side-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div></div><button onClick={onGovernment}>Government portal</button></header>
  <main className="personal-main">
   <div className="personal-welcome"><span>WELCOME</span><h1>Hi, {profile.name||"Candidate"}</h1><p>Your personal SkillTrace profile is ready.</p></div>
   <section className="personal-card">
    <div className="personal-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</div>
    <div className="personal-info"><span>YOUR PROFILE</span><h2>{profile.name||"Candidate"}</h2><p>{email||"Candidate account"}</p>
     <div className="personal-details"><div><small>Career goal</small><b>{profile.goal||"Not set"}</b></div><div><small>Education</small><b>{profile.education||"Not added"}</b></div><div><small>Training</small><b>{profile.training||"Not added"}</b></div><div><small>Skills</small><b>{skills.length?skills.join(", "):"Not added"}</b></div></div>
    </div>
   </section>
   <div className="personal-actions"><button className="personal-primary" onClick={onContinue}>Go to my dashboard <ArrowRight/></button><button className="personal-secondary" onClick={onLogout}>Sign out</button></div>
  </main>
 </div>
}
function Overview({profile,skills,setPage,setStep}){
 return <ProfilePage profile={profile} update={()=>{}}/>
}
function ProfilePage({profile,update,email}){
 const [tab,setTab]=useState("account");
 return <section className="profile-shell">
  <div className="profile-cover"><div className="cover-pattern"/><div className="profile-cover-label">SKILLTRACE CANDIDATE PROFILE</div></div>
  <div className="profile-layout">
   <aside className="profile-summary">
    <div className="profile-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</div>
    <h3>{profile.name||"Candidate"}</h3>
    <p>{profile.goal||"Career goal not set"}</p><small className="profile-email">{email}</small>
    <div className="profile-mini-stats"><div><b>{skillsCount(profile.skills)}</b><span>Skills</span></div><div><b>{profile.training?"1":"0"}</b><span>Training</span></div><div><b>{profile.education?"✓":"—"}</b><span>Education</span></div></div>
    <button className="profile-public">View candidate profile</button>
   </aside>
   <div className="profile-details">
    <div className="profile-tabs">{[["account","Profile"],["training","Training"],["skills","Skills"],["career","Career"]].map(([id,label])=><button className={tab===id?"active":""} onClick={()=>setTab(id)} key={id}>{label}</button>)}</div>
    {tab==="account"&&<div className="profile-form"><div className="profile-form-head"><div><span>ACCOUNT DETAILS</span><h3>Profile information</h3></div><User/></div><div className="profile-fields"><label>Full name<input value={profile.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name"/></label><label>Career goal<select value={profile.goal} onChange={e=>update("goal",e.target.value)}><option>Data Analyst</option><option>Software Developer</option><option>Cloud Support</option><option>Cybersecurity Analyst</option><option>Digital Marketing</option></select></label><label>Education<input value={profile.education} onChange={e=>update("education",e.target.value)} placeholder="BCA / MCA"/></label><label>Training completed<input value={profile.training} onChange={e=>update("training",e.target.value)} placeholder="Training name"/></label></div><button className="profile-update">Update profile</button></div>}
    {tab==="training"&&<div className="profile-form"><div className="profile-form-head"><div><span>LEARNING RECORD</span><h3>Training</h3></div><BookOpen/></div><div className="profile-record"><b>{profile.training||"No training added"}</b><span>{profile.training?"Completed":"Add your training in Profile."}</span></div></div>}
    {tab==="skills"&&<div className="profile-form"><div className="profile-form-head"><div><span>SKILLS</span><h3>Your skills</h3></div><BrainCircuit/></div><label className="skills-edit">Current skills<input value={profile.skills} onChange={e=>update("skills",e.target.value)} placeholder="Python, Excel, SQL"/></label><div className="skill-chips">{(profile.skills.split(",").map(x=>x.trim()).filter(Boolean)).map((x,i)=><span key={i}>{x}</span>)}</div></div>}
    {tab==="career"&&<div className="profile-form"><div className="profile-form-head"><div><span>CAREER</span><h3>{profile.goal}</h3></div><BriefcaseBusiness/></div><div className="career-focus"><span>Current goal</span><b>{profile.goal}</b><p>Build practical skills and projects for this career path.</p></div><button className="profile-update" onClick={()=>setStep(2)}>Get next steps</button></div>}
   </div>
  </div>
 </section>
}
function skillsCount(value){return value.split(",").map(x=>x.trim()).filter(Boolean).length}
function TrainingPage({profile}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>TRAINING</span><h3>Your learning record</h3></div><BookOpen/></div><div className="training-card"><div className="status-dot"><CheckCircle2/></div><div><b>{profile.training||"Training not added yet"}</b><p>{profile.training?"Training completed":"Add your completed training in My Profile."}</p></div><span>{profile.training?"Completed":"Pending"}</span></div><div className="timeline"><div><i/><b>Training</b><span>{profile.training||"Not added"}</span></div><div><i/><b>Skills</b><span>Build and improve your skills</span></div><div><i/><b>Career</b><span>Move towards your career goal</span></div></div></section>
}
function SkillsPage({profile,skills,update,setPage,setStep,analyze,loading}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>SKILLS</span><h3>Your skill set</h3></div><BrainCircuit/></div><label className="wide-label">Current skills<input value={profile.skills} onChange={e=>update("skills",e.target.value)} placeholder="Python, Excel, SQL"/></label><div className="skill-chips">{(skills.length?skills:["No skills added"]).map((x,i)=><span key={i}>{x}</span>)}</div><div className="analysis-cta"><div><b>Need a clear plan?</b><p>Run SkillTrace analysis to see your next skills.</p></div><button onClick={analyze} disabled={loading}>{loading?"Analyzing…":"Run analysis"} <Sparkles/></button></div></section>
}
function CareerPage({profile,setPage,setStep}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>CAREER</span><h3>Your career direction</h3></div><BriefcaseBusiness/></div><div className="career-focus"><span>Current goal</span><b>{profile.goal}</b><p>Build practical skills and projects for this path.</p></div><div className="career-steps"><div><b>1</b><span>Learn</span><small>Build the key skills.</small></div><div><b>2</b><span>Build</span><small>Create real projects.</small></div><div><b>3</b><span>Apply</span><small>Prepare for opportunities.</small></div></div><button className="user-primary" onClick={()=>{setPage("skills");setStep(1)}}>Go to skills <ArrowRight/></button></section>
}
function AnalysisPanel({result,notice,onEdit}){
 const clean=String(result||"").replace(/\\n/g,"\\n").replace(/\\r/g,"");
 const blocks=clean.split(/(?=LEVEL \\d)/).filter(Boolean);
 const labels=["Your profile","Good start","Learn next","Next 3 skills","Career path","Next step"];
 return <section className="candidate-panel simple-analysis"><div className="simple-analysis-head"><span>SKILLTRACE AI</span><h3>Your plan</h3><p>Simple steps based on your skills.</p></div><div className="analysis-simple">{notice||"Here is your simple career plan."}</div><div className="simple-analysis-grid">{blocks.map((block,i)=>{const lines=block.trim().split(/\\n/).map(x=>x.trim()).filter(Boolean);const body=lines.slice(1).join(" ").replace(/^•\\s*/,"").trim();return <div className="simple-step" key={i}><small>{labels[i]||"Next step"}</small><strong>{body||"Keep building your skills."}</strong></div>})}</div><button className="user-primary simple-analysis-button" onClick={onEdit}>Change my skills</button></section>
}mport React,{useState} from "react";
import {Sparkles,ArrowRight,Target,ShieldCheck,GraduationCap,ChevronLeft,LogIn,UserPlus,LayoutDashboard,User,BookOpen,BrainCircuit,BriefcaseBusiness,Menu,X,LogOut,CheckCircle2,Clock3,TrendingUp,Edit3} from "lucide-react";
export default function UserPortal({onGovernment}){
 const [auth,setAuth]=useState("login"),[logged,setLogged]=useState(false),[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const [step,setStep]=useState(0),[profile,setProfile]=useState({name:"",training:"",skills:"",education:"",goal:"Data Analyst"}),[loading,setLoading]=useState(false),[result,setResult]=useState(""),[analysisNotice,setAnalysisNotice]=useState("");
 const update=(k,v)=>setProfile(p=>({...p,[k]:v}));
 const authSubmit=async e=>{e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/candidate-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:auth,email,password,name})});const d=await r.json();if(!r.ok)throw Error(d.error||"Authentication failed.");setLogged(true);setStep(0);setResult("");setAnalysisNotice("");setProfile(p=>({...p,name:d.name||name}));}catch(e){setError(e.message)}finally{setBusy(false)}};
 const analyze=async()=>{setLoading(true);setAnalysisNotice("Preparing your SkillTrace analysis…");setResult("");setStep(2);const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);const candidate={name:profile.name,training:profile.training,skills,education:profile.education,role:profile.goal};try{const r=await fetch("/api/user-skill-gap",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({candidate})});const d=await r.json();if(!r.ok)throw Error(d.error||"Analysis unavailable.");setResult(d.result||"Analysis completed, but no guidance was returned.");setAnalysisNotice("AI-generated guidance based on your profile.");}catch(e){const topSkills=skills.length?skills.slice(0,3).join(", "):"your current skills";setResult(`LEVEL 1 — PROFILE\n• Your goal is ${profile.goal}.\nLEVEL 2 — GOOD START\n• You already know ${topSkills}.\nLEVEL 3 — NEED TO LEARN\n• Learn more tools for ${profile.goal}.\nLEVEL 4 — NEXT 3 SKILLS\n• Projects, tools, communication.\nLEVEL 5 — CAREER PATH\n• Build a small ${profile.goal} portfolio.\nLEVEL 6 — NEXT STEP\n• Finish one simple project this week.`);setAnalysisNotice("Simple guidance is shown because AI is unavailable.");}finally{setLoading(false)}};
 if(!logged)return <div className="user-portal"><header className="user-top"><div className="user-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div></div><button onClick={onGovernment}>Government portal</button></header><main className="user-main auth-main"><div className="user-kicker">CANDIDATE ACCESS</div><h1>{auth==="login"?"Welcome back.":"Start your skill journey."}</h1><p className="user-sub">{auth==="login"?"Sign in to continue your SkillTrace career journey.":"Create your SkillTrace account and build your career roadmap."}</p><section className="user-card auth-card"><div className="auth-tabs"><button className={auth==="login"?"active":""} onClick={()=>{setAuth("login");setError("")}}><LogIn/> Login</button><button className={auth==="signup"?"active":""} onClick={()=>{setAuth("signup");setError("")}}><UserPlus/> Sign up</button></div><form onSubmit={authSubmit}>{auth==="signup"&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" autoComplete={auth==="login"?"current-password":"new-password"}/></label>{error&&<div className="auth-error">{error}</div>}<button className="user-primary" disabled={busy}>{busy?"Please wait…":auth==="login"?"Login to Candidate Portal":"Create Candidate Account"} <ArrowRight/></button></form><div className="privacy"><ShieldCheck/> Your candidate account is separate from the government workspace.</div></section></main></div>;
 return <CandidateDashboard email={email} profile={profile} update={update} step={step} setStep={setStep} loading={loading} analyze={analyze} result={result} analysisNotice={analysisNotice} onGovernment={onGovernment} onLogout={()=>{setLogged(false);setStep(0);setResult("");}}/>}
}
function CandidateDashboard({email,profile,update,step,setStep,loading,analyze,result,analysisNotice,onGovernment,onLogout}){
 const [page,setPage]=useState("personal"),[mobile,setMobile]=useState(false);
 const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);
 const nav=[["overview","Overview",LayoutDashboard],["profile","My Profile",User],["training","Training",BookOpen],["skills","Skills",BrainCircuit],["career","Career",BriefcaseBusiness]];
 const go=p=>{setPage(p);setMobile(false)};
 if(page==="personal") return <PersonalLanding profile={profile} email={email} onContinue={()=>setPage("overview")} onGovernment={onGovernment} onLogout={onLogout}/>;
 return <div className="candidate-app">
  <aside className={mobile?"candidate-sidebar open":"candidate-sidebar"}>
   <div className="candidate-side-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div><button className="side-close" onClick={()=>setMobile(false)}><X/></button></div>
   <div className="candidate-nav">{nav.map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}</div>
   <div className="candidate-side-bottom"><button onClick={onGovernment}><BriefcaseBusiness/> Government portal</button><button onClick={onLogout}><LogOut/> Sign out</button></div>
  </aside>
  {mobile&&<div className="candidate-overlay" onClick={()=>setMobile(false)}/>}
  <div className="candidate-content">
   <header className="candidate-header"><button className="candidate-menu" onClick={()=>setMobile(true)}><Menu/></button><div><div className="candidate-mobile-kicker">CANDIDATE PORTAL</div><h2>{page==="overview"?"Welcome back":nav.find(x=>x[0]===page)?.[1]}</h2></div><div className="candidate-header-actions"><span className="candidate-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</span></div></header>
   <main className="candidate-main">
    {step===2
      ? <AnalysisPanel result={result} notice={analysisNotice} onEdit={()=>{setStep(1);setPage("skills")}}/>
      : <>
          {page==="overview"&&<Overview profile={profile} skills={skills} setPage={go} setStep={setStep} />}
          {page==="profile"&&<ProfilePage profile={profile} update={update} email={email}/>}
          {page==="training"&&<TrainingPage profile={profile}/>}
          {page==="skills"&&<SkillsPage profile={profile} skills={skills} update={update} setPage={go} setStep={setStep} analyze={analyze} loading={loading}/>}
          {page==="career"&&<CareerPage profile={profile} setPage={go} setStep={setStep}/>}
        </>
    }
   </main>
  </div>
 </div>
}
function PersonalLanding({profile,email,onContinue,onGovernment,onLogout}){
 const skills=profile.skills.split(",").map(x=>x.trim()).filter(Boolean);
 return <div className="personal-page">
  <header className="personal-header"><div className="candidate-side-brand"><span>S</span><div><b>SkillTrace</b><small>Candidate Portal</small></div></div><button onClick={onGovernment}>Government portal</button></header>
  <main className="personal-main">
   <div className="personal-welcome"><span>WELCOME</span><h1>Hi, {profile.name||"Candidate"}</h1><p>Your personal SkillTrace profile is ready.</p></div>
   <section className="personal-card">
    <div className="personal-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</div>
    <div className="personal-info"><span>YOUR PROFILE</span><h2>{profile.name||"Candidate"}</h2><p>{email||"Candidate account"}</p>
     <div className="personal-details"><div><small>Career goal</small><b>{profile.goal||"Not set"}</b></div><div><small>Education</small><b>{profile.education||"Not added"}</b></div><div><small>Training</small><b>{profile.training||"Not added"}</b></div><div><small>Skills</small><b>{skills.length?skills.join(", "):"Not added"}</b></div></div>
    </div>
   </section>
   <div className="personal-actions"><button className="personal-primary" onClick={onContinue}>Go to my dashboard <ArrowRight/></button><button className="personal-secondary" onClick={onLogout}>Sign out</button></div>
  </main>
 </div>
}
function Overview({profile,skills,setPage,setStep}){
 return <ProfilePage profile={profile} update={()=>{}}/>
}
function ProfilePage({profile,update,email}){
 const [tab,setTab]=useState("account");
 return <section className="profile-shell">
  <div className="profile-cover"><div className="cover-pattern"/><div className="profile-cover-label">SKILLTRACE CANDIDATE PROFILE</div></div>
  <div className="profile-layout">
   <aside className="profile-summary">
    <div className="profile-avatar">{(profile.name||"C").slice(0,1).toUpperCase()}</div>
    <h3>{profile.name||"Candidate"}</h3>
    <p>{profile.goal||"Career goal not set"}</p><small className="profile-email">{email}</small>
    <div className="profile-mini-stats"><div><b>{skillsCount(profile.skills)}</b><span>Skills</span></div><div><b>{profile.training?"1":"0"}</b><span>Training</span></div><div><b>{profile.education?"✓":"—"}</b><span>Education</span></div></div>
    <button className="profile-public">View candidate profile</button>
   </aside>
   <div className="profile-details">
    <div className="profile-tabs">{[["account","Profile"],["training","Training"],["skills","Skills"],["career","Career"]].map(([id,label])=><button className={tab===id?"active":""} onClick={()=>setTab(id)} key={id}>{label}</button>)}</div>
    {tab==="account"&&<div className="profile-form"><div className="profile-form-head"><div><span>ACCOUNT DETAILS</span><h3>Profile information</h3></div><User/></div><div className="profile-fields"><label>Full name<input value={profile.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name"/></label><label>Career goal<select value={profile.goal} onChange={e=>update("goal",e.target.value)}><option>Data Analyst</option><option>Software Developer</option><option>Cloud Support</option><option>Cybersecurity Analyst</option><option>Digital Marketing</option></select></label><label>Education<input value={profile.education} onChange={e=>update("education",e.target.value)} placeholder="BCA / MCA"/></label><label>Training completed<input value={profile.training} onChange={e=>update("training",e.target.value)} placeholder="Training name"/></label></div><button className="profile-update">Update profile</button></div>}
    {tab==="training"&&<div className="profile-form"><div className="profile-form-head"><div><span>LEARNING RECORD</span><h3>Training</h3></div><BookOpen/></div><div className="profile-record"><b>{profile.training||"No training added"}</b><span>{profile.training?"Completed":"Add your training in Profile."}</span></div></div>}
    {tab==="skills"&&<div className="profile-form"><div className="profile-form-head"><div><span>SKILLS</span><h3>Your skills</h3></div><BrainCircuit/></div><label className="skills-edit">Current skills<input value={profile.skills} onChange={e=>update("skills",e.target.value)} placeholder="Python, Excel, SQL"/></label><div className="skill-chips">{(profile.skills.split(",").map(x=>x.trim()).filter(Boolean)).map((x,i)=><span key={i}>{x}</span>)}</div></div>}
    {tab==="career"&&<div className="profile-form"><div className="profile-form-head"><div><span>CAREER</span><h3>{profile.goal}</h3></div><BriefcaseBusiness/></div><div className="career-focus"><span>Current goal</span><b>{profile.goal}</b><p>Build practical skills and projects for this career path.</p></div><button className="profile-update" onClick={()=>setStep(2)}>Get next steps</button></div>}
   </div>
  </div>
 </section>
}
function skillsCount(value){return value.split(",").map(x=>x.trim()).filter(Boolean).length}
function TrainingPage({profile}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>TRAINING</span><h3>Your learning record</h3></div><BookOpen/></div><div className="training-card"><div className="status-dot"><CheckCircle2/></div><div><b>{profile.training||"Training not added yet"}</b><p>{profile.training?"Training completed":"Add your completed training in My Profile."}</p></div><span>{profile.training?"Completed":"Pending"}</span></div><div className="timeline"><div><i/><b>Training</b><span>{profile.training||"Not added"}</span></div><div><i/><b>Skills</b><span>Build and improve your skills</span></div><div><i/><b>Career</b><span>Move towards your career goal</span></div></div></section>
}
function SkillsPage({profile,skills,update,setPage,setStep,analyze,loading}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>SKILLS</span><h3>Your skill set</h3></div><BrainCircuit/></div><label className="wide-label">Current skills<input value={profile.skills} onChange={e=>update("skills",e.target.value)} placeholder="Python, Excel, SQL"/></label><div className="skill-chips">{(skills.length?skills:["No skills added"]).map((x,i)=><span key={i}>{x}</span>)}</div><div className="analysis-cta"><div><b>Need a clear plan?</b><p>Run SkillTrace analysis to see your next skills.</p></div><button onClick={analyze} disabled={loading}>{loading?"Analyzing…":"Run analysis"} <Sparkles/></button></div></section>
}
function CareerPage({profile,setPage,setStep}){
 return <section className="candidate-panel page-panel"><div className="panel-title"><div><span>CAREER</span><h3>Your career direction</h3></div><BriefcaseBusiness/></div><div className="career-focus"><span>Current goal</span><b>{profile.goal}</b><p>Build practical skills and projects for this path.</p></div><div className="career-steps"><div><b>1</b><span>Learn</span><small>Build the key skills.</small></div><div><b>2</b><span>Build</span><small>Create real projects.</small></div><div><b>3</b><span>Apply</span><small>Prepare for opportunities.</small></div></div><button className="user-primary" onClick={()=>{setPage("skills");setStep(1)}}>Go to skills <ArrowRight/></button></section>
}
function AnalysisPanel({result,notice,onEdit}){
 const blocks=result.replace(/\\n/g,"\\n").split(/(?=LEVEL \\d)/).filter(Boolean);
 const labels=["Your profile","Good start","Learn next","Next 3 skills","Career path","Next step"];
 return <section className="candidate-panel analysis-panel simple-analysis"><div className="simple-analysis-head"><div><span>SKILLTRACE AI</span><h3>Your plan</h3><p>Easy steps based on your profile.</p></div></div><p className="analysis-simple">{notice||"Here is a simple plan for you."}</p><div className="analysis-levels">{blocks.map((block,i)=>{const lines=block.trim().split("\\n").map(x=>x.trim()).filter(Boolean);const body=lines.slice(1).join(" ").replace(/[•\\n]/g," ").replace(/\\s+/g," ").trim();return <div className="analysis-level" key={i}><span>{labels[i]||"Next step"}</span><b>{body}</b></div>})}</div><button className="user-primary" onClick={onEdit}>Change my skills</button></section>
}