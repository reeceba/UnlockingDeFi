const SUPABASE_URL='https://dvpxlirjmyluwljivtdw.supabase.co';
const SUPABASE_KEY='sb_publishable_E4GiDJ-pJ5n2a0WGBpHOdQ_upqwyiCA';
const LIVE_URL='https://reeceba.github.io/UnlockingDeFi/';
const supabaseClient=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY);
const toast=document.getElementById('toast');
const authShell=document.getElementById('authShell');
const setupShell=document.getElementById('setupShell');
const dashboardShell=document.getElementById('dashboardShell');
const authStatus=document.getElementById('authStatus');
let authMode='signup';
function message(text,error=false){if(authStatus){authStatus.textContent=text;authStatus.style.color=error?'#ff8f9c':'#bd91ff'}if(toast){toast.textContent=text;toast.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)}}
function showOnly(section){[authShell,setupShell,dashboardShell].forEach(el=>el?.classList.add('hidden'));section?.classList.remove('hidden')}
function initials(name){return (name||'Explorer').trim().charAt(0).toUpperCase()}
async function loadUser(){
  if(!supabaseClient)return;
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session){showOnly(authShell);return}
  const {data:profile,error}=await supabaseClient.from('profiles').select('*').eq('id',session.user.id).maybeSingle();
  if(error){showOnly(setupShell);message('Your account is ready. Finish your profile below.');return}
  if(!profile){showOnly(setupShell);return}
  renderDashboard(profile);showOnly(dashboardShell);
}
function renderDashboard(profile){
  const name=profile.username||'Explorer', goal=profile.learning_goal||'Solana basics';
  document.querySelectorAll('#dashName,#savedName').forEach(el=>el.textContent=name);
  const welcome=document.getElementById('welcomeName');if(welcome)welcome.textContent=name;
  const exp=document.getElementById('savedExperience');if(exp)exp.textContent=profile.experience||'Complete beginner';
  const goalEl=document.getElementById('dashGoal');if(goalEl)goalEl.textContent=goal;
  const goalStat=document.getElementById('goalStat');if(goalStat)goalStat.textContent=goal;
  const letter=initials(name);document.querySelectorAll('#dashAvatar,#dashAvatarTop').forEach(el=>el.textContent=letter);
  const xp=document.getElementById('dashXp');if(xp)xp.textContent=profile.xp??0;
  const streak=document.getElementById('dashStreak');if(streak)streak.textContent=profile.streak??0;
  const level=document.getElementById('dashLevel');if(level)level.textContent=`${profile.current_level||1} / 10`;
}
document.querySelectorAll('.auth-tab').forEach(tab=>tab.addEventListener('click',()=>{authMode=tab.dataset.mode;document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');const signup=authMode==='signup';document.getElementById('authTitle').textContent=signup?'Start your journey.':'Welcome back.';document.getElementById('authCopy').textContent=signup?'Create an account and keep your learning progress wherever you go.':'Log in to pick up exactly where you left off.';document.getElementById('authSubmit').innerHTML=signup?'Create account <span>→</span>':'Log in <span>→</span>';document.getElementById('password').autocomplete=signup?'new-password':'current-password';if(authStatus)authStatus.textContent=''}));
document.getElementById('authForm')?.addEventListener('submit',async e=>{e.preventDefault();if(!supabaseClient)return message('Authentication is unavailable right now.',true);const email=document.getElementById('email').value.trim(),password=document.getElementById('password').value;const submit=document.getElementById('authSubmit');submit.disabled=true;submit.textContent=authMode==='signup'?'Creating account…':'Logging in…';if(authMode==='signup'){const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:LIVE_URL}});if(error){message(error.message,true)}else if(data.session){message('Account created. Let’s build your profile.');showOnly(setupShell)}else{message('Account created. Check your email to confirm. The confirmation link will return you to UnlockingDeFi.')}}else{const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error){message(error.message,true)}else{message('Welcome back!');await loadUser()}}submit.disabled=false;submit.innerHTML=authMode==='signup'?'Create account <span>→</span>':'Log in <span>→</span>'});
document.querySelectorAll('.goal').forEach(goal=>goal.addEventListener('click',()=>{document.querySelectorAll('.goal').forEach(g=>g.classList.remove('selected'));goal.classList.add('selected')}));
document.getElementById('profileForm')?.addEventListener('submit',async e=>{e.preventDefault();const {data:{user}}=await supabaseClient.auth.getUser();if(!user){showOnly(authShell);return}const username=document.getElementById('name').value.trim()||'Explorer';const experience=document.getElementById('experience').value;const learning_goal=document.querySelector('.goal.selected')?.dataset.goal||'Solana basics';const button=e.target.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Saving…';const {data:profile,error}=await supabaseClient.from('profiles').upsert({id:user.id,username,experience,learning_goal},{onConflict:'id'}).select().single();if(error){message('Profile could not be saved yet. The database setup needs to finish first.',true);button.disabled=false;button.innerHTML='Save my profile <span>→</span>';return}localStorage.setItem('ud_profile',JSON.stringify(profile));renderDashboard(profile);showOnly(dashboardShell);message(`Welcome to UnlockingDeFi, ${username}!`)});
async function signOut(){await supabaseClient?.auth.signOut();showOnly(authShell);message('You have been signed out.');}
document.getElementById('signOut')?.addEventListener('click',signOut);document.getElementById('dashboardSignOut')?.addEventListener('click',signOut);
supabaseClient?.auth.onAuthStateChange((_event)=>{setTimeout(loadUser,0)});
loadUser();