import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSaju, koreanInstant, pillarName } from './saju';

const base={date:'2024-02-10',time:'12:00',solar:false,longitude:126.978,dayBoundary:'midnight' as const};
test('갑진년 병인월 갑진일 경오시와 8글자 오행을 계산한다',()=>{
 const r=calculateSaju(base);
 assert.deepEqual([r.year,r.month,r.day,r.hour].map(pillarName),['갑진','병인','갑진','경오']);
 assert.equal(r.counts.reduce((a,b)=>a+b),8);
});
test('입춘 당일 실제 절입 전후에 연주와 월주를 바꾼다',()=>{
 const before=calculateSaju({...base,date:'2024-02-04',time:'16:00'});
 const after=calculateSaju({...base,date:'2024-02-04',time:'18:00'});
 assert.equal(pillarName(before.year),'계묘');assert.equal(pillarName(before.month),'을축');
 assert.equal(pillarName(after.year),'갑진');assert.equal(pillarName(after.month),'병인');
});
test('23시 일자 경계 선택이 일주와 시주의 천간에 반영된다',()=>{
 const a=calculateSaju({...base,time:'23:30'});
 const b=calculateSaju({...base,time:'23:30',dayBoundary:'zi'});
 assert.equal(b.day.stem,(a.day.stem+1)%10);assert.notEqual(b.hour.stem,a.hour.stem);assert.equal(b.hour.branch,0);
});
test('서울 태양시 보정으로 자정 직후 입력이 전날로 이동할 수 있다',()=>{
 const a=calculateSaju({...base,date:'2000-01-13',time:'00:10'});
 const b=calculateSaju({...base,date:'2000-01-13',time:'00:10',solar:true});
 assert.ok(b.correction<0);assert.equal(a.day.stem,6);assert.equal(b.day.stem,5);
});
test('1988년 한국 서머타임을 보정하고 존재하지 않는 시각을 거부한다',()=>{
 const r=calculateSaju({...base,date:'1988-07-01',time:'12:00'});
 assert.equal(r.instant.toISOString(),'1988-07-01T02:00:00.000Z');assert.equal(r.correction,-60);
 assert.throws(()=>koreanInstant(1988,5,8,2,30));
 assert.equal(koreanInstant(1988,10,9,2,30).ambiguous,true);
});
test('잘못된 날짜와 시간 및 지원 범위 밖 입력을 거부한다',()=>{
 assert.throws(()=>calculateSaju({...base,date:'2000-02-30'}));
 assert.throws(()=>calculateSaju({...base,date:'1950-01-01'}));
 assert.throws(()=>calculateSaju({...base,time:'25:00'}));
});
