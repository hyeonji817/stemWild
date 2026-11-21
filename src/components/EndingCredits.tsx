import { useState } from 'react';
import type { CSSProperties } from 'react';
import { animals } from '../animals';
import type { Animal } from '../animals';
import { AnimalArt } from './Animal';

// Existing character artwork is retained; only their shared habitat is new.
const places:Record<string,{x:number;y:number;width:number;layer:number}>={
 lemur:{x:62,y:123,width:168,layer:3},
 squirrel:{x:333,y:139,width:159,layer:3},
 panda:{x:241,y:280,width:174,layer:4},
 bear:{x:402,y:333,width:185,layer:5},
 rabbit:{x:643,y:350,width:150,layer:5},
 quokka:{x:746,y:267,width:162,layer:4},
 wolf:{x:515,y:442,width:165,layer:6},
 fox:{x:999,y:230,width:157,layer:4},
 porpoise:{x:969,y:442,width:193,layer:6},
 marten:{x:843,y:349,width:170,layer:5},
};

function GardenLandscape(){return <svg className="garden-landscape" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="garden-sky" x2="0" y2="1"><stop stopColor="#f8e8d4"/><stop offset="1" stopColor="#f9f3e6"/></linearGradient><linearGradient id="garden-sea" x2="1" y2="1"><stop stopColor="#9bc7c7"/><stop offset="1" stopColor="#c5e0da"/></linearGradient><linearGradient id="garden-grass" x2="0" y2="1"><stop stopColor="#c2ce9b"/><stop offset="1" stopColor="#91b18e"/></linearGradient></defs>
 <path fill="url(#garden-sky)" d="M0 0h1200v650H0z"/>
 <circle cx="805" cy="135" r="64" fill="#f3c58b" opacity=".75"/>
 <path d="M485 118q28-29 59-3 27-37 55-3 30 0 35 17H471q0-10 14-11M920 75q21-26 43-8 27-31 47-1 28-6 36 17H905q3-9 15-8" fill="#fffaf0" opacity=".85"/>
 <path d="M0 330Q147 179 296 290Q425 153 594 306Q751 189 925 298Q1067 161 1200 290V650H0Z" fill="#dce1bc"/>
 <path d="M0 380Q171 257 331 353Q509 246 682 362Q846 259 998 330L1200 300V650H0Z" fill="#bacb9f"/>
 <path d="M884 335Q1037 232 1200 314V650H863Z" fill="#e4cf9f"/>
 <path d="M0 452Q212 358 433 423Q628 330 824 397Q976 408 1036 496L1103 650H0Z" fill="url(#garden-grass)"/>
 <path d="M781 650Q709 557 774 492Q817 456 799 421Q790 398 815 390Q808 424 854 455Q916 504 891 560Q858 619 912 650" fill="#e5d9b9"/>
 <path d="M1200 418Q1096 440 1032 505Q994 556 901 579Q844 611 867 650H1200Z" fill="url(#garden-sea)"/>
 <path d="M995 543q37-12 75-4m-23 56q46-11 92-3m-224 34q45-15 84-7m114-146 31-4" fill="none" stroke="#e7f3e8" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
 <path d="M219 458Q231 337 214 247Q199 189 223 153Q246 139 263 171Q247 245 260 303Q268 390 286 460" fill="#a78966"/>
 <path d="M237 302Q170 278 135 222M250 274Q312 247 367 227M259 371Q317 354 358 321" fill="none" stroke="#a78966" strokeWidth="24" strokeLinecap="round"/>
 <path d="M213 452q22-119 16-178" fill="none" stroke="#bea27c" strokeWidth="8" strokeLinecap="round"/>
 <ellipse cx="171" cy="165" rx="134" ry="104" fill="#96b18b"/><ellipse cx="295" cy="135" rx="125" ry="104" fill="#adc298"/><ellipse cx="368" cy="203" rx="98" ry="69" fill="#b8cba1"/><ellipse cx="83" cy="226" rx="91" ry="78" fill="#abc094"/>
 <ellipse cx="205" cy="91" rx="78" ry="50" fill="#c1cfa5"/>
 <path d="M104 165q24-20 52-11m114-69q26-9 47 1m-5 98 34 1m-309 42 24-6" fill="none" stroke="#e4e8c7" strokeWidth="4" strokeLinecap="round" opacity=".55"/>
 <path d="M258 439Q325 437 390 428" stroke="#977c60" strokeWidth="16" strokeLinecap="round"/>
 <g fill="#829e7f"><ellipse cx="28" cy="445" rx="57" ry="48"/><ellipse cx="83" cy="438" rx="50" ry="37"/><ellipse cx="1155" cy="388" rx="57" ry="37"/><ellipse cx="1199" cy="370" rx="43" ry="48"/></g>
 <g fill="#dce5b5"><ellipse cx="28" cy="419" rx="24" ry="12"/><ellipse cx="1167" cy="368" rx="20" ry="10"/></g>
 <g stroke="#6b916b" strokeWidth="3" strokeLinecap="round"><path d="M127 515l-4-16m4 16 9-10M347 553l-7-19m7 19 10-11M702 533l-5-18m5 18 10-9M43 586l-5-19m5 19 12-12M926 393l-4-16m4 16 9-10"/></g>
 <g fill="#efdbc0"><circle cx="127" cy="495" r="6"/><circle cx="340" cy="530" r="6"/><circle cx="697" cy="511" r="5"/><circle cx="38" cy="564" r="5"/></g>
 <g fill="#f7edcf"><circle cx="136" cy="505" r="5"/><circle cx="357" cy="539" r="5"/><circle cx="712" cy="523" r="5"/></g>
 <g fill="#cfbd97"><ellipse cx="945" cy="555" rx="20" ry="9"/><ellipse cx="913" cy="568" rx="11" ry="6"/></g>
 <path d="M585 194q9-8 18 0m0 0q9-8 18 0m39-34q7-6 14 0m0 0q7-6 14 0" fill="none" stroke="#9da787" strokeWidth="3" strokeLinecap="round"/>
 <g fill="#f3eacb" opacity=".8"><circle cx="489" cy="463" r="3"/><circle cx="711" cy="301" r="3"/><circle cx="593" cy="315" r="2"/></g>
 </svg>}

export default function EndingCredits({animal}:{animal?:Animal}){
 const [motion,setMotion]=useState(true);
 return <section className={`ending-section ${motion?'ending-animated':''}`} id="ending" aria-labelledby="ending-title">
 <div className="ending-intro"><span className="eyebrow">UNTIL WE MEET IN THE WILD</span><h2 id="ending-title">열 친구의 숲</h2><p>서로 다른 우리가, 같은 내일을 꿈꾸는 곳.</p></div>
 <figure className="ending-figure"><div className="garden" role="group" aria-label="열 캐릭터가 함께하는 상상의 생태정원"><GardenLandscape/>
 {animals.map(a=>{const p=places[a.type];const mine=a.type===animal?.type;const style={'--garden-x':`${p.x/12}%`,'--garden-y':`${p.y/6.5}%`,'--garden-width':`${p.width/12}%`,zIndex:p.layer} as CSSProperties;return <a key={a.type} data-type={a.type} className={`garden-friend ${mine?'my-garden-friend':''}`} style={style} href={`#wildlife/${a.type}`} aria-label={`${mine?'나의 친구 · ':''}${a.stem} ${a.name} ${a.nick}의 보전 이야기`}><span className="garden-halo"/><AnimalArt animal={a}/><span className="garden-name">{a.stem} · {a.nick}{mine?' · 나의 친구':''}</span>{mine&&<span className="garden-heart" aria-hidden="true">♡</span>}</a>})}
 <span className="garden-light light-one" aria-hidden="true"/><span className="garden-light light-two" aria-hidden="true"/><span className="garden-light light-three" aria-hidden="true"/>
 <button className="garden-motion" type="button" onClick={()=>setMotion(!motion)} aria-pressed={motion}>{motion?'움직임 끄기':'움직임 켜기'}</button></div>
 <figcaption>열 친구가 만나는 상상의 생태정원입니다. 실제 공동 서식지를 표현한 장면은 아니에요. 친구를 누르면 보전 이야기로 이어집니다.</figcaption></figure>
 <div className="ending-message">{animal&&<div className="ending-yours"><span>오늘 만난 나의 친구</span><strong>{animal.stem} · {animal.name} {animal.nick}</strong></div>}<h3>너를 만나,<br className="ending-mobile-break"/> 우리의 야생이 조금 더 가까워졌어.</h3><p>나를 알아가는 마음이, 다른 생명을 아끼는 마음으로.</p><div className="ending-actions"><a className="primary" href="#wildlife">친구들의 내일 알아보기 <span>✳</span></a><a className="text-link" href="#find">나의 친구 다시 만나기</a></div></div>
 <details className="ending-credits"><summary>엔딩 크레딧 · 함께한 열 친구</summary><div className="credits-roster">{animals.map(a=><a href={`#wildlife/${a.type}`} key={a.stem}><span>{a.stem} {a.han}</span><strong>{a.name}</strong><small>{a.nick}</small></a>)}</div><div className="credits-last"><span>STARRING</span><p>열 가지 야생, 그리고 이곳에 찾아온 당신.</p><span>CREATED WITH CARE · STEMWILD</span><p>이야기의 끝에서도, 생명을 향한 관심은 계속되기를.</p></div></details>
 </section>
}
