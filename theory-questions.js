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

const makeBook=(book,factory)=>Object.fromEntries([1,2,3,4,5].map(level=>[level,Array.from({length:100},(_,i)=>factory(level,i))]));
export const THEORY_LIBRARY={1:makeBook(1,book1),2:makeBook(2,book2)};
export const THEORY_SCOPES={
  1:{title:'기초 화성학',subtitle:'음정부터 텐션코드까지',description:'기초악전 · 음정 · 3화음 · 조성과 음계 · 다이아토닉 · 7화음 · 텐션'},
  2:{title:'응용 화성학',subtitle:'모드부터 코드 진행까지',description:'모드 · 재즈 마이너 스케일 · 다이아토닉 텐션 · 세컨더리 도미넌트 · 2-5-1 · 모달 인터체인지 · 분수 코드 · 비화성음 · 보이스 리딩'}
};
export const THEORY_LEVELS={
  1:[['기초악전','음이름·변화표·음표·박자'],['음정과 3화음','온음·반음·음정·Major/minor/aug/dim'],['조성과 음계','조표·관계조·장음계·단음계'],['다이아토닉과 7화음','도수·코드 유형·전위'],['텐션과 종합','9·11·13·코드 해석']],
  2:[['모드의 기초','7개 메이저 파생 모드'],['응용 스케일','Jazz minor 모드·코드 스케일'],['다이아토닉 텐션','7th 코드·어베일러블 텐션'],['코드 진행','세컨더리 도미넌트·2-5-1·모달 인터체인지'],['종합 응용','분수 코드·비화성음·보이스 리딩·종지·리하모니제이션']]
};
