import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sexagenary } from './calendar';
import { animals } from '../animals';

test('갑자 기준일과 연도 경계에서 60갑자 순서를 유지한다', () => {
  assert.equal(sexagenary(2000, 1, 7), 0);
  assert.equal(sexagenary(1999, 12, 31), 53);
  assert.equal(sexagenary(2024, 2, 10), 40);
});
test('윤년의 2월 29일을 하루로 계산한다', () => {
  assert.equal((sexagenary(2000, 3, 1) - sexagenary(2000, 2, 28) + 60) % 60, 2);
  assert.equal(sexagenary(2000, 3, 7), 0);
});
test('경오일은 경금의 회색늑대로 매칭한다', () => {
  const cycle = sexagenary(2000, 1, 13);
  assert.equal(cycle, 6);
  assert.equal(animals[cycle % 10].stem, '경금');
  assert.equal(animals[cycle % 10].name, '회색늑대');
});
