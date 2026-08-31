const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const INTERVALS=['완전1도','단2도','장2도','단3도','장3도','완전4도','증4도/감5도','완전5도','단6도','장6도','단7도','장7도'];
const MAJOR_KEYS=[['C',0,'Am'],['G',1,'Em'],['D',2,'Bm'],['A',3,'F#m'],['E',4,'C#m'],['B',5,'G#m'],['F#',6,'D#m'],['F',-1,'Dm'],['Bb',-2,'Gm'],['Eb',-3,'Cm'],['Ab',-4,'Fm'],['Db',-5,'Bbm']];
const MODES=[['Ionian',0,'1 2 3 4 5 6 7'],['Dorian',2,'1 2 ♭3 4 5 6 ♭7'],['Phrygian',4,'1 ♭2 ♭3 4 5 ♭6 ♭7'],['Lydian',5,'1 2 3 ♯4 5 6 7'],['Mixolydian',7,'1 2 3 4 5 6 ♭7'],['Aeolian',9,'1 2 ♭3 4 5 ♭6 ♭7'],['Locrian',11,'1 ♭2 ♭3 4 ♭5 ♭6 ♭7']];
const JAZZ_MINOR_MODES=['Jazz minor','Dorian ♭2','Lydian augmented','Lydian dominant','Mixolydian ♭6','Locrian ♮2','Altered'];
const DIATONIC_MAJOR=['maj7','m7','m7','maj7','7','m7','m7♭5'];
const DIATONIC_MINOR=['m','dim','aug','m','M','M','dim'];
const NON_CHORD_TONES=['경과음','보조음','전타음','계류음','선행음','이탈음'];
const pick=(a,i)=>a[((i%a.length)+a.length)%a.length];
const rotate=(a,n)=>[...a.slice(n),...a.slice(0,n)];
const choices=(correct,pool,i)=>rotate([correct,...rotate([...new Set(pool.filter(x=>x!==correct))],i).slice(0,3)],i);
const mcq=(id,topic,question,correct,wrong,explanation,i)=>({id,type:'mcq',topic,question,choices:choices(correct,wrong,i),answer:correct,explanation});
const ox=(id,topic,question,value,explanation)=>({id,type:'ox',topic,question,choices:['O','X'],answer:value?'O':'X',explanation});
const tagged=(question,family)=>({...question,family});
const JAZZ_MINOR_FORMULAS=['1 2 ♭3 4 5 6 7','1 ♭2 ♭3 4 5 6 ♭7','1 2 3 ♯4 ♯5 6 7','1 2 3 ♯4 5 6 ♭7','1 2 3 4 5 ♭6 ♭7','1 2 ♭3 4 ♭5 ♭6 ♭7','1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7'];

function foundationQuestion(book,level,i){
  if(level>2)return null;
  const root=i%12,branch=i%10,note=NOTES[root],up=NOTES[(root+1)%12],down=NOTES[(root+11)%12];
  if(book===1&&level===1){
    if(branch===0)return tagged(mcq(`1-1-${i}`,'반음과 온음',`${note}에서 반음 위의 음은?`,up,NOTES,`${note}에서 한 건반 위로 이동하면 ${up}이다.`,i),'semitone-up');
    if(branch===1)return tagged(mcq(`1-1-${i}`,'반음과 온음',`${note}에서 반음 아래의 음은?`,down,NOTES,`${note}에서 한 건반 아래로 이동하면 ${down}이다.`,i),'semitone-down');
    if(branch===2){const target=NOTES[(root+2)%12];return tagged(mcq(`1-1-${i}`,'온음 계산',`${note}에서 온음 위의 음은?`,target,NOTES,`온음은 반음 두 칸이므로 정답은 ${target}이다.`,i),'whole-up')}
    if(branch===3){const pairs=[['C#','D♭'],['D#','E♭'],['F#','G♭'],['G#','A♭'],['A#','B♭']],pair=pick(pairs,i);return tagged(mcq(`1-1-${i}`,'이명동음',`${pair[0]}과 같은 높이로 연주되는 음은?`,pair[1],pairs.map(x=>x[1]),`${pair[0]}과 ${pair[1]}은 표기만 다른 이명동음이다.`,i),'enharmonic')}
    if(branch===4){const signs=[['♯','반음 높인다'],['♭','반음 낮춘다'],['♮','변화표를 취소한다'],['𝄪','온음 높인다']],s=pick(signs,i);return tagged(mcq(`1-1-${i}`,'변화표',`악보에서 ${s[0]}의 기능은?`,s[1],signs.map(x=>x[1]),`${s[0]}은 음을 ${s[1]}.`,i),'accidental')}
    if(branch===5){const pairs=[['E','F','반음'],['B','C','반음'],['C','D','온음'],['F','G','온음']],p=pick(pairs,i);return tagged(mcq(`1-1-${i}`,'자연음 간격',`${p[0]}와 ${p[1]} 사이의 간격은?`,p[2],['반음','온음','단3도','완전4도'],`${p[0]}와 ${p[1]} 사이는 ${p[2]}이다.`,i),'natural-gap')}
    if(branch===6){const values=[['2분음표','4분음표'],['온음표','2분음표'],['4분음표','8분음표']],v=pick(values,i);return tagged(mcq(`1-1-${i}`,'음표 길이',`${v[0]} 하나는 ${v[1]} 몇 개와 길이가 같은가?`,'2',['1','2','3','4'],`${v[0]} 하나의 길이는 ${v[1]} 2개와 같다.`,i),'note-value')}
    if(branch===7)return tagged(ox(`1-1-${i}`,'점음표','점음표의 점은 원래 음표 길이의 절반을 더한다.',true,'점은 원래 길이의 1/2을 추가한다.'),'dotted-note');
    if(branch===8)return tagged(ox(`1-1-${i}`,'쉼표','쉼표도 음표처럼 정해진 박의 길이를 나타낸다.',true,'쉼표는 소리 없이 유지하는 시간의 길이를 나타낸다.'),'rest');
    return tagged(mcq(`1-1-${i}`,'오선과 음자리표','높은음자리표에서 둘째 줄의 기준 음은?','G',['C','F','G','A'],'높은음자리표는 둘째 줄의 G음을 기준으로 그린다.',i),'clef');
  }
  if(book===1&&level===2){
    const semitones=(i*5)%12,interval=INTERVALS[semitones],target=NOTES[(root+semitones)%12];
    if(branch===0)return tagged(mcq(`1-2-${i}`,'음정 이름',`${semitones}반음에 해당하는 음정은?`,interval,INTERVALS,`${semitones}반음은 ${interval}이다.`,i),'interval-name');
    if(branch===1)return tagged(mcq(`1-2-${i}`,'음정 계산',`${note}에서 위로 ${semitones}반음 이동한 음은?`,target,NOTES,`반음으로 ${semitones}칸 이동하면 ${target}에 도착한다.`,i),'interval-note');
    if(branch===2){const triads=[['Major','1 3 5'],['minor','1 ♭3 5'],['augmented','1 3 ♯5'],['diminished','1 ♭3 ♭5']],t=pick(triads,i);return tagged(mcq(`1-2-${i}`,'3화음 공식',`${t[0]} 3화음의 구성 공식은?`,t[1],triads.map(x=>x[1]),`${t[0]} 3화음의 공식은 ${t[1]}이다.`,i),'triad-formula')}
    if(branch===3){const triads=[['1 3 5','Major'],['1 ♭3 5','minor'],['1 3 ♯5','augmented'],['1 ♭3 ♭5','diminished']],t=pick(triads,i);return tagged(mcq(`1-2-${i}`,'3화음 분석',`${t[0]}에 해당하는 3화음의 성질은?`,t[1],triads.map(x=>x[1]),`${t[0]}은 ${t[1]} 3화음이다.`,i),'triad-quality')}
    if(branch===4){const roots=[['C','C E G'],['D','D F# A'],['E','E G# B'],['F','F A C'],['G','G B D']],t=pick(roots,i);return tagged(mcq(`1-2-${i}`,'장3화음 구성음',`${t[0]} Major 3화음의 구성음은?`,t[1],roots.map(x=>x[1]),`${t[0]} Major는 ${t[1]}로 구성된다.`,i),'major-notes')}
    if(branch===5){const roots=[['A','A C E'],['D','D F A'],['E','E G B'],['B','B D F#'],['C','C E♭ G']],t=pick(roots,i);return tagged(mcq(`1-2-${i}`,'단3화음 구성음',`${t[0]} minor 3화음의 구성음은?`,t[1],roots.map(x=>x[1]),`${t[0]} minor는 ${t[1]}로 구성된다.`,i),'minor-notes')}
    if(branch===6)return tagged(mcq(`1-2-${i}`,'코드 전위','3화음의 3음이 베이스에 놓인 전위는?','제1전위',['기본위치','제1전위','제2전위','제3전위'],'3음이 베이스이면 제1전위이다.',i),'inversion-first');
    if(branch===7)return tagged(mcq(`1-2-${i}`,'코드 전위','3화음의 5음이 베이스에 놓인 전위는?','제2전위',['기본위치','제1전위','제2전위','제3전위'],'5음이 베이스이면 제2전위이다.',i),'inversion-second');
    if(branch===8){const inv=[['C/E','E'],['G/B','B'],['D/F#','F#'],['Am/C','C']],t=pick(inv,i);return tagged(mcq(`1-2-${i}`,'슬래시 코드',`${t[0]}에서 베이스음은?`,t[1],NOTES,`슬래시 뒤의 ${t[1]}가 베이스음이다.`,i),'slash-bass')}
    return tagged(ox(`1-2-${i}`,'코드의 정체성','코드를 전위해도 구성음이 같으면 기본 코드의 성질은 유지된다.',true,'베이스 배열은 달라져도 구성음이 같으면 코드의 기본 성질은 유지된다.'),'inversion-concept');
  }
  if(book===2&&level===1){
    const degree=i%7,mode=MODES[degree];
    if(branch===0)return tagged(mcq(`2-1-${i}`,'모드 순서',`메이저 스케일의 ${degree+1}번째 음에서 시작하는 모드는?`,mode[0],MODES.map(x=>x[0]),`${degree+1}번째 모드는 ${mode[0]}이다.`,i),'mode-degree');
    if(branch===1)return tagged(mcq(`2-1-${i}`,'모드 공식',`${mode[0]} 모드의 음정 공식은?`,mode[2],MODES.map(x=>x[2]),`${mode[0]}의 공식은 ${mode[2]}이다.`,i),'mode-formula');
    if(branch===2)return tagged(mcq(`2-1-${i}`,'모드 특징음','장음계보다 4도가 반음 높은 모드는?','Lydian',MODES.map(x=>x[0]),'Lydian의 특징음은 ♯4이다.',i),'lydian');
    if(branch===3)return tagged(mcq(`2-1-${i}`,'모드 특징음','장음계보다 7도가 반음 낮은 모드는?','Mixolydian',MODES.map(x=>x[0]),'Mixolydian의 특징음은 ♭7이다.',i),'mixolydian');
    if(branch===4)return tagged(mcq(`2-1-${i}`,'모드 특징음','단음계보다 6도가 반음 높은 모드는?','Dorian',MODES.map(x=>x[0]),'Dorian은 단3도와 장6도를 함께 가진다.',i),'dorian');
    if(branch===5)return tagged(mcq(`2-1-${i}`,'모드 특징음','단음계보다 2도가 반음 낮은 모드는?','Phrygian',MODES.map(x=>x[0]),'Phrygian의 특징음은 ♭2이다.',i),'phrygian');
    if(branch===6)return tagged(mcq(`2-1-${i}`,'모드 성격','메이저 계열 모드가 아닌 것은?','Aeolian',['Ionian','Lydian','Mixolydian','Aeolian'],'Aeolian은 단3도를 가진 마이너 계열 모드이다.',i),'mode-family');
    if(branch===7)return tagged(mcq(`2-1-${i}`,'모드 중심음','C Major의 음 집합을 D부터 배열하면 어떤 모드인가?','D Dorian',['C Ionian','D Dorian','E Phrygian','G Mixolydian'],'C Major의 두 번째 음 D를 중심으로 하면 D Dorian이다.',i),'relative-mode');
    if(branch===8)return tagged(ox(`2-1-${i}`,'모드 중심음','같은 음들을 사용해도 중심음이 바뀌면 모드의 울림과 기능이 달라진다.',true,'모드는 음 집합뿐 아니라 중심음이 중요하다.'),'tonal-center');
    return tagged(mcq(`2-1-${i}`,'Locrian','완전5도 대신 감5도를 갖는 메이저 파생 모드는?','Locrian',MODES.map(x=>x[0]),'Locrian의 공식에는 ♭5가 포함된다.',i),'locrian');
  }
  if(book===2&&level===2){
    const degree=i%7,name=JAZZ_MINOR_MODES[degree],formula=JAZZ_MINOR_FORMULAS[degree];
    if(branch===0)return tagged(mcq(`2-2-${i}`,'재즈 마이너 모드',`Jazz minor의 ${degree+1}번째 모드는?`,name,JAZZ_MINOR_MODES,`${degree+1}번째 모드는 ${name}이다.`,i),'jazz-degree');
    if(branch===1)return tagged(mcq(`2-2-${i}`,'재즈 마이너 공식',`${name}의 음정 공식은?`,formula,JAZZ_MINOR_FORMULAS,`${name}의 공식은 ${formula}이다.`,i),'jazz-formula');
    if(branch===2)return tagged(mcq(`2-2-${i}`,'Altered','변형된 ♭9·♯9·♭5·♯5 텐션을 폭넓게 포함하는 스케일은?','Altered',JAZZ_MINOR_MODES,'Altered는 변화된 도미넌트 텐션을 가장 많이 포함한다.',i),'altered-tensions');
    if(branch===3)return tagged(mcq(`2-2-${i}`,'Lydian dominant','♯4와 ♭7을 함께 갖는 모드는?','Lydian dominant',JAZZ_MINOR_MODES,'Lydian dominant는 Lydian의 ♯4와 dominant의 ♭7을 함께 가진다.',i),'lydian-dominant');
    if(branch===4)return tagged(mcq(`2-2-${i}`,'코드 스케일','m7♭5 코드에 대표적으로 연결되는 Jazz minor 파생 모드는?','Locrian ♮2',JAZZ_MINOR_MODES,'Locrian ♮2는 m7♭5에 자주 사용된다.',i),'locrian-natural2');
    if(branch===5)return tagged(mcq(`2-2-${i}`,'코드 스케일','altered dominant 코드에 대표적으로 사용하는 스케일은?','Altered',JAZZ_MINOR_MODES,'Altered 스케일은 altered dominant의 변화 텐션을 포함한다.',i),'altered-chord');
    if(branch===6)return tagged(mcq(`2-2-${i}`,'모드 비교','Lydian augmented의 특징적인 변화음 조합은?','♯4 · ♯5',['♯4 · ♯5','♭2 · ♭5','♭3 · ♭7','♮4 · ♭6'],'Lydian augmented는 ♯4와 ♯5를 가진다.',i),'lydian-augmented');
    if(branch===7)return tagged(mcq(`2-2-${i}`,'모드 비교','Dorian ♭2의 특징적인 시작 간격은?','♭2',['♭2','♮2','♯2','장3도'],'Dorian ♭2는 이름처럼 2도가 반음 낮다.',i),'dorian-flat2');
    if(branch===8)return tagged(ox(`2-2-${i}`,'Jazz minor','Jazz minor는 자연단음계와 달리 6도와 7도가 모두 장음정이다.',true,'Jazz minor의 공식은 1 2 ♭3 4 5 6 7이다.'),'jazz-minor-concept');
    return tagged(mcq(`2-2-${i}`,'Altered','Jazz minor의 7번째 모드는?','Altered',JAZZ_MINOR_MODES,'Jazz minor의 7번째 모드는 Altered이다.',i),'altered-degree');
  }
  return null;
}

function book1(level,i){
  const root=i%12,next=(root+1)%12,interval=(i*5)%12,key=pick(MAJOR_KEYS,i),degree=i%7;
  if(level===1){
    if(i%2===0)return mcq(`1-1-${i}`,'기초악전',`${NOTES[root]}에서 반음 위의 음은?`,NOTES[next],NOTES,`${NOTES[root]}에서 반음 위로 이동하면 ${NOTES[next]}이다.`,i);
    const trueValue=i%4===1;return ox(`1-1-${i}`,'기초악전',trueValue?'8분음표 두 개는 4분음표 하나와 길이가 같다.':'B와 C 사이는 온음이다.',trueValue,trueValue?'두 8분음표의 합은 한 박인 4분음표와 같다.':'B–C와 E–F 사이는 반음이다.');
  }
  if(level===2){
    if(i%2===0)return mcq(`1-2-${i}`,'음정',`${NOTES[root]}에서 위로 ${interval}반음 떨어진 음정의 종류는?`,INTERVALS[interval],INTERVALS,`${interval}반음은 ${INTERVALS[interval]}에 해당한다.`,i);
    const types=[['Major','장3도+단3도'],['minor','단3도+장3도'],['augmented','장3도+장3도'],['diminished','단3도+단3도']],t=pick(types,i);return mcq(`1-2-${i}`,'3화음',`${t[0]} 3화음의 음정 구조는?`,t[1],types.map(x=>x[1]),`${t[0]} 3화음은 ${t[1]} 구조다.`,i);
  }
  if(level===3){
    if(i%2===0){const count=Math.abs(key[1]),mark=key[1]>=0?'♯':'♭';return mcq(`1-3-${i}`,'조성',`${key[0]}장조의 조표는?`,count?`${mark} ${count}개`:'없음',['없음','♯ 1개','♯ 2개','♯ 3개','♭ 1개','♭ 2개','♭ 3개','♭ 4개'],`${key[0]}장조는 ${count?`${mark} ${count}개`:'조표가 없다'}.`,i)}
    return mcq(`1-3-${i}`,'관계조',`${key[0]}장조의 관계단조는?`,key[2],MAJOR_KEYS.map(x=>x[2]),`장조의 6도에서 시작하는 단조가 관계단조이며, 정답은 ${key[2]}이다.`,i);
  }
  if(level===4){
    if(i%2===0){const quality=DIATONIC_MAJOR[degree];return mcq(`1-4-${i}`,'다이아토닉',`메이저 키의 ${degree+1}도 다이아토닉 7화음의 코드 유형은?`,quality,DIATONIC_MAJOR,`메이저 다이아토닉 7화음의 ${degree+1}도는 ${quality}이다.`,i)}
    const type=pick(['maj7','7','m7','m7♭5'],i),formula={maj7:'1 3 5 7','7':'1 3 5 ♭7','m7':'1 ♭3 5 ♭7','m7♭5':'1 ♭3 ♭5 ♭7'}[type];return mcq(`1-4-${i}`,'7화음',`${type} 코드의 구성 공식은?`,formula,['1 3 5 7','1 3 5 ♭7','1 ♭3 5 ♭7','1 ♭3 ♭5 ♭7'],`${type}의 공식은 ${formula}이다.`,i);
  }
  if(i%2===0){const tension=pick([['9','2'],['11','4'],['13','6']],i);return mcq(`1-5-${i}`,'텐션',`텐션 ${tension[0]}와 옥타브 관계인 음정은?`,`${tension[1]}도`,['2도','3도','4도','5도','6도','7도'],`${tension[0]}는 한 옥타브 아래의 ${tension[1]}도와 같은 음이름을 가진다.`,i)}
  return ox(`1-5-${i}`,'텐션',i%4===1?'모든 코드에는 모든 텐션을 조건 없이 사용할 수 있다.':'텐션 13은 코드의 6도와 같은 음이름을 가진다.',i%4!==1,i%4===1?'코드톤과 충돌하는 avoid note를 고려해야 한다.':'13은 복합음정이며 단순화하면 6도다.');
}

function book2(level,i){
  const mode=pick(MODES,i),degree=i%7;
  if(level===1){
    if(i%2===0)return mcq(`2-1-${i}`,'모드',`메이저 스케일의 ${degree+1}번째 음에서 시작하는 모드는?`,MODES[degree][0],MODES.map(x=>x[0]),`${degree+1}번째 모드는 ${MODES[degree][0]}이다.`,i);
    return mcq(`2-1-${i}`,'모드',`${mode[0]} 모드의 음정 공식은?`,mode[2],MODES.map(x=>x[2]),`${mode[0]}의 공식은 ${mode[2]}이다.`,i);
  }
  if(level===2){
    if(i%2===0)return mcq(`2-2-${i}`,'재즈 마이너 모드',`Jazz minor의 ${degree+1}번째 모드는?`,JAZZ_MINOR_MODES[degree],JAZZ_MINOR_MODES,`${degree+1}번째 모드는 ${JAZZ_MINOR_MODES[degree]}이다.`,i);
    const scale=pick([['Altered','도미넌트7 altered'],['Lydian dominant','7(♯11)'],['Locrian ♮2','m7♭5'],['Lydian augmented','maj7(♯5)']],i);return mcq(`2-2-${i}`,'코드-스케일',`${scale[1]} 코드에 연결하기 좋은 대표 스케일은?`,scale[0],JAZZ_MINOR_MODES,`${scale[0]}은 ${scale[1]} 코드와 연결되는 대표적인 코드 스케일이다.`,i);
  }
  if(level===3){
    if(i%2===0){const quality=DIATONIC_MAJOR[degree];return mcq(`2-3-${i}`,'다이아토닉 7th',`메이저 다이아토닉의 ${degree+1}도 7화음은?`,quality,DIATONIC_MAJOR,`${degree+1}도 코드 유형은 ${quality}이다.`,i)}
    return ox(`2-3-${i}`,'어베일러블 텐션',i%4===1?'코드톤과 단9도로 충돌하는 음도 항상 사용 가능한 텐션이다.':'다이아토닉 텐션은 조성의 음과 코드톤의 관계를 함께 살펴야 한다.',i%4!==1,i%4===1?'단9도 충돌은 일반적으로 avoid note 판단의 핵심이다.':'조성 안의 음이라도 코드톤과의 간격을 확인해야 한다.');
  }
  if(level===4){
    const key=pick(MAJOR_KEYS,i)[0];
    if(i%3===0)return mcq(`2-4-${i}`,'2-5-1',`${key}장조의 2-5-1에서 코드 유형의 순서는?`,'m7 → 7 → maj7',['m7 → 7 → maj7','m7♭5 → 7 → m7','maj7 → m7 → 7','7 → m7 → maj7'],`장조 2-5-1의 기본 유형은 m7 → 7 → maj7이다.`,i);
    if(i%3===1)return ox(`2-4-${i}`,'세컨더리 도미넌트','세컨더리 도미넌트는 목표 코드로 진행하려는 일시적인 V7 기능을 만든다.',true,'목표 코드의 도미넌트를 빌려 강한 해결감을 만든다.');
    return ox(`2-4-${i}`,'모달 인터체인지','모달 인터체인지는 같은 으뜸음을 가진 평행조나 모드에서 코드를 빌려올 수 있다.',true,'같은 토닉을 공유하는 모드 사이의 차용이 핵심이다.');
  }
  const tone=pick(NON_CHORD_TONES,i);
  if(i%3===0)return mcq(`2-5-${i}`,'비화성음',`다음 중 비화성음의 종류에 해당하는 것은?`,tone,NON_CHORD_TONES,`${tone}은 화음 밖의 음을 설명하는 비화성음 유형이다.`,i);
  if(i%3===1)return ox(`2-5-${i}`,'분수 코드','C/E에서 베이스음은 E이다.',true,'슬래시 뒤의 음이 지정된 베이스음이다.');
  return ox(`2-5-${i}`,'보이스 리딩','공통음을 유지하고 각 성부의 이동을 줄이면 일반적으로 매끄러운 보이스 리딩이 된다.',true,'최소 이동과 공통음 유지는 기본적인 보이스 리딩 원리다.');
}

function diverseQuestion(book,level,i){
  const branch=i%5;if(branch<2)return null;const root=i%12,target=(root+(i*5)%12)%12,key=pick(MAJOR_KEYS,i),degree=i%7;
  if(book===1){
    if(level===1){if(branch===2)return mcq(`1-1-${i}`,'음이름과 반음',`${NOTES[root]}에서 반음 아래의 음은?`,NOTES[(root+11)%12],NOTES,'반음 한 칸 아래의 음을 찾는다.',i);if(branch===3)return ox(`1-1-${i}`,'변화표','♯은 원래 음을 반음 높인다.',true,'올림표는 음높이를 반음 올린다.');return mcq(`1-1-${i}`,'이명동음','건반에서 C♯과 같은 높이의 음은?','D♭',['D♭','D','B♯','E♭'],'C♯과 D♭은 표기는 다르지만 같은 건반을 가리킨다.',i)}
    if(level===2){if(branch===2)return mcq(`1-2-${i}`,'음정 계산',`${NOTES[root]}에서 위로 ${(i*5)%12}반음 이동한 음은?`,NOTES[target],NOTES,`${NOTES[root]}에서 반음 수를 세면 ${NOTES[target]}에 도착한다.`,i);if(branch===3)return ox(`1-2-${i}`,'코드 전위','코드의 전위는 베이스음을 바꾸지만 코드의 기본 성질은 유지한다.',true,'구성음이 같다면 전위되어도 코드의 정체성은 유지된다.');const qualities=[['1 3 5','Major'],['1 ♭3 5','minor'],['1 3 ♯5','augmented'],['1 ♭3 ♭5','diminished']],q=pick(qualities,i);return mcq(`1-2-${i}`,'3화음 분석',`구성 공식 ${q[0]}에 해당하는 3화음은?`,q[1],qualities.map(x=>x[1]),`${q[0]}은 ${q[1]} 3화음의 공식이다.`,i)}
    if(level===3){if(branch===2){const count=Math.abs(key[1]),mark=key[1]>=0?'♯':'♭';return mcq(`1-3-${i}`,'조표 역추론',`${count?`${mark} ${count}개`:'조표 없음'}인 장조는?`,key[0],MAJOR_KEYS.map(x=>x[0]),`해당 조표의 장조는 ${key[0]}장조다.`,i)}if(branch===3)return mcq(`1-3-${i}`,'관계조 역추론',`${key[2]}의 관계장조는?`,key[0],MAJOR_KEYS.map(x=>x[0]),`${key[2]}과 ${key[0]}장조는 같은 조표를 쓴다.`,i);return ox(`1-3-${i}`,'Scale structure','Natural minor의 6도와 7도는 Major scale보다 각각 반음 낮다.',true,'Natural minor의 공식은 1 2 ♭3 4 5 ♭6 ♭7이다.')}
    if(level===4){const formulas=[['1 3 5 7','maj7'],['1 3 5 ♭7','7'],['1 ♭3 5 ♭7','m7'],['1 ♭3 ♭5 ♭7','m7♭5']],q=pick(formulas,i);if(branch===2)return mcq(`1-4-${i}`,'코드 공식 역추론',`${q[0]} 공식의 코드 유형은?`,q[1],formulas.map(x=>x[1]),`${q[0]}은 ${q[1]}의 구성 공식이다.`,i);if(branch===3)return mcq(`1-4-${i}`,'기능화성','메이저 키의 V도 7화음 유형은?','7',['maj7','m7','7','m7♭5'],'V도는 도미넌트 기능의 7화음이다.',i);return ox(`1-4-${i}`,'다이아토닉','메이저 다이아토닉 7화음의 VII도는 m7♭5이다.',true,'VII도는 반감7화음이다.')}
    if(branch===2)return mcq(`1-5-${i}`,'텐션 적용','도미넌트 7화음에 장9도를 더한 표기는?','9',['add9','maj9','9','6'],'도미넌트7에 장9도를 더하면 9 코드로 표기한다.',i);if(branch===3)return ox(`1-5-${i}`,'어보이드 노트','텐션은 코드톤과의 단9도 충돌을 확인해야 한다.',true,'단9도 충돌은 사용 가능한 텐션 판단의 중요한 기준이다.');return mcq(`1-5-${i}`,'복합음정','텐션 11을 단순음정으로 바꾸면?','4도',['2도','3도','4도','6도'],'11도에서 옥타브인 7을 빼면 4도다.',i)
  }
  if(level===1){if(branch===2)return mcq(`2-1-${i}`,'모드 특징음','장음계보다 4도가 반음 높은 모드는?','Lydian',MODES.map(x=>x[0]),'Lydian의 특징은 ♯4다.',i);if(branch===3)return mcq(`2-1-${i}`,'모드 비교','장음계보다 7도가 반음 낮은 모드는?','Mixolydian',MODES.map(x=>x[0]),'Mixolydian 공식은 1 2 3 4 5 6 ♭7이다.',i);return ox(`2-1-${i}`,'모드 중심음','같은 음 집합을 사용해도 중심음이 달라지면 모드의 기능과 울림이 달라진다.',true,'모드는 단순한 음 목록뿐 아니라 중심음이 중요하다.')}
  if(level===2){if(branch===2)return mcq(`2-2-${i}`,'Altered 스케일','Altered 스케일과 연결되는 대표 코드 기능은?','altered dominant',['major tonic','minor tonic','altered dominant','sus tonic'],'Altered는 변화 텐션을 가진 도미넌트에 사용한다.',i);if(branch===3)return mcq(`2-2-${i}`,'Lydian dominant','Lydian dominant의 대표 특징은?','장3도 · ♯4 · ♭7',['♭3 · ♭6','장3도 · ♯4 · ♭7','♭2 · ♭5','장7도 · 완전4도'],'Lydian dominant는 Lydian의 ♯4와 dominant의 ♭7을 함께 가진다.',i);return ox(`2-2-${i}`,'코드 스케일','m7♭5에는 Locrian ♮2가 대표적인 선택지가 될 수 있다.',true,'Locrian ♮2는 재즈 마이너의 6번째 모드로 m7♭5에 연결된다.')}
  if(level===3){if(branch===2)return mcq(`2-3-${i}`,'텐션 판별','maj7 코드에서 대표적으로 사용할 수 있는 텐션 조합은?','9 · 13',['♭9 · ♭13','9 · 13','♯9 · ♭9','♭5 · ♯5'],'maj7에서는 9와 13이 대표적인 색채 텐션이다.',i);if(branch===3)return ox(`2-3-${i}`,'코드톤 충돌','어떤 음이 조성 안에 있어도 코드톤과 강하게 충돌하면 어보이드 노트가 될 수 있다.',true,'다이아토닉 여부와 코드톤과의 간격을 함께 봐야 한다.');return mcq(`2-3-${i}`,'다이아토닉 기능',`메이저 키의 ${degree+1}도 7화음 유형은?`,DIATONIC_MAJOR[degree],DIATONIC_MAJOR,`${degree+1}도의 유형은 ${DIATONIC_MAJOR[degree]}이다.`,i)}
  if(level===4){if(branch===2)return mcq(`2-4-${i}`,'진행의 목표','장조 2-5-1에서 V7이 해결되는 목표는?','Imaj7',['Imaj7','IIm7','IVmaj7','VIm7'],'도미넌트 V7은 토닉 Imaj7으로 해결된다.',i);if(branch===3)return ox(`2-4-${i}`,'대리 도미넌트','트라이톤 대리는 원래 도미넌트와 같은 트라이톤을 공유한다.',true,'공유하는 트라이톤 때문에 비슷한 해결 기능을 낸다.');return mcq(`2-4-${i}`,'모달 인터체인지','장조에서 평행단조의 ivm을 빌려오는 기법은?','모달 인터체인지',['세컨더리 도미넌트','모달 인터체인지','페달 포인트','온음계 전조'],'평행 모드에서 코드를 차용하는 방식이다.',i)}
  if(branch===2)return mcq(`2-5-${i}`,'슬래시 코드 분석','G/B의 지정 베이스음은?','B',['G','B','D','F♯'],'슬래시 뒤의 B가 베이스음이다.',i);if(branch===3)return ox(`2-5-${i}`,'보이스 리딩','각 성부를 가능한 가까운 코드톤으로 이동시키면 대체로 연결이 매끄러워진다.',true,'최소 이동은 보이스 리딩의 기본 원리다.');return mcq(`2-5-${i}`,'비화성음 구별','강박에서 앞 화음의 음이 유지되었다가 순차 해결되는 비화성음은?','계류음',NON_CHORD_TONES,'계류음은 앞 화음의 음이 지속되어 불협을 만든 뒤 순차 해결된다.',i)
}

function scenarioQuestion(book,level,i){
  if(level<4)return null;const key=pick(MAJOR_KEYS,i),root=i%12,degree=i%7;
  if(book===1&&level===4){const quality=DIATONIC_MAJOR[degree];return mcq(`1-4-${i}`,'상황형 · 다이아토닉',`${key[0]}장조 곡에서 ${degree+1}도 위에 7화음을 쌓았다. 예상되는 코드 유형은?`,quality,DIATONIC_MAJOR,`메이저 다이아토닉의 ${degree+1}도 7화음은 ${quality}이다.`,i)}
  if(book===1&&level===5){const types=[['9','1 3 5 ♭7 9'],['maj9','1 3 5 7 9'],['m9','1 ♭3 5 ♭7 9'],['13','1 3 5 ♭7 9 13']],t=types[Math.floor(i/12)%types.length],contexts=['편곡자가 코드의 기본 성질을 유지하며 텐션을 추가하려 한다.','멜로디의 텐션과 충돌하지 않도록 코드톤을 확인하려 한다.','보이싱에서 5도를 생략하더라도 핵심 성질을 표시하려 한다.'],context=pick(contexts,i);return mcq(`1-5-${i}`,'상황형 · 텐션코드',`${context} ${NOTES[root]}${t[0]}의 핵심 구성 공식은?`,t[1],types.map(x=>x[1]),`${t[0]}의 핵심 공식은 ${t[1]}이다.`,i)}
  if(book===2&&level===4){const cases=[['V7/V','세컨더리 도미넌트'],['♭VIImaj7','모달 인터체인지'],['subV7/I','트라이톤 대리'],['IIm7 → V7 → Imaj7','2-5-1']],c=cases[Math.floor(i/12)%cases.length];return mcq(`2-4-${i}`,'상황형 · 코드 진행',`${key[0]}장조 편곡에서 ${c[0]}을 사용했다. 가장 직접적인 설명은?`,c[1],cases.map(x=>x[1]),`${c[0]}은 ${c[1]}의 대표적인 사례다.`,i)}
  const scenarioRoot=Math.floor(i/3)%12,third=NOTES[(scenarioRoot+4)%12],fifth=NOTES[(scenarioRoot+7)%12],slash=`${NOTES[scenarioRoot]}/${third}`;if(i%3===0)return mcq(`2-5-${i}`,'상황형 · 보이싱',`베이스가 ${third}음을 유지하고 상부 성부가 ${NOTES[scenarioRoot]} 메이저를 연주한다. 적절한 표기는?`,slash,[slash,`${NOTES[scenarioRoot]}/${fifth}`,`${third}/${NOTES[scenarioRoot]}`,`${NOTES[scenarioRoot]}sus4`],`루트는 ${NOTES[scenarioRoot]}, 베이스는 ${third}이므로 ${slash}이다.`,i);if(i%3===1){const next=NOTES[(scenarioRoot+5)%12];return mcq(`2-5-${i}`,'상황형 · 보이스 리딩',`${NOTES[scenarioRoot]}음에서 가장 작은 상행으로 ${next}음에 도착하는 이동은?`,'완전4도 상행',['반음 상행','장2도 상행','장3도 상행','완전4도 상행'],`${NOTES[scenarioRoot]}에서 ${next}까지는 5반음, 완전4도다.`,i)}const tone=NON_CHORD_TONES[Math.floor(i/3)%NON_CHORD_TONES.length];return mcq(`2-5-${i}`,'상황형 · 비화성음',`${NOTES[scenarioRoot]}장조 멜로디 분석에서 화음 밖의 음을 ${tone}으로 분류했다. 이 용어가 속하는 범주는?`,'비화성음',['코드톤','비화성음','조표','종지'],`${tone}은 비화성음의 세부 유형이다.`,i)
}

function audioQuestion(book,level,i){
  if(i%2===0){const semitones=pick([2,3,4,5,7,8,9,10,11],i+level+book),answer=INTERVALS[semitones];return{...mcq(`${book}-${level}-${i}`,'청음 · 음정','재생되는 두 음의 음정은?',answer,INTERVALS,`두 음의 거리는 ${semitones}반음으로 ${answer}이다.`,i),audio:{kind:'interval',notes:[0,semitones]}}}
  const qualities=[['Major',[0,4,7]],['minor',[0,3,7]],['augmented',[0,4,8]],['diminished',[0,3,6]]],q=pick(qualities,i+level+book);return{...mcq(`${book}-${level}-${i}`,'청음 · 3화음','재생되는 3화음의 성질은?',q[0],qualities.map(x=>x[0]),`${q[0]} 3화음의 음정 구조를 들을 수 있다.`,i),audio:{kind:'chord',notes:q[1]}}
}

function extensionQuestion(book,level,i){
  const branch=i%5,root=i%12,note=NOTES[root];
  if(book===1&&level===1){
    if(branch===0){const signs=[['𝄪','온음 높인다'],['𝄫','온음 낮춘다'],['♮','앞선 변화표를 취소한다'],['♯','반음 높인다']],s=pick(signs,i);return tagged(mcq(`1-1-${i}`,'변화표 심화',`${s[0]}의 정확한 기능은?`,s[1],signs.map(x=>x[1]),`${s[0]}은 음을 ${s[1]}.`,i),'advanced-accidental')}
    if(branch===1){const meters=[['4/4','4분음표가 한 마디에 4박'],['3/4','4분음표가 한 마디에 3박'],['6/8','8분음표가 한 마디에 6개'],['2/4','4분음표가 한 마디에 2박']],m=pick(meters,i);return tagged(mcq(`1-1-${i}`,'박자표',`${m[0]}박자의 뜻은?`,m[1],meters.map(x=>x[1]),`${m[0]}는 ${m[1]}을 뜻한다.`,i),'meter')}
    if(branch===2){const dotted=[['점4분음표','8분음표','3'],['점2분음표','4분음표','3'],['점8분음표','16분음표','3']],d=pick(dotted,i);return tagged(mcq(`1-1-${i}`,'점음표 계산',`${d[0]} 하나는 ${d[1]} 몇 개와 같은가?`,d[2],['1','2','3','4'],`${d[0]}는 ${d[1]} ${d[2]}개 길이다.`,i),'dotted-value')}
    if(branch===3)return tagged(mcq(`1-1-${i}`,'반음계',`${note}에서 시작해 모든 반음을 차례로 사용하는 음계는?`,'반음계',['온음계','반음계','오음음계','블루스 음계'],'12개의 반음을 순서대로 사용하는 음계는 반음계다.',i),'chromatic-scale');
    return tagged(ox(`1-1-${i}`,'임시표의 범위','일반적으로 임시표는 같은 마디 안의 같은 높이 음에 효력이 지속된다.',true,'마디가 바뀌면 임시표의 효력은 보통 끝난다.'),'accidental-scope');
  }
  if(book===1&&level===2){
    if(branch===0){const inversions=[['장3도','단6도'],['단3도','장6도'],['완전4도','완전5도'],['장2도','단7도']],v=pick(inversions,i);return tagged(mcq(`1-2-${i}`,'음정 전위',`${v[0]}를 전위한 음정은?`,v[1],inversions.map(x=>x[1]),`${v[0]}와 ${v[1]}의 도수 합은 9다.`,i),'interval-inversion')}
    if(branch===1){const structures=[['장3도+단3도','Major'],['단3도+장3도','minor'],['장3도+장3도','augmented'],['단3도+단3도','diminished']],s=pick(structures,i);return tagged(mcq(`1-2-${i}`,'3화음 음정 구조',`${s[0]} 구조의 3화음은?`,s[1],structures.map(x=>x[1]),`${s[0]}은 ${s[1]} 3화음이다.`,i),'third-stack')}
    if(branch===2)return tagged(mcq(`1-2-${i}`,'장·단 변환','Major 3화음을 minor로 바꾸려면 어느 음을 변화시키는가?','3음을 반음 낮춘다',['근음을 반음 낮춘다','3음을 반음 낮춘다','5음을 반음 높인다','5음을 반음 낮춘다'],'장3도를 단3도로 바꾸려면 3음을 반음 낮춘다.',i),'major-minor-change');
    if(branch===3){const chords=[['E G C','C Major 제1전위'],['G C E','C Major 제2전위'],['C E G','C Major 기본위치'],['C E♭ G','C minor 기본위치']],c=pick(chords,i);return tagged(mcq(`1-2-${i}`,'구성음과 전위',`${c[0]}로 낮은 음부터 배열된 화음은?`,c[1],chords.map(x=>x[1]),`가장 낮은 음과 구성음을 함께 보면 ${c[1]}이다.`,i),'voicing-analysis')}
    return tagged(ox(`1-2-${i}`,'협화 음정','완전5도는 일반적으로 협화음정으로 분류한다.',true,'완전5도는 완전 협화음정에 속한다.'),'consonance');
  }
  if(book===2&&level===1){
    if(branch===0){const chars=[['♯4','Lydian'],['♭7','Mixolydian'],['장6도와 단3도','Dorian'],['♭2','Phrygian']],c=pick(chars,i);return tagged(mcq(`2-1-${i}`,'특징음 역추론',`${c[0]}가 대표 특징인 모드는?`,c[1],MODES.map(x=>x[0]),`${c[0]}는 ${c[1]}의 대표 특징이다.`,i),'mode-characteristic-reverse')}
    if(branch===1){const parents=[['D Dorian','C Major'],['E Phrygian','C Major'],['A Aeolian','C Major'],['B Locrian','C Major']],p=pick(parents,i);return tagged(mcq(`2-1-${i}`,'모드의 모음계',`${p[0]}와 같은 음을 사용하는 모음계는?`,p[1],['C Major','D Major','F Major','G Major'],`${p[0]}는 ${p[1]}의 음들을 사용한다.`,i),'parent-scale')}
    if(branch===2)return tagged(mcq(`2-1-${i}`,'모드 밝기','메이저 계열 모드 중 ♯4 때문에 가장 밝게 들리는 모드는?','Lydian',['Ionian','Dorian','Lydian','Mixolydian'],'Lydian은 장3도·장7도와 ♯4를 가진다.',i),'mode-brightness');
    if(branch===3)return tagged(mcq(`2-1-${i}`,'모드의 토닉 화음','Dorian 모드의 토닉 3화음 성질은?','minor',['Major','minor','augmented','diminished'],'Dorian은 ♭3을 가지므로 토닉 3화음은 minor다.',i),'modal-tonic');
    return tagged(ox(`2-1-${i}`,'평행 모드','C Ionian과 C Dorian은 같은 중심음 C를 공유하는 평행 모드다.',true,'중심음이 같고 음 구성이 다른 관계를 평행 모드라 한다.'),'parallel-mode');
  }
  if(book===2&&level===2){
    if(branch===0){const links=[['7(♯11)','Lydian dominant'],['maj7(♯5)','Lydian augmented'],['m7♭5','Locrian ♮2'],['altered dominant','Altered']],l=pick(links,i);return tagged(mcq(`2-2-${i}`,'코드 스케일 역추론',`${l[0]}에 연결되는 대표 모드는?`,l[1],links.map(x=>x[1]),`${l[0]}에는 ${l[1]}가 대표적이다.`,i),'chord-scale-reverse')}
    if(branch===1)return tagged(mcq(`2-2-${i}`,'Jazz minor 비교','자연단음계와 비교한 Jazz minor의 변화는?','6도와 7도를 반음 높인다',['2도와 3도를 높인다','4도만 높인다','6도와 7도를 반음 높인다','7도만 낮춘다'],'Jazz minor는 1 2 ♭3 4 5 6 7이다.',i),'jazz-minor-compare');
    if(branch===2)return tagged(mcq(`2-2-${i}`,'Altered 텐션','다음 중 Altered 스케일의 대표 변화 텐션 조합은?','♭9 · ♯9 · ♭5 · ♯5',['9 · 13','♯11 · 13','♭9 · ♯9 · ♭5 · ♯5','9 · ♯11'],'Altered는 변화된 9도와 5도를 폭넓게 포함한다.',i),'altered-set');
    if(branch===3)return tagged(mcq(`2-2-${i}`,'모드 도수 역추론','Jazz minor의 4번째 모드는?','Lydian dominant',JAZZ_MINOR_MODES,'Jazz minor의 4번째 모드는 Lydian dominant다.',i),'jazz-fourth-mode');
    return tagged(ox(`2-2-${i}`,'코드 스케일 선택','코드 스케일은 코드 기호뿐 아니라 기능과 해결 방향도 함께 고려해야 한다.',true,'같은 코드 기호도 기능에 따라 적절한 스케일이 달라질 수 있다.'),'scale-context');
  }
  return null;
}

function supplementalQuestion(book,level,i){
  const branch=i%10,variant=Math.floor(i/10),root=i%12,note=NOTES[root];
  if(book===1&&level===1){
    if(branch===5){const bars=[['4/4','4분음표','4'],['3/4','4분음표','3'],['6/8','8분음표','6'],['2/2','2분음표','2']],b=pick(bars,variant);return tagged(mcq(`1-1-${i}`,'마디 완성',`${b[0]} 한 마디를 ${b[1]}만으로 채우면 몇 개가 필요한가?`,b[2],['2','3','4','6'],`${b[0]}의 윗숫자는 한 마디에 들어가는 기준 박의 수를 뜻한다.`,i),'measure-fill')}
    if(branch===6){const rests=[['4분쉼표','8분쉼표','2'],['2분쉼표','4분쉼표','2'],['온쉼표','2분쉼표','2']],r=pick(rests,variant);return tagged(mcq(`1-1-${i}`,'쉼표 환산',`${r[0]} 하나와 같은 길이가 되려면 ${r[1]}가 몇 개 필요한가?`,r[2],['1','2','3','4'],`${r[0]} 하나는 ${r[1]} ${r[2]}개 길이다.`,i),'rest-value')}
    if(branch===7){const pairs=[['E–F','사이에 검은 건반이 없다'],['B–C','사이에 검은 건반이 없다'],['C–D','사이에 검은 건반이 있다'],['F–G','사이에 검은 건반이 있다']],p=pick(pairs,variant);return tagged(mcq(`1-1-${i}`,'건반 구조',`${p[0]}에 대한 올바른 설명은?`,p[1],['사이에 검은 건반이 없다','사이에 검은 건반이 있다','두 음은 같은 높이다','두 음 사이는 완전5도다'],`${p[0]}는 ${p[1]}.`,i),'keyboard-layout')}
    if(branch===8){const tied=[['4분음표 두 개','2박'],['2분음표와 4분음표','3박'],['8분음표 두 개','1박'],['온음표와 2분음표','6박']],t=pick(tied,variant);return tagged(mcq(`1-1-${i}`,'붙임줄 계산',`붙임줄로 연결한 ${t[0]}의 전체 길이는?`,t[1],['1박','2박','3박','6박'],`붙임줄은 연결된 음표의 길이를 합하므로 ${t[1]}이다.`,i),'tie-duration')}
    return tagged(ox(`1-1-${i}`,'세로줄과 마디',variant%2===0?'세로줄은 악보에서 마디의 경계를 구분한다.':'겹세로줄은 언제나 곡의 완전한 끝만을 뜻한다.',variant%2===0,variant%2===0?'세로줄 사이의 구간이 한 마디다.':'겹세로줄은 악곡의 구획이나 조표 변화에도 쓰일 수 있다.'),'barline')
  }
  if(book===1&&level===2){
    if(branch===5){const compound=[['9도','2도'],['10도','3도'],['11도','4도'],['13도','6도']],c=pick(compound,variant);return tagged(mcq(`1-2-${i}`,'복합음정 환산',`${c[0]}를 한 옥타브 안의 단순음정으로 바꾸면?`,c[1],compound.map(x=>x[1]),`${c[0]}에서 7을 빼면 ${c[1]}가 된다.`,i),'compound-interval')}
    if(branch===6){const changes=[['장3도에서 윗음을 반음 낮춘다','단3도'],['완전5도에서 윗음을 반음 낮춘다','감5도'],['단3도에서 윗음을 반음 높인다','장3도'],['완전4도에서 윗음을 반음 높인다','증4도']],c=pick(changes,variant);return tagged(mcq(`1-2-${i}`,'음정 변화',`${c[0]}면 어떤 음정이 되는가?`,c[1],changes.map(x=>x[1]),`반음 변화 뒤의 음정은 ${c[1]}다.`,i),'interval-alteration')}
    if(branch===7){const chords=[['C–E–G','C Major'],['D–F–A','D minor'],['B–D–F','B diminished'],['C–E–G♯','C augmented']],c=pick(chords,variant);return tagged(mcq(`1-2-${i}`,'실음 코드 분석',`${c[0]}의 세 음으로 이루어진 3화음은?`,c[1],chords.map(x=>x[1]),`근음부터 쌓인 음정 구조를 보면 ${c[1]}다.`,i),'spelled-triad')}
    if(branch===8){const bass=[['C Major','E','제1전위'],['C Major','G','제2전위'],['A minor','A','기본위치'],['D minor','A','제2전위']],b=pick(bass,variant);return tagged(mcq(`1-2-${i}`,'베이스로 전위 판별',`${b[0]}에서 ${b[1]}가 베이스라면?`,b[2],['기본위치','제1전위','제2전위','제3전위'],`${b[1]}의 코드 내 도수를 확인하면 ${b[2]}다.`,i),'bass-inversion')}
    const stacks=[['4+3반음','Major'],['3+4반음','minor'],['4+4반음','augmented'],['3+3반음','diminished']],s=pick(stacks,variant);return tagged(mcq(`1-2-${i}`,'반음 수로 3화음 판별',`아래 음정부터 ${s[0]}으로 쌓인 3화음은?`,s[1],stacks.map(x=>x[1]),`${s[0]} 구조는 ${s[1]} 3화음이다.`,i),'semitone-stack')
  }
  if(book===2&&level===1){
    if(branch===5){const formulas=MODES.map(x=>[x[2],x[0]]),f=pick(formulas,variant);return tagged(mcq(`2-1-${i}`,'공식으로 모드 찾기',`${f[0]} 공식을 가진 모드는?`,f[1],MODES.map(x=>x[0]),`이 음정 공식은 ${f[1]}이다.`,i),'mode-from-formula')}
    if(branch===6){const tonic=[['Ionian','Major'],['Dorian','minor'],['Locrian','diminished'],['Mixolydian','Major']],t=pick(tonic,variant);return tagged(mcq(`2-1-${i}`,'토닉 코드 성질',`${t[0]}의 1도 3화음 성질은?`,t[1],['Major','minor','augmented','diminished'],`${t[0]}의 1·3·5도를 쌓으면 ${t[1]}가 된다.`,i),'mode-tonic-quality')}
    if(branch===7){const comparisons=[['Ionian','Lydian','4도'],['Ionian','Mixolydian','7도'],['Aeolian','Dorian','6도'],['Aeolian','Phrygian','2도']],c=pick(comparisons,variant);return tagged(mcq(`2-1-${i}`,'평행 모드 비교',`${c[0]}과 ${c[1]}을 같은 토닉에서 비교할 때 달라지는 핵심 도수는?`,c[2],['2도','4도','6도','7도'],`${c[1]}의 특징은 ${c[0]}과 비교한 ${c[2]} 변화다.`,i),'parallel-comparison')}
    if(branch===8){const mood=[['밝고 떠 있는 ♯4 색채','Lydian'],['블루지한 Major와 ♭7','Mixolydian'],['minor 위의 밝은 장6도','Dorian'],['어두운 minor와 ♭2','Phrygian']],m=pick(mood,variant);return tagged(mcq(`2-1-${i}`,'사운드로 모드 추론',`${m[0]}를 의도할 때 가장 알맞은 모드는?`,m[1],MODES.map(x=>x[0]),`${m[0]}는 ${m[1]}의 대표적인 색채다.`,i),'mode-sound-context')}
    const relatives=[['C Major 음을 D 중심으로 연주','D Dorian'],['C Major 음을 E 중심으로 연주','E Phrygian'],['C Major 음을 G 중심으로 연주','G Mixolydian'],['C Major 음을 A 중심으로 연주','A Aeolian']],r=pick(relatives,variant);return tagged(mcq(`2-1-${i}`,'연주 중심음 추론',`${r[0]}하면 어떤 모드가 되는가?`,r[1],relatives.map(x=>x[1]),`같은 음 집합에서 중심음을 바꾸면 ${r[1]}가 된다.`,i),'modal-center-application')
  }
  if(book===2&&level===2){
    if(branch===5){const parents=[['Dorian ♭2','Jazz minor 2도'],['Lydian augmented','Jazz minor 3도'],['Lydian dominant','Jazz minor 4도'],['Altered','Jazz minor 7도']],p=pick(parents,variant);return tagged(mcq(`2-2-${i}`,'파생 도수 연결',`${p[0]}는 어느 위치에서 파생되는가?`,p[1],parents.map(x=>x[1]),`${p[0]}는 ${p[1]}에서 시작한다.`,i),'jazz-mode-degree-link')}
    if(branch===6){const tensions=[['Lydian dominant','♯11 · ♭7'],['Altered','♭9 · ♯9'],['Mixolydian ♭6','♭6 · ♭7'],['Locrian ♮2','♮2 · ♭5']],t=pick(tensions,variant);return tagged(mcq(`2-2-${i}`,'특징 텐션 매칭',`${t[0]}의 특징음 조합은?`,t[1],tensions.map(x=>x[1]),`${t[0]}에는 ${t[1]}가 포함된다.`,i),'jazz-tension-match')}
    if(branch===7){const symbols=[['7alt','Altered'],['7(♯11)','Lydian dominant'],['maj7(♯5)','Lydian augmented'],['m7♭5','Locrian ♮2']],s=pick(symbols,variant);return tagged(mcq(`2-2-${i}`,'코드 기호 적용',`${s[0]} 코드에서 우선 검토할 스케일은?`,s[1],JAZZ_MINOR_MODES,`${s[0]}에는 ${s[1]}가 대표적으로 연결된다.`,i),'symbol-to-scale')}
    if(branch===8){const formulas=JAZZ_MINOR_MODES.map((name,index)=>[JAZZ_MINOR_FORMULAS[index],name]),f=pick(formulas,variant);return tagged(mcq(`2-2-${i}`,'공식 역분석',`${f[0]} 공식을 보고 모드 이름을 고르면?`,f[1],JAZZ_MINOR_MODES,`${f[0]}은 ${f[1]}의 공식이다.`,i),'jazz-formula-reverse')}
    const uses=[['V7이 tonic minor로 강하게 해결되기 직전','Altered'],['dominant 7에서 ♯11 색채가 필요할 때','Lydian dominant'],['m7♭5에서 장2도를 살리고 싶을 때','Locrian ♮2'],['maj7에서 증5도 색채가 필요할 때','Lydian augmented']],u=pick(uses,variant);return tagged(mcq(`2-2-${i}`,'연주 상황별 선택',`${u[0]} 우선 고려할 스케일은?`,u[1],JAZZ_MINOR_MODES,`이 상황의 대표 선택은 ${u[1]}다.`,i),'scale-use-case')
  }
  return extensionQuestion(book,level,i)
}

// Each level now has ten musical concepts asked in three genuinely different ways:
// recall, practical application, and error checking. This keeps the deck varied while
// still letting the adaptive-review scheduler revisit the same underlying concept.
const ADVANCED_CONCEPTS={
  1:{
    3:[
      ['Major scale','Major scale의 도수 공식은?','1 2 3 4 5 6 7',['1 2 ♭3 4 5 ♭6 ♭7','1 2 ♭3 4 5 6 7','1 ♭2 ♭3 4 5 ♭6 ♭7'],'Major scale은 모든 장·단 음정을 변화 없이 사용한다.','키 안의 음을 찾을 때 으뜸음에서 이 공식을 순서대로 대입한다.'],
      ['Natural minor','Natural minor의 도수 공식은?','1 2 ♭3 4 5 ♭6 ♭7',['1 2 3 4 5 6 7','1 2 ♭3 4 5 6 7','1 2 ♭3 4 5 ♭6 7'],'Major scale과 비교하면 3·6·7도가 반음 낮다.','마이너 곡의 기본 음 집합과 다이아토닉 코드를 확인할 때 사용한다.'],
      ['Harmonic minor','Natural minor를 Harmonic minor로 바꿀 때 달라지는 도수는?','7도를 반음 높인다',['6도를 반음 높인다','3도를 반음 높인다','2도를 반음 낮춘다'],'7도를 높이면 으뜸음 아래에 leading tone이 생겨 V-i 해결이 강해진다.','마이너 키의 V7과 leading tone을 분석할 때 먼저 7도를 확인한다.'],
      ['Melodic minor','상행 Melodic minor가 Natural minor와 다른 점은?','6도와 7도를 반음 높인다',['3도와 6도를 높인다','7도만 높인다','2도와 7도를 낮춘다'],'상행형은 1 2 ♭3 4 5 6 7의 구조를 가진다.','선율이 상행할 때 6도와 7도의 진행이 자연스러운지 확인한다.'],
      ['Relative key','C Major의 Relative minor는?','A minor',['C minor','E minor','D minor'],'Relative key는 같은 조표를 공유하며 장조의 6도에서 시작한다.','조표는 그대로인데 중심음이 바뀌는 곡을 분석할 때 적용한다.'],
      ['Parallel key','C Major의 Parallel minor는?','C minor',['A minor','E minor','F minor'],'Parallel key는 같은 tonic을 공유하고 조표와 음 구성이 달라진다.','같은 으뜸음의 장·단조 색채를 비교하거나 차용화음을 찾을 때 쓴다.'],
      ['Sharp order','조표에 ♯이 붙는 순서는?','F C G D A E B',['B E A D G C F','C D E F G A B','F G A B C D E'],'5도권을 따라 F부터 차례로 ♯이 추가된다.','악보의 ♯ 개수로 Key를 빠르게 판별할 때 이 순서를 사용한다.'],
      ['Flat order','조표에 ♭이 붙는 순서는?','B E A D G C F',['F C G D A E B','C B A G F E D','B A G F E D C'],'♭의 순서는 ♯ 순서의 역방향이다.','마지막에서 두 번째 ♭을 보고 장조 Key를 찾는 규칙과 함께 활용한다.'],
      ['Leading tone','Major scale에서 tonic으로 반음 해결하려는 도수는?','7도',['2도','4도','6도'],'7도는 tonic 바로 아래의 반음이어서 강한 상행 해결 성향을 가진다.','멜로디나 V 코드에서 7도가 1도로 해결되는지 귀와 악보로 확인한다.'],
      ['Circle of fifths','5도권을 시계 방향으로 한 칸 이동하면 일반적으로 어떻게 되는가?','♯이 하나 늘어난다',['♭이 두 개 늘어난다','조표가 사라진다','♭이 하나 늘어난다'],'시계 방향은 으뜸음이 완전5도 올라가며 ♯ 계열 조표가 하나씩 늘어난다.','가까운 Key로 전조하거나 공통 코드를 찾을 때 인접한 위치를 살핀다.']
    ],
    4:[
      ['Diatonic 7th','Major key의 다이아토닉 7화음 순서는?','maj7 m7 m7 maj7 7 m7 m7♭5',['maj7 m7 maj7 7 m7 m7 m7♭5','m7 m7 maj7 maj7 7 m7 dim7','maj7 m7 m7 maj7 m7 7 m7♭5'],'Major scale 각 음 위에 3도씩 네 음을 쌓으면 이 순서가 된다.','Key 안의 코드 후보를 찾을 때 도수와 코드 성질을 함께 읽는다.'],
      ['Tonic function','Major key에서 tonic 기능에 속하는 대표 도수는?','I · III · VI',['II · IV','V · VII','II · V · VI'],'I·III·VI는 tonic 코드와 공통음이 많아 안정 기능을 공유한다.','진행의 출발·도착과 대리코드를 찾을 때 이 그룹을 확인한다.'],
      ['Subdominant function','Major key에서 subdominant 기능의 대표 도수는?','II · IV',['I · III','V · VII','III · VI'],'II와 IV는 dominant로 향하는 준비 기능을 담당한다.','ii-V 또는 IV-V 진행에서 긴장이 만들어지는 순서를 분석한다.'],
      ['Dominant function','Major key에서 dominant 기능의 대표 도수는?','V · VII',['I · VI','II · IV','III · VI'],'V와 VII는 leading tone과 불안정한 음정을 포함해 tonic 해결을 요구한다.','V-I나 vii°-I에서 성부가 반음으로 해결되는지 확인한다.'],
      ['Dominant seventh','Major key의 V도 7화음 유형은?','7',['maj7','m7','m7♭5'],'V7은 장3화음에 단7도를 더한 dominant seventh다.','3음과 7음이 만드는 tritone의 해결 방향을 코드폼에서도 의식한다.'],
      ['Leading-tone chord','Major key의 VII도 7화음 유형은?','m7♭5',['maj7','7','m7'],'VII도 위에는 1 ♭3 ♭5 ♭7 구조의 half-diminished 화음이 생긴다.','V7의 일부 음을 공유하는 dominant 대리 기능으로 해석할 수 있다.'],
      ['First inversion','7화음에서 3음이 bass이면 어떤 전위인가?','제1전위',['기본위치','제2전위','제3전위'],'bass에 놓인 코드톤이 3음이면 제1전위다.','슬래시 코드의 오른쪽 bass음을 코드 구성음과 대조해 판별한다.'],
      ['Second inversion','7화음에서 5음이 bass이면 어떤 전위인가?','제2전위',['기본위치','제1전위','제3전위'],'bass에 5음이 오면 제2전위다.','기타의 가장 낮은 실제 울림음이 5음인지 확인한다.'],
      ['Third inversion','7화음에서 7음이 bass이면 어떤 전위인가?','제3전위',['기본위치','제1전위','제2전위'],'네 음 화음의 7음이 bass에 놓인 형태가 제3전위다.','7음이 아래 성부에서 다음 코드의 3음으로 하행하는 흐름을 살핀다.'],
      ['Authentic cadence','가장 전형적인 authentic cadence의 진행은?','V → I',['IV → I','V → vi','ii → IV'],'dominant가 tonic으로 해결되며 조성이 가장 분명하게 확정된다.','마지막 두 코드의 bass와 leading tone이 tonic으로 해결되는지 들어 본다.']
    ],
    5:[
      ['Ninth','텐션 9를 한 옥타브 안으로 줄이면?','2도',['3도','4도','6도'],'복합음정 9도에서 7을 빼면 단순음정 2도가 된다.','코드폼에서 9음과 루트가 단9도로 붙지 않는지 확인한다.'],
      ['Eleventh','텐션 11을 한 옥타브 안으로 줄이면?','4도',['2도','5도','6도'],'11도는 한 옥타브 위의 4도다.','Major 계열 코드에서는 3음과 11의 단9도 충돌을 우선 점검한다.'],
      ['Thirteenth','텐션 13을 한 옥타브 안으로 줄이면?','6도',['4도','5도','7도'],'13도는 한 옥타브 위의 6도다.','dominant 보이싱에서 13이 ♭7과 함께 색채를 만드는지 들어 본다.'],
      ['Dominant 9','9 코드의 핵심 도수 공식은?','1 3 5 ♭7 9',['1 3 5 7 9','1 ♭3 5 ♭7 9','1 3 5 6 9'],'dominant 7 구조에 9를 더한 화음이다.','기타에서는 3음·♭7을 남기고 필요하면 5음을 생략해 기능을 보존한다.'],
      ['Major 9','maj9 코드의 핵심 도수 공식은?','1 3 5 7 9',['1 3 5 ♭7 9','1 ♭3 5 ♭7 9','1 3 5 7 ♭9'],'maj7에 장9도를 더한 구조다.','7음과 9음이 멜로디와 충돌하지 않는 포지션을 선택한다.'],
      ['Minor 9','m9 코드의 핵심 도수 공식은?','1 ♭3 5 ♭7 9',['1 3 5 7 9','1 3 5 ♭7 9','1 ♭3 ♭5 ♭7 9'],'m7에 장9도를 더해 minor 성질과 부드러운 확장을 함께 만든다.','♭3과 ♭7을 우선 확보한 뒤 9음을 위 성부에 배치한다.'],
      ['Dominant 13','13 코드의 기능을 가장 분명히 하는 핵심음 조합은?','3 · ♭7 · 13',['1 · 4 · 5','♭3 · 5 · 7','2 · 4 · 6'],'3음과 ♭7이 dominant 기능을, 13이 확장 색채를 만든다.','음 수가 제한된 기타에서는 루트나 5음을 생략하고 이 핵심음을 남길 수 있다.'],
      ['Avoid note','일반적인 avoid note 판단의 핵심 기준은?','중요 코드톤과 단9도 충돌',['루트와 완전5도','모든 장2도 관계','같은 음의 중복'],'강박에서 지속되는 단9도는 코드의 성질을 흐리거나 거친 충돌을 만들 수 있다.','멜로디 음을 길게 유지한 채 코드톤과 함께 울려 실제 충돌을 확인한다.'],
      ['Voicing omission','확장 코드 보이싱에서 가장 먼저 생략하기 쉬운 음은?','5음',['3음','7음','텐션'],'완전5도는 많은 코드에서 성질과 기능을 결정하는 정보량이 상대적으로 적다.','3음·7음·필요한 텐션을 우선 배치해 작은 손 모양으로 정리한다.'],
      ['Melody compatibility','텐션 코드를 선택하기 전에 가장 먼저 확인할 것은?','멜로디 음과 코드톤의 간격',['코드 이름의 글자 수','기타 줄의 개수','템포 표시만'],'같은 텐션도 멜로디와의 간격과 지속 위치에 따라 사용 가능성이 달라진다.','멜로디를 최고음으로 놓고 아래 코드폼을 바꾸어 가장 자연스러운 보이싱을 고른다.']
    ]
  },
  2:{
    3:[
      ['Ionian tensions','Ionian의 대표 available tension은?','9 · 13',['♭9 · ♭13','♯9 · ♯11','11 · ♭13'],'Ionian의 11은 장3도와 단9도로 충돌하기 쉬워 보통 주의한다.','maj7 코드 위에서 9·13을 길게 유지해 안정적인 색채를 확인한다.'],
      ['Dorian tensions','Dorian m7에서 대표적으로 사용할 수 있는 tension은?','9 · 11 · 13',['♭9 · 11 · ♭13','9 · ♯11 · 13','♯9 · 11 · ♭13'],'Dorian의 장6도는 m7 위에서 특징적인 13 tension이 된다.','minor vamp에서 13을 강조해 Aeolian과 다른 색채를 만든다.'],
      ['Phrygian tension','Phrygian m7에서 특히 주의할 음은?','♭9',['9','♯11','13'],'♭2는 루트와 단9도를 만들어 강박에서 길게 쓰면 충돌이 크다.','♭9는 경과음이나 짧은 장식음으로 처리하고 해결을 들어 본다.'],
      ['Lydian tension','Lydian maj7의 대표 특징 tension은?','♯11',['♭9','♭13','♯9'],'올라간 4도는 장3도와의 단9도 충돌을 피하면서 Lydian 색채를 만든다.','maj7 보이싱 위에 ♯11을 최고음으로 놓아 Ionian과 비교한다.'],
      ['Mixolydian tensions','Mixolydian 7의 대표 available tension은?','9 · 13',['♭9 · ♭13','♯9 · ♯11','11 · 13'],'자연 11은 장3도와 충돌하기 쉬우며 9와 13이 기본 확장음이다.','dominant vamp에서 3·♭7을 유지하고 9 또는 13을 추가한다.'],
      ['Aeolian tensions','Aeolian m7의 기본 tension 선택은?','9 · 11',['♭9 · ♯11','9 · 13','♯9 · ♭13'],'9와 11은 자연스럽고 ♭13은 기능과 보이싱에 따라 주의가 필요하다.','Dorian의 13과 Aeolian의 ♭13을 번갈아 연주해 차이를 익힌다.'],
      ['Locrian tensions','Locrian m7♭5의 특징을 살리는 tension은?','11 · ♭13',['9 · 13','♯11 · 13','♭9 · 7'],'♭5를 가진 코드 위에서 11과 ♭13이 모드의 색을 보완하며 ♭9는 루트와 충돌한다.','m7♭5 보이싱의 ♭5를 유지한 채 11을 선율음으로 시험한다.'],
      ['Minor ninth rule','available tension을 거르는 대표 기준은?','중요 코드톤과 단9도 충돌 여부',['완전5도 존재 여부만','루트 중복 여부만','음 이름의 철자 수'],'조성 안의 음이라도 중요 코드톤과 단9도면 강한 충돌을 만들 수 있다.','후보음을 한 옥타브 안으로 옮겨 각 코드톤과의 간격을 계산한다.'],
      ['Chord-scale context','코드 스케일을 선택할 때 함께 확인해야 할 것은?','조성 · 코드 기능 · 해결 방향',['코드 기호만','템포만','악기 종류만'],'같은 코드 기호도 앞뒤 진행과 기능에 따라 적합한 tension이 달라진다.','목표 코드와 다음 코드까지 연주해 스케일 음의 해결을 검증한다.'],
      ['Guide tones','7화음의 기능과 성질을 가장 간결하게 보여 주는 guide tones는?','3음 · 7음',['루트 · 5음','2음 · 6음','4음 · 5음'],'3음은 장·단 성질을, 7음은 maj7·dominant·minor7 차이를 결정한다.','기타에서 3음과 7음만 연결해 진행의 최소 보이스 리딩을 연습한다.']
    ],
    4:[
      ['Major ii-V-I','Major ii-V-I의 코드 유형 순서는?','m7 → 7 → maj7',['m7♭5 → 7 → m','maj7 → m7 → 7','7 → m7 → maj7'],'Major key의 II·V·I 위에 7화음을 쌓은 표준 진행이다.','각 코드의 3음과 7음을 반음 또는 온음의 최소 이동으로 연결한다.'],
      ['Minor ii-V-i','Minor ii-V-i의 대표 코드 유형 순서는?','m7♭5 → 7alt → m',['m7 → 7 → maj7','maj7 → 7 → m7','dim7 → maj7 → 7'],'minor의 iiø와 변화 dominant가 tonic minor로 강하게 해결된다.','V7alt의 변화 tension을 다음 m 코드톤으로 반음 해결한다.'],
      ['Secondary dominant','Secondary dominant의 핵심 기능은?','목표 코드의 일시적인 V7',['평행조의 IV','tonic의 대리만','조표를 영구 변경'],'다이아토닉 코드 하나를 잠시 tonic처럼 보고 그 앞에 V7을 둔다.','목표 코드의 루트에서 완전5도 위 코드를 dominant7으로 만든다.'],
      ['V of V','V/V가 해결하려는 목표 도수는?','V',['I','IV','vi'],'V도 코드를 잠시 tonic으로 보고 만든 dominant가 V/V다.','V/V의 3음이 다음 V 코드의 루트로 반음 해결되는지 확인한다.'],
      ['Tritone substitution','Tritone substitution이 원래 V7을 대신할 수 있는 이유는?','3음과 7음의 tritone을 공유한다',['루트가 같다','모든 음이 같다','같은 조표만 쓴다'],'두 dominant7의 guide tones가 enharmonic으로 같은 tritone을 이룬다.','대리 코드의 루트가 목표 tonic으로 반음 하행하는 bass 움직임을 들어 본다.'],
      ['Modal interchange','Modal interchange의 뜻은?','같은 tonic의 평행 모드에서 코드 차용',['관계조로 완전 전조','코드 순서를 역행','모든 코드를 dominant로 변경'],'중심음은 유지하면서 평행 장·단조나 모드의 코드를 빌려 색채를 바꾼다.','Major key에서 ivm·♭VI·♭VII 같은 차용 코드를 찾아 본다.'],
      ['Backdoor cadence','대표적인 backdoor cadence 진행은?','♭VII7 → I',['V7 → I','IV → V','ii → iii'],'♭VII7이 정통 V7과 다른 방향에서 tonic으로 부드럽게 접근한다.','♭VII7의 guide tones가 I 코드톤으로 어떻게 반음 이동하는지 확인한다.'],
      ['Turnaround','대표적인 turnaround 진행은?','I → VI → II → V',['I → IV → I','V → IV → I','II → III → IV'],'tonic에서 출발해 dominant로 돌아가 다음 구간의 I을 준비한다.','각 도수를 7화음으로 연주하며 VI와 II가 secondary dominant로 바뀌는 경우도 비교한다.'],
      ['Dominant resolution','V7에서 I로 갈 때 guide tones의 전형적 해결은?','3음은 tonic으로, 7음은 3음으로',['두 음 모두 그대로','3음은 5음으로, 7음은 루트로','두 음 모두 반음 상승'],'V7의 3음은 leading tone이고 7음은 하행 해결 성향을 가진다.','두 성부만 따로 연주해 서로 반대 방향의 반음 해결을 귀에 익힌다.'],
      ['Deceptive cadence','deceptive cadence의 대표 진행은?','V → vi',['V → I','IV → I','ii → V'],'dominant가 예상한 I 대신 공통음을 가진 vi로 진행해 종결을 미룬다.','V 다음에 I과 vi를 번갈아 연주해 기대와 우회의 차이를 느낀다.']
    ],
    5:[
      ['Slash chord','C/E에서 지정된 bass음은?','E',['C','G','B'],'슬래시 뒤의 음이 실제 최저음으로 지정된다.','기타의 가장 낮게 울리는 줄이 E인지 확인하고 불필요한 저음은 뮤트한다.'],
      ['Pedal point','화음이 바뀌어도 한 성부의 음을 지속하는 기법은?','pedal point',['passing tone','anticipation','escape tone'],'지속되는 음 주변에서 화성이 변하며 긴장과 통일감을 만든다.','개방현이나 bass음을 유지한 채 상부 코드폼만 바꾸어 연습한다.'],
      ['Passing tone','두 코드톤 사이를 순차 진행으로 잇는 비화성음은?','passing tone',['neighbor tone','suspension','appoggiatura'],'경과음은 한 코드톤에서 다른 코드톤으로 같은 방향의 순차 이동을 만든다.','스케일의 중간음을 약박에 넣고 양쪽 도착음이 코드톤인지 확인한다.'],
      ['Neighbor tone','코드톤에서 순차 이탈했다가 같은 음으로 돌아오는 음은?','neighbor tone',['passing tone','anticipation','pedal point'],'보조음은 출발음과 도착음이 같은 장식 구조다.','한 프렛 위나 아래를 거쳐 원래 코드톤으로 돌아오는 짧은 프레이즈를 만든다.'],
      ['Suspension','suspension의 전형적인 과정은?','준비 · 지속 · 순차 해결',['도약 · 지속 · 도약','순차 · 도약 · 반복','즉시 반복 · 종지'],'앞 화음의 코드톤이 다음 화음까지 남아 불협을 만든 뒤 순차 해결된다.','4-3 또는 9-8 suspension을 상부 성부에서 유지해 해결감을 듣는다.'],
      ['Anticipation','다음 화음의 코드톤을 화음보다 먼저 내는 비화성음은?','anticipation',['suspension','escape tone','pedal point'],'선행음은 다음 화음에 속할 음을 미리 들려주고 화음이 뒤따라 확인한다.','코드 전환 직전 약박에 다음 코드의 최고음을 먼저 연주한다.'],
      ['Appoggiatura','appoggiatura의 대표적인 접근과 해결은?','도약 접근 후 순차 해결',['순차 접근 후 도약 이탈','같은 음 반복','순차 접근 후 같은 방향 진행'],'전타음은 강박의 비화성음으로 도약해 들어와 순차적으로 코드톤에 해결된다.','멜로디의 강박 음이 코드톤으로 한 음 내려가거나 올라가는지 확인한다.'],
      ['Escape tone','escape tone의 대표적인 움직임은?','순차 접근 후 반대 방향 도약',['도약 접근 후 순차 해결','같은 음으로 복귀','한 음 지속'],'이탈음은 코드톤에서 순차 이동한 뒤 반대 방향으로 도약해 벗어난다.','짧은 선율을 만들고 접근·이탈 방향이 서로 반대인지 표시한다.'],
      ['Voice leading','매끄러운 voice leading의 기본 원리는?','공통음 유지와 최소 이동',['모든 성부를 같은 방향 도약','루트만 반복','각 음을 한 옥타브 이동'],'성부별 이동 거리를 줄이고 공통음을 유지하면 연결이 자연스럽다.','인접 코드폼에서 같은 손가락 음을 남기고 나머지만 가까운 음으로 이동한다.'],
      ['Reharmonization','reharmonization의 의미는?','멜로디를 유지하며 화음을 새롭게 구성',['멜로디를 삭제','박자만 변경','모든 음을 반음 상승'],'같은 선율 아래의 기능·bass·대리 코드를 바꾸어 새로운 진행을 만든다.','멜로디 음을 코드톤 또는 tension으로 포함하는 대체 코드를 여러 개 시험한다.']
    ]
  }
};

const VARIANT_LABELS=['개념 확인','연주 상황','오류 점검'];
const CONTEXTS=['악보를 분석하는 중이다.','기타 보이싱을 고르는 중이다.','코드 진행을 귀로 확인하는 중이다.','멜로디와 화음을 함께 편곡하는 중이다.'];
function enrichExplanation(question,book,level,application){
  const steps=level<=2?'먼저 기준음·도수·공식을 확인하고, 보기마다 달라지는 한 요소를 비교한다.':level===3?'먼저 tonic과 조표를 정한 뒤 스케일 도수와 코드톤의 관계를 차례로 확인한다.':level===4?'먼저 Key와 코드의 도수 기능을 찾고, bass와 guide tone의 해결 방향을 확인한다.':'먼저 코드의 3음·7음으로 성질과 기능을 잡고, 멜로디·텐션·성부 이동의 충돌을 확인한다.';
  return `${question.explanation} 판단 순서: ${steps} 연주·분석 적용: ${application||'정답을 실제 코드폼이나 짧은 진행에 대입하고, 앞뒤 음의 움직임까지 소리로 확인한다.'}`;
}
function varyQuestion(base,book,level,i,application){
  const variant=Math.floor(i/10)%3,family=`${base.family||`concept-${i%10}`}-${VARIANT_LABELS[variant]}`;
  let question={...base,id:`${book}-${level}-${i}`,family};
  if(variant===1)question={...question,topic:`상황형 · ${base.topic}`,question:`${pick(CONTEXTS,i)} ${base.question}`};
  if(variant===2&&base.type==='mcq'){
    const useCorrect=Math.floor(i/30)%2===0,claim=useCorrect?base.answer:base.choices.find(choice=>choice!==base.answer);
    question=ox(`${book}-${level}-${i}`,`판단형 · ${base.topic}`,`${base.question.replace(/\?$/,'')} 답을 “${claim}”이라고 판단했다. 이 판단은 옳다.`,useCorrect,base.explanation);
    question.family=family;
  }else if(variant===2){
    question={...question,topic:`판단형 · ${base.topic}`,question:`오류 점검: ${base.question}`};
  }
  question.explanation=enrichExplanation(question,book,level,application);
  return question;
}
function conceptQuestion(book,level,i){
  const data=ADVANCED_CONCEPTS[book][level][i%10],variant=Math.floor(i/10)%3;
  const [topic,prompt,answer,wrong,why,application]=data;
  const base=tagged(mcq(`${book}-${level}-${i}`,topic,prompt,answer,wrong,why,i),`core-${i%10+1}`);
  return varyQuestion(base,book,level,i,application);
}
function standardQuestion(book,level,i){
  if(level>=3)return conceptQuestion(book,level,i);
  // Re-seed every block so all ten concepts receive each of the three formats.
  const seed=(i%10)+Math.floor(i/30)*10;
  return varyQuestion(foundationQuestion(book,level,seed),book,level,i);
}
const makeBook=book=>Object.fromEntries([1,2,3,4,5].map(level=>{const count=level<=2?200:100;return[level,Array.from({length:count},(_,i)=>i>=count-10?(()=>{const q=audioQuestion(book,level,i);q.explanation=enrichExplanation(q,book,level,'첫 음을 기준으로 반음 수나 3화음의 3도 쌓임을 귀로 구분하고, 재생 뒤 건반이나 지판에서 같은 소리를 확인한다.');return q})():standardQuestion(book,level,i))]}));
export const THEORY_LIBRARY={1:makeBook(1),2:makeBook(2)};
export const THEORY_SCOPES={
  1:{title:'기초 화성학',subtitle:'음정부터 텐션코드까지',description:'기초악전 · 음정 · 3화음 · 조성과 음계 · 다이아토닉 · 7화음 · 텐션'},
  2:{title:'응용 화성학',subtitle:'모드부터 코드 진행까지',description:'모드 · 재즈 마이너 스케일 · 다이아토닉 텐션 · 세컨더리 도미넌트 · 2-5-1 · 모달 인터체인지 · 분수 코드 · 비화성음 · 보이스 리딩'}
};
export const THEORY_LEVELS={
  1:[['기초악전','음이름·변화표·음표·박자'],['음정과 3화음','온음·반음·음정·Major/minor/aug/dim'],['Key & Scales','조표·Relative key·Major/Natural minor'],['다이아토닉과 7화음','도수·코드 유형·전위'],['텐션과 종합','9·11·13·코드 해석']],
  2:[['모드의 기초','7개 메이저 파생 모드'],['응용 스케일','Jazz minor 모드·코드 스케일'],['다이아토닉 텐션','7th 코드·어베일러블 텐션'],['코드 진행','세컨더리 도미넌트·2-5-1·모달 인터체인지'],['종합 응용','분수 코드·비화성음·보이스 리딩·종지·리하모니제이션']]
};
