const phrases=['feel useful.','work better.','stay human.'];let phrase=0;const typed=document.querySelector('#typed');setInterval(()=>{phrase=(phrase+1)%phrases.length;typed.animate([{opacity:1},{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:600});setTimeout(()=>typed.textContent=phrases[phrase],260)},3600);
const progress=document.querySelector('#progress');addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?scrollY/max*100:0)+'%'});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section-head,.project,.about-mark,.about-copy,.about-side,.tool,.contact-panel').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
const menu=document.querySelector('#menuToggle'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// Filter the four independently built product studies.
const prototypeCards=[...document.querySelectorAll('#prototypeGrid .project')];
const prototypeCount=document.querySelector('#prototypeCount');
document.querySelectorAll('.prototype-filter').forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.category; let visible=0;
  document.querySelectorAll('.prototype-filter').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});
  prototypeCards.forEach(card=>{const show=category==='all'||card.dataset.category===category;card.classList.toggle('filtered-out',!show);if(show)visible++});
  prototypeCount.textContent=String(visible).padStart(2,'0')+(visible===1?' product study':' product studies');
}));
// Count only evidence we can substantiate from the included projects.
const metricObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const node=entry.target,target=Number(node.dataset.count),start=performance.now(),duration=850;const tick=now=>{const t=Math.min(1,(now-start)/duration);node.textContent=String(Math.round(target*(1-Math.pow(1-t,3))));if(t<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);metricObserver.unobserve(node)}),{threshold:.65});
document.querySelectorAll('[data-count]').forEach(node=>metricObserver.observe(node));
// Curated answers keep the portfolio guide useful without pretending it calls an AI service.
const guideLaunch=document.querySelector('#guideLaunch'),guidePanel=document.querySelector('#guidePanel'),guideClose=document.querySelector('#guideClose'),guideMessages=document.querySelector('#guideMessages');
const guideAnswers={services:'Umar is focused on responsive websites, interactive product prototypes, and practical AI or workflow automation concepts. Explore the case studies to see the current work.',restaurant:'Restaurant AI is a Node.js project for clarifying text or voice orders and giving staff a review dashboard. Its 67 automated tests pass; the portfolio dashboard is sample data and is not connected to WhatsApp.',call:'Use <a href="https://wa.me/923195753848?text=Hi%20Umar%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer">WhatsApp to start a project conversation</a>, or <a href="mailto:umariyas803@gmail.com?subject=Project%20discussion">email Umar</a>. A discovery call can be arranged directly.'};
function setGuide(open){guidePanel.hidden=!open;guideLaunch.setAttribute('aria-expanded',String(open));if(open)document.querySelector('.guide-questions button')?.focus()}
guideLaunch?.addEventListener('click',()=>setGuide(guidePanel.hidden));guideClose?.addEventListener('click',()=>{setGuide(false);guideLaunch.focus()});
document.querySelectorAll('.guide-questions button').forEach(button=>button.addEventListener('click',()=>{const question=document.createElement('p');question.className='guide-bubble guide-user';question.textContent=button.textContent;const answer=document.createElement('p');answer.className='guide-bubble';answer.innerHTML=guideAnswers[button.dataset.question];guideMessages.append(question,answer);guideMessages.scrollTop=guideMessages.scrollHeight}));

document.querySelectorAll('.flag-card,.work-subhead,.workflow-grid article').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
