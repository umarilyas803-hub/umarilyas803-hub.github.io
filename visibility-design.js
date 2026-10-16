(() => {
  'use strict';
  const stage=document.querySelector('.comparison-stage');
  const modes=[...document.querySelectorAll('[data-compare]')];
  if(stage)modes.forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.compare;
    stage.dataset.compareMode=mode;
    modes.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    stage.querySelector('.example-before').hidden=mode==='after';
    stage.querySelector('.example-after').hidden=mode==='before';
    document.querySelector('.comparison-note').textContent=`Showing ${mode==='both'?'both concepts':`the ${mode} concept`}. The controls inside the previews are illustrative.`;
  }));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-depth]').forEach(surface=>{
    let frame;
    const reset=()=>{cancelAnimationFrame(frame);surface.style.removeProperty('--depth-x');surface.style.removeProperty('--depth-y');};
    surface.addEventListener('pointermove',event=>{
      if(reduced.matches||!pointer.matches||document.documentElement.classList.contains('motion-paused')){reset();return;}
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{const rect=surface.getBoundingClientRect();surface.style.setProperty('--depth-x',`${((event.clientX-rect.left)/rect.width-.5)*6}deg`);surface.style.setProperty('--depth-y',`${((event.clientY-rect.top)/rect.height-.5)*-6}deg`);});
    });
    surface.addEventListener('pointerleave',reset);surface.addEventListener('focusin',reset);reduced.addEventListener('change',reset);
  });
})();
