'use strict';
document.documentElement.classList.add('ah-js');
const toggle=document.querySelector('.ah-toggle');
const links=document.getElementById('ah-navigation');
function closeNavigation(){if(!toggle||!links)return;links.classList.remove('ah-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu';}
if(toggle&&links){
 toggle.addEventListener('click',()=>{const open=links.classList.toggle('ah-open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu';});
 links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNavigation));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('ah-open')){closeNavigation();toggle.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.ah-header'))closeNavigation();});
 window.matchMedia('(max-width:1050px)').addEventListener('change',closeNavigation);
}
document.querySelectorAll('#year').forEach(n=>n.textContent=new Date().getFullYear());
document.querySelectorAll('.reveal').forEach(n=>n.classList.add('visible'));
document.querySelectorAll('form').forEach(form=>{
 const status=form.querySelector('[role="status"]')||Object.assign(document.createElement('p'),{className:'ah-form-status'});
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');if(!status.parentNode)form.append(status);
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form),name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim();
  const message=String(data.get('challenge')||data.get('message')||data.get('problem')||'').trim();
  if(!name||!email||!message){status.textContent='Please enter your name, email and enquiry.';return;}
  const page=document.body.dataset.enquiry||'A-hitec';
  const subject=encodeURIComponent(page+' website enquiry');
  const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nCompany: '+String(data.get('company')||'').trim()+'\nPage: '+page+'\n\n'+message);
  status.textContent='Your email app will open with a draft to A-hitec. Review and send it from your email app.';
  window.location.href='mailto:adeniran.ilesanmi@hitec.co.uk?subject='+subject+'&body='+body;
 });
});
