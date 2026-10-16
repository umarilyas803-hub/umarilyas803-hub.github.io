(() => {
  'use strict';
  const queue=document.getElementById('clinic-queue');
  if(queue){
    const samples=()=>[{id:'A001',name:'Sample visit A',type:'First visit',fee:1000,paid:1000,status:'Waiting'},{id:'A002',name:'Sample visit B',type:'Follow-up',fee:1500,paid:500,status:'Waiting'},{id:'A003',name:'Sample visit C',type:'First visit',fee:1000,paid:1000,status:'Complete'}];
    let records=samples(),selected='A001';const money=n=>'PKR '+n.toLocaleString('en-US');
    const detail=document.getElementById('clinic-detail'),search=document.getElementById('clinic-search'),status=document.getElementById('clinic-status');
    const printView=document.getElementById('clinic-print-view');document.body.append(printView);
    function render(){
      const q=search.value.trim().toLowerCase();const shown=records.filter(record=>`${record.id} ${record.name} ${record.type}`.toLowerCase().includes(q));
      queue.replaceChildren();
      shown.forEach(record=>{const row=document.createElement('tr');row.innerHTML=`<td><b>${record.id}</b></td><td>${record.name}<small>Fictional record</small></td><td>${record.type}</td><td><span class="clinic-state ${record.status==='Complete'?'complete':''}">${record.status}</span></td><td><button class="clinic-queue-action" type="button" data-clinic-open="${record.id}" aria-label="View sample visit ${record.id}">View record ↗</button></td>`;queue.append(row);});
      if(!shown.length){const row=document.createElement('tr');row.innerHTML='<td colspan="5">No sample visits match your search.</td>';queue.append(row);}
      document.getElementById('clinic-total').textContent=records.length;
      document.getElementById('clinic-waiting').textContent=records.filter(r=>r.status==='Waiting').length;
      document.getElementById('clinic-complete').textContent=records.filter(r=>r.status==='Complete').length;
      document.getElementById('clinic-payments').textContent=money(records.reduce((n,r)=>n+r.paid,0));
      const record=records.find(r=>r.id===selected);detail.innerHTML=`<h4>${record.id} / ${record.name}</h4><p>${record.type} · ${record.status} · Fictional record</p><p>Sample fee: <b>${money(record.fee)}</b> · Recorded: <b>${money(record.paid)}</b> · Balance: <b>${money(record.fee-record.paid)}</b></p><div class="record-actions"><button type="button" class="clinic-record-action primary" id="clinic-mark-complete" ${record.status==='Complete'?'disabled':''}>Mark sample complete</button><button type="button" class="clinic-record-action" id="clinic-record-payment" ${record.paid===record.fee?'disabled':''}>Record sample balance</button><button type="button" class="clinic-record-action" id="clinic-print">Print sample slip ↗</button></div>`;
    }
    queue.addEventListener('click',event=>{const button=event.target.closest('[data-clinic-open]');if(!button)return;selected=button.dataset.clinicOpen;status.textContent='';render();});
    search.addEventListener('input',render);
    detail.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;const record=records.find(r=>r.id===selected);
      if(button.id==='clinic-mark-complete'){record.status='Complete';status.textContent=`${record.id} marked complete in this browser walkthrough.`;render();}
      if(button.id==='clinic-record-payment'){record.paid=record.fee;status.textContent=`Sample balance recorded for ${record.id}. No real payment was processed.`;render();}
      if(button.id==='clinic-print'){
        printView.innerHTML=`<h2>Clinic Desk / Sample visit slip</h2><p><b>PORTFOLIO WALKTHROUGH — NOT A MEDICAL RECORD OR PRESCRIPTION</b></p><p>Sample token: ${record.id}<br>Record: ${record.name}<br>Visit: ${record.type}<br>Status: ${record.status}</p><p>Fee: ${money(record.fee)}<br>Recorded: ${money(record.paid)}<br>Balance: ${money(record.fee-record.paid)}</p><small>Fictional demonstration only. No patient details or actual payment are represented.</small>`;
        document.body.classList.add('printing-clinic');printView.hidden=false;window.print();
      }
    });
    window.addEventListener('afterprint',()=>{document.body.classList.remove('printing-clinic');printView.hidden=true;});
    document.getElementById('clinic-reset').addEventListener('click',()=>{records=samples();selected='A001';search.value='';status.textContent='Sample queue reset.';render();});render();
  }
  const hotelForm=document.getElementById('aurelia-form');
  if(hotelForm){
    const rooms={classic:{name:'Classic room',rate:165,capacity:2},deluxe:{name:'Deluxe room',rate:225,capacity:2},suite:{name:'Suite',rate:345,capacity:4}};
    const arrival=document.getElementById('aurelia-arrival'),departure=document.getElementById('aurelia-departure'),room=document.getElementById('aurelia-room'),guests=document.getElementById('aurelia-guests'),breakfast=document.getElementById('aurelia-breakfast'),error=document.getElementById('aurelia-error'),request=document.getElementById('aurelia-request');
    const today=new Date(),pad=n=>String(n).padStart(2,'0'),localDay=`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
    const plus=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
    arrival.min=localDay;arrival.value=localDay;departure.min=plus(localDay,1);departure.value=plus(localDay,2);let prepared=null;
    const currency=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
    function quote(){
      const chosen=rooms[room.value];const count=Number(guests.value);const a=arrival.value,d=departure.value;
      const nights=(Date.parse(d+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000;
      if(!chosen||!/^\d{4}-\d{2}-\d{2}$/.test(a)||!/^\d{4}-\d{2}-\d{2}$/.test(d)||a<localDay||!Number.isInteger(nights)||nights<1||nights>14)return{error:'Choose a stay of 1–14 nights, with departure after arrival and no past arrival date.'};
      if(!Number.isInteger(count)||count<1||count>chosen.capacity)return{error:`${chosen.name} supports up to ${chosen.capacity} guests. Choose the suite for 3–4 guests.`};
      const total=nights*chosen.rate+(breakfast.checked?nights*count*18:0);return{chosen,count,nights,total,arrival:a,departure:d};
    }
    function update(){
      const result=quote();error.textContent=result.error||'';document.getElementById('aurelia-room-title').textContent=rooms[room.value]?.name||'Choose a room';
      document.getElementById('aurelia-stay-detail').textContent=result.error?'Adjust your sample stay to see an estimate.':`${result.nights} ${result.nights===1?'night':'nights'} · ${result.count} guests${breakfast.checked?' · Breakfast preview included':''}`;
      document.getElementById('aurelia-total').textContent=result.error?'—':currency(result.total);
      document.getElementById('aurelia-deposit').textContent=result.error?'No valid estimate yet.':`30% demo deposit: ${currency(Math.round(result.total*30)/100)}`;
    }
    hotelForm.addEventListener('input',()=>{prepared=null;request.hidden=true;update();});
    hotelForm.addEventListener('change',()=>{prepared=null;request.hidden=true;update();});
    hotelForm.addEventListener('submit',event=>{event.preventDefault();if(!hotelForm.reportValidity())return;const result=quote();if(result.error){error.textContent=result.error;return;}prepared=result;document.getElementById('aurelia-request-detail').textContent=`${result.chosen.name} · ${result.arrival} to ${result.departure} · ${result.count} guests · ${currency(result.total)} illustrative total.`;document.getElementById('aurelia-checkin').disabled=false;document.getElementById('aurelia-operation-state').textContent='Request prepared. Nothing was sent to a hotel.';request.hidden=false;});
    document.getElementById('aurelia-checkin').addEventListener('click',event=>{if(!prepared)return;document.getElementById('aurelia-operation-state').textContent='Sample checked in. This is a browser walkthrough; no real room was reserved.';event.currentTarget.disabled=true;});
    document.getElementById('aurelia-reset').addEventListener('click',()=>{prepared=null;request.hidden=true;error.textContent='Sample request cleared.';});update();
  }
})();
