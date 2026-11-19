
const fs = require("fs");

const input = "admin.html";
const output = "admin-secure.html";

if (!fs.existsSync(input)) {
  console.error("Nu găsesc admin.html.");
  process.exit(1);
}

let s = fs.readFileSync(input, "utf8");

function replaceOnce(oldText, newText, label) {
  if (!s.includes(oldText)) {
    throw new Error(
      "Nu am găsit secțiunea: " + label +
      ". Fișierul original a rămas neschimbat."
    );
  }
  s = s.replace(oldText, newText);
}

// 1. Adaugă Supabase SDK
replaceOnce(
  '<meta name="theme-color" content="#171717"><title>VALMEX | Administrare</title>',
  '<meta name="theme-color" content="#171717"><title>VALMEX | Administrare</title>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>',
  "Supabase SDK"
);

// 2. Adaugă legătura către meniul CRM
replaceOnce(
  '<button class="active" data-page="connect"><i>⚿</i>Conectare GitHub</button>',
  '<button onclick="location.href=\'dashboard.html\'"><i>⌂</i>Meniu CRM</button>\n<button class="active" data-page="connect"><i>⚿</i>Conexiune securizată</button>',
  "Meniu CRM"
);

// 3. Înlocuiește formularul cu token GitHub
const oldCard = `<div class="notice"><b>Cum creezi tokenul:</b> GitHub → Settings → Developer settings → Fine-grained tokens. Repository: doar <b>valmex-site</b>. Permisiune: <b>Contents – Read and write</b>. Setează expirare (30–90 zile). Tokenul rămâne doar în memoria acestei pagini și dispare la reîncărcare. Nu este afișat după conectare. Acest panou nu este o autentificare reală: protecția stă în token.</div>
 <div class="card"><div class="cardhead"><div><h2>Token de acces</h2><p>Repository-ul în care scrie panoul · ramură de lucru: cms-staging</p></div></div><div class="body"><div class="field"><label>Repository (proprietar/nume)</label><input id="repoSel" placeholder="totulshopmd-dotcom/valmex-site"></div><div class="field"><label>GitHub Fine-grained token</label><input id="tok" type="password" autocomplete="off" placeholder="github_pat_..."></div></div><div class="actions"><button class="btn primary" id="btnConnect" onclick="connect()">Conectează</button></div></div>`;

const newCard = `<div class="notice">Accesul este verificat prin contul VALMEX CRM. Numai profilul activ cu rolul <b>administrator</b> poate modifica repository-ul. Cheia GitHub rămâne exclusiv în Supabase, nu în browser.</div>
<div class="card"><div class="cardhead"><div><h2>Sesiune administrator</h2><p>Conexiune prin Supabase Edge Function · ramură de lucru: cms-staging</p></div><span class="pill" id="authStatus">Se verifică...</span></div><div class="body"><div id="adminIdentity" class="sub">Se verifică sesiunea CRM...</div><p class="sub" style="margin-top:10px">Repository: totulshopmd-dotcom/valmex-site</p><p class="sub">Ramură izolată: cms-staging</p></div><div class="actions"><button class="btn light" onclick="location.href='dashboard.html'">Meniu CRM</button><button class="btn primary" id="btnConnect" onclick="connect()">Conectează repository-ul</button></div></div>`;

replaceOnce(oldCard, newCard, "Formular token");

// 4. Configurare Supabase
replaceOnce(
`let OWNER="totulshopmd-dotcom",REPO="valmex-site";const BR="cms-staging",FILE="cms/content.json";
let token=null,sha=null,db=null,connected=false;`,
`const OWNER="totulshopmd-dotcom",REPO="valmex-site",BR="cms-staging",FILE="cms/content.json";
const SUPABASE_URL="https://qejnbbzhpvfjeqzwotwt.supabase.co";
const SUPABASE_KEY="sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov";
const STORAGE_KEY="sb-qejnbbzhpvfjeqzwotwt-auth-token";
const activeStorage=localStorage.getItem(STORAGE_KEY)?localStorage:(sessionStorage.getItem(STORAGE_KEY)?sessionStorage:localStorage);
const authClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
 auth:{storage:activeStorage,storageKey:STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
const BRIDGE_URL=SUPABASE_URL+"/functions/v1/github-repo-bridge";
let session=null,profile=null,sha=null,db=null,connected=false;`,
"Configurație Supabase"
);

// 5. Înlocuiește conexiunea directă GitHub cu Supabase Bridge
const oldGh = `async function gh(p,o={}){let r;try{r=await fetch("https://api.github.com/repos/"+OWNER+"/"+REPO+p,{...o,headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(o.body?{"Content-Type":"application/json"}:{})}})}catch(e){throw Object.assign(new Error("Fără conexiune la internet."),{status:0})}
 let j=null;try{j=await r.json()}catch(e){}if(!r.ok){let m=j&&j.message||r.statusText;if(r.status===401)m="Token invalid sau expirat.";if(r.status===403||r.status===404)m+=" (verifică permisiunile tokenului și accesul la repository)";throw Object.assign(new Error(m),{status:r.status})}return j}`;

const newGh = `async function bridge(action,extra={}){
 if(!session?.access_token) throw new Error("Sesiunea CRM a expirat. Autentifică-te din nou.");
 const r=await fetch(BRIDGE_URL,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   "apikey":SUPABASE_KEY,
   "Authorization":"Bearer "+session.access_token
  },
  body:JSON.stringify({action,...extra})
 });
 let j={};
 try{j=await r.json()}catch(e){}
 if(!r.ok||j.error) throw new Error(j.error||"Operația GitHub a eșuat.");
 return j;
}

async function gh(p,o={}){
 const method=(o.method||"GET").toUpperCase();
 const u=new URL(p,"https://api.github.com");
 const pathname=u.pathname;
 const path=decodeURIComponent(pathname.split("/contents/")[1]||"");

 if(pathname.includes("/commits")){
  return (await bridge("commits",{path:decodeURIComponent(u.searchParams.get("path")||FILE)})).commits;
 }

 if(pathname.endsWith("/contents")||pathname.includes("/contents/")){
  const isDirectory=!path||!path.split("/").pop().includes(".");

  if(method==="GET"){
   if(isDirectory) return (await bridge("list",{path})).files;
   const j=await bridge("read",{path});
   return {sha:j.sha,content:b64(j.content)};
  }

  if(method==="PUT"){
   const payload=JSON.parse(o.body||"{}");
   const binary=path.startsWith("images/");
   const action=binary?"uploadBase64":(payload.sha?"update":"create");

   const j=await bridge(action,binary
    ?{path,contentBase64:payload.content,message:payload.message}
    :{path,content:ub64(payload.content),sha:payload.sha,message:payload.message}
   );

   return {content:{sha:j.content_sha}};
  }

  if(method==="DELETE"){
   const payload=JSON.parse(o.body||"{}");
   return bridge("delete",{path,sha:payload.sha,message:payload.message});
  }
 }

 throw new Error("Operație GitHub neacceptată: "+method+" "+pathname);
}`;

replaceOnce(oldGh,newGh,"Conexiune GitHub");

// 6. Înlocuiește funcția connect()
const a=s.indexOf("async function connect(){");
const b=s.indexOf("function render(){",a);

if(a<0||b<0){
 throw new Error("Nu pot identifica funcția connect().");
}

s=s.slice(0,a)+`async function connect(){
 el("btnConnect").disabled=true;
 try{
  const {data:{session:current},error}=await authClient.auth.getSession();
  if(error||!current) throw new Error("Nu există o sesiune CRM activă.");
  session=current;

  const {data:p,error:pe}=await authClient
   .from("profiles")
   .select("full_name,role,active")
   .eq("id",session.user.id)
   .maybeSingle();

  if(pe||!p||p.role!=="administrator"||p.active!==true){
   throw new Error("Acces permis doar administratorului activ.");
  }

  profile=p;
  el("adminIdentity").textContent=(p.full_name||"Administrator")+" · administrator activ";
  el("authStatus").textContent="Autentificat";
  el("authStatus").classList.add("on");

  await bridge("ensureBranch");
  await load();
  await loadLib();

  connected=true;
  el("status").textContent="Conectat · "+BR;
  el("status").classList.add("on");
  render();
  go("prices");
  toast("Repository conectat prin Supabase.");
 }catch(e){
  connected=false;
  el("authStatus").textContent="Acces indisponibil";
  toast("Conectare eșuată: "+e.message);
 }finally{
  el("btnConnect").disabled=false;
 }
}
`+s.slice(b);

// 7. Inițializarea sesiunii administratorului
const oldInit=`try{const r0=localStorage.getItem("valmexRepo");if(r0)el("repoSel").value=r0;else el("repoSel").value=OWNER+"/"+REPO}catch(e){el("repoSel").value=OWNER+"/"+REPO}`;

const newInit=`async function initAdmin(){
 try{
  const {data:{session:current},error}=await authClient.auth.getSession();

  if(error||!current){
   el("authStatus").textContent="Neautentificat";
   el("adminIdentity").textContent="Autentifică-te în CRM pentru a continua.";
   return;
  }

  session=current;

  const {data:p,error:pe}=await authClient
   .from("profiles")
   .select("full_name,role,active")
   .eq("id",session.user.id)
   .maybeSingle();

  if(pe||!p||p.role!=="administrator"||p.active!==true){
   el("authStatus").textContent="Acces refuzat";
   el("adminIdentity").textContent="Este necesar un administrator activ.";
   return;
  }

  profile=p;
  el("authStatus").textContent="Autentificat";
  el("authStatus").classList.add("on");
  el("adminIdentity").textContent=(p.full_name||"Administrator")+" · administrator activ";
 }catch(e){
  el("authStatus").textContent="Eroare";
  el("adminIdentity").textContent=e.message;
 }
}

authClient.auth.onAuthStateChange((_event,next)=>{
 session=next;
 if(!next){
  connected=false;
  el("status").textContent="Sesiune închisă";
  el("authStatus").textContent="Neautentificat";
 }
});

initAdmin();`;

replaceOnce(oldInit,newInit,"Inițializare administrator");

// 8. Salvează fișierul nou
fs.writeFileSync(output,s,"utf8");

console.log("Creat: "+output);
console.log("Originalul admin.html a rămas neschimbat.");
console.log("Testează înainte de a înlocui fișierul din GitHub.");
