import {THEORY_LIBRARY,THEORY_SCOPES,THEORY_LEVELS} from './theory-questions.js';

const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const STRINGS=[4,11,7,2,9,4]; // 높은 E부터 낮은 E
const CHORDS={
  major:{label:'Major',suffix:''},minor:{label:'Minor',suffix:'m'},seven:{label:'7',suffix:'7'},
  minor7:{label:'m7',suffix:'m7'},major7:{label:'maj7',suffix:'maj7'},sus2:{label:'sus2',suffix:'sus2'},sus4:{label:'sus4',suffix:'sus4'}
};
// frets는 6번 줄(낮은 E)부터 1번 줄(높은 E) 순서입니다. null은 뮤트, 0은 개방현입니다.
// 모든 항목은 실제로 널리 사용하는 표준 오픈/바레 코드폼입니다.
const CHORD_SHAPES=[
  {level:1,name:'C',type:'major',frets:[null,3,2,0,1,0]},
  {level:1,name:'A',type:'major',frets:[null,0,2,2,2,0]},
  {level:1,name:'G',type:'major',frets:[3,2,0,0,0,3]},
  {level:1,name:'E',type:'major',frets:[0,2,2,1,0,0]},
  {level:1,name:'D',type:'major',frets:[null,null,0,2,3,2]},
  {level:1,name:'Am',type:'minor',frets:[null,0,2,2,1,0]},
  {level:1,name:'Em',type:'minor',frets:[0,2,2,0,0,0]},
  {level:1,name:'Dm',type:'minor',frets:[null,null,0,2,3,1]},
  {level:2,name:'A7',type:'seven',frets:[null,0,2,0,2,0]},
  {level:2,name:'C7',type:'seven',frets:[null,3,2,3,1,0]},
  {level:2,name:'D7',type:'seven',frets:[null,null,0,2,1,2]},
  {level:2,name:'E7',type:'seven',frets:[0,2,0,1,0,0]},
  {level:2,name:'G7',type:'seven',frets:[3,2,0,0,0,1]},
  {level:2,name:'Am7',type:'minor7',frets:[null,0,2,0,1,0]},
  {level:2,name:'Dm7',type:'minor7',frets:[null,null,0,2,1,1]},
  {level:2,name:'Em7',type:'minor7',frets:[0,2,0,0,0,0]},
  {level:3,name:'F',type:'major',frets:[1,3,3,2,1,1]},
  {level:3,name:'B♭',type:'major',frets:[null,1,3,3,3,1]},
  {level:3,name:'Bm',type:'minor',frets:[null,2,4,4,3,2]},
  {level:3,name:'Fm',type:'minor',frets:[1,3,3,1,1,1]},
  {level:3,name:'C♯m',type:'minor',frets:[null,4,6,6,5,4]},
  {level:3,name:'Gm',type:'minor',frets:[3,5,5,3,3,3]},
  {level:4,name:'Asus2',type:'sus2',frets:[null,0,2,2,0,0]},
  {level:4,name:'Asus4',type:'sus4',frets:[null,0,2,2,3,0]},
  {level:4,name:'Dsus2',type:'sus2',frets:[null,null,0,2,3,0]},
  {level:4,name:'Dsus4',type:'sus4',frets:[null,null,0,2,3,3]},
  {level:4,name:'Esus4',type:'sus4',frets:[0,2,2,2,0,0]},
  {level:5,name:'Cmaj7',type:'major7',frets:[null,3,2,0,0,0]},
  {level:5,name:'Amaj7',type:'major7',frets:[null,0,2,1,2,0]},
  {level:5,name:'Dmaj7',type:'major7',frets:[null,null,0,2,2,2]},
  {level:5,name:'Emaj7',type:'major7',frets:[0,2,1,1,0,0]},
  {level:5,name:'Fmaj7',type:'major7',frets:[1,3,3,2,1,0]},
  {level:5,name:'B7',type:'seven',frets:[null,2,1,2,0,2]},
  {level:5,name:'F7',type:'seven',frets:[1,3,1,2,1,1]},
  {level:5,name:'Bm7',type:'minor7',frets:[null,2,4,2,3,2]}
];
const LEVEL_NAMES={
  1:['Em','Am','E','A','D'],
  2:['C','G','Dm','A7','D7','E7'],
  3:['C7','G7','Am7','Dm7','Em7','Asus2','Asus4','Dsus2','Dsus4','Esus4','Cmaj7','Amaj7','Dmaj7','Emaj7'],
  4:['F','B♭','Bm','Fm','C♯m','Gm'],
  5:['Fmaj7','B7','F7','Bm7']
};
const FINGERINGS={
  C:[null,3,2,0,1,0],A:[null,0,1,2,3,0],G:[2,1,0,0,0,3],E:[0,2,3,1,0,0],D:[null,null,0,1,3,2],
  Am:[null,0,2,3,1,0],Em:[0,2,3,0,0,0],Dm:[null,null,0,2,3,1],A7:[null,0,2,0,3,0],D7:[null,null,0,2,1,3],
  E7:[0,2,0,1,0,0],C7:[null,3,2,4,1,0],G7:[3,2,0,0,0,1],Am7:[null,0,2,0,1,0],Dm7:[null,null,0,2,1,1],
  Em7:[0,2,0,0,0,0],Asus2:[null,0,1,2,0,0],Asus4:[null,0,1,2,3,0],Dsus2:[null,null,0,1,3,0],Dsus4:[null,null,0,1,3,4],
  Esus4:[0,2,3,4,0,0],Cmaj7:[null,3,2,0,0,0],Amaj7:[null,0,2,1,3,0],Dmaj7:[null,null,0,1,2,3],Emaj7:[0,2,1,1,0,0],
  F:[1,3,4,2,1,1],'B♭':[null,1,3,4,4,1],Bm:[null,1,3,4,2,1],Fm:[1,3,4,1,1,1],'C♯m':[null,1,3,4,2,1],Gm:[1,3,4,1,1,1],
  Fmaj7:[1,3,4,2,1,0],B7:[null,2,1,3,0,4],F7:[1,3,1,2,1,1],Bm7:[null,1,3,1,2,1]
};
const BARRES={F:{fret:1,from:0,to:5},'B♭':{fret:1,from:1,to:5},Bm:{fret:2,from:1,to:5},Fm:{fret:1,from:0,to:5},'C♯m':{fret:4,from:1,to:5},Gm:{fret:3,from:0,to:5},F7:{fret:1,from:0,to:5},Bm7:{fret:2,from:1,to:5}};
const VARIANT_SHAPES=[
  {name:'C',type:'major',form:'A형 바레',difficulty:4,frets:[null,3,5,5,5,3],fingers:[null,1,3,3,3,1],barre:{fret:3,from:1,to:5}},
  {name:'C',type:'major',form:'E형 바레',difficulty:5,frets:[8,10,10,9,8,8],fingers:[1,3,4,2,1,1],barre:{fret:8,from:0,to:5}},
  {name:'G',type:'major',form:'E형 바레',difficulty:4,frets:[3,5,5,4,3,3],fingers:[1,3,4,2,1,1],barre:{fret:3,from:0,to:5}},
  {name:'A',type:'major',form:'E형 바레',difficulty:4,frets:[5,7,7,6,5,5],fingers:[1,3,4,2,1,1],barre:{fret:5,from:0,to:5}},
  {name:'D',type:'major',form:'A형 바레',difficulty:4,frets:[null,5,7,7,7,5],fingers:[null,1,3,3,3,1],barre:{fret:5,from:1,to:5}},
  {name:'E',type:'major',form:'A형 바레',difficulty:5,frets:[null,7,9,9,9,7],fingers:[null,1,3,3,3,1],barre:{fret:7,from:1,to:5}},
  {name:'Am',type:'minor',form:'E형 바레',difficulty:4,frets:[5,7,7,5,5,5],fingers:[1,3,4,1,1,1],barre:{fret:5,from:0,to:5}},
  {name:'Dm',type:'minor',form:'A형 바레',difficulty:5,frets:[null,5,7,7,6,5],fingers:[null,1,3,4,2,1],barre:{fret:5,from:1,to:5}}
];
const ALL_SHAPES=[...CHORD_SHAPES,...VARIANT_SHAPES];
const FLAT_NAMES={'C#':'D♭','D#':'E♭','F#':'G♭','G#':'A♭','A#':'B♭'};
const CHORD_FORMULAS={major:'루트 · 장3도 · 완전5도',minor:'루트 · 단3도 · 완전5도',seven:'루트 · 장3도 · 완전5도 · 단7도',minor7:'루트 · 단3도 · 완전5도 · 단7도',major7:'루트 · 장3도 · 완전5도 · 장7도',sus2:'루트 · 장2도 · 완전5도',sus4:'루트 · 완전4도 · 완전5도'};
const TUNING_LOW=[4,9,2,7,11,4];

const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const random=(items)=>items[Math.floor(Math.random()*items.length)];
const shuffle=(items)=>[...items].sort(()=>Math.random()-.5);
const weightedRandom=(items,weightOf)=>{let total=items.reduce((sum,item)=>sum+weightOf(item),0),pick=Math.random()*total;for(const item of items){pick-=weightOf(item);if(pick<=0)return item}return items.at(-1)};

class Store{
  static defaults={fretMax:12,notation:'sharp',adaptiveReview:true,chordForm:'all',chordTypes:['major','minor','seven','minor7','major7','sus2','sus4'],review:{notes:{},chords:{},theory:{}},scores:{note:{correct:0,total:0},chord:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}},theory:{1:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}},2:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}}}}};
  static load(){try{const saved=JSON.parse(localStorage.getItem('fretboard-v2')||'{}');const state={...structuredClone(this.defaults),...saved};state.scores={...structuredClone(this.defaults.scores),...(saved.scores||{}),theory:{...structuredClone(this.defaults.scores.theory),...(saved.scores?.theory||{})}};state.review={...structuredClone(this.defaults.review),...(saved.review||{})};return state}catch{return structuredClone(this.defaults)}}
  static save(state){localStorage.setItem('fretboard-v2',JSON.stringify(state))}
}

class Fretboard{
  static render(target,{stringIndex=0,fret=1,tones=[],viewStart=0,viewEnd=12,compact=false,stringStates=[],barre=null}){
    const firstFret=viewStart===0?1:viewStart;
    const fretCount=viewEnd-firstFret+1;
    const edge=n=>1-Math.pow(2,-n/12);
    const rangeStart=edge(firstFret-1),rangeEnd=edge(viewEnd);
    const boundaryOf=current=>((edge(current)-rangeStart)/(rangeEnd-rangeStart))*100;
    const positionOf=current=>(((edge(current-1)+edge(current))/2-rangeStart)/(rangeEnd-rangeStart))*100;
    const visibleInlays=[3,5,7,9].filter(n=>n>=firstFret&&n<=viewEnd);
    target.innerHTML=`<div class="fretboard-scroll ${compact?'compact':''}" aria-label="기타 지판 ${viewStart===0?'너트부터 ':''}${firstFret}~${viewEnd}프렛">
      <div class="fretboard">${viewStart===0?'<div class="nut"></div>':''}<div class="fret-grid">${Array.from({length:fretCount},(_,i)=>`<i class="fret-wire" style="left:${boundaryOf(firstFret+i)}%"></i>`).join('')}</div>
      <div class="strings">${STRINGS.map((_,i)=>`<div class="string" style="--thickness:${1+i*.38}px;--string-y:${16+i*13.6}%"></div>`).join('')}</div>
      ${visibleInlays.map(n=>`<i class="inlay" style="left:${positionOf(n)}%"></i>`).join('')}
      ${viewEnd>=12&&firstFret<=12?[38,62].map(y=>`<i class="inlay" style="left:${positionOf(12)}%;top:${y}%"></i>`).join(''):''}
      ${barre?`<i class="barre" style="left:${positionOf(barre.fret)}%;top:${16+(5-barre.to)*13.6}%;height:${(barre.to-barre.from)*13.6}%"><span>1</span></i>`:''}
      ${stringStates.map((state,i)=>state?`<span class="string-state ${state}" style="top:${16+i*13.6}%">${state==='open'?'○':'×'}</span>`:'').join('')}
      ${tones.filter(t=>t.fret>0&&!(barre&&t.fret===barre.fret&&t.finger===1)).map(t=>`<i class="marker" style="left:${positionOf(t.fret)}%;top:${16+t.string*13.6}%" title="${t.fret}프렛, ${t.finger}번 손가락"><span>${t.finger||''}</span></i>`).join('')||(!tones.length?`<i class="marker" style="left:${positionOf(fret)}%;top:${16+stringIndex*13.6}%"></i>`:'')}
      </div><div class="fret-numbers" aria-hidden="true">${Array.from({length:fretCount},(_,i)=>`<span class="fret-number" style="left:${positionOf(firstFret+i)}%">${firstFret+i}</span>`).join('')}</div></div>`;
  }
}

class PianoKeyboard{
  static render(target,onPick,notation='sharp'){
    const white=['C','D','E','F','G','A','B']; const black=['C#','D#','F#','G#','A#'];
    const label=n=>notation==='flat'&&FLAT_NAMES[n]?FLAT_NAMES[n]:n;
    target.innerHTML=`<div class="keyboard" role="group" aria-label="한 옥타브 피아노 건반"><div class="white-keys">${white.map(n=>`<button class="piano-key white-key" data-note="${n}" aria-label="${label(n)}">${label(n)}</button>`).join('')}</div>${black.map(n=>`<button class="piano-key black-key" data-note="${n}" aria-label="${label(n)}">${label(n)}</button>`).join('')}</div>`;
    $$('.piano-key',target).forEach(key=>key.addEventListener('click',()=>onPick(key.dataset.note,key)));
  }
}

class App{
  constructor(){this.screen=$('#screen');this.title=$('#screenTitle');this.back=$('#backButton');this.install=$('#installButton');this.state=Store.load();this.deferredPrompt=null;this.back.addEventListener('click',()=>this.home());this.install.addEventListener('click',()=>this.promptInstall());window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();this.deferredPrompt=e;this.install.classList.remove('hidden')});window.addEventListener('keydown',e=>this.keydown(e));this.home()}
  shell(title,back=true){this.title.textContent=title;this.back.classList.toggle('hidden',!back);this.screen.focus()}
  home(){this.mode=null;this.shell('코드 앤 프렛',false);const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="home-panel card"><div class="hero-fretboard" aria-hidden="true"><span class="hero-nut"></span>${Array.from({length:6},(_,i)=>`<i class="hero-string" style="--i:${i}"></i>`).join('')}<b style="--x:25%;--y:30%"></b><b style="--x:50%;--y:57%"></b><b style="--x:75%;--y:84%"></b></div><span class="section-kicker">CHORD &amp; FRET</span><h2>지판과 코드, 화성학을<br>연주로 연결하세요.</h2><p class="lead">기타 지판의 음 위치부터 실전 코드폼과 화성학까지, 필요한 영역을 골라 단계별로 익힐 수 있습니다.</p><div class="mode-grid home-modes"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>지판 음 연습</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 찾습니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>실전 코드폼 연습</strong><span>실제 연주에 쓰는 코드폼을 보고 코드 이름을 맞힙니다.</span></button><button class="mode-card" data-mode="theory"><span class="mode-icon">♭</span><strong>화성학 퀴즈</strong><span>기초 이론부터 코드 진행까지 혼합 문제로 연습합니다.</span></button></div><fieldset class="form-group quick-fret home-fret"><legend>지판 음 연습 최대 프렛</legend><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="homeFret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset><div class="home-tools"><button class="secondary-button" data-go="settings">연습 설정</button><button class="secondary-button stats-button" data-go="statistics">학습 통계</button></div><p class="small-note">연습 설정과 누적 점수는 이 기기에 자동 저장됩니다.</p></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>b.dataset.mode==='chord'?this.chordDifficulty():b.dataset.mode==='theory'?this.theoryBooks():this.start('note'));$$('[name=homeFret]',this.screen).forEach(input=>input.onchange=()=>{this.state.fretMax=Number(input.value);Store.save(this.state)});$$('[data-go]',this.screen).forEach(b=>b.onclick=()=>this[b.dataset.go]())}
  modes(){this.shell('연습 선택');const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">PRACTICE MODE</span><h2>무엇을 연습할까요?</h2><div class="mode-grid three-modes"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>음 맞히기</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 선택합니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>코드 맞히기</strong><span>실제 연주에 쓰는 표준 코드폼을 보고 코드 이름을 고릅니다.</span></button><button class="mode-card" data-mode="theory"><span class="mode-icon">♭</span><strong>화성학 퀴즈</strong><span>기초부터 코드 진행까지 객관식과 O/X 문제를 혼합해 연습합니다.</span></button></div><fieldset class="form-group quick-fret"><legend>최대 프렛</legend><p>음 맞히기 출제 범위에 적용됩니다.</p><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="fret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>b.dataset.mode==='chord'?this.chordDifficulty():b.dataset.mode==='theory'?this.theoryBooks():this.start('note'));$$('[name=fret]',this.screen).forEach(input=>input.onchange=()=>{this.state.fretMax=Number(input.value);Store.save(this.state)})}
  theoryBooks(){this.shell('화성학 범위 선택');this.screen.innerHTML=`<section class="setup card theory-setup"><span class="section-kicker">THEORY COURSE</span><h2>학습 범위를 선택하세요.</h2><p class="lead">권 번호 대신 배우게 될 이론의 범위를 확인하고 선택할 수 있습니다.</p><div class="scope-grid">${Object.entries(THEORY_SCOPES).map(([book,s])=>`<button class="scope-card" data-book="${book}"><small>${s.title}</small><strong>${s.subtitle}</strong><span>${s.description}</span><b>각 단계 100문제 · 객관식/OX 혼합</b></button>`).join('')}</div></section>`;$$('[data-book]',this.screen).forEach(b=>b.onclick=()=>{this.theoryBook=Number(b.dataset.book);this.theoryLevels()})}
  theoryLevels(){const levels=THEORY_LEVELS[this.theoryBook];this.shell(`${THEORY_SCOPES[this.theoryBook].title} 난이도`);this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">${THEORY_SCOPES[this.theoryBook].subtitle}</span><h2>난이도를 선택하세요.</h2><div class="level-list">${levels.map((x,i)=>`<button class="level-card" data-theory-level="${i+1}"><span class="level-number">${i+1}</span><span><strong>${i+1}단계 · ${x[0]}</strong><small>${x[1]} · 100문제에서 랜덤 출제</small></span><b aria-hidden="true">→</b></button>`).join('')}</div></section>`;$$('[data-theory-level]',this.screen).forEach(b=>b.onclick=()=>{this.theoryLevel=Number(b.dataset.theoryLevel);this.theoryDeck=shuffle(THEORY_LIBRARY[this.theoryBook][this.theoryLevel]);this.theoryIndex=0;this.start('theory')})}
  chordDifficulty(){this.shell('코드 난이도');const levels=[['1단계','가장 쉬운 오픈 코드','Em · Am · E · A · D'],['2단계','기본 오픈 코드 확장','C · G · Dm · 쉬운 7th'],['3단계','오픈 확장 코드','7th · m7 · maj7 · sus2 · sus4'],['4단계','기본 바레 코드','F · B♭ · Bm · E형/A형 이동 코드'],['5단계','고급 바레·확장 코드','높은 포지션 · maj7 · 7 · m7']];this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">CHORD LEVEL</span><h2>난이도를 선택하세요.</h2><fieldset class="form-group form-picker"><legend>연습할 코드폼</legend><div class="chip-grid">${[['all','전체'],['open','오픈'],['E형 바레','E형 바레'],['A형 바레','A형 바레']].map(([value,label])=>`<label class="chip"><input type="radio" name="form" value="${value}" ${this.state.chordForm===value?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset><div class="level-list">${levels.map((x,i)=>`<button class="level-card" data-level="${i+1}"><span class="level-number">${i+1}</span><span><strong>${x[0]} · ${x[1]}</strong><small>${x[2]}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div></section>`;$$('[name=form]',this.screen).forEach(input=>input.onchange=()=>{this.state.chordForm=input.value;Store.save(this.state)});$$('[data-level]',this.screen).forEach(b=>b.onclick=()=>{this.chordLevel=Number(b.dataset.level);this.start('chord')})}
  settings(){this.shell('연습 설정');this.screen.innerHTML=`<section class="settings card"><span class="section-kicker">SETTINGS</span><h2>연습 방식을 설정하세요.</h2><fieldset class="form-group"><legend>음 이름 표기</legend><div class="chip-grid"><label class="chip"><input type="radio" name="notation" value="sharp" ${this.state.notation==='sharp'?'checked':''}><span>올림표 C♯</span></label><label class="chip"><input type="radio" name="notation" value="flat" ${this.state.notation==='flat'?'checked':''}><span>내림표 D♭</span></label></div></fieldset><fieldset class="form-group"><legend>코드 종류</legend><div class="chip-grid">${Object.entries(CHORDS).map(([k,v])=>`<label class="chip"><input type="checkbox" name="chord" value="${k}" ${this.state.chordTypes.includes(k)?'checked':''}><span>${v.label}</span></label>`).join('')}</div></fieldset><fieldset class="form-group"><legend>적응형 복습</legend><label class="switch-row"><span><strong>자주 틀리는 문제 우선 출제</strong><small>오답 문제의 출제 빈도를 자동으로 높입니다.</small></span><input type="checkbox" id="adaptive" ${this.state.adaptiveReview?'checked':''}></label></fieldset><button class="primary-button" id="saveSettings">설정 저장</button><section class="reset-panel"><div><strong>누적 학습 기록 초기화</strong><small>정답률과 오답 복습 기록을 모두 0으로 되돌립니다. 연습 설정은 유지됩니다.</small></div><button class="danger-button" id="resetProgress" type="button">누적 정답률 초기화</button></section></section>`;$('#saveSettings').onclick=()=>{const chosen=$$('[name=chord]:checked').map(x=>x.value);this.state.notation=$('[name=notation]:checked').value;this.state.adaptiveReview=$('#adaptive').checked;this.state.chordTypes=chosen.length?chosen:['major'];Store.save(this.state);this.home()};$('#resetProgress').onclick=()=>{if(!confirm('누적 정답률과 오답 복습 기록을 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.'))return;this.state.scores=structuredClone(Store.defaults.scores);this.state.review=structuredClone(Store.defaults.review);Store.save(this.state);alert('누적 학습 기록을 초기화했습니다.');this.settings()}}
  statistics(){this.shell('학습 통계');const note=this.state.scores.note;const levels=Object.entries(this.state.scores.chord);const rate=s=>s.total?Math.round(s.correct/s.total*100):0;const noteWeak=Object.entries(this.state.review.notes).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5);const chordWeak=Object.entries(this.state.review.chords).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5);const theoryStats=Object.entries(this.state.scores.theory).flatMap(([book,items])=>Object.entries(items).map(([level,s])=>({book,level,...s})));this.screen.innerHTML=`<section class="stats-page"><div class="stats-hero card"><span class="section-kicker">LEARNING REPORT</span><h2>학습 통계</h2><div class="stat-main"><strong>${rate(note)}%</strong><span>음 맞히기 정답률<br>${note.correct}/${note.total}문제</span></div></div><div class="stats-grid">${levels.map(([level,s])=>`<article class="stat-card card"><small>코드 ${level}단계</small><strong>${rate(s)}%</strong><span>${s.correct}/${s.total}문제</span></article>`).join('')}</div><h3 class="stats-section-title">화성학 단계별 정답률</h3><div class="stats-grid theory-stats">${theoryStats.map(s=>`<article class="stat-card card"><small>${THEORY_SCOPES[s.book].title} ${s.level}단계</small><strong>${rate(s)}%</strong><span>${s.correct}/${s.total}문제</span></article>`).join('')}</div><div class="weak-grid"><article class="card weak-card"><h3>다시 볼 음</h3>${noteWeak.length?noteWeak.map(([k,v])=>`<p><span>${k.split(':').at(-1)}</span><b>오답 가중치 ${v}</b></p>`).join(''):'<p class="empty-copy">아직 기록이 없습니다.</p>'}</article><article class="card weak-card"><h3>다시 볼 코드</h3>${chordWeak.length?chordWeak.map(([k,v])=>`<p><span>${k.split('|')[0]}</span><b>오답 가중치 ${v}</b></p>`).join(''):'<p class="empty-copy">아직 기록이 없습니다.</p>'}</article></div></section>`}
  start(mode){this.mode=mode;this.nextQuestion()}
  nextQuestion(){this.answered=false;if(this.mode==='note')this.noteQuestion();else if(this.mode==='chord')this.chordQuestion();else this.theoryQuestion()}
  currentScore(){if(this.mode==='note')return this.state.scores.note;if(this.mode==='chord')return this.state.scores.chord[this.chordLevel||1];return this.state.scores.theory[this.theoryBook][this.theoryLevel]}
  scoreHtml(){const score=this.currentScore();const rate=score.total?Math.round(score.correct/score.total*100):0;return `<div class="score"><span>정답 ${score.correct}/${score.total}</span><span>정답률 ${rate}%</span></div>`}
  noteQuestion(){this.shell('음 맞히기');const candidates=Array.from({length:6},(_,stringIndex)=>Array.from({length:this.state.fretMax},(_,i)=>({stringIndex,fret:i+1}))).flat();const question=this.state.adaptiveReview?weightedRandom(candidates,q=>1+(this.state.review.notes[`${q.stringIndex}:${q.fret}:${NOTES[(STRINGS[q.stringIndex]+q.fret)%12]}`]||0)*3):random(candidates);const {stringIndex,fret}=question;this.answer=NOTES[(STRINGS[stringIndex]+fret)%12];this.currentQuestionKey=`${stringIndex}:${fret}:${this.answer}`;this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">NOTE QUIZ</span><h2>이 음은 무엇일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>${stringIndex+1}번 줄 · ${fret}프렛</strong><p>아래 피아노 건반에서 정답을 선택하세요.</p></div><div id="piano"></div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;Fretboard.render($('#board'),{stringIndex,fret});PianoKeyboard.render($('#piano'),(note,key)=>this.answerNote(note,key),this.state.notation);$('#next').onclick=()=>this.nextQuestion()}
  displayNote(note){return this.state.notation==='flat'&&FLAT_NAMES[note]?FLAT_NAMES[note]:note}
  answerNote(note,key){if(this.answered)return;this.answered=true;const ok=note===this.answer;key.classList.add(ok?'correct':'wrong');if(!ok){const correct=$(`.piano-key[data-note="${this.answer}"]`);correct?.classList.add('correct')}this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.displayNote(this.answer)}입니다.`)}
  theoryQuestion(){if(!this.theoryDeck?.length)this.theoryDeck=shuffle(THEORY_LIBRARY[this.theoryBook][this.theoryLevel]);if(this.theoryIndex>=this.theoryDeck.length){this.theoryDeck=shuffle(this.theoryDeck);this.theoryIndex=0}let question=this.theoryDeck[this.theoryIndex++];if(this.state.adaptiveReview){const weak=this.theoryDeck.filter(q=>(this.state.review.theory[q.id]||0)>0);if(weak.length&&Math.random()<.45)question=weightedRandom(weak,q=>this.state.review.theory[q.id]+1)}this.currentTheory=question;this.answer=question.answer;this.currentQuestionKey=question.id;const typeLabel=question.type==='ox'?'O/X':'객관식';this.shell(`화성학 · ${this.theoryLevel}단계`);this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">${THEORY_SCOPES[this.theoryBook].title.toUpperCase()} · ${typeLabel}</span><h2>${question.topic}</h2></div>${this.scoreHtml()}</div><section class="theory-card card"><div class="question-count">100문제 중 랜덤 출제</div><h3>${question.question}</h3><div class="theory-choices ${question.type==='ox'?'ox-choices':''}">${question.choices.map((choice,i)=>`<button class="theory-choice" data-theory-choice="${choice}"><small>${question.type==='ox'?'':i+1}</small>${choice}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div><details id="theoryInfo" class="chord-info hidden"><summary>정답 해설 보기</summary><div class="theory-explanation">${question.explanation}</div></details></section>`;$$('[data-theory-choice]',this.screen).forEach(b=>b.onclick=()=>this.answerTheory(b));$('#next').onclick=()=>this.nextQuestion()}
  answerTheory(button){if(this.answered)return;this.answered=true;const ok=button.dataset.theoryChoice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$$('[data-theory-choice]').find(b=>b.dataset.theoryChoice===this.answer)?.classList.add('correct');this.finish(ok,ok?'정답입니다!':`아쉬워요. 정답은 ${this.answer}입니다.`);$('#theoryInfo').classList.remove('hidden')}
  shapeForm(shape){if(shape.form)return shape.form;if(BARRES[shape.name])return shape.frets[0]===null?'A형 바레':'E형 바레';return 'open'}
  shapeDifficulty(shape){if(shape.difficulty)return shape.difficulty;return Number(Object.keys(LEVEL_NAMES).find(level=>LEVEL_NAMES[level].includes(shape.name))||1)}
  chordInfo(shape){const notes=[...new Set(shape.frets.map((fret,i)=>fret===null?null:NOTES[(TUNING_LOW[i]+fret)%12]).filter(Boolean))].map(n=>this.displayNote(n));const root=shape.name.match(/^[A-G][♯♭]?/)?.[0]||shape.name;return `<details id="chordInfo" class="chord-info hidden"><summary>코드 정보 보기</summary><div class="info-grid"><p><small>구성음</small><strong>${notes.join(' · ')}</strong></p><p><small>루트음</small><strong>${root}</strong></p><p><small>코드 공식</small><strong>${CHORD_FORMULAS[shape.type]}</strong></p><p><small>코드폼</small><strong>${this.shapeForm(shape)}</strong></p></div></details>`}
  chordQuestion(){
    const level=this.chordLevel||1;
    this.shell(`코드 맞히기 · ${level}단계`);
    const levelPool=ALL_SHAPES.filter(s=>this.shapeDifficulty(s)===level);
    const formPool=levelPool.filter(s=>this.state.chordForm==='all'||this.shapeForm(s)===this.state.chordForm);
    const pool=formPool.filter(s=>this.state.chordTypes.includes(s.type));
    if(!pool.length){this.screen.innerHTML=`<section class="setup card empty-state"><span class="section-kicker">설정 확인</span><h2>이 단계에서 출제할 코드가 없습니다.</h2><p class="lead">선택한 코드 종류와 ${level}단계의 코드가 일치하지 않습니다. 코드 종류를 추가해 주세요.</p><div class="stack-actions"><button class="primary-button" id="openSettings">코드 종류 설정</button><button class="secondary-button" id="backLevels">난이도 다시 선택</button></div></section>`;$('#openSettings').onclick=()=>this.settings();$('#backLevels').onclick=()=>this.chordDifficulty();return}
    const shape=this.state.adaptiveReview?weightedRandom(pool,s=>1+(this.state.review.chords[`${s.name}|${this.shapeForm(s)}`]||0)*3):random(pool);this.answer=shape.name;this.currentShape=shape;this.currentQuestionKey=`${shape.name}|${this.shapeForm(shape)}`;
    const fingers=shape.fingers||FINGERINGS[shape.name]||[];
    const tones=shape.frets.map((fret,lowIndex)=>fret===null?null:{string:5-lowIndex,fret,finger:fingers[lowIndex]||0}).filter(Boolean);
    const stringStates=[...shape.frets].reverse().map(f=>f===0?'open':f===null?'muted':'');
    const pressed=tones.filter(t=>t.fret>0).map(t=>t.fret);const minFret=Math.min(...pressed),maxFret=Math.max(...pressed);
    const openPosition=tones.some(t=>t.fret===0)||minFret<=3;let viewStart=openPosition?0:minFret;let viewEnd=openPosition?Math.max(3,maxFret):Math.max(maxFret,minFret+2);if(viewEnd>12){viewStart-=viewEnd-12;viewEnd=12}
    const distractors=shuffle([...new Set(levelPool.filter(s=>s.name!==shape.name).map(s=>s.name))]).slice(0,2);const choices=shuffle([this.answer,...distractors]);
    this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">CHORD QUIZ · LEVEL ${level}</span><h2>어떤 코드폼일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="chord-legend"><span><i class="legend-dot">2</i> 손가락 번호</span><span><b>○</b> 개방현</span><span><b>×</b> 뮤트현</span></div><div class="prompt"><strong>${viewStart===0?'너트':`${viewStart}프렛`}부터 ${viewEnd}프렛까지 확대했습니다.</strong><p>가로 막대는 검지로 여러 줄을 누르는 바레 운지입니다.</p></div><div class="chord-choices">${choices.map((c,i)=>`<button class="choice-button" data-choice="${c}"><small>${i+1}</small> ${c}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div>${this.chordInfo(shape)}</section>`;
    Fretboard.render($('#board'),{tones,viewStart,viewEnd,compact:true,stringStates,barre:shape.barre||BARRES[shape.name]||null});$$('[data-choice]').forEach(b=>b.onclick=()=>this.answerChord(b));$('#next').onclick=()=>this.nextQuestion()
  }
  answerChord(button){if(this.answered)return;this.answered=true;const ok=button.dataset.choice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$(`[data-choice="${CSS.escape(this.answer)}"]`)?.classList.add('correct');this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.answer}입니다.`)}
  finish(ok,message){const score=this.currentScore();score.total++;if(ok)score.correct++;const bucket=this.mode==='note'?this.state.review.notes:this.mode==='chord'?this.state.review.chords:this.state.review.theory;const previous=bucket[this.currentQuestionKey]||0;bucket[this.currentQuestionKey]=ok?Math.max(0,previous-1):previous+1;Store.save(this.state);const f=$('#feedback');f.textContent=message;f.className=`feedback ${ok?'good':'bad'}`;$('#next').classList.remove('hidden');$('#chordInfo')?.classList.remove('hidden')}
  keydown(e){if(!this.mode)return;if(e.key==='Enter'&&this.answered){this.nextQuestion();return}if(this.mode==='note'){const note=e.key.toUpperCase();if(['A','B','C','D','E','F','G'].includes(note))$(`.piano-key[data-note="${note}"]`)?.click()}else if(this.mode==='chord'&&['1','2','3'].includes(e.key))$$('[data-choice]')[Number(e.key)-1]?.click();else if(this.mode==='theory'&&['1','2','3','4'].includes(e.key))$$('[data-theory-choice]')[Number(e.key)-1]?.click()}
  async promptInstall(){if(!this.deferredPrompt)return;this.deferredPrompt.prompt();await this.deferredPrompt.userChoice;this.deferredPrompt=null;this.install.classList.add('hidden')}
}

new App();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
