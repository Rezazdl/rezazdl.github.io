// Keep the message in place on errors; clear it only after a successful response.
export function installContactForm(form,text){
 if(!form)return;
 const button=form.querySelector('[type="submit"]'),status=form.querySelector('#email-status');
 let pending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(pending||!form.reportValidity())return;
  const endpoint=form.dataset.endpoint,recipient=form.dataset.recipient?.trim();
  if(!endpoint&&!recipient)return;
  const fields=new FormData(form);
  if(!endpoint){
   const body=`${fields.get('message')}\n\nFrom: ${fields.get('name')}\nReply to: ${fields.get('email')}`;
   location.href=`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(fields.get('subject'))}&body=${encodeURIComponent(body)}`;
   status.textContent=text('emailOpened');return;
  }
  pending=true;button.disabled=true;form.setAttribute('aria-busy','true');
  const label=button.textContent;button.textContent=text('emailSending');status.textContent=text('emailSending');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
  try{
   const response=await fetch(endpoint,{method:'POST',body:fields,headers:{Accept:'application/json'},signal:controller.signal});
   const result=await response.json().catch(()=>null);
   if(!response.ok||!result||result.ok===false||result.errors||result.error){
    status.textContent=text(response.status===429?'emailLimit':'emailError');return;
   }
   form.reset();status.textContent=text('emailSent');
  }catch{
   status.textContent=text('emailError');
  }finally{
   clearTimeout(timeout);pending=false;button.disabled=false;button.textContent=label;form.removeAttribute('aria-busy');
  }
 });
}
