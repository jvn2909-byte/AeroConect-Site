const SUPABASE_URL="https://wzxhuqhazlihxewbutxu.supabase.co";
const SUPABASE_KEY="sb_publishable_uNKr4_9U5ruGll27VaZ-0A_LGBF0-EO";
const EMAIL_REDIRECT_URL="aeroconect://auth/confirm";
const RECOVERY_REDIRECT_URL="aeroconect://auth/reset";

function showSignup(){
  const form=document.getElementById("signup-form");
  if(form){
    form.scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>document.getElementById("signup-name")?.focus(),350);
  }
}

function showLogin(){
  const form=document.getElementById("login-form");
  if(form){
    form.scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>document.getElementById("login-email")?.focus(),350);
  }
}

document.querySelectorAll('a[href="#cadastro"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  showSignup();
}));

document.querySelectorAll('a[href="#login"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  showLogin();
}));

const form=document.getElementById("signup-form");

form?.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=form.querySelector("button");
  const message=document.getElementById("signup-message");
  const name=document.getElementById("signup-name")?.value.trim()||"";
  const email=document.getElementById("signup-email")?.value.trim()||"";
  const password=document.getElementById("signup-password")?.value||"";
  message.textContent="Criando sua conta...";
  message.className="form-message";
  button.disabled=true;
  try{
    const response=await fetch(SUPABASE_URL+"/auth/v1/signup",{
      method:"POST",
      headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({email,password,data:{name},options:{emailRedirectTo:EMAIL_REDIRECT_URL}})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.msg||data?.message||data?.error_description||data?.error||"O Supabase recusou o cadastro. Tente novamente.");
    message.className="form-message success";
    message.textContent=data?.session?"Conta criada! Você já pode usar o AeroConect.":"Cadastro recebido com sucesso! Verifique seu e-mail (inclusive Spam) para confirmar a conta e depois entre no AeroConect.";
    form.reset();
  }catch(err){
    message.className="form-message error";
    message.textContent=err?.message||"Não foi possível criar a conta. Tente novamente.";
  }finally{button.disabled=false;}
});

const loginForm=document.getElementById("login-form");
loginForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=loginForm.querySelector('button[type="submit"]');
  const message=document.getElementById("login-message");
  const email=document.getElementById("login-email")?.value.trim()||"";
  const password=document.getElementById("login-password")?.value||"";
  message.textContent="Entrando...";
  message.className="form-message";
  button.disabled=true;
  try{
    const response=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=password",{
      method:"POST",
      headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({email,password})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.msg||data?.message||data?.error_description||"E-mail ou senha inválidos.");
    if(data?.access_token){
      localStorage.setItem("aeroconect_access_token",data.access_token);
      if(data.refresh_token) localStorage.setItem("aeroconect_refresh_token",data.refresh_token);
      if(data.user?.email) localStorage.setItem("aeroconect_email",data.user.email);
    }
    message.className="form-message success";
    message.textContent="Login realizado! Sua conta está conectada.";
    const open=document.createElement("a");
    open.href="aeroconect://auth/login#access_token="+encodeURIComponent(data.access_token||"")+"&refresh_token="+encodeURIComponent(data.refresh_token||"")+"&type=login";
    open.className="btn";
    open.textContent="Abrir AeroConect";
    open.style.marginTop="10px";
    message.appendChild(document.createElement("br"));
    message.appendChild(open);
  }catch(err){
    message.className="form-message error";
    message.textContent=err?.message||"Não foi possível entrar. Tente novamente.";
  }finally{button.disabled=false;}
});

document.getElementById("show-login-password")?.addEventListener("change",e=>{
  const input=document.getElementById("login-password");
  if(input) input.type=e.target.checked?"text":"password";
});

document.getElementById("forgot-password")?.addEventListener("click",async()=>{
  const email=document.getElementById("login-email")?.value.trim()||"";
  const message=document.getElementById("login-message");
  if(!email){
    message.className="form-message error";
    message.textContent="Digite seu e-mail primeiro para receber o link de recuperação.";
    document.getElementById("login-email")?.focus();
    return;
  }
  message.className="form-message";
  message.textContent="Enviando o e-mail de recuperação...";
  try{
    const response=await fetch(SUPABASE_URL+"/auth/v1/recover",{
      method:"POST",
      headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({email,redirect_to:RECOVERY_REDIRECT_URL})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.msg||data?.message||data?.error_description||"Não foi possível enviar a recuperação.");
    message.className="form-message success";
    message.textContent="Se o e-mail estiver cadastrado, o link de recuperação foi enviado. Verifique também o Spam.";
  }catch(err){
    message.className="form-message error";
    message.textContent=err?.message||"Não foi possível enviar o e-mail de recuperação.";
  }
});
