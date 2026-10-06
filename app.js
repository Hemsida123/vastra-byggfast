(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const menu=$('#mobile-menu'),toggle=$('.menu-toggle');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.innerHTML='Meny <span aria-hidden="true">＋</span>';document.body.classList.remove('menu-open');}
function openMenu(){menu.hidden=false;menu.style.top=$('.site-header').getBoundingClientRect().bottom+'px';toggle.setAttribute('aria-expanded','true');toggle.innerHTML='Stäng <span aria-hidden="true">×</span>';document.body.classList.add('menu-open');$('a',menu).focus();}
toggle.addEventListener('click',()=>menu.hidden?openMenu():closeMenu());
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',ev=>{if(!menu.hidden){if(ev.key==='Escape'){closeMenu();toggle.focus();}if(ev.key==='Tab'){const nodes=[toggle,...$$('a',menu)],first=nodes[0],last=nodes[nodes.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus();}}}});
matchMedia('(min-width:851px)').addEventListener('change',ev=>{if(ev.matches)closeMenu();});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver'in window){document.body.classList.add('motion-ready');const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}}),{threshold:.07,rootMargin:'0px 0px 35px 0px'});$$('.reveal').forEach(el=>io.observe(el));}
const preview=$('.service-preview'),caption=$('#service-caption');let serviceTimer;
$$('[data-service-image]').forEach(a=>{const change=()=>{if(!preview)return;clearTimeout(serviceTimer);preview.style.opacity='.5';serviceTimer=setTimeout(()=>{preview.src=a.dataset.serviceImage;preview.alt=a.dataset.serviceTitle;caption.textContent=a.dataset.serviceTitle;preview.style.opacity='1';},100);};a.addEventListener('mouseenter',change);a.addEventListener('focus',change);});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.filter;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;$$('.all-projects .project-card').forEach(card=>{const show=category==='all'||card.dataset.category===category;card.hidden=!show;if(show){count++;card.classList.add('visible');}});$('.filter-status').textContent=`Visar ${count} projekt`;}));
const dialog=$('.lightbox');let previousFocus;
$$('[data-image]').forEach(b=>b.addEventListener('click',()=>{previousFocus=b;const im=$('img',dialog);im.src=b.dataset.image;im.alt=b.dataset.caption;$('p',dialog).textContent=b.dataset.caption;dialog.showModal();document.body.style.overflow='hidden';}));
$('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{document.body.style.overflow='';previousFocus?.focus();});
const form=$('#enquiry-form');if(!form)return;
let step=0,bodyText='';const panels=$$('[data-step]',form),error=$('.form-error',form),result=$('#enquiry-result');
const param=new URLSearchParams(location.search).get('tjanst');if(param){const choice=$$('input[data-service-id]',form).find(i=>i.dataset.serviceId===param);if(choice)choice.checked=true;}
function showStep(n){step=n;panels.forEach((p,i)=>p.hidden=i!==n);$$('.form-progress li').forEach((li,i)=>{if(i===n)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});error.textContent='';const legend=$('legend',panels[n]);legend.tabIndex=-1;legend.focus({preventScroll:true});}
function valid(){if(step===0&&!$('input[name=service]:checked',form)){error.textContent='Välj vad du vill ha hjälp med för att fortsätta.';$('input[name=service]',form).focus();return false;}for(const input of $$('input,textarea,select',panels[step])){if(!input.checkValidity()){error.textContent='Fyll i de obligatoriska uppgifterna för att fortsätta.';input.reportValidity();return false;}}error.textContent='';return true;}
$$('.next-step',form).forEach(b=>b.addEventListener('click',()=>{if(valid())showStep(step+1);}));
$$('.back-step',form).forEach(b=>b.addEventListener('click',()=>showStep(step-1)));
// Each visible step is validated explicitly, so hidden required fields never block navigation.
form.noValidate=true;
form.addEventListener('submit',ev=>{ev.preventDefault();if(step<2){if(valid())showStep(step+1);return;}if(!valid())return;const data=new FormData(form);bodyText=`Hej Västra Bygg & Fastigheter!\n\nJag vill gärna prata om följande projekt:\n\nTyp av projekt: ${data.get('service')}\nOrt: ${data.get('location')}\nÖnskad tidpunkt: ${data.get('timing')}\n\n${data.get('description')}\n\nKontaktuppgifter\nNamn: ${data.get('name')}\nE-post: ${data.get('email')}\nTelefon: ${data.get('phone')||'Ej angivet'}\n\nVänliga hälsningar,\n${data.get('name')}`;$('#email-preview').textContent=bodyText;$('#open-email').href='mailto:info@vastra-byggfast.se?subject='+encodeURIComponent('Projektförfrågan: '+data.get('service')+' i '+data.get('location'))+'&body='+encodeURIComponent(bodyText);form.hidden=true;result.hidden=false;$('.form-progress').hidden=true;const heading=$('h3',result);heading.tabIndex=-1;heading.focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});});
$('#edit-request').addEventListener('click',()=>{result.hidden=true;form.hidden=false;$('.form-progress').hidden=false;showStep(2);});
$('.copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(bodyText);$('#copy-status').textContent='Texten är kopierad. Klistra in den i ett mejl till info@vastra-byggfast.se.';}catch{const range=document.createRange();range.selectNodeContents($('#email-preview'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent='Texten är markerad. Kopiera den och klistra in den i din mejlapp.';}});
})();
