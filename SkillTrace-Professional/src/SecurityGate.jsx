import React,{useEffect,useState} from "react";

export default function SecurityGate({children}){
 const [state,setState]=useState("loading"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const check=async()=>{try{const r=await fetch("/api/session",{credentials:"same-origin"});const d=await r.json();setState(d.authenticated?"ok":"login")}catch{setState("login")}};
 useEffect(()=>{check(); const logout=async e=>{if(e.target.closest?.(".logout")){e.preventDefault();await fetch("/api/logout",{method:"POST",credentials:"same-origin"});location.reload()}};document.addEventListener("click",logout);return()=>document.removeEventListener("click",logout)},[]);
 const login=async e=>{e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/login",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw Error(d.error||"Login failed.");setState("ok")}catch(err){setError(err.message)}finally{setBusy(false)}};
 if(state==="loading")return <div style={screen}>Loading secure workspace…</div>;
 if(state==="ok")return children;
 return <div style={screen}><div style={card}><div style={logo}>S</div><div style={{fontSize:11,letterSpacing:2,color:"#6f849a",fontWeight:700}}>SECURE WORKSPACE</div><h1 style={{fontFamily:"Space Grotesk",margin:"8px 0",fontSize:28}}>SkillTrace</h1><p style={{color:"#8ca0b5",fontSize:12,lineHeight:1.6}}>Sign in to access Maharashtra workforce outcome intelligence.</p><form onSubmit={login} style={{display:"grid",gap:10,marginTop:20}}><input aria-label="Email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" style={input}/><input aria-label="Password" autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={input}/>{error&&<div style={{color:"#ff9aa2",fontSize:10}}>{error}</div>}<button disabled={busy} style={button}>{busy?"Signing in…":"Sign in"}</button></form><small style={{color:"#5f7387",fontSize:9,marginTop:16,display:"block"}}>Protected by server-side authentication, secure cookies and rate limiting.</small></div></div>
}
const screen={minHeight:"100vh",display:"grid",placeItems:"center",background:"#07111f",color:"#edf4fb",fontFamily:"DM Sans,sans-serif",padding:20};
const card={width:"min(410px,100%)",background:"#0d1929",border:"1px solid #1d3045",borderRadius:20,padding:30,boxShadow:"0 30px 80px #0008"};
const logo={width:44,height:44,borderRadius:13,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#7af1c8,#5689ff)",color:"#06111e",fontWeight:800,fontSize:22,marginBottom:18};
const input={width:"100%",padding:"12px 13px",borderRadius:10,border:"1px solid #1d3045",background:"#091625",color:"#edf4fb",outline:"none",fontSize:12};
const button={border:0,borderRadius:10,padding:12,background:"#e7f6f0",color:"#07151c",fontWeight:800,cursor:"pointer"};
