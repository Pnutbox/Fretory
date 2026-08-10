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

function diverseQuestion(book,level,i){
  const branch=i%5;if(branch<2)return null;const root=i%12,target=(root+(i*5)%12)%12,key=pick(MAJOR_KEYS,i),degree=i%7;
  if(book===1){
    if(level===1){if(branch===2)return mcq(`1-1-${i}`,'음이름과 반음',`${NOTES[root]}에서 반음 아래의 음은?`,NOTES[(root+11)%12],NOTES,'반음 한 칸 아래의 음을 찾는다.',i);if(branch===3)return ox(`1-1-${i}`,'변화표','♯은 원래 음을 반음 높인다.',true,'올림표는 음높이를 반음 올린다.');return mcq(`1-1-${i}`,'이명동음','건반에서 C♯과 같은 높이의 음은?','D♭',['D♭','D','B♯','E♭'],'C♯과 D♭은 표기는 다르지만 같은 건반을 가리킨다.',i)}
    if(level===2){if(branch===2)return mcq(`1-2-${i}`,'음정 계산',`${NOTES[root]}에서 위로 ${(i*5)%12}반음 이동한 음은?`,NOTES[target],NOTES,`${NOTES[root]}에서 반음 수를 세면 ${NOTES[target]}에 도착한다.`,i);if(branch===3)return ox(`1-2-${i}`,'코드 전위','코드의 전위는 베이스음을 바꾸지만 코드의 기본 성질은 유지한다.',true,'구성음이 같다면 전위되어도 코드의 정체성은 유지된다.');const qualities=[['1 3 5','Major'],['1 ♭3 5','minor'],['1 3 ♯5','augmented'],['1 ♭3 ♭5','diminished']],q=pick(qualities,i);return mcq(`1-2-${i}`,'3화음 분석',`구성 공식 ${q[0]}에 해당하는 3화음은?`,q[1],qualities.map(x=>x[1]),`${q[0]}은 ${q[1]} 3화음의 공식이다.`,i)}
    if(level===3){if(branch===2){const count=Math.abs(key[1]),mark=key[1]>=0?'♯':'♭';return mcq(`1-3-${i}`,'조표 역추론',`${count?`${mark} ${count}개`:'조표 없음'}인 장조는?`,key[0],MAJOR_KEYS.map(x=>x[0]),`해당 조표의 장조는 ${key[0]}장조다.`,i)}if(branch===3)return mcq(`1-3-${i}`,'관계조 역추론',`${key[2]}의 관계장조는?`,key[0],MAJOR_KEYS.map(x=>x[0]),`${key[2]}과 ${key[0]}장조는 같은 조표를 쓴다.`,i);return ox(`1-3-${i}`,'음계 구조','자연단음계의 6도와 7도는 장음계보다 각각 반음 낮다.',true,'자연단음계 공식은 1 2 ♭3 4 5 ♭6 ♭7이다.')}
    if(level===4){const formulas=[['1 3 5 7','maj7'],['1 3 5 ♭7','7'],['1 ♭3 5 ♭7','m7'],['1 ♭3 ♭5 ♭7','m7♭5']],q=pick(formulas,i);if(branch===2)return mcq(`1-4-${i}`,'코드 공식 역추론',`${q[0]} 공식의 코드 유형은?`,q[1],formulas.map(x=>x[1]),`${q[0]}은 ${q[1]}의 구성 공식이다.`,i);if(branch===3)return mcq(`1-4-${i}`,'기능화성','메이저 키의 V도 7화음 유형은?','7',['maj7','m7','7','m7♭5'],'V도는 도미넌트 기능의 7화음이다.',i);return ox(`1-4-${i}`,'다이아토닉','메이저 다이아토닉 7화음의 VII도는 m7♭5이다.',true,'VII도는 반감7화음이다.')}
    if(branch===2)return mcq(`1-5-${i}`,'텐션 적용','도미넌트 7화음에 장9도를 더한 표기는?','9',['add9','maj9','9','6'],'도미넌트7에 장9도를 더하면 9 코드로 표기한다.',i);if(branch===3)return ox(`1-5-${i}`,'어보이드 노트','텐션은 코드톤과의 단9도 충돌을 확인해야 한다.',true,'단9도 충돌은 사용 가능한 텐션 판단의 중요한 기준이다.');return mcq(`1-5-${i}`,'복합음정','텐션 11을 단순음정으로 바꾸면?','4도',['2도','3도','4도','6도'],'11도에서 옥타브인 7을 빼면 4도다.',i)
  }
  if(level===1){if(branch===2)return mcq(`2-1-${i}`,'모드 특징음','장음계보다 4도가 반음 높은 모드는?','Lydian',MODES.map(x=>x[0]),'Lydian의 특징은 ♯4다.',i);if(branch===3)return mcq(`2-1-${i}`,'모드 비교','장음계보다 7도가 반음 낮은 모드는?','Mixolydian',MODES.map(x=>x[0]),'Mixolydian 공식은 1 2 3 4 5 6 ♭7이다.',i);return ox(`2-1-${i}`,'모드 중심음','같은 음 집합을 사용해도 중심음이 달라지면 모드의 기능과 울림이 달라진다.',true,'모드는 단순한 음 목록뿐 아니라 중심음이 중요하다.')}
  if(level===2){if(branch===2)return mcq(`2-2-${i}`,'Altered 스케일','Altered 스케일과 연결되는 대표 코드 기능은?','altered dominant',['major tonic','minor tonic','altered dominant','sus tonic'],'Altered는 변화 텐션을 가진 도미넌트에 사용한다.',i);if(branch===3)return mcq(`2-2-${i}`,'Lydian dominant','Lydian dominant의 대표 특징은?','장3도 · ♯4 · ♭7',['♭3 · ♭6','장3도 · ♯4 · ♭7','♭2 · ♭5','장7도 · 완전4도'],'Lydian dominant는 Lydian의 ♯4와 dominant의 ♭7을 함께 가진다.',i);return ox(`2-2-${i}`,'코드 스케일','m7♭5에는 Locrian ♮2가 대표적인 선택지가 될 수 있다.',true,'Locrian ♮2는 재즈 마이너의 6번째 모드로 m7♭5에 연결된다.')}
  if(level===3){if(branch===2)return mcq(`2-3-${i}`,'텐션 판별','maj7 코드에서 대표적으로 사용할 수 있는 텐션 조합은?','9 · 13',['♭9 · ♭13','9 · 13','♯9 · ♭9','♭5 · ♯5'],'maj7에서는 9와 13이 대표적인 색채 텐션이다.',i);if(branch===3)return ox(`2-3-${i}`,'코드톤 충돌','어떤 음이 조성 안에 있어도 코드톤과 강하게 충돌하면 어보이드 노트가 될 수 있다.',true,'다이아토닉 여부와 코드톤과의 간격을 함께 봐야 한다.');return mcq(`2-3-${i}`,'다이아토닉 기능',`메이저 키의 ${degree+1}도 7화음 유형은?`,DIATONIC_MAJOR[degree],DIATONIC_MAJOR,`${degree+1}도의 유형은 ${DIATONIC_MAJOR[degree]}이다.`,i)}
  if(level===4){if(branch===2)return mcq(`2-4-${i}`,'진행의 목표','장조 2-5-1에서 V7이 해결되는 목표는?','Imaj7',['Imaj7','IIm7','IVmaj7','VIm7'],'도미넌트 V7은 토닉 Imaj7으로 해결된다.',i);if(branch===3)return ox(`2-4-${i}`,'대리 도미넌트','트라이톤 대리는 원래 도미넌트와 같은 트라이톤을 공유한다.',true,'공유하는 트라이톤 때문에 비슷한 해결 기능을 낸다.');return mcq(`2-4-${i}`,'모달 인터체인지','장조에서 평행단조의 ivm을 빌려오는 기법은?','모달 인터체인지',['세컨더리 도미넌트','모달 인터체인지','페달 포인트','온음계 전조'],'평행 모드에서 코드를 차용하는 방식이다.',i)}
  if(branch===2)return mcq(`2-5-${i}`,'슬래시 코드 분석','G/B의 지정 베이스음은?','B',['G','B','D','F♯'],'슬래시 뒤의 B가 베이스음이다.',i);if(branch===3)return ox(`2-5-${i}`,'보이스 리딩','각 성부를 가능한 가까운 코드톤으로 이동시키면 대체로 연결이 매끄러워진다.',true,'최소 이동은 보이스 리딩의 기본 원리다.');return mcq(`2-5-${i}`,'비화성음 구별','강박에서 앞 화음의 음이 유지되었다가 순차 해결되는 비화성음은?','계류음',NON_CHORD_TONES,'계류음은 앞 화음의 음이 지속되어 불협을 만든 뒤 순차 해결된다.',i)
}

const makeBook=(book,factory)=>Object.fromEntries([1,2,3,4,5].map(level=>[level,Array.from({length:100},(_,i)=>diverseQuestion(book,level,i)||factory(level,i))]));
export const THEORY_LIBRARY={1:makeBook(1,book1),2:makeBook(2,book2)};
export const THEORY_SCOPES={
  1:{title:'기초 화성학',subtitle:'음정부터 텐션코드까지',description:'기초악전 · 음정 · 3화음 · 조성과 음계 · 다이아토닉 · 7화음 · 텐션'},
  2:{title:'응용 화성학',subtitle:'모드부터 코드 진행까지',description:'모드 · 재즈 마이너 스케일 · 다이아토닉 텐션 · 세컨더리 도미넌트 · 2-5-1 · 모달 인터체인지 · 분수 코드 · 비화성음 · 보이스 리딩'}
};
export const THEORY_LEVELS={
  1:[['기초악전','음이름·변화표·음표·박자'],['음정과 3화음','온음·반음·음정·Major/minor/aug/dim'],['조성과 음계','조표·관계조·장음계·단음계'],['다이아토닉과 7화음','도수·코드 유형·전위'],['텐션과 종합','9·11·13·코드 해석']],
  2:[['모드의 기초','7개 메이저 파생 모드'],['응용 스케일','Jazz minor 모드·코드 스케일'],['다이아토닉 텐션','7th 코드·어베일러블 텐션'],['코드 진행','세컨더리 도미넌트·2-5-1·모달 인터체인지'],['종합 응용','분수 코드·비화성음·보이스 리딩·종지·리하모니제이션']]
};
