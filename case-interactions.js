document.querySelectorAll('.flow-compare').forEach(compare=>{
  const restaurant=document.body.classList.contains('restaurant');
  const states=restaurant?{
    manual:{leftLabel:'BEFORE · MANUAL FLOW',left:'Message arrives → staff asks follow-up questions → details are copied into a separate queue → status is updated by hand.',right:'Clarify order → confirm customer details → staff reviews one shared order record → track its status.',rightLabel:'PRODUCT DIRECTION'},
    designed:{leftLabel:'DESIGNED FLOW · CUSTOMER',left:'Describe the order → answer one clarification → confirm name and pickup details.',right:'DESIGNED FLOW · STAFF',right:'Review the confirmed order → approve exceptions → update the status with an audit trail.'}
  }:{
    manual:{leftLabel:'BEFORE · MANUAL FLOW',left:'Find an event in a post → message the organizer → wait for details → follow up to confirm a place.',right:'Filter events → inspect details → apply in one place → follow the application status.',rightLabel:'PRODUCT DIRECTION'},
    designed:{leftLabel:'DESIGNED FLOW · PLAYER',left:'Filter by sport or city → inspect event details → send a structured application.',right:'DESIGNED FLOW · ORGANIZER',right:'Review applications in one queue → update participant status → share event changes.'}
  };
  const leftLabel=compare.querySelector('#compare-label'),left=compare.querySelector('#compare-text'),rightLabel=compare.querySelector('.proposed small'),right=compare.querySelector('#compare-result');
  compare.querySelectorAll('.compare-choice').forEach(button=>button.addEventListener('click',()=>{
    const state=states[button.dataset.mode];if(!state)return;
    compare.querySelectorAll('.compare-choice').forEach(choice=>{const selected=choice===button;choice.classList.toggle('active',selected);choice.setAttribute('aria-pressed',String(selected))});
    leftLabel.textContent=state.leftLabel;left.textContent=state.left;rightLabel.textContent=state.rightLabel;right.textContent=state.right;
  }));
});

const caseObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('case-visible');caseObserver.unobserve(entry.target)}}),{threshold:.1});document.querySelectorAll('.case-brief,.section-shell,.next-section').forEach(section=>{section.classList.add('case-reveal');caseObserver.observe(section)});
