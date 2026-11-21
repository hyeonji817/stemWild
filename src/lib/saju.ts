import { SunPosition } from 'astronomy-engine';
import { sexagenary } from './calendar';

export const stems = ['갑','을','병','정','무','기','경','신','임','계'];
export const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
export const stemHan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const branchHan = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const elements = ['목','화','토','금','수'] as const;
export const cities = [
  { name:'서울', longitude:126.978 }, { name:'인천', longitude:126.705 },
  { name:'수원', longitude:127.029 }, { name:'대전', longitude:127.385 },
  { name:'광주', longitude:126.853 }, { name:'대구', longitude:128.601 },
  { name:'부산', longitude:129.075 }, { name:'울산', longitude:129.311 },
  { name:'춘천', longitude:127.73 }, { name:'강릉', longitude:128.876 },
  { name:'전주', longitude:127.148 }, { name:'제주', longitude:126.531 },
];
const minute = 60_000;
const mod = (n:number,m:number) => ((n%m)+m)%m;
const seoulFormatter = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' });
function seoulParts(date:Date) {
  const p = Object.fromEntries(seoulFormatter.formatToParts(date).map(x=>[x.type,x.value]));
  return [Number(p.year),Number(p.month),Number(p.day),Number(p.hour),Number(p.minute)];
}
export function koreanInstant(y:number,m:number,d:number,h:number,min:number) {
  const wall = Date.UTC(y,m-1,d,h,min);
  const candidates = [540,600].map(offset=>new Date(wall-offset*minute))
    .filter(date=>seoulParts(date).every((v,i)=>v===[y,m,d,h,min][i]));
  if(!candidates.length) throw new Error('유효하지 않은 날짜이거나, 서머타임 전환으로 존재하지 않는 시각입니다. 출생 기록을 확인해 주세요.');
  candidates.sort((a,b)=>a.getTime()-b.getTime());
  return { instant:candidates[0], ambiguous:candidates.length>1 };
}
// NOAA fractional-year approximation; used only for optional apparent solar time.
export function equationOfTime(date:Date) {
  const year = date.getUTCFullYear();
  const days = (Date.UTC(year+1,0,1)-Date.UTC(year,0,1))/86_400_000;
  const day = Math.floor((Date.UTC(year,date.getUTCMonth(),date.getUTCDate())-Date.UTC(year,0,1))/86_400_000)+1;
  const gamma = 2*Math.PI/days*(day-1+(date.getUTCHours()-12)/24);
  return 229.18*(0.000075+0.001868*Math.cos(gamma)-0.032077*Math.sin(gamma)-0.014615*Math.cos(2*gamma)-0.040849*Math.sin(2*gamma));
}
export interface Pillar { stem:number; branch:number }
export const pillarName = (p:Pillar) => stems[p.stem]+branches[p.branch];
export interface SajuInput { date:string; time:string; solar:boolean; longitude:number; dayBoundary:'midnight'|'zi' }
export function calculateSaju(input:SajuInput) {
  const [y,m,d] = input.date.split('-').map(Number);
  const [h,min] = input.time.split(':').map(Number);
  if(![y,m,d,h,min].every(Number.isFinite)||y<1962||y>new Date().getFullYear()||h<0||h>23||min<0||min>59||input.longitude<124||input.longitude>132) throw new Error('1962년 이후의 유효한 생년월일·시각과 한국 내 경도를 입력해 주세요.');
  const { instant,ambiguous }=koreanInstant(y,m,d,h,min);
  if(instant.getTime()>Date.now()) throw new Error('미래의 출생 시각은 입력할 수 없어요.');
  const longitude = SunPosition(instant).elon;
  const monthIndex = Math.floor(mod(longitude-315,360)/30);
  const solarYear = y-((m<=2&&longitude<315)?1:0);
  const year:Pillar={stem:mod(solarYear-4,10),branch:mod(solarYear-4,12)};
  const month:Pillar={stem:mod((year.stem%5)*2+2+monthIndex,10),branch:mod(monthIndex+2,12)};
  const offset = input.solar ? input.longitude*4+equationOfTime(instant) : 540;
  const clock = new Date(instant.getTime()+offset*minute);
  const dayClock = new Date(clock);
  if(input.dayBoundary==='zi'&&clock.getUTCHours()>=23) dayClock.setUTCDate(dayClock.getUTCDate()+1);
  const cycle = sexagenary(dayClock.getUTCFullYear(),dayClock.getUTCMonth()+1,dayClock.getUTCDate());
  const day:Pillar={stem:cycle%10,branch:cycle%12};
  const hourBranch = Math.floor((clock.getUTCHours()+1)/2)%12;
  const hour:Pillar={stem:mod((day.stem%5)*2+hourBranch,10),branch:hourBranch};
  const counts = [0,0,0,0,0];
  const branchElements=[4,2,0,0,2,1,1,2,3,3,2,4];
  for(const p of [year,month,day,hour]) { counts[Math.floor(p.stem/2)]++; counts[branchElements[p.branch]]++; }
  const inputWall = Date.UTC(y,m-1,d,h,min);
  return { year,month,day,hour,counts,clock,instant,ambiguous,correction:(clock.getTime()-inputWall)/minute };
}
export type SajuResult=ReturnType<typeof calculateSaju>;
