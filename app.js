'use strict';

const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const OPEN_STRINGS = ['E','A','D','G','B','E']; // 6번줄 -> 1번줄
const RANGE_OPTIONS = [3,5,7,9,12];
const CATEGORIES = ['Major','Minor','7','m7','maj7','sus2','sus4'];
const CHORDS = [
  ['C','Major',[-1,3,2,0,1,0]], ['D','Major',[-1,-1,0,2,3,2]], ['E','Major',[0,2,2,1,0,0]],
  ['F','Major',[1,3,3,2,1,1]], ['G','Major',[3,2,0,0,0,3]], ['A','Major',[-1,0,2,2,2,0]], ['B','Major',[-1,2,4,4,4,2]],
  ['Cm','Minor',[-1,3,5,5,4,3]], ['Dm','Minor',[-1,-1,0,2,3,1]], ['Em','Minor',[0,2,2,0,0,0]],
  ['Fm','Minor',[1,3,3,1,1,1]], ['Am','Minor',[-1,0,2,2,1,0]], ['Bm','Minor',[-1,2,4,4,3,2]],
  ['C7','7',[-1,3,2,3,1,0]], ['D7','7',[-1,-1,0,2,1,2]], ['E7','7',[0,2,0,1,0,0]], ['G7','7',[3,2,0,0,0,1]],
  ['A7','7',[-1,0,2,0,2,0]], ['B7','7',[-1,2,1,2,0,2]],
  ['Dm7','m7',[-1,-1,0,2,1,1]], ['Em7','m7',[0,2,0,0,0,0]], ['Am7','m7',[-1,0,2,0,1,0]], ['Bm7','m7',[-1,2,4,2,3,2]],
  ['Cmaj7','maj7',[-1,3,2,0,0,0]], ['Dmaj7','maj7',[-1,-1,0,2,2,2]], ['Emaj7','maj7',[0,2,1,1,0,0]], ['Amaj7','maj7',[-1,0,2,1,2,0]],
  ['Dsus2','sus2',[-1,-1,0,2,3,0]], ['Asus2','sus2',[-1,0,2,2,0,0]],
  ['Esus4','sus4',[0,2,2,2,0,0]], ['Dsus4','sus4',[-1,-1,0,2,3,3]], ['Asus4','sus4',[-1,0,2,2,3,0]]
].map(([name, category, frets]) => ({name, category, frets}));

const state = {
  screen: 'home', quizType: 'note', maxFret: 5, score: 0, total: 0,
  answered: false, current: null,
  categories: loadSettings().categories
};

const screenEl = document.getElementById('screen');
const titleEl = document.getElementById('screenTitle');
const backButton = document.getElementById('backButton');
const installButton = document.getElementById('installButton');
let deferredInstallPrompt = null;

function loadSettings() {
  const defaults = Object.fromEntries(CATEGORIES.map(c => [c, true]));
  try {
    const saved = JSON.parse(localStorage.getItem('fretboardQuizSettings') || '{}');
    return { categories: {...defaults, ...(saved.categories || {})} };
  } catch { return {categories: defaults}; }
}
function saveSettings() {
  localStorage.setItem('fretboardQuizSettings', JSON.stringify({categories: state.categories}));
}
function setScreen(name, title, canGoBack = true) {
  state.screen = name; titleEl.textContent = title;
  backButton.classList.toggle('hidden', !canGoBack);
  screenEl.innerHTML = '';
  screenEl.focus({preventScroll:true});
}
function button(label, className, onClick) {
  const b = document.createElement('button'); b.type='button'; b.textContent=label; b.className=className; b.addEventListener('click', onClick); return b;
}
function randomItem(items) { return items[Math.floor(Math.random()*items.length)]; }
function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function noteAt(stringIndex, fret) { return NOTES[(NOTES.indexOf(OPEN_STRINGS[stringIndex]) + fret) % 12]; }

function showHome() {
  setScreen('home','기타 지판 퀴즈',false);
  const node = document.getElementById('homeTemplate').content.cloneNode(true);
  node.querySelector('[data-action="start-setup"]').addEventListener('click', showSetup);
  node.querySelector('[data-action="settings"]').addEventListener('click', showSettings);
  screenEl.appendChild(node);
}

function showSetup() {
  setScreen('setup','게임 설정');
  const panel = document.createElement('section'); panel.className='card panel';
  panel.innerHTML = `<div class="form-section"><h2 class="section-title">문제 유형</h2><div class="option-grid" id="quizTypes"></div></div>
    <div class="form-section"><h2 class="section-title">지판 범위</h2><div class="option-grid" id="ranges"></div><p class="inline-help">개방현(0프렛)부터 선택한 프렛까지 출제됩니다.</p></div>`;
  const quizTypes = panel.querySelector('#quizTypes');
  [['note','지판 음 맞히기'],['chord','코드 맞히기']].forEach(([value,label]) => {
    const b=button(label,`choice-button ${state.quizType===value?'active':''}`,()=>{state.quizType=value;showSetup();}); quizTypes.appendChild(b);
  });
  const ranges=panel.querySelector('#ranges');
  RANGE_OPTIONS.forEach(f => ranges.appendChild(button(`0~${f}프렛`,`range-button ${state.maxFret===f?'active':''}`,()=>{state.maxFret=f;showSetup();})));
  const start=button('시작','primary-button',startGame); start.style.marginTop='28px'; start.style.width='100%'; panel.appendChild(start);
  screenEl.appendChild(panel);
}

function showSettings() {
  setScreen('settings','설정');
  const panel=document.createElement('section'); panel.className='card panel';
  panel.innerHTML='<h2 class="section-title">코드 문제 출제 범위</h2><p class="inline-help">코드 문제에서 사용할 코드 종류를 선택하세요.</p>';
  const list=document.createElement('div'); list.className='settings-list'; list.style.marginTop='14px';
  CATEGORIES.forEach(category=>{
    const label=document.createElement('label'); label.className='check-row';
    const input=document.createElement('input'); input.type='checkbox'; input.checked=!!state.categories[category];
    input.addEventListener('change',()=>{state.categories[category]=input.checked;});
    label.append(input,document.createTextNode(category)); list.appendChild(label);
  });
  panel.appendChild(list);
  const save=button('설정 저장','primary-button',()=>{
    if(!Object.values(state.categories).some(Boolean)){alert('코드 종류를 하나 이상 선택해 주세요.');return;}
    saveSettings(); showHome();
  }); save.style.marginTop='24px'; save.style.width='100%'; panel.appendChild(save);
  screenEl.appendChild(panel);
}

function startGame() {
  if(state.quizType==='chord' && !availableChords().length){alert('현재 범위와 설정에서 출제할 수 있는 코드가 없습니다. 범위 또는 코드 종류를 변경해 주세요.');return;}
  state.score=0; state.total=0; state.answered=false; nextQuestion();
}
function availableChords() {
  return CHORDS.filter(c => state.categories[c.category] && Math.max(...c.frets) <= state.maxFret);
}
function nextQuestion() {
  state.answered=false;
  if(state.quizType==='note') {
    const stringIndex=Math.floor(Math.random()*6), fret=Math.floor(Math.random()*(state.maxFret+1));
    state.current={type:'note',stringIndex,fret,answer:noteAt(stringIndex,fret)};
  } else {
    const chord=randomItem(availableChords());
    const distractors=shuffle(availableChords().filter(c=>c.name!==chord.name)).slice(0,2);
    state.current={type:'chord',chord,answer:chord.name,choices:shuffle([chord,...distractors]).map(c=>c.name)};
  }
  renderGame();
}

function renderGame() {
  setScreen('game', state.quizType==='note'?'지판 음 맞히기':'코드 맞히기');
  const layout=document.createElement('section'); layout.className='game-layout';
  const status=document.createElement('div'); status.className='status-row';
  status.innerHTML=`<span class="mode-chip">범위 0~${state.maxFret}프렛</span><span class="score-chip">점수 <strong>${state.score}</strong> / ${state.total}</span>`;
  const qCard=document.createElement('div'); qCard.className='card question-card';
  const q=document.createElement('p'); q.className='question-text'; q.textContent=state.quizType==='note'?'표시된 위치의 음은 무엇일까요?':'표시된 코드폼은 어떤 코드일까요?';
  qCard.append(q,buildFretboard());
  const aCard=document.createElement('div'); aCard.className='card answer-card'; aCard.append(buildAnswers());
  const feedback=document.createElement('p'); feedback.id='feedback'; feedback.className='feedback'; feedback.setAttribute('aria-live','polite'); aCard.appendChild(feedback);
  layout.append(status,qCard,aCard); screenEl.appendChild(layout);
}

function buildFretboard() {
  const wrap=document.createElement('div'); wrap.className='fretboard-wrap';
  const width=Math.max(520,(state.maxFret+1)*74), height=250;
  const svgNS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(svgNS,'svg'); svg.setAttribute('viewBox',`0 0 ${width} ${height}`); svg.classList.add('fretboard'); svg.setAttribute('role','img');
  svg.setAttribute('aria-label', state.quizType==='note'?'문제 위치가 표시된 기타 지판':'코드폼이 표시된 기타 지판');
  const left=46,right=18,top=34,bottom=24,uw=width-left-right,uh=height-top-bottom,fw=uw/(state.maxFret+1),sg=uh/5;
  const add=(tag,attrs,text)=>{const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!=null)el.textContent=text;svg.appendChild(el);return el;};
  for(let f=0;f<=state.maxFret;f++) add('text',{x:left+f*fw+fw/2,y:18,'text-anchor':'middle',fill:'#555','font-size':'12'},String(f));
  for(let f=0;f<=state.maxFret+1;f++) add('line',{x1:left+f*fw,y1:top,x2:left+f*fw,y2:top+uh,stroke:'#6d604f','stroke-width':f===1?4:1});
  for(let s=0;s<6;s++) { const y=top+s*sg; add('line',{x1:left,y1:y,x2:left+uw,y2:y,stroke:'#5d5144','stroke-width':1+(5-s)*.3}); add('text',{x:20,y:y+4,'text-anchor':'middle',fill:'#333','font-size':'13','font-weight':'700'},OPEN_STRINGS[s]); }
  [3,5,7,9].filter(f=>f<=state.maxFret).forEach(f=>add('circle',{cx:left+f*fw+fw/2,cy:top+uh/2,r:5,fill:'#b8aa95'}));
  if(state.maxFret>=12){const x=left+12*fw+fw/2;add('circle',{cx:x,cy:top+uh/3,r:5,fill:'#b8aa95'});add('circle',{cx:x,cy:top+uh*2/3,r:5,fill:'#b8aa95'});}
  if(state.current.type==='note'){
    const {stringIndex,fret}=state.current,x=left+fret*fw+fw/2,y=top+stringIndex*sg,r=Math.max(10,Math.min(16,fw*.22));
    add('circle',{cx:x,cy:y,r,fill:'#e65d48',stroke:'#9a2e24','stroke-width':2}); add('text',{x,y:y+5,'text-anchor':'middle',fill:'white','font-size':'14','font-weight':'800'},'?');
  } else {
    state.current.chord.frets.forEach((f,s)=>{const y=top+s*sg;if(f===-1)add('text',{x:left-15,y:y+5,'text-anchor':'middle',fill:'#9a2e24','font-size':'18','font-weight':'800'},'×');else if(f===0)add('text',{x:left-15,y:y+5,'text-anchor':'middle',fill:'#2d6a4f','font-size':'18','font-weight':'800'},'○');else {const x=left+f*fw+fw/2;add('circle',{cx:x,cy:y,r:Math.max(9,Math.min(14,fw*.2)),fill:'#3867d6',stroke:'#234a9b','stroke-width':2});}});
  }
  wrap.appendChild(svg); return wrap;
}

function buildAnswers() {
  if(state.quizType==='note') {
    const piano=document.createElement('div'); piano.className='piano';
    NOTES.forEach(note=>{const b=button(note,`note-key ${note.includes('#')?'accidental':''}`,()=>submitAnswer(note)); piano.appendChild(b);}); return piano;
  }
  const choices=document.createElement('div'); choices.className='answer-choices';
  state.current.choices.forEach(choice=>choices.appendChild(button(choice,'choice-button',()=>submitAnswer(choice)))); return choices;
}
function submitAnswer(answer) {
  if(state.answered) return;
  state.answered=true; state.total++;
  const correct=answer===state.current.answer; if(correct) state.score++;
  const feedback=document.getElementById('feedback');
  feedback.textContent=correct?'정답입니다!':`오답입니다. 정답은 ${state.current.answer}입니다.`;
  feedback.className=`feedback ${correct?'correct':'wrong'}`;
  document.querySelectorAll('.answer-card button').forEach(b=>b.disabled=true);
  const next=button('다음 문제','next-button',nextQuestion); next.style.marginTop='2px'; document.querySelector('.answer-card').appendChild(next); next.focus();
  document.querySelector('.score-chip').innerHTML=`점수 <strong>${state.score}</strong> / ${state.total}`;
}

backButton.addEventListener('click',()=>{ if(state.screen==='game') showSetup(); else showHome(); });
window.addEventListener('keydown',e=>{
  if(state.screen!=='game') return;
  if(e.key==='Enter' && state.answered){e.preventDefault();nextQuestion();return;}
  if(state.quizType==='chord' && ['1','2','3'].includes(e.key) && !state.answered){const i=Number(e.key)-1;const c=state.current.choices[i];if(c)submitAnswer(c);}
  if(state.quizType==='note' && !state.answered){const key=e.key.toUpperCase();if(['A','B','C','D','E','F','G'].includes(key))submitAnswer(key);}
});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;installButton.classList.remove('hidden');});
installButton.addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installButton.classList.add('hidden');});
window.addEventListener('appinstalled',()=>installButton.classList.add('hidden'));

if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
showHome();
