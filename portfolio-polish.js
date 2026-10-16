(() => {
  'use strict';
  const buttons=[...document.querySelectorAll('[data-project-filter]')];
  const cards=[...document.querySelectorAll('.catalogue-card')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.projectFilter;
    buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    cards.forEach(card=>{card.hidden=filter!=='All'&&card.dataset.projectCategory!==filter;});
    const count=cards.filter(card=>!card.hidden).length;
    document.querySelector('.catalogue-count').textContent=`Showing ${count} projects`;
  }));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  [...cards,document.querySelector('.presentation')].filter(Boolean).forEach(card=>{
    let frame;
    const reset=()=>{cancelAnimationFrame(frame);card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');};
    card.addEventListener('pointermove',event=>{
      if(motion.matches||!pointer.matches||document.documentElement.classList.contains('motion-paused')){reset();return;}
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{const box=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${((event.clientX-box.left)/box.width-.5)*5}deg`);card.style.setProperty('--tilt-y',`${((event.clientY-box.top)/box.height-.5)*-5}deg`);});
    });
    card.addEventListener('pointerleave',reset);card.addEventListener('focusin',reset);motion.addEventListener('change',reset);
  });
})();
