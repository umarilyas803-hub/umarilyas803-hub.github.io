(() => {
  'use strict';
  const stage=document.querySelector('.presentation');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  if(stage){
    const choices=['clinic','hotel','workflow'];let paused=false,visible=true;
    const buttons=[...stage.querySelectorAll('[data-showcase-select]')];
    const pause=stage.querySelector('.showcase-pause');
    function focusProduct(value){stage.dataset.showcase=value;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.showcaseSelect===value)));}
    buttons.forEach(button=>button.addEventListener('click',()=>focusProduct(button.dataset.showcaseSelect)));
    if(reduce.matches){paused=true;pause.disabled=true;pause.setAttribute('aria-label','Reduced motion enabled');pause.textContent='✓';}
    pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume product presentation':'Pause product presentation');pause.textContent=paused?'▶':'Ⅱ';});
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.1}).observe(stage);
    window.setInterval(()=>{if(paused||reduce.matches||!visible||document.hidden||document.documentElement.classList.contains('motion-paused')||stage.matches(':hover')||stage.matches(':focus-within'))return;focusProduct(choices[(choices.indexOf(stage.dataset.showcase)+1)%choices.length]);},6500);
  }
  const toolCards=[...document.querySelectorAll('.animated-tool')];
  document.querySelectorAll('[data-tool-filter]').forEach(button=>button.addEventListener('click',()=>{
    let count=0;const category=button.dataset.toolFilter;
    document.querySelectorAll('[data-tool-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    toolCards.forEach(card=>{const show=category==='All'||card.dataset.toolCategory===category;card.hidden=!show;if(show)count++;});
    const status=document.getElementById('tool-filter-status');if(status)status.textContent=`${count} ${category==='All'?'tools and areas of practice':category.toLowerCase()+' tools and areas of practice'}`;
  }));
  const messageForm=document.getElementById('direct-message-form');
  messageForm?.addEventListener('input',event=>{if(!event.target.closest('#direct-message-status'))document.getElementById('direct-message-status').hidden=true;});
  messageForm?.addEventListener('submit',event=>{
    event.preventDefault();if(!messageForm.reportValidity())return;
    const data=new FormData(messageForm);
    const message=`Hi Umar,\n\nMy name is ${data.get('name')}.\nProject: ${data.get('service')}\n${data.get('email')?'Reply email: '+data.get('email')+'\n':''}\n${data.get('message')}\n\nSent from your portfolio contact form.`;
    const channel=data.get('channel')==='email'?'email':'whatsapp';
    const link=document.createElement('a');
    link.href=channel==='email'?`mailto:umariyas803@gmail.com?subject=${encodeURIComponent('Portfolio project enquiry')}&body=${encodeURIComponent(message)}`:`https://wa.me/923195753848?text=${encodeURIComponent(message)}`;
    link.textContent=channel==='email'?'Open email app and review →':'Open WhatsApp and review →';
    if(channel==='whatsapp'){link.target='_blank';link.rel='noopener noreferrer';}
    const status=document.getElementById('direct-message-status');
    status.replaceChildren('Your message is ready. Nothing has been sent. ',link);
    const copy=document.createElement('button');copy.type='button';copy.textContent='Copy message instead';
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);copy.textContent='Copied';}catch{const area=document.createElement('textarea');area.value=message;area.setAttribute('aria-label','Prepared message to copy');area.rows=8;area.style.width='100%';status.append(area);area.focus();area.select();copy.textContent='Select and copy the message below';copy.disabled=true;}});
    status.append(document.createElement('br'),copy);status.hidden=false;
  });
  if(document.getElementById('home-review-summary'))fetch('reviews.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(items=>{
    const reviews=items.filter(x=>x.approved===true&&x.consent===true&&Number.isInteger(x.rating)&&x.rating>=1&&x.rating<=5&&typeof x.name==='string'&&typeof x.review==='string');
    if(!reviews.length)return;const average=reviews.reduce((n,x)=>n+x.rating,0)/reviews.length;
    document.getElementById('home-review-summary').textContent=`${average.toFixed(1)} / 5 from ${reviews.length} published ${reviews.length===1?'review':'reviews'}.`;
    document.querySelectorAll('.invitation-stars span').forEach((star,index)=>{star.textContent=index<Math.round(average)?'★':'☆';});
  }).catch(()=>{document.getElementById('home-review-summary').textContent='See the reviews page for published feedback.';});
})();
