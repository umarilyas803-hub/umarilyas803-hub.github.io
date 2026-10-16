import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=await readFile(new URL('../feedback.js',import.meta.url),'utf8');
const form={valid:false,reportValidity(){return this.valid},addEventListener(type,fn){this.submit=fn}};
const status={hidden:true,replaceChildren(...nodes){this.nodes=nodes}};
const values={name:'A & B',email:'person@example.com',project:'Website #1',rating:'5',review:'Clear communication & useful work.\nThank you!',consent:'on'};
const context={document:{querySelectorAll(){return []},getElementById(id){return id==='review-form'?form:id==='review-status'?status:null},createElement(){return {}}},FormData:class{get(key){return values[key]}},encodeURIComponent};
vm.runInNewContext(code,context);form.submit({preventDefault(){}});assert.equal(status.hidden,true,'Invalid form must not create email');form.valid=true;form.submit({preventDefault(){}});assert.equal(status.hidden,false);const link=status.nodes[1];const url=new URL(link.href);assert.equal(url.pathname,'umariyas803@gmail.com');assert.match(url.searchParams.get('body'),/Rating: 5 \/ 5/);assert.match(url.searchParams.get('body'),/A & B/);assert.match(url.searchParams.get('body'),/Website #1/);assert.match(status.nodes[0],/Nothing has been sent/);assert.equal(url.searchParams.get('bcc'),null);console.log('PASS: invalid review blocked; email encoding, consent, recipient and honest handoff checked.');
