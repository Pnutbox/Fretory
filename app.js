import {THEORY_LIBRARY,THEORY_SCOPES,THEORY_LEVELS} from './theory-questions.js?v=4.18.0';
const APP_VERSION='4.18.0';
const VERSION_HISTORY=[
  {version:'4.18.0',title:'문제 지판 너비 조정',items:['음·코드 문제의 지판 너비를 조금 축소','화면 가운데 정렬과 기존 프렛·마커 좌표 유지']},
  {version:'4.17.0',title:'업데이트 안내와 변경사항',items:['현재 버전을 메인 화면 하단으로 이동','새 버전 준비 시 알림과 바로 업데이트 버튼 표시','메인 화면에서 버전별 변경사항 확인']},
  {version:'4.16.0',title:'화성학 전 단계 확장',items:['모든 범위·난이도를 단계별 30개 핵심 유형으로 확장','정답 근거·판단 순서·연주 적용을 포함한 상세 해설']},
  {version:'4.15.0',title:'설치 앱 뒤로가기 개선',items:['내부 화면에서는 이전 페이지로 이동','첫 화면에서는 한 번 더 누르면 종료된다는 안내 표시']},
  {version:'4.14.0',title:'시작 화면 가독성 개선',items:['세 학습 아이콘 확대','프렛토리의 학습 목적이 드러나는 메인 문구 적용']},
  {version:'4.13.0',title:'프렛토리 브랜드 적용',items:['앱 이름을 프렛토리(Fretory)로 변경','땅콩 캐릭터와 기타가 담긴 설치 아이콘 적용']},
  {version:'4.12.0',title:'화성학과 시작 화면 확장',items:['1·2단계 계산형·역추론형·연주 상황형 문제 추가','3단계 음계 용어를 영어 표기로 정리']},
  {version:'4.11.0',title:'문제 수와 버전 정보',items:['화성학 1·2단계를 각 200문제로 확장','설치된 앱 버전 표시 추가']},
  {version:'4.10.0',title:'화성학 반복 완화',items:['1·2단계에 독립 문제 유형 적용','같은 유형이 연속되지 않도록 출제 순서 분산']},
  {version:'4.9.0',title:'적응형 오답 복습',items:['오답을 최대 40문제 이내에 다시 출제','반복 오답과 정답에 따라 복습 간격 자동 조절']},
  {version:'4.7.0',title:'모바일 퀴즈 화면 개선',items:['다음 문제 버튼을 화면 하단에서 바로 사용','출제 프렛 구간 자동 이동·확대']},
  {version:'4.0.0',title:'CAGED 학습 구조 개편',items:['코드 난이도와 CAGED 폼·프렛 위치·바레 조건 분리','코드·지판·화성학 세부 통계 추가']}
];

const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const STRINGS=[4,11,7,2,9,4]; // 높은 E부터 낮은 E
const CHORDS={
  major:{label:'Major',suffix:''},minor:{label:'Minor',suffix:'m'},seven:{label:'7',suffix:'7'},
  minor7:{label:'m7',suffix:'m7'},major7:{label:'maj7',suffix:'maj7'},sus2:{label:'sus2',suffix:'sus2'},sus4:{label:'sus4',suffix:'sus4'},
  add9:{label:'add9',suffix:'add9'},six:{label:'6',suffix:'6'},minor6:{label:'m6',suffix:'m6'},
  diminished:{label:'dim',suffix:'dim'},augmented:{label:'aug',suffix:'aug'},halfDim:{label:'m7♭5',suffix:'m7♭5'},dim7:{label:'dim7',suffix:'dim7'},nine:{label:'9',suffix:'9'}
};
const CHORD_TYPE_GROUPS=[
  {level:'1단계',title:'기본 메이저·마이너',description:'오픈 코드와 바레 코드의 중심이 되는 가장 기본적인 코드',types:['major','minor']},
  {level:'2단계',title:'도미넌트 7th',description:'블루스와 기본 진행에서 자주 사용하는 긴장감 있는 코드',types:['seven']},
  {level:'3단계',title:'확장·서스 코드',description:'7th의 색채와 sus 계열의 열린 울림을 익히는 코드',types:['minor7','major7','sus2','sus4']},
  {level:'4단계',title:'6th·add9 코드',description:'팝과 어쿠스틱 연주에서 자주 쓰는 부드럽고 열린 색채',types:['add9','six','minor6']},
  {level:'5단계',title:'고급 대칭·텐션 코드',description:'감·증화음, 하프디미니시와 9th 등 고급 화성 어휘',types:['diminished','augmented','halfDim','dim7','nine']}
];
const TYPE_LEVEL={major:1,minor:1,seven:2,minor7:3,major7:3,sus2:3,sus4:3,add9:4,six:4,minor6:4,diminished:5,augmented:5,halfDim:5,dim7:5,nine:5};
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
  {level:5,name:'Bm7',type:'minor7',frets:[null,2,4,2,3,2]},
  {level:4,name:'Cadd9',type:'add9',frets:[null,3,2,0,3,3],fingers:[null,2,1,0,3,4]},
  {level:4,name:'Gadd9',type:'add9',frets:[3,2,0,2,0,3],fingers:[2,1,0,3,0,4]},
  {level:4,name:'C6',type:'six',frets:[null,3,2,2,1,0],fingers:[null,3,2,2,1,0]},
  {level:4,name:'A6',type:'six',frets:[null,0,2,2,2,2],fingers:[null,0,1,1,1,1]},
  {level:4,name:'Am6',type:'minor6',frets:[null,0,2,2,1,2],fingers:[null,0,2,3,1,4]},
  {level:4,name:'Dm6',type:'minor6',frets:[null,null,0,2,0,1],fingers:[null,null,0,2,0,1]},
  {level:5,name:'Bdim',type:'diminished',frets:[null,2,3,4,3,null],fingers:[null,1,2,4,3,null]},
  {level:5,name:'Cdim',type:'diminished',frets:[null,3,4,5,4,null],fingers:[null,1,2,4,3,null]},
  {level:5,name:'Caug',type:'augmented',frets:[null,3,2,1,1,null],fingers:[null,4,3,1,2,null]},
  {level:5,name:'Eaug',type:'augmented',frets:[0,3,2,1,1,0],fingers:[0,4,3,1,2,0]},
  {level:5,name:'Bm7♭5',type:'halfDim',frets:[null,2,3,2,3,null],fingers:[null,1,3,2,4,null]},
  {level:5,name:'Em7♭5',type:'halfDim',frets:[0,null,2,3,3,3],fingers:[0,null,1,2,3,4]},
  {level:5,name:'Cdim7',type:'dim7',frets:[null,3,4,2,4,null],fingers:[null,2,3,1,4,null]},
  {level:5,name:'Bdim7',type:'dim7',frets:[null,2,0,1,0,1],fingers:[null,3,0,1,0,2]},
  {level:5,name:'C9',type:'nine',frets:[null,3,2,3,3,null],fingers:[null,2,1,3,4,null]},
  {level:5,name:'E9',type:'nine',frets:[0,2,0,1,0,2],fingers:[0,2,0,1,0,3]}
];
const LEVEL_NAMES={
  1:['Em','Am','E','A','D'],
  2:['C','G','Dm','A7','D7','E7'],
  3:['C7','G7','Am7','Dm7','Em7','Asus2','Asus4','Dsus2','Dsus4','Esus4','Cmaj7','Amaj7','Dmaj7','Emaj7'],
  4:['F','B♭','Bm','Fm','C♯m','Gm','Cadd9','Gadd9','C6','A6','Am6','Dm6'],
  5:['Fmaj7','B7','F7','Bm7','Bdim','Cdim','Caug','Eaug','Bm7♭5','Em7♭5','Cdim7','Bdim7','C9','E9']
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
const CAGED_TEMPLATES=[
  {family:'C',root:0,type:'major',frets:[null,3,2,0,1,0],fingers:[null,4,3,1,2,1],barre:{from:0,to:2},recommended:false},
  {family:'A',root:9,type:'major',frets:[null,0,2,2,2,0],fingers:[null,1,3,3,3,1],barre:{from:1,to:5},recommended:true},
  {family:'G',root:7,type:'major',frets:[null,2,0,0,0,3],fingers:[null,3,1,1,1,4],barre:{from:1,to:3},recommended:false},
  {family:'E',root:4,type:'major',frets:[0,2,2,1,0,0],fingers:[1,3,4,2,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'major',frets:[null,null,0,2,3,2],fingers:[null,null,1,2,4,3],recommended:true},
  {family:'A',root:9,type:'minor',frets:[null,0,2,2,1,0],fingers:[null,1,3,4,2,1],barre:{from:1,to:5},recommended:true},
  {family:'E',root:4,type:'minor',frets:[0,2,2,0,0,0],fingers:[1,3,4,1,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'minor',frets:[null,null,0,2,3,1],fingers:[null,null,1,3,4,2],recommended:true},
  {family:'A',root:9,type:'seven',frets:[null,0,2,0,2,0],fingers:[null,1,3,1,4,1],barre:{from:1,to:5},recommended:true},
  {family:'E',root:4,type:'seven',frets:[0,2,0,1,0,0],fingers:[1,3,1,2,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'seven',frets:[null,null,0,2,1,2],fingers:[null,null,1,3,2,4],recommended:true},
  {family:'A',root:9,type:'minor7',frets:[null,0,2,0,1,0],fingers:[null,1,3,1,2,1],barre:{from:1,to:5},recommended:true},
  {family:'E',root:4,type:'minor7',frets:[0,2,0,0,0,0],fingers:[1,3,1,1,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'minor7',frets:[null,null,0,2,1,1],fingers:[null,null,1,3,2,2],recommended:true},
  {family:'A',root:9,type:'major7',frets:[null,0,2,1,2,0],fingers:[null,1,3,2,4,1],barre:{from:1,to:5},recommended:true},
  {family:'E',root:4,type:'major7',frets:[0,2,1,1,0,0],fingers:[1,3,2,2,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'major7',frets:[null,null,0,2,2,2],fingers:[null,null,1,2,3,4],recommended:true},
  {family:'A',root:9,type:'sus2',frets:[null,0,2,2,0,0],fingers:[null,1,3,4,1,1],barre:{from:1,to:5},recommended:true},
  {family:'D',root:2,type:'sus2',frets:[null,null,0,2,3,0],fingers:[null,null,1,3,4,1],recommended:true},
  {family:'A',root:9,type:'sus4',frets:[null,0,2,2,3,0],fingers:[null,1,3,3,4,1],barre:{from:1,to:5},recommended:true},
  {family:'E',root:4,type:'sus4',frets:[0,2,2,2,0,0],fingers:[1,3,4,2,1,1],barre:{from:0,to:5},recommended:true},
  {family:'D',root:2,type:'sus4',frets:[null,null,0,2,3,3],fingers:[null,null,1,2,3,4],recommended:true}
];
const fretRangeOf=frets=>{const active=frets.filter(f=>f>0);if(frets.includes(0))return'open';const first=Math.min(...active);return first<=4?'low':first<=8?'mid':'high'};
const CAGED_SHAPES=CAGED_TEMPLATES.flatMap(template=>{const maxBase=Math.max(...template.frets.filter(f=>f!==null));return Array.from({length:12-maxBase},(_,i)=>i+1).map(shift=>{const frets=template.frets.map(f=>f===null?null:f+shift);return{name:`${NOTES[(template.root+shift)%12]}${CHORDS[template.type].suffix}`,type:template.type,form:`${template.family}형 CAGED`,family:template.family,range:fretRangeOf(frets),difficulty:TYPE_LEVEL[template.type],frets,fingers:template.fingers,barre:template.barre?{fret:shift,...template.barre}:null,caged:true,recommended:template.recommended}})});
const ALL_SHAPES=[...CHORD_SHAPES,...VARIANT_SHAPES,...CAGED_SHAPES];
const FLAT_NAMES={'C#':'D♭','D#':'E♭','F#':'G♭','G#':'A♭','A#':'B♭'};
const CHORD_FORMULAS={major:'루트 · 장3도 · 완전5도',minor:'루트 · 단3도 · 완전5도',seven:'루트 · 장3도 · 완전5도 · 단7도',minor7:'루트 · 단3도 · 완전5도 · 단7도',major7:'루트 · 장3도 · 완전5도 · 장7도',sus2:'루트 · 장2도 · 완전5도',sus4:'루트 · 완전4도 · 완전5도',add9:'루트 · 장3도 · 완전5도 · 장9도',six:'루트 · 장3도 · 완전5도 · 장6도',minor6:'루트 · 단3도 · 완전5도 · 장6도',diminished:'루트 · 단3도 · 감5도',augmented:'루트 · 장3도 · 증5도',halfDim:'루트 · 단3도 · 감5도 · 단7도',dim7:'루트 · 단3도 · 감5도 · 감7도',nine:'루트 · 장3도 · 완전5도 · 단7도 · 장9도'};
const TUNING_LOW=[4,9,2,7,11,4];

const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const random=(items)=>items[Math.floor(Math.random()*items.length)];
const shuffle=(items)=>[...items].sort(()=>Math.random()-.5);
const weightedRandom=(items,weightOf)=>{let total=items.reduce((sum,item)=>sum+weightOf(item),0),pick=Math.random()*total;for(const item of items){pick-=weightOf(item);if(pick<=0)return item}return items.at(-1)};

class Store{
  static defaults={fretMax:12,notation:'sharp',adaptiveReview:true,audioTheory:false,cagedScope:'recommended',cagedForms:['C','A','G','E','D','practical'],chordRanges:['open','low','mid','high'],barrePolicy:'all',chordTypes:['major','minor','seven','minor7','major7','sus2','sus4','add9','six','minor6','diminished','augmented','halfDim','dim7','nine'],review:{notes:{},chords:{},theory:{}},details:{noteString:{},noteFret:{},chordType:{},chordForm:{},chordRange:{},theoryTopic:{}},scores:{note:{correct:0,total:0},chord:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}},theory:{1:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}},2:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0},4:{correct:0,total:0},5:{correct:0,total:0}}}}};
  static load(){try{const saved=JSON.parse(localStorage.getItem('fretboard-v2')||'{}');const state={...structuredClone(this.defaults),...saved};state.scores={...structuredClone(this.defaults.scores),...(saved.scores||{}),theory:{...structuredClone(this.defaults.scores.theory),...(saved.scores?.theory||{})}};state.review={...structuredClone(this.defaults.review),...(saved.review||{})};state.details={...structuredClone(this.defaults.details),...(saved.details||{})};state.cagedForms=Array.isArray(saved.cagedForms)?saved.cagedForms:structuredClone(this.defaults.cagedForms);state.chordRanges=Array.isArray(saved.chordRanges)?saved.chordRanges:structuredClone(this.defaults.chordRanges);return state}catch{return structuredClone(this.defaults)}}
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
      ${stringStates.map((state,i)=>state?`<span class="string-state ${state}" style="top:${16+i*13.6}%" role="img" aria-label="${state==='open'?'개방현':'뮤트'}"></span>`:'').join('')}
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
  constructor(){this.screen=$('#screen');this.title=$('#screenTitle');this.back=$('#backButton');this.install=$('#installButton');this.state=Store.load();this.deferredPrompt=null;this.updateRegistration=null;this.updateWorker=null;this.updateReady=false;this.updateRequested=false;this.backAction=()=>this.home();this.historyReady=false;this.historyDepth=0;this.handlingPop=false;this.currentView='';this.lastExitBack=0;this.exitHintTimer=null;this.back.addEventListener('click',()=>this.requestBack());this.install.addEventListener('click',()=>this.promptInstall());window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();this.deferredPrompt=e;this.install.classList.remove('hidden')});window.addEventListener('popstate',()=>this.handlePopState());window.addEventListener('keydown',e=>this.keydown(e));this.home()}
  shell(title,back=true,backAction=()=>this.home()){if(!this.historyReady){history.replaceState({fretory:true,depth:0,base:true},'');history.pushState({fretory:true,depth:0,guard:true},'');this.historyReady=true}else if(!this.handlingPop&&title!==this.currentView){this.historyDepth+=1;history.pushState({fretory:true,depth:this.historyDepth},'')}else if(!this.handlingPop){history.replaceState({fretory:true,depth:this.historyDepth},'')}this.currentView=title;this.title.textContent=title;this.back.classList.toggle('hidden',!back);this.backAction=backAction;this.screen.focus()}
  requestBack(){if(this.historyDepth>0)history.back();else this.homeExitBack()}
  handlePopState(){if(this.historyDepth>0){this.historyDepth-=1;this.handlingPop=true;this.backAction();this.handlingPop=false;return}this.homeExitBack()}
  homeExitBack(){const now=Date.now();if(now-this.lastExitBack<=2000){this.lastExitBack=0;setTimeout(()=>history.back(),0);return}this.lastExitBack=now;history.pushState({fretory:true,depth:0,guard:true},'');this.showExitHint()}
  showExitHint(){let hint=$('#exitHint');if(!hint){hint=document.createElement('div');hint.id='exitHint';hint.className='exit-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');document.body.append(hint)}hint.textContent='뒤로가기를 한 번 더 누르면 앱이 종료됩니다.';hint.classList.add('show');clearTimeout(this.exitHintTimer);this.exitHintTimer=setTimeout(()=>hint.classList.remove('show'),1900)}
  home(){this.mode=null;this.shell('프렛토리',false);const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="home-panel card"><div class="hero-fretboard" aria-hidden="true"><span class="hero-nut"></span>${Array.from({length:6},(_,i)=>`<i class="hero-string" style="--i:${i}"></i>`).join('')}<b style="--x:25%;--y:30%"></b><b style="--x:50%;--y:57%"></b><b style="--x:75%;--y:84%"></b></div><span class="section-kicker">FRETORY</span><h2>지판을 읽고, 코드를 이해해<br>내 연주로 만드세요.</h2><p class="lead">기타 지판의 음 위치부터 실전 코드폼과 화성학까지, 필요한 영역을 골라 단계별로 익힐 수 있습니다.</p><div class="mode-grid home-modes"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>지판 음 연습</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 찾습니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>실전 코드폼 연습</strong><span>실제 연주에 쓰는 코드폼을 보고 코드 이름을 맞힙니다.</span></button><button class="mode-card" data-mode="theory"><span class="mode-icon">♭</span><strong>화성학 퀴즈</strong><span>기초 이론부터 코드 진행까지 혼합 문제로 연습합니다.</span></button></div><fieldset class="form-group quick-fret home-fret"><legend>지판 음 연습 최대 프렛</legend><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="homeFret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset><div class="home-tools"><button class="secondary-button" data-go="settings">연습 설정</button><button class="secondary-button stats-button" data-go="statistics">학습 통계</button><button class="secondary-button changes-button" data-go="versionChanges">변경사항</button></div><p class="small-note">연습 설정과 누적 점수는 이 기기에 자동 저장됩니다.</p>${this.updateReady?`<section class="update-notice" role="status"><span><b>새 버전이 준비되었습니다.</b><small>학습 기록은 유지되며 앱만 새로 고칩니다.</small></span><button class="primary-button" id="applyUpdate" type="button">지금 업데이트</button></section>`:''}<footer class="home-version" aria-label="앱 버전"><span>현재 버전</span><strong>V${APP_VERSION}</strong></footer></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>b.dataset.mode==='chord'?this.chordDifficulty():b.dataset.mode==='theory'?this.theoryBooks():this.start('note'));$$('[name=homeFret]',this.screen).forEach(input=>input.onchange=()=>{this.state.fretMax=Number(input.value);Store.save(this.state)});$$('[data-go]',this.screen).forEach(b=>b.onclick=()=>this[b.dataset.go]());$('#applyUpdate')?.addEventListener('click',()=>this.applyUpdate())}
  modes(){this.shell('연습 선택');const frets=[3,5,7,9,12];this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">PRACTICE MODE</span><h2>무엇을 연습할까요?</h2><div class="mode-grid three-modes"><button class="mode-card" data-mode="note"><span class="mode-icon">🎹</span><strong>음 맞히기</strong><span>표시된 줄과 프렛의 음을 피아노 건반에서 선택합니다.</span></button><button class="mode-card" data-mode="chord"><span class="mode-icon">🎸</span><strong>코드 맞히기</strong><span>실제 연주에 쓰는 표준 코드폼을 보고 코드 이름을 고릅니다.</span></button><button class="mode-card" data-mode="theory"><span class="mode-icon">♭</span><strong>화성학 퀴즈</strong><span>기초부터 코드 진행까지 객관식과 O/X 문제를 혼합해 연습합니다.</span></button></div><fieldset class="form-group quick-fret"><legend>최대 프렛</legend><p>음 맞히기 출제 범위에 적용됩니다.</p><div class="chip-grid">${frets.map(n=>`<label class="chip"><input type="radio" name="fret" value="${n}" ${this.state.fretMax===n?'checked':''}><span>${n}프렛</span></label>`).join('')}</div></fieldset></section>`;$$('[data-mode]',this.screen).forEach(b=>b.onclick=()=>b.dataset.mode==='chord'?this.chordDifficulty():b.dataset.mode==='theory'?this.theoryBooks():this.start('note'));$$('[name=fret]',this.screen).forEach(input=>input.onchange=()=>{this.state.fretMax=Number(input.value);Store.save(this.state)})}
  theoryPool(){return THEORY_LIBRARY[this.theoryBook][this.theoryLevel].filter(q=>this.state.audioTheory||!q.audio)}
  buildTheoryDeck(){
    const pool=this.theoryPool(),groups=new Map();
    for(const question of pool){
      const key=question.family||question.question.trim();
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(question);
    }
    for(const items of groups.values()){
      const mixed=shuffle(items);
      if(this.state.adaptiveReview)mixed.sort((a,b)=>(this.state.review.theory[b.id]||0)-(this.state.review.theory[a.id]||0));
      items.splice(0,items.length,...mixed);
    }
    const deck=[];let previousText=this.lastTheoryFamily||this.lastTheoryText||'';
    while(deck.length<pool.length){
      const candidates=[...groups.entries()].filter(([key,items])=>items.length&&key!==previousText);
      const available=candidates.length?candidates:[...groups.entries()].filter(([,items])=>items.length);
      const maxRemaining=Math.max(...available.map(([,items])=>items.length));
      const choices=available.filter(([,items])=>items.length===maxRemaining);
      const [key,items]=random(choices);const question=items.shift();deck.push(question);previousText=key;
    }
    return deck;
  }
  resetTheorySession(){this.lastTheoryText='';this.lastTheoryFamily='';this.theoryDeck=this.buildTheoryDeck();this.theoryIndex=0;this.theoryTurn=0;this.theoryReviewDue=new Map();this.currentTheoryIsReview=false}
  scheduleTheoryReview(){
    if(!this.state.adaptiveReview||!this.currentTheory)return;
    const weight=this.state.review.theory[this.currentTheory.id]||0;
    if(weight<=0){this.theoryReviewDue.delete(this.currentTheory.id);return}
    const interval=Math.max(6,40-(weight-1)*7);
    this.theoryReviewDue.set(this.currentTheory.id,(this.theoryTurn||0)+interval);
  }
  dueTheoryReview(){
    if(!this.state.adaptiveReview||!this.theoryReviewDue?.size)return null;
    const poolById=new Map(this.theoryPool().map(q=>[q.id,q]));
    const due=[...this.theoryReviewDue.entries()].filter(([id,turn])=>turn<=this.theoryTurn&&id!==this.currentTheory?.id&&poolById.has(id));
    if(!due.length)return null;
    due.sort((a,b)=>{const scheduled=a[1]-b[1];if(scheduled)return scheduled;return (this.state.review.theory[b[0]]||0)-(this.state.review.theory[a[0]]||0)});
    const [id]=due[0];this.theoryReviewDue.delete(id);return poolById.get(id);
  }
  theoryBooks(){this.shell('화성학 범위 선택',true,()=>this.home());this.screen.innerHTML=`<section class="setup card theory-setup"><span class="section-kicker">THEORY COURSE</span><h2>학습 범위를 선택하세요.</h2><p class="lead">권 번호 대신 배우게 될 이론의 범위를 확인하고 선택할 수 있습니다.</p><div class="scope-grid">${Object.entries(THEORY_SCOPES).map(([book,s])=>`<button class="scope-card" data-book="${book}"><small>${s.title}</small><strong>${s.subtitle}</strong><span>${s.description}</span><b>단계별 30개 유형 · 100~200문제</b></button>`).join('')}</div></section>`;$$('[data-book]',this.screen).forEach(b=>b.onclick=()=>{this.theoryBook=Number(b.dataset.book);this.theoryLevels()})}
  theoryLevels(){const levels=THEORY_LEVELS[this.theoryBook];this.shell(`${THEORY_SCOPES[this.theoryBook].title} 난이도`,true,()=>this.theoryBooks());this.screen.innerHTML=`<section class="setup card"><span class="section-kicker">${THEORY_SCOPES[this.theoryBook].subtitle}</span><h2>난이도를 선택하세요.</h2><div class="level-list">${levels.map((x,i)=>`<button class="level-card" data-theory-level="${i+1}"><span class="level-number">${i+1}</span><span><strong>${i+1}단계 · ${x[0]}</strong><small>${x[1]} · 30개 유형 · ${THEORY_LIBRARY[this.theoryBook][i+1].length}문제 · 40문제 이내 오답 복습</small></span><b aria-hidden="true">→</b></button>`).join('')}</div></section>`;$$('[data-theory-level]',this.screen).forEach(b=>b.onclick=()=>{this.theoryLevel=Number(b.dataset.theoryLevel);this.resetTheorySession();this.start('theory')})}
  chordDifficulty(){this.shell('CAGED 코드 퀴즈',true,()=>this.home());const levels=[['1단계','Major · Minor','기본 화음의 모든 선택 CAGED 폼'],['2단계','Dominant 7th','7th 코드의 이동형 CAGED 폼'],['3단계','m7 · maj7 · sus','확장 코드의 실전 CAGED 폼'],['4단계','add9 · 6 · m6','팝·어쿠스틱 확장 코드'],['5단계','dim · aug · m7♭5 · dim7 · 9','고급 대칭·텐션 코드']];const forms=[['C','C형'],['A','A형'],['G','G형'],['E','E형'],['D','D형'],['practical','기타 실전폼']];const ranges=[['open','오픈'],['low','1~4프렛'],['mid','5~8프렛'],['high','9~12프렛']];this.screen.innerHTML=`<section class="setup card caged-setup"><span class="section-kicker">CAGED CHORD QUIZ</span><h2>코드 종류와 폼을 따로 선택하세요.</h2><fieldset class="form-group form-picker"><legend>CAGED 폼</legend><p class="field-help">선택한 폼은 모든 난이도에 독립적으로 적용됩니다.</p><div class="chip-grid">${forms.map(([value,label])=>`<label class="chip"><input type="checkbox" name="cagedForm" value="${value}" ${this.state.cagedForms.includes(value)?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset><fieldset class="form-group form-picker"><legend>프렛 위치</legend><div class="chip-grid">${ranges.map(([value,label])=>`<label class="chip"><input type="checkbox" name="chordRange" value="${value}" ${this.state.chordRanges.includes(value)?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset><fieldset class="form-group form-picker"><legend>바레 운지</legend><div class="chip-grid">${[['all','모두'],['only','바레만'],['exclude','바레 제외']].map(([value,label])=>`<label class="chip"><input type="radio" name="barrePolicy" value="${value}" ${this.state.barrePolicy===value?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset><fieldset class="form-group form-picker"><legend>출제 폼 범위</legend><div class="chip-grid">${[['recommended','실전 권장폼'],['all','전체 CAGED 학습폼']].map(([value,label])=>`<label class="chip"><input type="radio" name="cagedScope" value="${value}" ${this.state.cagedScope===value?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset><div class="level-list">${levels.map((x,i)=>`<button class="level-card" data-level="${i+1}"><span class="level-number">${i+1}</span><span><strong>${x[0]} · ${x[1]}</strong><small>${x[2]}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div></section>`;const updateAvailability=()=>$$('[data-level]',this.screen).forEach(button=>{const level=Number(button.dataset.level);const count=ALL_SHAPES.filter(s=>this.shapeDifficulty(s)===level&&this.state.chordTypes.includes(s.type)&&this.state.cagedForms.includes(this.shapeFamily(s))&&this.state.chordRanges.includes(this.shapeRange(s))&&this.shapeInScope(s)&&(this.state.barrePolicy==='all'||(this.state.barrePolicy==='only'&&this.shapeHasBarre(s))||(this.state.barrePolicy==='exclude'&&!this.shapeHasBarre(s)))).length;button.disabled=!count;const small=button.querySelector('small');if(!small.dataset.base)small.dataset.base=small.textContent;small.textContent=`${small.dataset.base} · ${count}개 폼`});const saveMulti=(name,key)=>$$(`[name=${name}]`,this.screen).forEach(input=>input.onchange=()=>{const chosen=$$(`[name=${name}]:checked`,this.screen).map(x=>x.value);if(!chosen.length){input.checked=true;return}this.state[key]=chosen;Store.save(this.state);updateAvailability()});saveMulti('cagedForm','cagedForms');saveMulti('chordRange','chordRanges');$$('[name=cagedScope]',this.screen).forEach(input=>input.onchange=()=>{this.state.cagedScope=input.value;Store.save(this.state);updateAvailability()});$$('[name=barrePolicy]',this.screen).forEach(input=>input.onchange=()=>{this.state.barrePolicy=input.value;Store.save(this.state);updateAvailability()});$$('[data-level]',this.screen).forEach(b=>b.onclick=()=>{this.chordLevel=Number(b.dataset.level);this.start('chord')});updateAvailability()}
  versionChanges(){this.shell('버전별 변경사항',true,()=>this.home());this.screen.innerHTML=`<section class="setup card changelog-page"><span class="section-kicker">WHAT'S NEW</span><h2>프렛토리 변경사항</h2><p class="lead">최근 버전에서 달라진 기능을 확인할 수 있습니다.</p><div class="changelog-list">${VERSION_HISTORY.map((release,index)=>`<article class="changelog-item ${index===0?'latest':''}"><header><strong>V${release.version}</strong>${index===0?'<span>현재 버전</span>':''}</header><h3>${release.title}</h3><ul>${release.items.map(item=>`<li>${item}</li>`).join('')}</ul></article>`).join('')}</div></section>`}
  connectServiceWorker(registration){
    this.updateRegistration=registration;
    const announce=worker=>{if(!worker||!navigator.serviceWorker.controller)return;this.updateWorker=worker;this.updateReady=true;if(this.currentView==='프렛토리')this.home()};
    if(registration.waiting)announce(registration.waiting);
    registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed')announce(registration.waiting||worker)})});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(this.updateRequested)location.reload()});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')registration.update().catch(()=>{})});
    registration.update().catch(()=>{});
  }
  applyUpdate(){const worker=this.updateRegistration?.waiting||this.updateWorker;if(!worker){this.updateRegistration?.update();return}this.updateRequested=true;const button=$('#applyUpdate');if(button){button.disabled=true;button.textContent='업데이트 중…'}worker.postMessage({type:'SKIP_WAITING'})}
  settings(){this.shell('연습 설정',true,()=>this.home());this.screen.innerHTML=`<section class="settings card"><span class="section-kicker">SETTINGS</span><h2>연습 방식을 설정하세요.</h2><fieldset class="form-group"><legend>음 이름 표기</legend><div class="chip-grid"><label class="chip"><input type="radio" name="notation" value="sharp" ${this.state.notation==='sharp'?'checked':''}><span>올림표 C♯</span></label><label class="chip"><input type="radio" name="notation" value="flat" ${this.state.notation==='flat'?'checked':''}><span>내림표 D♭</span></label></div></fieldset><fieldset class="form-group chord-type-picker"><legend>코드 종류</legend><p class="field-help">코드 종류의 난이도만 설정합니다. CAGED 폼과 프렛 위치는 코드 퀴즈 시작 화면에서 별도로 선택합니다.</p><div class="chord-type-actions"><button type="button" data-chord-action="all">전체 선택</button><button type="button" data-chord-action="none">전체 해제</button></div><div class="chord-type-groups">${CHORD_TYPE_GROUPS.map(group=>`<section class="chord-type-group"><div class="chord-type-heading"><b>${group.level}</b><span><strong>${group.title}</strong><small>${group.description}</small></span></div><div class="chip-grid">${group.types.map(k=>`<label class="chip"><input type="checkbox" name="chord" value="${k}" ${this.state.chordTypes.includes(k)?'checked':''}><span>${CHORDS[k].label}</span></label>`).join('')}</div></section>`).join('')}</div></fieldset><fieldset class="form-group"><legend>청음 문제</legend><label class="switch-row"><span><strong>소리를 듣고 푸는 문제 포함</strong><small>켜면 화성학 퀴즈에 음정·3화음 청음 문제가 포함됩니다.</small></span><input type="checkbox" id="audioTheory" ${this.state.audioTheory?'checked':''}></label></fieldset><fieldset class="form-group"><legend>적응형 복습</legend><label class="switch-row"><span><strong>자주 틀리는 문제 우선 출제</strong><small>오답 문제의 출제 빈도를 자동으로 높입니다.</small></span><input type="checkbox" id="adaptive" ${this.state.adaptiveReview?'checked':''}></label></fieldset><button class="primary-button" id="saveSettings">설정 저장</button><section class="reset-panel"><div><strong>누적 학습 기록 초기화</strong><small>정답률과 오답 복습 기록을 모두 0으로 되돌립니다. 연습 설정은 유지됩니다.</small></div><button class="danger-button" id="resetProgress" type="button">누적 정답률 초기화</button></section><footer class="version-info" aria-label="앱 버전"><span>설치된 앱 버전</span><strong>V${APP_VERSION}</strong></footer></section>`;$$('[data-chord-action]').forEach(button=>button.onclick=()=>$$('[name=chord]').forEach(input=>input.checked=button.dataset.chordAction==='all'));$('#saveSettings').onclick=()=>{const chosen=$$('[name=chord]:checked').map(x=>x.value);this.state.notation=$('[name=notation]:checked').value;this.state.adaptiveReview=$('#adaptive').checked;this.state.audioTheory=$('#audioTheory').checked;this.state.chordTypes=chosen.length?chosen:['major'];Store.save(this.state);this.home()};$('#resetProgress').onclick=()=>{if(!confirm('누적 정답률과 오답 복습 기록을 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.'))return;this.state.scores=structuredClone(Store.defaults.scores);this.state.review=structuredClone(Store.defaults.review);this.state.details=structuredClone(Store.defaults.details);Store.save(this.state);alert('누적 학습 기록을 초기화했습니다.');this.settings()}}
  statistics(){this.shell('학습 통계',true,()=>this.home());const rate=s=>s.total?Math.round(s.correct/s.total*100):0;const cards=(bucket,label=x=>x)=>{const rows=Object.entries(bucket).filter(([,s])=>s.total).sort((a,b)=>b[1].total-a[1].total);return rows.length?`<div class="detail-stats">${rows.map(([key,s])=>`<article><span>${label(key)}</span><strong>${rate(s)}%</strong><small>${s.correct}/${s.total}</small></article>`).join('')}</div>`:'<p class="empty-copy">이 항목의 학습 기록이 아직 없습니다.</p>'};const note=this.state.scores.note;const levels=Object.entries(this.state.scores.chord);const theoryStats=Object.entries(this.state.scores.theory).flatMap(([book,items])=>Object.entries(items).map(([level,s])=>({book,level,...s})));const noteWeak=Object.entries(this.state.review.notes).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5);const chordWeak=Object.entries(this.state.review.chords).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5);this.screen.innerHTML=`<section class="stats-page"><div class="stats-hero card"><span class="section-kicker">LEARNING REPORT</span><h2>학습 통계</h2><div class="stat-main"><strong>${rate(note)}%</strong><span>지판 음 정답률<br>${note.correct}/${note.total}문제</span></div></div><h3 class="stats-section-title">코드 난이도별</h3><div class="stats-grid">${levels.map(([level,s])=>`<article class="stat-card card"><small>${level}단계</small><strong>${rate(s)}%</strong><span>${s.correct}/${s.total}문제</span></article>`).join('')}</div><div class="report-grid"><article class="card report-card"><h3>코드 종류별</h3>${cards(this.state.details.chordType,k=>CHORDS[k]?.label||k)}</article><article class="card report-card"><h3>CAGED 폼별</h3>${cards(this.state.details.chordForm)}</article><article class="card report-card"><h3>프렛 위치별</h3>${cards(this.state.details.chordRange,k=>({open:'오픈',low:'1~4프렛',mid:'5~8프렛',high:'9~12프렛'}[k]||k))}</article><article class="card report-card"><h3>줄별 음 정답률</h3>${cards(this.state.details.noteString,k=>`${k}번 줄`)}</article></div><h3 class="stats-section-title">화성학 단계별</h3><div class="stats-grid theory-stats">${theoryStats.map(s=>`<article class="stat-card card"><small>${THEORY_SCOPES[s.book].title} ${s.level}단계</small><strong>${rate(s)}%</strong><span>${s.correct}/${s.total}문제</span></article>`).join('')}</div><article class="card report-card theory-topic-report"><h3>화성학 단원별</h3>${cards(this.state.details.theoryTopic)}</article><div class="weak-grid"><article class="card weak-card"><h3>다시 볼 음</h3>${noteWeak.length?noteWeak.map(([k,v])=>`<p><span>${k.split(':').at(-1)}</span><b>오답 가중치 ${v}</b></p>`).join(''):'<p class="empty-copy">아직 기록이 없습니다.</p>'}</article><article class="card weak-card"><h3>다시 볼 코드</h3>${chordWeak.length?chordWeak.map(([k,v])=>`<p><span>${k.split('|')[0]}</span><b>오답 가중치 ${v}</b></p>`).join(''):'<p class="empty-copy">아직 기록이 없습니다.</p>'}</article></div></section>`}
  start(mode){this.mode=mode;this.nextQuestion()}
  nextQuestion(){this.answered=false;if(this.mode==='note')this.noteQuestion();else if(this.mode==='chord')this.chordQuestion();else this.theoryQuestion()}
  currentScore(){if(this.mode==='note')return this.state.scores.note;if(this.mode==='chord')return this.state.scores.chord[this.chordLevel||1];return this.state.scores.theory[this.theoryBook][this.theoryLevel]}
  scoreHtml(){const score=this.currentScore();const rate=score.total?Math.round(score.correct/score.total*100):0;return `<div class="score"><span>정답 ${score.correct}/${score.total}</span><span>정답률 ${rate}%</span></div>`}
  noteQuestion(){this.shell('음 맞히기',true,()=>this.home());const candidates=Array.from({length:6},(_,stringIndex)=>Array.from({length:this.state.fretMax},(_,i)=>({stringIndex,fret:i+1}))).flat();const question=this.state.adaptiveReview?weightedRandom(candidates,q=>1+(this.state.review.notes[`${q.stringIndex}:${q.fret}:${NOTES[(STRINGS[q.stringIndex]+q.fret)%12]}`]||0)*3):random(candidates);const {stringIndex,fret}=question;this.currentNote={stringIndex,fret};this.answer=NOTES[(STRINGS[stringIndex]+fret)%12];this.currentQuestionKey=`${stringIndex}:${fret}:${this.answer}`;this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">NOTE QUIZ</span><h2>이 음은 무엇일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="prompt"><strong>${stringIndex+1}번 줄 · ${fret}프렛</strong><p>아래 피아노 건반에서 정답을 선택하세요.</p></div><div id="piano"></div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div></section>`;let viewStart=0,viewEnd=Math.min(3,this.state.fretMax);if(fret>3){viewStart=Math.max(1,Math.min(fret-1,this.state.fretMax-3));viewEnd=Math.min(this.state.fretMax,viewStart+3)}Fretboard.render($('#board'),{stringIndex,fret,viewStart,viewEnd,compact:true});PianoKeyboard.render($('#piano'),(note,key)=>this.answerNote(note,key),this.state.notation);$('#next').onclick=()=>this.nextQuestion()}
  displayNote(note){return this.state.notation==='flat'&&FLAT_NAMES[note]?FLAT_NAMES[note]:note}
  displayChord(name){const match=name.match(/^[A-G](?:#|♯|♭)?/);if(!match)return name;const raw=match[0].replace('♯','#');const root=this.state.notation==='flat'&&FLAT_NAMES[raw]?FLAT_NAMES[raw]:raw.replace('#','♯');return root+name.slice(match[0].length)}
  answerNote(note,key){if(this.answered)return;this.answered=true;const ok=note===this.answer;key.classList.add(ok?'correct':'wrong');if(!ok){const correct=$(`.piano-key[data-note="${this.answer}"]`);correct?.classList.add('correct')}this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.displayNote(this.answer)}입니다.`)}
  theoryQuestion(){if(!this.theoryDeck?.length)this.resetTheorySession();if(this.theoryIndex>=this.theoryDeck.length){this.theoryDeck=this.buildTheoryDeck();this.theoryIndex=0}this.theoryTurn=(this.theoryTurn||0)+1;let question=this.dueTheoryReview();this.currentTheoryIsReview=Boolean(question);if(!question)question=this.theoryDeck[this.theoryIndex++];this.lastTheoryText=question.question.trim();this.currentTheory=question;this.answer=question.answer;this.currentQuestionKey=question.id;const typeLabel=question.type==='ox'?'O/X':'객관식';const progress=this.currentTheoryIsReview?'오답 복습 · 정답 시 재출제 간격 증가':`새 문제 ${this.theoryIndex}/${this.theoryDeck.length}`;this.shell(`화성학 · ${this.theoryLevel}단계`,true,()=>this.theoryLevels());this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">${THEORY_SCOPES[this.theoryBook].title.toUpperCase()} · ${typeLabel}</span><h2>${question.topic}</h2></div>${this.scoreHtml()}</div><section class="theory-card card"><div class="question-count">${progress}</div>${question.audio?`<button class="audio-play-button" id="playTheoryAudio" type="button">🔊 소리 재생</button>`:'' }<h3>${question.question}</h3><div class="theory-choices ${question.type==='ox'?'ox-choices':''}">${question.choices.map((choice,i)=>`<button class="theory-choice" data-theory-choice="${choice}"><small>${question.type==='ox'?'':i+1}</small>${choice}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div><details id="theoryInfo" class="chord-info hidden"><summary>정답 해설 보기</summary><div class="theory-explanation">${question.explanation}</div></details></section>`;if(question.audio)$('#playTheoryAudio').onclick=()=>this.playTheoryAudio(question.audio);$$('[data-theory-choice]',this.screen).forEach(b=>b.onclick=()=>this.answerTheory(b));$('#next').onclick=()=>this.nextQuestion()}
  playTheoryAudio(spec){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;this.audioContext??=new AudioContext();const ctx=this.audioContext,base=60,start=ctx.currentTime+.05;ctx.resume();const play=(offset,when,duration=.7)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=440*Math.pow(2,(base+offset-69)/12);gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(.18,when+.025);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(gain).connect(ctx.destination);osc.start(when);osc.stop(when+duration+.03)};if(spec.kind==='interval')spec.notes.forEach((note,i)=>play(note,start+i*.65,.58));else spec.notes.forEach(note=>play(note,start,.95))}
  answerTheory(button){if(this.answered)return;this.answered=true;const ok=button.dataset.theoryChoice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$$('[data-theory-choice]').find(b=>b.dataset.theoryChoice===this.answer)?.classList.add('correct');this.finish(ok,ok?'정답입니다!':`아쉬워요. 정답은 ${this.answer}입니다.`);$('#theoryInfo').classList.remove('hidden')}
  shapeForm(shape){if(shape.form)return shape.form;if(BARRES[shape.name])return shape.frets[0]===null?'A형 바레':'E형 바레';return this.shapePosition(shape)==='open'?'오픈 포지션':'이동형(비바레)'}
  shapePosition(shape){if(shape.position)return shape.position;const positive=shape.frets.filter(f=>f>0);if(positive.length&&Math.min(...positive)>=5)return 'high';if(shape.barre||BARRES[shape.name])return 'barre';if(shape.frets.includes(0))return 'open';return 'movable'}
  shapeDifficulty(shape){return TYPE_LEVEL[shape.type]||shape.difficulty||1}
  shapeRange(shape){return shape.range||fretRangeOf(shape.frets)}
  shapeFamily(shape){return shape.family||'practical'}
  shapeHasBarre(shape){return Boolean(shape.barre||BARRES[shape.name])}
  shapeInScope(shape){return this.state.cagedScope==='all'||!shape.caged||shape.recommended}
  chordInfo(shape){const notes=[...new Set(shape.frets.map((fret,i)=>fret===null?null:NOTES[(TUNING_LOW[i]+fret)%12]).filter(Boolean))].map(n=>this.displayNote(n));const root=shape.name.match(/^[A-G](?:#|♯|♭)?/)?.[0]||shape.name;return `<details id="chordInfo" class="chord-info hidden"><summary>코드 정보 보기</summary><div class="info-grid"><p><small>구성음</small><strong>${notes.join(' · ')}</strong></p><p><small>루트음</small><strong>${this.displayChord(root)}</strong></p><p><small>코드 공식</small><strong>${CHORD_FORMULAS[shape.type]}</strong></p><p><small>코드폼</small><strong>${this.shapeForm(shape)} · ${shape.recommended===false?'전체 학습용':'실전 권장'}</strong></p></div></details>`}
  chordQuestion(){
    const level=this.chordLevel||1;
    this.shell(`코드 맞히기 · ${level}단계`,true,()=>this.chordDifficulty());
    const levelPool=ALL_SHAPES.filter(s=>this.shapeDifficulty(s)===level);
    const formPool=levelPool.filter(s=>this.state.cagedForms.includes(this.shapeFamily(s))&&this.state.chordRanges.includes(this.shapeRange(s))&&this.shapeInScope(s));
    const techniquePool=formPool.filter(s=>this.state.barrePolicy==='all'||(this.state.barrePolicy==='only'&&this.shapeHasBarre(s))||(this.state.barrePolicy==='exclude'&&!this.shapeHasBarre(s)));
    const pool=techniquePool.filter(s=>this.state.chordTypes.includes(s.type));
    if(!pool.length){this.screen.innerHTML=`<section class="setup card empty-state"><span class="section-kicker">설정 확인</span><h2>이 조건에서 출제할 코드가 없습니다.</h2><p class="lead">선택한 코드 종류와 위치·폼이 ${level}단계 문제에 함께 존재하지 않습니다. 코드 종류 또는 위치·폼을 추가해 주세요.</p><div class="stack-actions"><button class="primary-button" id="openSettings">코드 종류 설정</button><button class="secondary-button" id="backLevels">위치·난이도 다시 선택</button></div></section>`;$('#openSettings').onclick=()=>this.settings();$('#backLevels').onclick=()=>this.chordDifficulty();return}
    const shape=this.state.adaptiveReview?weightedRandom(pool,s=>1+(this.state.review.chords[`${s.name}|${this.shapeForm(s)}`]||0)*3):random(pool);this.answer=shape.name;this.currentShape=shape;this.currentQuestionKey=`${shape.name}|${this.shapeForm(shape)}`;
    const fingers=shape.fingers||FINGERINGS[shape.name]||[];
    const tones=shape.frets.map((fret,lowIndex)=>fret===null?null:{string:5-lowIndex,fret,finger:fingers[lowIndex]||0}).filter(Boolean);
    const stringStates=[...shape.frets].reverse().map(f=>f===0?'open':f===null?'muted':'');
    const pressed=tones.filter(t=>t.fret>0).map(t=>t.fret);const minFret=Math.min(...pressed),maxFret=Math.max(...pressed);
    const openPosition=tones.some(t=>t.fret===0)||minFret<=3;let viewStart=openPosition?0:minFret;let viewEnd=openPosition?Math.max(3,maxFret):Math.max(maxFret,minFret+2);if(viewEnd>12){viewStart-=viewEnd-12;viewEnd=12}
    const preferred=[...new Set(pool.filter(s=>s.name!==shape.name).map(s=>s.name))];const fallback=[...new Set(levelPool.filter(s=>s.name!==shape.name&&!preferred.includes(s.name)).map(s=>s.name))];const distractors=shuffle([...preferred,...fallback]).slice(0,2);const choices=shuffle([this.answer,...distractors]);
    this.screen.innerHTML=`<div class="quiz-header"><div><span class="section-kicker">CHORD QUIZ · LEVEL ${level}</span><h2>어떤 코드폼일까요?</h2></div>${this.scoreHtml()}</div><section class="quiz-card card"><div id="board"></div><div class="chord-legend"><span><i class="legend-dot">2</i> 손가락 번호</span><span><b>○</b> 개방현</span><span><b>×</b> 뮤트현</span></div><div class="prompt"><strong>${viewStart===0?'너트':`${viewStart}프렛`}부터 ${viewEnd}프렛까지 확대했습니다.</strong><p>가로 막대는 검지로 여러 줄을 누르는 바레 운지입니다.</p></div><div class="chord-choices">${choices.map((c,i)=>`<button class="choice-button" data-choice="${c}"><small>${i+1}</small> ${this.displayChord(c)}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><div class="next-wrap"><button id="next" class="primary-button hidden">다음 문제</button></div>${this.chordInfo(shape)}</section>`;
    Fretboard.render($('#board'),{tones,viewStart,viewEnd,compact:true,stringStates,barre:shape.barre||BARRES[shape.name]||null});$$('[data-choice]').forEach(b=>b.onclick=()=>this.answerChord(b));$('#next').onclick=()=>this.nextQuestion()
  }
  answerChord(button){if(this.answered)return;this.answered=true;const ok=button.dataset.choice===this.answer;button.classList.add(ok?'correct':'wrong');if(!ok)$(`[data-choice="${CSS.escape(this.answer)}"]`)?.classList.add('correct');this.finish(ok,`${ok?'정답입니다!':'아쉬워요.'} 정답은 ${this.displayChord(this.answer)}입니다.`)}
  recordDetail(group,key,ok){const bucket=this.state.details[group];const item=bucket[key]||(bucket[key]={correct:0,total:0});item.total++;if(ok)item.correct++}
  finish(ok,message){const score=this.currentScore();score.total++;if(ok)score.correct++;const bucket=this.mode==='note'?this.state.review.notes:this.mode==='chord'?this.state.review.chords:this.state.review.theory;const previous=bucket[this.currentQuestionKey]||0;bucket[this.currentQuestionKey]=ok?Math.max(0,previous-1):previous+1;if(this.mode==='note'){this.recordDetail('noteString',String(this.currentNote.stringIndex+1),ok);this.recordDetail('noteFret',String(this.currentNote.fret),ok)}else if(this.mode==='chord'){this.recordDetail('chordType',this.currentShape.type,ok);this.recordDetail('chordForm',this.shapeFamily(this.currentShape)==='practical'?'기타 실전폼':`${this.shapeFamily(this.currentShape)}형`,ok);this.recordDetail('chordRange',this.shapeRange(this.currentShape),ok)}else{this.recordDetail('theoryTopic',this.currentTheory.topic,ok);this.scheduleTheoryReview()}Store.save(this.state);const f=$('#feedback');f.textContent=message;f.className=`feedback ${ok?'good':'bad'}`;$('#next').classList.remove('hidden');$('#chordInfo')?.classList.remove('hidden')}
  keydown(e){if(!this.mode)return;if(e.key==='Enter'&&this.answered){this.nextQuestion();return}if(this.mode==='note'){const note=e.key.toUpperCase();if(['A','B','C','D','E','F','G'].includes(note))$(`.piano-key[data-note="${note}"]`)?.click()}else if(this.mode==='chord'&&['1','2','3'].includes(e.key))$$('[data-choice]')[Number(e.key)-1]?.click();else if(this.mode==='theory'&&['1','2','3','4'].includes(e.key))$$('[data-theory-choice]')[Number(e.key)-1]?.click()}
  async promptInstall(){if(!this.deferredPrompt)return;this.deferredPrompt.prompt();await this.deferredPrompt.userChoice;this.deferredPrompt=null;this.install.classList.add('hidden')}
}

const app=new App();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(registration=>app.connectServiceWorker(registration)).catch(()=>{}));
