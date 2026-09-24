const SUPABASE_URL="https://wzxhuqhazlihxewbutxu.supabase.co";
const SUPABASE_KEY="sb_publishable_uNKr4_9U5ruGll27VaZ-0A_LGBF0-EO";
const EMAIL_REDIRECT_URL="https://jvn2909-byte.github.io/AeroConect-Site/";

function showSignup(){
  const form=document.getElementById("signup-form");
  if(form){
    form.scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>document.getElementById("signup-name")?.focus(),350);
  }
}

document.querySelectorAll('a[href="#cadastro"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  showSignup();
}));

document.querySelectorAll('a[href="#login"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  showSignup();
  const message=document.getElementById("signup-message");
  if(message){
    message.textContent="Para entrar, use a conta criada no aplicativo. A área de login do site será adicionada na próxima etapa.";
    message.className="form-message";
  }
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
      headers:{
        "apikey":SUPABASE_KEY,
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify({
        email,
        password,
        data:{name},
        options:{emailRedirectTo:EMAIL_REDIRECT_URL}
      })
    });

    const data=await response.json().catch(()=>({}));

    if(!response.ok){
      throw new Error(
        data?.msg||
        data?.message||
        data?.error_description||
        data?.error||
        "O Supabase recusou o cadastro. Tente novamente."
      );
    }

    // Com confirmações de e-mail ativadas, o Supabase normalmente
    // retorna um usuário, mas não uma sessão. Só consideramos sucesso
    // quando o Auth realmente devolveu um ID de usuário.
    if(!data?.user?.id){
      throw new Error("O cadastro não foi confirmado pelo servidor. Nenhuma conta foi criada. Tente novamente.");
    }

    message.className="form-message success";
    message.textContent=data?.session
      ?"Conta criada! Você já pode usar o AeroConect."
      :"Conta criada com sucesso! Verifique seu e-mail (inclusive Spam) para confirmar a conta e depois entre no AeroConect.";

    form.reset();
  }catch(err){
    message.className="form-message error";
    message.textContent=err?.message||"Não foi possível criar a conta. Tente novamente.";
  }finally{
    button.disabled=false;
  }
});