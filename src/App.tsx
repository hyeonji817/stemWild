import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { animals } from './animals';
import type { Animal, Element } from './animals';
import { AnimalArt, AnimalDetails } from './components/Animal';
import { sexagenary } from './lib/calendar';
import SajuPage from './components/SajuPage';
import WildlifePage from './components/WildlifePage';
import MbtiPage from './components/MbtiPage';
import EndingCredits from './components/EndingCredits';

type Match = { animal: Animal; dateText?: string };
export default function App() {
 const getPage=()=>location.hash.startsWith('#mbti')?'mbti':location.hash.startsWith('#saju')?'saju':location.hash.startsWith('#wildlife')?'wildlife':'home';
 const [page,setPage]=useState(getPage);
 const [endingAnimal,setEndingAnimal]=useState<Animal|undefined>();
 useEffect(()=>{const update=()=>{const next=getPage();setPage(next);requestAnimationFrame(()=>{if(next==='home'){const id=location.hash.slice(1);if(id)document.getElementById(id)?.scrollIntoView();else window.scrollTo(0,0);}else window.scrollTo(0,0);});};addEventListener('hashchange',update);update();return()=>removeEventListener('hashchange',update)},[]);
 const [mode,setMode]=useState<'date'|'stem'>('date');
 const [birth,setBirth]=useState('');
 const [stem,setStem]=useState(0);
 const [filter,setFilter]=useState<Element|'all'>('all');
 const [match,setMatch]=useState<Match|null>(null);
 const [detail,setDetail]=useState<Animal|null>(null);
 const [copyStatus,setCopyStatus]=useState<'idle'|'copied'|'fallback'>('idle');
 const dialog=useRef<HTMLDialogElement>(null);
 const result=useRef<HTMLElement>(null);
 const today = new Date();
 const maxDate = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 useEffect(()=>{if(detail)dialog.current?.showModal();else dialog.current?.close()},[detail]);
 useEffect(()=>{if(match)result.current?.scrollIntoView({behavior:'smooth',block:'center'})},[match]);
 function choose(next:Match){setEndingAnimal(next.animal);setMatch(next);setCopyStatus('idle')}
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const [y,m,d]=birth.split('-').map(Number);const cycle=sexagenary(y,m,d);choose({animal:animals[cycle%10],dateText:`${y}년 ${m}월 ${d}일 · ${'갑을병정무기경신임계'[cycle%10]}${'자축인묘진사오미신유술해'[cycle%12]}일주 · 양력/자정 기준`})}
 const shareText=match ? `나의 stemwild는 ${match.animal.stem} · ${match.animal.name} ${match.animal.nick}! ${match.animal.trait}` : '';
 async function copy(){try{await navigator.clipboard.writeText(shareText);setCopyStatus('copied')}catch{setCopyStatus('fallback')}}
 return <><header><a className="logo" href="#">stemwild<span>✳</span></a><nav aria-label="주 메뉴"><a href="#find" aria-current={page==='home'?'page':undefined}>내 동물 찾기</a><a href="#saju" aria-current={page==='saju'?'page':undefined}>사주 풀이</a><a href="#mbti" aria-current={page==='mbti'?'page':undefined}>MBTI 코너</a><a href="#friends">캐릭터 친구들</a><a className="sub-nav" href="#wildlife" aria-current={page==='wildlife'?'page':undefined}>동물 정보</a></nav><span className="header-note">Born to be wild. Born to be you.</span></header><main>{page==='mbti'?<MbtiPage initialAnimal={endingAnimal||match?.animal} onAnimalChange={setEndingAnimal}/>:page==='saju'?<SajuPage onAnimalChange={setEndingAnimal}/>:page==='wildlife'?<WildlifePage/>:<><section className="hero"><div className="intro"><div className="eyebrow"><span className="spark">✳</span> YOUR NATURE, YOUR WILD</div><h1>태어난 날에 담긴,<br />나의 <span>야생</span>을 만나다.</h1><p>같은 지구, 조금 닮은 우리.<br />나의 일간과 연결된 특별한 동물 친구를 만나보세요.</p><a className="primary" href="#find">나의 야생 친구 찾기 <span>✳</span></a><div className="micro">가입 없이 가볍게 · 생년월일은 저장하지 않아요</div></div><div className="hero-art"><span className="art-label">MEET YOUR WILD SIDE</span><div id="hero-animal"><AnimalArt animal={animals[6]} /></div><span className="floating one">무심한 듯, 다정한</span><span className="floating two">경금 庚金 · 회색늑대</span><span className="art-star">✦</span><span className="art-bottom">A LITTLE WILD. A LOT LIKE YOU.</span></div></section><div className="ticker">TEN STEMS <span>✳</span> TEN WILD FRIENDS <span>✳</span> ONE OF A KIND YOU <span>✳</span> TEN STEMS <span>✳</span> TEN WILD FRIENDS</div>
 <section className="finder" id="find"><div><div className="eyebrow">FIND YOUR NATURE</div><h2>어떤 친구와<br />닮아 있을까요?</h2><p>태어난 날이 알려주는 작은 연결.<br />열 가지 야생 중 나만의 친구를 찾아보세요.</p><div className="privacy">◎ 입력한 정보는 서버로 전송하지 않아요.</div></div>
 <div className="form-box"><div className="tabs" aria-label="찾기 방식">
 <button aria-pressed={mode==='date'} aria-controls="date-panel" onClick={()=>setMode('date')}>생년월일로 찾기</button><button aria-pressed={mode==='stem'} aria-controls="stem-panel" onClick={()=>setMode('stem')}>일간을 알고 있어요</button></div>
 <form id="date-panel" hidden={mode!=='date'} onSubmit={submit}><label htmlFor="birth">생년월일 <span>양력 기준</span></label><input id="birth" type="date" min="1900-01-01" max={maxDate} value={birth} onInput={e=>setBirth(e.currentTarget.value)} onChange={e=>setBirth(e.target.value)} required /><p className="help">태어난 지역의 날짜 · 자정(00:00) 기준으로 계산해요.</p><button className="primary" type="submit">내 친구 만나기 <span>✳</span></button></form>
 <div id="stem-panel" hidden={mode!=='stem'}><label htmlFor="stem">나의 일간</label><select id="stem" value={stem} onChange={e=>setStem(Number(e.target.value))}>{animals.map((a,i)=><option key={a.stem} value={i}>{a.stem} {a.han} · {a.name}</option>)}</select><button className="primary" onClick={()=>choose({animal:animals[stem]})}>내 친구 만나기 <span>✳</span></button></div>
 <p className="form-foot">사주를 활용한 재미있는 상징 매칭이에요.<br />출생 시각·야자시 기준에 따라 만세력 결과와 다를 수 있어요.</p></div></section>
 {match && <section id="result" ref={result} aria-live="polite"><AnimalDetails animal={match.animal} />{match.dateText&&<p>{match.dateText}</p>}<button className="primary" onClick={copy}>{copyStatus==='copied'?'복사했어요!':copyStatus==='fallback'?'아래 문구를 선택해 복사해 주세요':'결과 문구 복사하기'} <span>✳</span></button>{copyStatus==='fallback'&&<p>{shareText}</p>}<a className="text-link result-mbti-link" href={`#mbti/${match.animal.type}`}>MBTI를 더해 나의 소개 카드 만들기</a><a className="text-link result-mbti-link" href="#ending">열 친구의 숲에서 만나기</a></section>}
 <section className="friends" id="friends"><div className="section-top"><div><div className="eyebrow">THE WILD CLUB</div><h2>열 가지 야생, 열 가지 나다움.</h2></div><p>조금씩 달라서, 모두 특별한 우리.<br />카드를 눌러 친구를 자세히 만나보세요.</p></div><div className="filters" aria-label="오행 필터">{(['all','목','화','토','금','수'] as const).map((el,i)=><button key={el} className={filter===el?'active':''} aria-pressed={filter===el} onClick={()=>setFilter(el)}>{['모든 친구','목 木','화 火','토 土','금 金','수 水'][i]}</button>)}</div>
 <div className="grid">{animals.filter(a=>filter==='all'||a.el===filter).map(a=><button key={a.stem} className="card" aria-label={a.stem+' '+a.name+' 자세히 보기'} onClick={()=>setDetail(a)}><div className="portrait" style={{background:a.color}}><span className="stem-badge">{a.stem} {a.han}</span><AnimalArt animal={a} /></div><div className="card-copy"><h3>{a.name}</h3><p>{a.trait}</p><span className="card-tag">{a.tags}</span></div></button>)}</div></section>
 <section className="story" id="story"><div className="eyebrow">SMALL CONNECTION, WILD POSSIBILITIES</div><h2>나를 알아가는 일이,<br />다른 생명을 알아가는 시작이 되도록.</h2><p>stemwild는 십천간의 상징과 야생동물의 매력을 연결한 캐릭터 프로젝트입니다.<br />익숙한 나의 이야기에서 시작해, 함께 살아가는 동물에게 관심이 닿기를 바라요.</p><div className="story-note">보전 이야기 안내 · 이곳의 매칭과 성격은 창작 설정입니다. 멸종위기 여부는 종·아종·지역 및 평가 체계에 따라 다릅니다. 회색늑대·페넥여우·담비 등을 전 세계적으로 동일한 멸종위기종으로 분류하지 않습니다.</div></section></>}<EndingCredits animal={endingAnimal}/></main><footer><a className="logo" href="#">stemwild<span>✳</span></a><p>나의 본성을 만나고, 야생의 내일을 생각하다.</p><span>© 2026 stemwild</span></footer>
 <dialog id="detail" ref={dialog} aria-label={detail?.name ?? '동물 소개'} onClose={()=>setDetail(null)} onClick={e=>{if(e.target!==e.currentTarget)return;const b=e.currentTarget.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)setDetail(null)}}><button className="close" aria-label="닫기" onClick={()=>setDetail(null)}>×</button>{detail&&<><AnimalDetails animal={detail} heading="MEET THE WILD" /><a className="text-link" href={`#wildlife/${detail.type}`} onClick={()=>setDetail(null)}>보전등급·서식지·실천 방법 보기</a></>}</dialog></>;
}
