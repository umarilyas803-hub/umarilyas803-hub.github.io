(() => {
  'use strict';
  const toolkit=document.querySelector('.logo-toolkit');
  const control=toolkit?.querySelector('.toolkit-motion');
  if(!toolkit||!control)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=false,inView=true;
  function sync(){
    const globalPause=document.documentElement.classList.contains('motion-paused');
    toolkit.classList.toggle('toolkit-paused',paused);
    toolkit.classList.toggle('toolkit-resting',!inView||document.hidden);
    control.disabled=reduced.matches||globalPause;
    control.setAttribute('aria-pressed',String(paused||reduced.matches||globalPause));
    control.textContent=reduced.matches?'Reduced motion enabled':globalPause?'Motion paused':paused?'Resume toolkit ↻':'Pause toolkit Ⅱ';
  }
  control.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{rootMargin:'100px'}).observe(toolkit);
  sync();
})();
