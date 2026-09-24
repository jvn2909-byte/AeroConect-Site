const SUPABASE_URL="https://wzxhuqhazlihxewbutxu.supabase.co";
const SUPABASE_KEY="sb_publishable_uNKr4_9U5ruGll27VaZ-0A_LGBF0-EO";

function showSignup(){
  const form=document.getElementById("signup-form");
  if(form){form.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>document.getElementById("signup-name")?.focus(),350);}
}

document.querySelectorAll('a[href="#cadastro"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showSignup();}));
document.querySelectorAll('a[href="#login"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showSignup();document.getElementById("signup-message").textContent="Para entrar, use a conta criada no aplicativo. A área de login do site será adicionada na próxima etapa.";document.getElementById("signup-message").className="form-message";}));

const form=document.getElementById("signup-form");
form?.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=form.querySelector("button");
  const message=document.getElementById("signup-message");
  const name=document.getElementById("signup-name").value.trim();
  const email=document.getElementById("signup-email").value.trim();
  const password=document.getElementById("signup-password").value;
  message.textContent="Criando sua conta..."; message.className="form-message"; button.disabled=true;
  try{
    const response=await fetch(SUPABASE_URL+"/auth/v1/signup",{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password,data:{name}})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.msg||data?.message||data?.error_description||"Não foi possível criar a conta.");
    message.className="form-message success";
    message.textContent=data?.access_token?"Conta criada! Você já pode usar o AeroConect.":"Conta criada! Verifique seu e-mail para confirmar a conta e depois entre no AeroConect.";
    form.reset();
  }catch(err){message.className="form-message error";message.textContent=err?.message||"Não foi possível criar a conta. Tente novamente."}
  finally{button.disabled=false;}
});