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

const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const random=(items)=>items[Math.floor(Math.random()*items.length)];
const shuffle=(items)=>[...items].sort(()=>Math.random()-.5);

class Store{
  static defaults={fretMax:12,chordTypes:['major','minor','seven','minor7','major7','sus2','sus4'],score:{correct:0,total:0}};
  static load(){try{return {...this.defaults,...JSON.parse(localStorage.getItem('fretboard-v2')||'{}')}}catch{return structuredClone(this.defaults)}}
  static save(state){localStorage.setItem('fretboard-v2',JSON.stringify(state))}
}

class Fretboard{
  static render(target,{stringIndex,fret,tones=[]}){
    target.innerHTML=`<div class="fretboard-scroll" aria-label="기타 지판, ${stringIndex+1}번 줄 ${fret}프렛">
      <div class="fretboard"><div class="nut"></div><div class="fret-grid">${Array.from({length:12},(_,i)=>`<div class="fret-cell" data-fret="${i+1}"></div>`).join('')}</div>
      <div class="strings">${STRINGS.map((_,i)=>`<div class="string" style="--thickness:${1+i*.38}px;--string-y:${16+i*13.6}%"></div>`).join('')}</div>
      ${[3,5,7,9].map(n=>`<i class="inlay" style="left:${((n-.5)/12)*100}%"></i>`).join('')}
      ${[11.68,12.32].map(x=>`<i class="inlay" style="left:${(x/12)*100}%;top:${x<12?'38':'62'}%"></i>`).join('')}
      ${tones.length?tones.map(t=>`<i class="marker ${t.fret===0?'open-marker':''}" style="left:${t.fret===0?'1.5':((t.fret-.5)/12)*100}%;top:${16+t.string*13.6}%" title="${t.fret===0?'개방현':`${t.fret}프렛`}"></i>`).join(''):`<i class="marker" style="left:${((fret-.5)/12)*100}%;top:${16+stringIndex*13.6}%"></i>`}
      </div><div class="fret-numbers" aria-hidden="true">${Array.from({length:12},(_,i)=>`<span class="fret-number">${i+1}</span>`).join('')}</div></div>`;
  }
}

class PianoKeyboard{
  static render(target,onPick){
    const white=['C','D','E','F','G','A','B']; const black=['C#','D#','F#','G#','A#'];
    target.innerHTML=`<div class="keyboard" role="group" aria-label="한 옥타브 피아노 건반"><div class="white-keys">${white.map(n=>`<button class="piano-key white-key" data-note="${n}" aria-label="${n}">${n}</button>`).join('')}</div>${black.map(n=>`<button class="piano-key black-key" data-note="${n}" aria-label="${n}">${n}</button>`).join('')}</div>`;
    $$('.piano-key',target).forEach(key=>key.addEventListener('click',()=>onPick(key.dataset.note,key)));
  }
}

class App{
  constructor(){this.screen=$('#screen');this.title=$('#screenTitle');this.back=$('#backButton');this.install=$('#installButton');this.state=Store.load();this.deferredPrompt=null;this.back.addEventListener('click',()=>this.home());this.install.addEventListener('click',()=>this.promptInstall());window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();this.deferredPrompt=e;this.install.classList.remove('hidden')});window.addEventListener('keydown',e=>this.keydown(e));this.home()}
  shell(title,back=true){this.title.textContent=title;this.back.classList.toggle('hidden',!back);this.screen.focus()}
  home(){this.mode=null;this.shell('기타 지판 트레이너',false);this.screen.innerHTML=`<section class="home-panel card"><div class="hero-fretboard" aria-hidden="true"><span class="hero-nut"></span>${Array.from({length:6},(_,i)=>`<i class="hero-string" style="--i:${i}"></i>`).join('')}<b style="--x:25%;--y:30%"></b><b style="--x:50%;--y:57%"></b><b style="--x:75%;--y:84%"></b></div><span class="section-kicker">GUITAR FRETBOARD PRACTICE</span><h2>지판을 이해하면<br>연주가 더 자유로워집니다.</h2><p class="lead">기타 지판의 음 위치를 익히고, 실제 연주자가 사용하는 코드와 코드폼을 단계별 퀴즈로 연습하세요.</p><div class="learning-points"><span><b>01</b> 지판 음 찾기</span><span><b>02</b> 코드 이름 익히기</span><span><b>03</b> 실전 코드폼 연습</span></div><div class="stack-actions"><button class="primary-button" data-go="modes">지판 연습 시작</button><button class="secondary-button" data-go="settings">코드 종류 설정</button></div><p class="small-note">연습 설정과 누적 점수는 이 기기에 자동 저장됩니다.</p></section>`;$$('[data-go]',this.screen).forEach(b=>b.onclick=()=>this[b.dataset.go]())}
  modes(){this.shell('연습 선택');const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">PRACTICE MODE</span><h2>무엇을 연습할까요?</h2><div class="mode-grid"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>음 맞히기</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 선택합니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>코드 맞히기</strong><span>실제 연주에 쓰는 표준 코드폼을 보고 코드 이름을 고릅니다.</span></button></div><fieldset class="form-group quick-fret"><legend>최대 프렛</legend><p>음 맞히기 출제 범위에 적용됩니다.</p><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="fret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>b.dataset.mode==='chord'?this.chordDifficulty():this.start('note'));$$('[name=fret]',this.screen).forEach(input=>input.onchange=()=>{this.state.fretMax=Number(input.value);Store.save(this.state)})}
  chordDifficulty(){this.shell('코드 난이도');const levels=[['1단계','기본 오픈 코드','C · A · G · E · D · Am · Em · Dm'],['2단계','기본 7th 코드','A7 · C7 · D7 · E7 · G7 · m7'],['3단계','바레 코드','F · B♭ · Bm · Fm · C♯m · Gm'],['4단계','서스펜디드 코드','sus2 · sus4 코드폼'],['5단계','확장 코드','maj7 · 7 · m7 고급 코드폼']];this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">CHORD LEVEL</span><h2>난이도를 선택하세요.</h2><div class="level-list">${levels.map((x,i)=>`<button class="level-card" data-level="${i+1}"><span class="level-number">${i+1}</span><span><strong>${x[0]} · ${x[1]}</strong><small>${x[2]}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div></section>`;$$('[data-level]',this.screen).forEach(b=>b.onclick=()=>{this.chordLevel=Number(b.dataset.level);this.start('chord')})}
  settings(){this.shell('코드 설정');this.screen.innerHTML=`<section class="settings card"><span class="section-kicker">SETTINGS</span><h2>연습할 코드를 고르세요.</h2><fieldset class="form-group"><legend>코드 종류</legend><div class="chip-grid">${Object.entries(CHORDS).map(([k,v])=>`<label class="chip"><input type="checkbox" name="chord" value="${k}" ${this.state.chordTypes.includes(k)?'checked':''}><span>${v.label}</span></label>`).join('')}</div></fieldset><button class="primary-button" id="saveSettings">설정 저장</button></section>`;$('#saveSettings').onclick=()=>{const chosen=$$('[name=chord]:checked').map(x=>x.value);this.state.chordTypes=chosen.length?chosen:['major'];Store.save(this.state);this.modes()}}
  start(mode){this.mode=mode;this.nextQuestion()}
  nextQuestion(){this.answered=false;this.mode==='note'?this.noteQuestion():this.chordQuestion()}
  scoreHtml(){return `<div class="score"><span>정답 ${this.state.score.correct}</span><span>문제 ${this.state.score.total}</span></div>`}
  noteQuestion(){this.shell('음 맞히기');const fret=1+Math.floor(Math.random()*this.state.fretMax);const stringIndex=Math.floor(Math.random()*6);this.answer=NOTES[(STRINGS[stringIndex]+fret)%12];this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">NOTE QUIZ</span><h2>이 음은 무엇일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>${stringIndex+1}번 줄 · ${fret}프렛</strong><p>아래 피아노 건반에서 정답을 선택하세요.</p></div><div id="piano"></div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;Fretboard.render($('#board'),{stringIndex,fret});PianoKeyboard.render($('#piano'),(note,key)=>this.answerNote(note,key));$('#next').onclick=()=>this.nextQuestion()}
  answerNote(note,key){if(this.answered)return;this.answered=true;const ok=note===this.answer;key.classList.add(ok?'correct':'wrong');if(!ok){const correct=$(`.piano-key[data-note="${this.answer}"]`);correct?.classList.add('correct')}this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.answer}입니다.`)}
  chordQuestion(){this.shell(`코드 맞히기 · ${this.chordLevel||1}단계`);let pool=CHORD_SHAPES.filter(s=>s.level===(this.chordLevel||1)&&this.state.chordTypes.includes(s.type));if(pool.length<3)pool=CHORD_SHAPES.filter(s=>s.level===(this.chordLevel||1));const shape=random(pool);this.answer=shape.name;const tones=shape.frets.map((fret,lowIndex)=>fret===null?null:{string:5-lowIndex,fret}).filter(Boolean);const distractors=shuffle(CHORD_SHAPES.filter(s=>s.level===(this.chordLevel||1)&&s.name!==shape.name)).slice(0,2).map(s=>s.name);const choices=shuffle([this.answer,...distractors]);this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">CHORD QUIZ · LEVEL ${this.chordLevel||1}</span><h2>어떤 코드폼일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>실제 기타 운지 위치입니다.</strong><p>밝은 원은 누르는 프렛, 속이 빈 원은 개방현입니다. 표시가 없는 줄은 뮤트합니다.</p></div><div class="chord-choices">${choices.map((c,i)=>`<button class="choice-button" data-choice="${c}"><small>${i+1}</small> ${c}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;Fretboard.render($('#board'),{tones,stringIndex:0,fret:1});$$('[data-choice]').forEach(b=>b.onclick=()=>this.answerChord(b));$('#next').onclick=()=>this.nextQuestion()}
  answerChord(button){if(this.answered)return;this.answered=true;const ok=button.dataset.choice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$(`[data-choice="${CSS.escape(this.answer)}"]`)?.classList.add('correct');this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.answer}입니다.`)}
  finish(ok,message){this.state.score.total++;if(ok)this.state.score.correct++;Store.save(this.state);const f=$('#feedback');f.textContent=message;f.className=`feedback ${ok?'good':'bad'}`;$('#next').classList.remove('hidden')}
  keydown(e){if(!this.mode)return;if(e.key==='Enter'&&this.answered){this.nextQuestion();return}if(this.mode==='note'){const note=e.key.toUpperCase();if(['A','B','C','D','E','F','G'].includes(note))$(`.piano-key[data-note="${note}"]`)?.click()}else if(['1','2','3'].includes(e.key))$$('[data-choice]')[Number(e.key)-1]?.click()}
  async promptInstall(){if(!this.deferredPrompt)return;this.deferredPrompt.prompt();await this.deferredPrompt.userChoice;this.deferredPrompt=null;this.install.classList.add('hidden')}
}

new App();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
