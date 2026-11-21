import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { animals } from "../animals";
import type { Animal } from "../animals";
import { AnimalArt } from "./Animal";
import {
  calculateSaju,
  cities,
  elements,
  pillarName,
  stemHan,
  branchHan,
} from "../lib/saju";
import type { SajuResult } from "../lib/saju";

export default function SajuPage({
  onAnimalChange,
}: {
  onAnimalChange?: (animal: Animal) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [entry, setEntry] = useState<"direct" | "select">("direct");
  const [solar, setSolar] = useState(false);
  const [city, setCity] = useState("서울");
  const [boundary, setBoundary] = useState<"midnight" | "zi">("midnight");
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState("");

  const output = useRef<HTMLDivElement>(null);
  const years = Array.from(
    { length: new Date().getFullYear() - 1961 },
    (_, i) => new Date().getFullYear() - i
  );
  const parts = (date || "2000-01-01").split("-").map(Number);
  const times = (time || "12:00").split(":").map(Number);
  const days = new Date(Date.UTC(parts[0], parts[1], 0)).getUTCDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  function updateDate(i: number, value: number) {
    const next = [...parts];
    next[i] = value;
    next[2] = Math.min(
      next[2],
      new Date(Date.UTC(next[0], next[1], 0)).getUTCDate()
    );
    setDate(`${next[0]}-${pad(next[1])}-${pad(next[2])}`);
  }
  function updateTime(i: number, value: number) {
    const next = [...times];
    next[i] = value;
    setTime(`${pad(next[0])}:${pad(next[1])}`);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setResult(
        calculateSaju({
          date,
          time,
          solar,
          longitude: cities.find((c) => c.name === city)!.longitude,
          dayBoundary: boundary,
        })
      );
      requestAnimationFrame(() =>
        output.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "입력값을 확인해 주세요.");
    }
  }
  const friend = result ? animals[result.day.stem] : null;
  useEffect(() => {
    if (friend) onAnimalChange?.(friend);
  }, [friend, onAnimalChange]);
  return (
    <div className="subpage saju-page">
      <a className="back-link" href="#find">
        내 동물 찾기
      </a>
      <div className="page-heading">
        <div className="eyebrow">READ YOUR NATURE</div>
        <h1>나의 사주, 나의 자연.</h1>
        <p>
          태어난 순간을 네 개의 기둥으로 살펴보고,
          <br />
          나의 일간과 이어진 야생 친구를 만나보세요.
        </p>
      </div>
      <div className="saju-layout">
        <form className="panel saju-form" onSubmit={submit} onChange={() => { setResult(null); setError(""); }}>
          <h2>태어난 순간을 알려주세요</h2>
          <div className="tabs">
            <button
              type="button"
              aria-pressed={entry === "direct"}
              onClick={() => setEntry("direct")}
            >
              직접 입력
            </button>
            <button
              type="button"
              aria-pressed={entry === "select"}
              onClick={() => {
                setEntry("select");
                if (!date) setDate("2000-01-01");
                if (!time) setTime("12:00");
              }}
            >
              목록으로 선택
            </button>
          </div>
          {entry === "direct" ? (
            <>
              <label htmlFor="saju-date">생년월일 · 양력</label>
              <input
                id="saju-date"
                type="date"
                min="1962-01-01"
                max={new Date().toLocaleDateString("en-CA", {
                  timeZone: "Asia/Seoul",
                })}
                required
                value={date}
                onInput={(e) => setDate(e.currentTarget.value)}
                onChange={(e) => setDate(e.target.value)}
              />
              <label htmlFor="saju-time">출생시각 · 한국에서 기록된 시각</label>
              <input
                id="saju-time"
                type="time"
                required
                value={time}
                onInput={(e) => setTime(e.currentTarget.value)}
                onChange={(e) => setTime(e.target.value)}
              />
            </>
          ) : (
            <>
              <label>생년월일 · 양력</label>
              <div className="input-row">
                {[
                  years,
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  Array.from({ length: days }, (_, i) => i + 1),
                ].map((list, i) => (
                  <select
                    key={i}
                    aria-label={["출생 연도", "출생 월", "출생 일"][i]}
                    value={parts[i]}
                    onChange={(e) => updateDate(i, Number(e.target.value))}
                  >
                    {list.map((n) => (
                      <option key={n} value={n}>
                        {n}
                        {["년", "월", "일"][i]}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
              <label>출생시각 · 한국에서 기록된 시각</label>
              <div className="input-row">
                {[24, 60].map((count, i) => (
                  <select
                    key={i}
                    aria-label={["출생 시", "출생 분"][i]}
                    value={times[i]}
                    onChange={(e) => updateTime(i, Number(e.target.value))}
                  >
                    {Array.from({ length: count }, (_, n) => (
                      <option key={n} value={n}>
                        {pad(n)}
                        {["시", "분"][i]}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </>
          )}
          <label htmlFor="time-basis">풀이 시간 기준</label>
          <select
            id="time-basis"
            value={solar ? "solar" : "kst"}
            onChange={(e) => setSolar(e.target.value === "solar")}
          >
            <option value="kst">한국 표준시 · KST (UTC+9)</option>
            <option value="solar">
              출생 지역의 태양시 · 경도 + 균시차 보정
            </option>
          </select>
          {solar && (
            <>
              <label htmlFor="birth-city">출생 지역 · 가까운 도시</label>
              <select
                id="birth-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              <p className="help">
                도시 중심 경도를 사용하는 근사 태양시입니다. 한국 표준시와
                태양시는 서로 다릅니다.
              </p>
            </>
          )}
          <label htmlFor="day-boundary">하루가 바뀌는 기준</label>
          <select
            id="day-boundary"
            value={boundary}
            onChange={(e) => setBoundary(e.target.value as "midnight" | "zi")}
          >
            <option value="midnight">자정 · 00:00부터 다음 날</option>
            <option value="zi">자초 · 23:00부터 다음 날</option>
          </select>
          <p className="help">
            1962년 이후 한국 출생 · 양력 기준. 과거 서머타임은 Asia/Seoul
            기록으로 보정합니다.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="primary">
            나의 사주 살펴보기 <span>✳</span>
          </button>
          <p className="form-foot">
            입력 정보는 기기 안에서만 계산하고 저장하지 않아요.
          </p>
        </form>
        <aside className="saju-aside">
          <div className="eyebrow">A MOMENT, FOUR PILLARS</div>
          <h2>
            시간을 읽고,
            <br />
            나를 발견하는 작은 힌트.
          </h2>
          <p>
            연주·월주·일주·시주에서 나의 일간과 오행의 구성을 살펴보세요. 정해진
            미래 대신, 나를 돌아보는 이야기로 읽어주세요.
          </p>
          <div
            className="aside-art"
            style={{ background: (friend || animals[3]).color }}
          >
            <AnimalArt animal={friend || animals[3]} />
          </div>
          <details>
            <summary>계산 기준 알아보기</summary>
            <p>
              연주는 입춘, 월주는 태양 황경의 30도 간격 절입 시점을 기준으로
              합니다. 일주·시주는 선택한 시간 보정과 하루 경계에 따릅니다.
              오행은 천간 4자와 지지의 대표 오행 4자만 셉니다.
              지장간·용신·대운·세운은 포함하지 않습니다.
            </p>
            <p>
              태양시는 경도와 NOAA 균시차 근사식으로 보정합니다. 절기·시주 경계
              부근은 전문 만세력과 함께 확인하세요. 서머타임 종료로 중복되는
              시각은 먼저 발생한 시각을 사용하며 결과에 알립니다.
            </p>
          </details>
        </aside>
      </div>
      {result && friend && (
        <div ref={output} className="saju-output" aria-live="polite">
          <div className="eyebrow">YOUR FOUR PILLARS</div>
          <h2>당신의 일간은 {friend.stem}입니다.</h2>
          <p>
            {solar ? "태양시" : "한국 표준시"} 적용 시각:{" "}
            {result.clock.toISOString().slice(0, 16).replace("T", " ")} · 입력
            시각 대비 {result.correction >= 0 ? "+" : ""}
            {result.correction.toFixed(1)}분 ·{" "}
            {boundary === "midnight" ? "자정" : "23시"} 경계
          </p>
          {result.ambiguous && (
            <p className="error">
              서머타임 종료의 중복 시각으로, 먼저 발생한 시각을 적용했습니다.
            </p>
          )}
          <div className="pillars">
            {(
              [
                ["연주", result.year],
                ["월주", result.month],
                ["일주", result.day],
                ["시주", result.hour],
              ] as const
            ).map(([name, p]) => (
              <div
                key={name}
                className={name === "일주" ? "pillar highlighted" : "pillar"}
              >
                <span>{name}</span>
                <strong>
                  {stemHan[p.stem]}
                  <br />
                  {branchHan[p.branch]}
                </strong>
                <b>{pillarName(p)}</b>
                <small>
                  {elements[Math.floor(p.stem / 2)]} ·{" "}
                  {["양", "음"][p.stem % 2]}
                </small>
              </div>
            ))}
          </div>
          <div className="reading-grid">
            <div className="panel">
              <h3>나의 오행 구성</h3>
              {elements.map((el, i) => (
                <div className="element-row" key={el}>
                  <span>{el}</span>
                  <div className="element-track">
                    <div
                      style={{ width: `${(result.counts[i] / 8) * 100}%` }}
                    />
                  </div>
                  <b>{result.counts[i]}개</b>
                </div>
              ))}
              <p className="help">
                8글자의 단순 분포입니다. 많고 적음이 좋고 나쁨이나 실제 성격을
                뜻하지 않습니다.
              </p>
            </div>
            <div className="panel match-reading">
              <AnimalArt animal={friend} />
              <h3>
                {friend.name} · {friend.nick}
              </h3>
              <strong>{friend.trait}</strong>
              <p>{friend.bio}</p>
              <p>
                오늘의 작은 실천:{" "}
                {
                  [
                    "새로운 아이디어 하나를 적어보세요.",
                    "마음을 따뜻하게 하는 사람에게 안부를 전해보세요.",
                    "편안하게 쉴 공간을 가꿔보세요.",
                    "지키고 싶은 나만의 기준을 적어보세요.",
                    "산책하며 떠오르는 생각을 기록해보세요.",
                  ][Math.floor(result.day.stem / 2)]
                }
              </p>
              <a className="text-link" href={`#wildlife/${friend.type}`}>
                이 친구의 보전 이야기 보기
              </a>
              <a
                className="text-link result-mbti-link"
                href={`#mbti/${friend.type}`}
              >
                MBTI를 더해 자기소개 만들기
              </a>
              <a className="text-link result-mbti-link" href="#ending">
                열 친구의 숲에서 만나기
              </a>
            </div>
          </div>
          <p className="help">
            일간의 성격·동물 매칭·실천 문구는 stemwild의 창작 해석입니다. 과학적
            성격 진단이나 미래 예측이 아닙니다.
          </p>
        </div>
      )}
    </div>
  );
}
