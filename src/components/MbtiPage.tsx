import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { animals } from '../animals';
import type { Animal } from '../animals';
import { AnimalArt } from './Animal';
import { mbtiProfiles, isMbti } from '../mbti';
import type { MbtiType } from '../mbti';
import { sexagenary } from '../lib/calendar';

interface Identity {animal:Animal;mbti:MbtiType;name:string}
export default function MbtiPage({initialAnimal,onAnimalChange}:{initialAnimal?:Animal;onAnimalChange?:(animal:Animal)=>void}) {
 const linked=animals.findIndex(a=>a.type===location.hash.split('/')[1]);
 const [mbti,setMbti]=useState(''); const [name,setName]=useState('');
 const [mode,setMode]=useState<'stem'|'birth'>('stem');
 const [stem,setStem]=useState(linked>=0?String(linked):initialAnimal?String(animals.indexOf(initialAnimal)):'');
 const [birth,setBirth]=useState(''); const [identity,setIdentity]=useState<Identity|null>(null);
 const [intro,setIntro]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
 const output=useRef<HTMLDivElement>(null);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
 function submit(e:FormEvent){e.preventDefault();setNotice('');if(!isMbti(mbti)){setNotice('네 글자의 MBTI를 선택하거나 입력해 주세요.');return;}let index=Number(stem);if(mode==='birth'){const [y,m,d]=birth.split('-').map(Number);index=sexagenary(y,m,d)%10;}if(!Number.isInteger(index)||index<0||index>=animals.length||(mode==='stem'&&stem==='')){setNotice('나의 일간 동물을 골라주세요.');return;}const animal=animals[index];onAnimalChange?.(animal);const nick=name.trim()||'나';setIdentity({animal,mbti,name:nick});setIntro(`안녕하세요, ${nick}입니다. 저를 소개하는 친구는 ${animal.stem}의 ${animal.name} ${animal.nick}! ${mbtiProfiles[mbti].line} ${animal.trait} — 이런 모습도 저만의 이야기로 담아봤어요.`);requestAnimationFrame(()=>output.current?.scrollIntoView({behavior:'smooth',block:'start'}));}
 const profile=identity?mbtiProfiles[identity.mbti]:null;
 const shareText=identity?`${identity.name}의 stemwild\n${identity.mbti} × ${identity.animal.stem} · ${identity.animal.name}\n${intro}\n#stemwild #${identity.mbti} #${identity.animal.name}`:'';
 async function copy(){try{await navigator.clipboard.writeText(shareText);setNotice('자기소개 문구를 복사했어요. 원하는 곳에 붙여넣어 보세요.');}catch{setNotice('복사가 제한되어 있어요. 자기소개 입력칸의 문구를 직접 선택해 복사해 주세요.');}}
 async function download(){if(!identity||!profile)return;setBusy(true);setNotice('');try{
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw new Error();
  ctx.fillStyle=identity.animal.color;ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#fffefa';ctx.beginPath();ctx.roundRect(55,55,970,1240,45);ctx.fill();
  ctx.fillStyle='#253127';ctx.font='bold 36px sans-serif';ctx.fillText('stemwild ✳',105,125);ctx.font='bold 28px sans-serif';ctx.textAlign='right';ctx.fillText(`${identity.mbti} × ${identity.animal.stem}`,975,125);
  const image=new Image();image.src=`/animals/${identity.animal.type}.svg?v=5`;await image.decode();ctx.drawImage(image,340,155,400,400);
  ctx.textAlign='center';ctx.font='bold 46px sans-serif';ctx.fillText(`${identity.name}의 ${identity.animal.name}`,540,610,870);
  ctx.font='26px sans-serif';ctx.fillStyle='#5c6f45';ctx.fillText(profile.title,540,663,850);ctx.font='23px sans-serif';ctx.fillText(profile.tags.map(t=>'#'+t.replaceAll(' ','')).join('  '),540,718,850);
  ctx.textAlign='left';ctx.fillStyle='#394238';ctx.font='28px sans-serif';let line='',y=800;for(const char of intro.replace(/\s+/g,' ').trim()){if(char==='\n'||ctx.measureText(line+char).width>840){ctx.fillText(line,120,y);line=char==='\n'?'':char;y+=45;}else line+=char;}ctx.fillText(line,120,y);
  ctx.textAlign='center';ctx.fillStyle='#7b8373';ctx.font='22px sans-serif';ctx.fillText('나를 소개하는 작은 야생 · MBTI와 일간을 연결한 창작 카드',540,1240,850);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(),'image/png'));const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`stemwild-${identity.mbti}-${identity.animal.type}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);setNotice('카드 이미지를 저장했어요.');
 }catch{setNotice('이미지를 저장하지 못했어요. 자기소개 문구 복사를 이용해 주세요.');}finally{setBusy(false);}}
 return <div className="subpage mbti-page"><a className="back-link" href="#find">나의 일간 동물 찾기</a><div className="page-heading"><div className="eyebrow">MY TYPE, MY WILD</div><h1>나를 소개하는 또 하나의 방법.</h1><p>나의 MBTI에 야생 친구의 매력을 한 스푼.<br/>세상에 하나뿐인 나의 소개 카드를 만들어보세요.</p></div>
 <div className="mbti-layout"><form className="panel mbti-form" onSubmit={submit}><h2>나만의 조합을 골라주세요</h2><label htmlFor="mbti-name">어떻게 불러드릴까요? <span>선택</span></label><input id="mbti-name" value={name} onChange={e=>setName(e.target.value)} maxLength={16} placeholder="이름 또는 닉네임"/>
 <label htmlFor="mbti-type">나의 MBTI</label><input id="mbti-type" value={mbti} onChange={e=>setMbti(e.target.value.toUpperCase().replace(/[^A-Z]/g,''))} maxLength={4} pattern="[IE][NS][FT][JP]" required placeholder="예: INFP" autoComplete="off" spellCheck={false}/><div className="mbti-types" aria-label="MBTI 유형 선택">{(Object.keys(mbtiProfiles) as MbtiType[]).map(type=><button key={type} type="button" aria-pressed={mbti===type} onClick={()=>setMbti(type)}>{type}</button>)}</div>
 <label>나의 일간 동물 연결하기</label><div className="tabs"><button type="button" aria-pressed={mode==='stem'} onClick={()=>setMode('stem')}>일간으로 선택</button><button type="button" aria-pressed={mode==='birth'} onClick={()=>setMode('birth')}>생년월일로 찾기</button></div>
 {mode==='stem'?<><label className="sr-only" htmlFor="mbti-stem">나의 일간</label><select id="mbti-stem" value={stem} required onChange={e=>setStem(e.target.value)}><option value="" disabled>나의 일간과 동물을 선택해 주세요</option>{animals.map((a,i)=><option key={a.stem} value={i}>{a.stem} {a.han} · {a.name}</option>)}</select></>:<><label htmlFor="mbti-birth">생년월일 · 양력</label><input id="mbti-birth" type="date" min="1900-01-01" max={today} value={birth} required onInput={e=>setBirth(e.currentTarget.value)} onChange={e=>setBirth(e.target.value)}/><p className="help">현지 날짜의 자정 기준 매칭입니다. 출생시간·태양시를 반영하려면 <a className="text-link" href="#saju">사주 풀이</a>에서 확인한 일간을 선택해 주세요.</p></>}
 <button className="primary" type="submit">나의 소개 카드 만들기 <span>✳</span></button><p className="form-foot">입력한 정보는 서버에 보내거나 저장하지 않아요.</p></form>
 <aside className="mbti-aside"><div className="eyebrow">A LITTLE MORE LIKE YOU</div><h2>같은 동물이라도,<br/>나의 이야기는 다르니까.</h2><div className="mbti-example"><AnimalArt animal={animals[3]}/><span>예시 · INFP × 정화</span><strong>나만의 이야기를 품은 레서판다</strong></div><p>MBTI의 성향 키워드와 일간 동물의 상징을 조합한 자기소개입니다. 맞는 표현은 남기고, 나와 다른 부분은 편하게 고쳐보세요.</p><p className="help">MBTI 검사를 제공하거나 유형을 추정하지 않아요. 캐릭터·성격의 연결은 창작 콘텐츠이며, 성격을 확정하는 진단이 아닙니다.</p></aside></div>
 {identity&&profile&&<div ref={output} className="mbti-output" aria-live="polite"><div className="eyebrow">THIS IS MY WILD</div><h2>이렇게 나를 소개해볼까요?</h2><p className="help">입력값을 바꾸면 카드 만들기를 다시 눌러 적용해 주세요.</p><div className="identity-layout"><article className="identity-card" style={{background:identity.animal.color}}><div className="identity-top"><span>stemwild ✳</span><b>{identity.mbti} × {identity.animal.stem}</b></div><div className="identity-portrait"><AnimalArt animal={identity.animal}/></div><span className="identity-kicker">{identity.name}의 야생 친구</span><h2>{identity.animal.name} · {identity.animal.nick}</h2><p>{profile.title}</p><div className="identity-tags">{profile.tags.map(tag=><span key={tag}>#{tag.replaceAll(' ','')}</span>)}</div><p className="identity-intro">{intro}</p><span className="identity-foot">나를 소개하는 작은 야생</span></article><div className="panel intro-editor"><h3>내 말투로 다듬어보세요</h3><p>내가 직접 쓴 문장이 카드와 저장 이미지에 그대로 반영돼요.</p><label htmlFor="my-intro">나의 자기소개</label><textarea id="my-intro" value={intro} maxLength={240} rows={8} onChange={e=>setIntro(e.target.value)}/><span className="char-count">{intro.length}/240</span><button className="primary" type="button" onClick={copy}>소개 문구 복사하기 <span>✳</span></button><button className="secondary" type="button" disabled={busy} onClick={download}>{busy?'카드 만드는 중…':'카드 이미지 저장'}</button><a className="text-link" href={`#wildlife/${identity.animal.type}`}>내 친구의 보전 이야기 알아보기</a><a className="text-link result-mbti-link" href="#ending">열 친구의 숲에서 만나기</a></div></div></div>}
 {notice&&<p className="mbti-notice" role="status">{notice}</p>}</div>;
}

