'use strict';
const root=document.documentElement;
const menu=document.querySelector('.site-menu');
const navigation=document.getElementById('site-navigation');
function closeMenu(){navigation?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const open=navigation.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
navigation?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation?.classList.contains('is-open')){closeMenu();menu.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=false;try{motionPaused=localStorage.getItem('portfolio-motion')==='paused';}catch{}
if(motionPaused)root.classList.add('motion-paused');
if(!motionPreference.matches){const toggle=document.createElement('button');toggle.className='motion-toggle';toggle.type='button';const sync=()=>{toggle.textContent=motionPaused?'Resume motion ↻':'Pause motion Ⅱ';toggle.setAttribute('aria-pressed',String(motionPaused));};sync();toggle.addEventListener('click',()=>{motionPaused=!motionPaused;root.classList.toggle('motion-paused',motionPaused);try{localStorage.setItem('portfolio-motion',motionPaused?'paused':'on');}catch{}sync();});document.body.append(toggle);}
if('IntersectionObserver'in window&&!motionPreference.matches&&!motionPaused){root.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.section-head,.service-cards article,.flag-card,.visibility-feature,.review-card,.definition-grid article,.search-steps li,.project-answer').forEach(node=>{node.setAttribute('data-reveal','');observer.observe(node);});}
const cards=[...document.querySelectorAll('#prototypeGrid .project')];document.querySelectorAll('.prototype-filter').forEach(button=>button.addEventListener('click',()=>{let visible=0;document.querySelectorAll('.prototype-filter').forEach(other=>{other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));});cards.forEach(card=>{const show=button.dataset.category==='all'||card.dataset.category===button.dataset.category;card.classList.toggle('filtered-out',!show);if(show)visible++;});const count=document.getElementById('prototypeCount');if(count)count.textContent=`${String(visible).padStart(2,'0')} product ${visible===1?'study':'studies'}`;}));
