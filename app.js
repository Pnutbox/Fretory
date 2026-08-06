const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const STRINGS=[4,11,7,2,9,4]; // 높은 E부터 낮은 E
const CHORDS={
  major:{label:'Major',suffix:''},minor:{label:'Minor',suffix:'m'},seven:{label:'7',suffix:'7'},
  minor7:{label:'m7',suffix:'m7'},major7:{label:'maj7',suffix:'maj7'},sus2:{label:'sus2',suffix:'sus2'},sus4:{label:'sus4',suffix:'sus4'}
};
const CHORD_TONES={major:[0,4,7],minor:[0,3,7],seven:[0,4,7,10],minor7:[0,3,7,10],major7:[0,4,7,11],sus2:[0,2,7],sus4:[0,5,7]};

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
      <div class="strings">${STRINGS.map((_,i)=>`<div class="string" style="--thickness:${1+i*.38}px"></div>`).join('')}</div>
      ${[3,5,7,9].map(n=>`<i class="inlay" style="left:${((n-.5)/12)*100}%"></i>`).join('')}
      ${[11.68,12.32].map(x=>`<i class="inlay" style="left:${(x/12)*100}%;top:${x<12?'38':'62'}%"></i>`).join('')}
      ${tones.length?tones.map(t=>`<i class="marker" style="left:${((t.fret-.5)/12)*100}%;top:${((t.string+.5)/6)*100}%"></i>`).join(''):`<i class="marker" style="left:${((fret-.5)/12)*100}%;top:${((stringIndex+.5)/6)*100}%"></i>`}
      </div></div>`;
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
  home(){this.mode=null;this.shell('기타 지판 트레이너',false);this.screen.innerHTML=`<section class="home-panel card"><div class="brand-mark" aria-hidden="true">♬</div><span class="section-kicker">매일 조금씩, 지판이 선명해집니다</span><h2>보고, 누르고,<br>기억하세요.</h2><p class="lead">기타 지판의 음과 자주 쓰는 코드 구성음을 짧은 퀴즈로 익혀 보세요.</p><div class="stack-actions"><button class="primary-button" data-go="modes">연습 시작</button><button class="secondary-button" data-go="settings">연습 설정</button></div><p class="small-note">설정과 누적 점수는 이 기기에 자동 저장됩니다.</p></section>`;$$('[data-go]',this.screen).forEach(b=>b.onclick=()=>this[b.dataset.go]())}
  modes(){this.shell('연습 선택');this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">PRACTICE MODE</span><h2>무엇을 연습할까요?</h2><div class="mode-grid"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>음 맞히기</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 선택합니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>코드 맞히기</strong><span>지판에 표시된 구성음을 보고 코드 이름을 고릅니다.</span></button></div></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>this.start(b.dataset.mode))}
  settings(){this.shell('연습 설정');const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="settings card"><span class="section-kicker">SETTINGS</span><h2>출제 범위를 정하세요.</h2><fieldset class="form-group"><legend>최대 프렛</legend><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="fret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset><fieldset class="form-group"><legend>코드 종류</legend><div class="chip-grid">${Object.entries(CHORDS).map(([k,v])=>`<label class="chip"><input type="checkbox" name="chord" value="${k}" ${this.state.chordTypes.includes(k)?'checked':''}><span>${v.label}</span></label>`).join('')}</div></fieldset><button class="primary-button" id="saveSettings">설정 저장</button></section>`;$('#saveSettings').onclick=()=>{this.state.fretMax=Number($('[name=fret]:checked').value);const chosen=$$('[name=chord]:checked').map(x=>x.value);this.state.chordTypes=chosen.length?chosen:['major'];Store.save(this.state);this.modes()}}
  start(mode){this.mode=mode;this.nextQuestion()}
  nextQuestion(){this.answered=false;this.mode==='note'?this.noteQuestion():this.chordQuestion()}
  scoreHtml(){return `<div class="score"><span>정답 ${this.state.score.correct}</span><span>문제 ${this.state.score.total}</span></div>`}
  noteQuestion(){this.shell('음 맞히기');const fret=1+Math.floor(Math.random()*this.state.fretMax);const stringIndex=Math.floor(Math.random()*6);this.answer=NOTES[(STRINGS[stringIndex]+fret)%12];this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">NOTE QUIZ</span><h2>이 음은 무엇일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>${stringIndex+1}번 줄 · ${fret}프렛</strong><p>아래 피아노 건반에서 정답을 선택하세요.</p></div><div id="piano"></div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;Fretboard.render($('#board'),{stringIndex,fret});PianoKeyboard.render($('#piano'),(note,key)=>this.answerNote(note,key));$('#next').onclick=()=>this.nextQuestion()}
  answerNote(note,key){if(this.answered)return;this.answered=true;const ok=note===this.answer;key.classList.add(ok?'correct':'wrong');if(!ok){const correct=$(`.piano-key[data-note="${this.answer}"]`);correct?.classList.add('correct')}this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.answer}입니다.`)}
  chordQuestion(){this.shell('코드 맞히기');const type=random(this.state.chordTypes);const root=Math.floor(Math.random()*12);this.answer=`${NOTES[root]}${CHORDS[type].suffix}`;const tones=CHORD_TONES[type].map((interval,i)=>{const note=(root+interval)%12;for(let s=0;s<6;s++){for(let f=1;f<=this.state.fretMax;f++){if((STRINGS[s]+f)%12===note)return{string:s,fret:f}}}return{string:i,fret:1}});const otherTypes=shuffle(Object.keys(CHORDS).filter(t=>t!==type)).slice(0,2);const choices=shuffle([this.answer,...otherTypes.map(t=>`${NOTES[(root+random([2,5,7]))%12]}${CHORDS[t].suffix}`)]);this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">CHORD QUIZ</span><h2>어떤 코드일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>표시된 구성음을 살펴보세요.</strong><p>가장 알맞은 코드 이름을 선택하세요.</p></div><div class="chord-choices">${choices.map((c,i)=>`<button class="choice-button" data-choice="${c}"><small>${i+1}</small> ${c}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;Fretboard.render($('#board'),{tones,stringIndex:0,fret:1});$$('[data-choice]').forEach(b=>b.onclick=()=>this.answerChord(b));$('#next').onclick=()=>this.nextQuestion()}
  answerChord(button){if(this.answered)return;this.answered=true;const ok=button.dataset.choice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$(`[data-choice="${CSS.escape(this.answer)}"]`)?.classList.add('correct');this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.answer}입니다.`)}
  finish(ok,message){this.state.score.total++;if(ok)this.state.score.correct++;Store.save(this.state);const f=$('#feedback');f.textContent=message;f.className=`feedback ${ok?'good':'bad'}`;$('#next').classList.remove('hidden')}
  keydown(e){if(!this.mode)return;if(e.key==='Enter'&&this.answered){this.nextQuestion();return}if(this.mode==='note'){const note=e.key.toUpperCase();if(['A','B','C','D','E','F','G'].includes(note))$(`.piano-key[data-note="${note}"]`)?.click()}else if(['1','2','3'].includes(e.key))$$('[data-choice]')[Number(e.key)-1]?.click()}
  async promptInstall(){if(!this.deferredPrompt)return;this.deferredPrompt.prompt();await this.deferredPrompt.userChoice;this.deferredPrompt=null;this.install.classList.add('hidden')}
}

new App();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
