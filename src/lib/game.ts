export type Direction = "up" | "down" | "left" | "right";
export type GamePhase = "playing" | "paused" | "rest" | "checkpoint" | "won";
export type Tile =
  | "#"
  | "."
  | "S"
  | "T"
  | "W"
  | "L"
  | "C"
  | "R"
  | "Q"
  | "G"
  | "H";
export interface Point {
  x: number;
  y: number;
}
export interface Chapter {
  title: string;
  place: string;
  quest: string;
  tool: string;
  villain: string;
  repair: string;
  rows: string[];
  hazards: Point[];
  hint: string;
}
export const chapters: readonly Chapter[] = [
  {
    title: "다시 이어지는 숲길",
    place: "초록 숲",
    quest: "버려진 쓰레기를 정리해 숲길을 열어요.",
    tool: "튼튼한 장갑",
    villain: "쓰레기 더미",
    repair: "숲길 정리",
    hint: "숲 위쪽에서 장갑을 찾고, 쓰레기 더미 옆에서 상호작용해요.",
    rows: [
      "###########",
      "#T..#....G#",
      "#.#.#.###.#",
      "#R#..Q....#",
      "#.#.###.#.#",
      "#S.WL..C..#",
      "###########",
    ],
    hazards: [{ x: 8, y: 3 }],
  },
  {
    title: "숨을 돌리는 작은 정원",
    place: "바람 정원",
    quest: "씨앗을 심어 매연 구름이 머무는 길을 되살려요.",
    tool: "초록 씨앗 주머니",
    villain: "매연 구름",
    repair: "정원 가꾸기",
    hint: "왼쪽 위의 씨앗 주머니를 찾아, 구름 옆에서 심어주세요.",
    rows: [
      "###########",
      "#T....#..G#",
      "#.###.#.#.#",
      "#...Q...#.#",
      "#.#.###.#.#",
      "#S.WL..C..#",
      "###########",
    ],
    hazards: [{ x: 9, y: 4 }],
  },
  {
    title: "물가의 약속",
    place: "반짝이는 물가",
    quest: "버려진 그물을 풀고 마지막 길을 연결해요.",
    tool: "안전한 그물 해제 도구",
    villain: "버려진 그물",
    repair: "그물 정리",
    hint: "위쪽의 해제 도구를 찾은 뒤 그물 옆에서 상호작용해요.",
    rows: [
      "###########",
      "#..T#....G#",
      "#.#.#.#.#.#",
      "#R#...Q...#",
      "#.#.###.#.#",
      "#S.WL..C..#",
      "###########",
    ],
    hazards: [{ x: 9, y: 3 }],
  },
];
export interface GameState {
  level: number;
  phase: GamePhase;
  position: Point;
  energy: number;
  difficulty: "easy" | "normal";
  tool: boolean;
  leaves: number;
  picked: string[];
  repaired: boolean;
  seeds: number;
  bankedSeeds: number;
  moves: number;
  message: string;
}
const key = (p: Point) => `${p.x},${p.y}`;
export function findTile(level: number, tile: Tile): Point {
  const rows = chapters[level].rows;
  for (let y = 0; y < rows.length; y++) {
    const x = rows[y].indexOf(tile);
    if (x >= 0) return { x, y };
  }
  throw new Error("Missing map tile: " + tile);
}
export function startGame(
  difficulty: "easy" | "normal" = "easy",
  level = 0,
  bankedSeeds = 0,
  moves = 0
): GameState {
  return {
    level,
    phase: "playing",
    position: findTile(level, "S"),
    energy: 100,
    difficulty,
    tool: false,
    leaves: 0,
    picked: [],
    repaired: false,
    seeds: 0,
    bankedSeeds,
    moves,
    message: chapters[level].hint,
  };
}
export function tileAt(state: GameState, p: Point): Tile {
  const row = chapters[state.level].rows[p.y];
  const raw = row?.[p.x] as Tile | undefined;
  if (!raw) return "#";
  if (state.picked.includes(key(p))) return ".";
  if (chapters[state.level].hazards.some((h) => h.x === p.x && h.y === p.y))
    return "H";
  return raw;
}
export function near(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) <= 1;
}
export function move(state: GameState, direction: Direction): GameState {
  if (state.phase !== "playing") return state;
  const delta = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }[direction];
  const p = { x: state.position.x + delta.x, y: state.position.y + delta.y };
  const tile = tileAt(state, p);
  if (tile === "#")
    return { ...state, message: "나무가 있는 곳이에요. 열린 길로 이동해요." };
  if (tile === "Q" && !state.repaired)
    return {
      ...state,
      message: state.tool
        ? "도구를 찾았어요! 여기서 상호작용(E)을 눌러 길을 열어요."
        : `${chapters[state.level].tool}가 필요해요. 먼저 도구를 찾아봐요.`,
    };
  if (tile === "G" && !state.repaired)
    return {
      ...state,
      message:
        "아직 길이 이어지지 않았어요. 이번 구간의 퀘스트를 먼저 완료해요.",
    };
  let next = {
    ...state,
    position: p,
    moves: state.moves + 1,
    energy: Math.max(0, state.energy - (state.difficulty === "easy" ? 1 : 2)),
    message: "천천히, 내 속도로 집을 향해요.",
  };
  const pick = () => {
    next = { ...next, picked: [...next.picked, key(p)] };
  };
  if (tile === "T") {
    pick();
    next.tool = true;
    next.message = `${chapters[state.level].tool} 획득! ${
      chapters[state.level].hint
    }`;
  }
  if (tile === "W") {
    pick();
    next.energy = Math.min(100, next.energy + 30);
    next.message = "깨끗한 물방울을 마셨어요. 체력 +30 (최대 100)";
  }
  if (tile === "L") {
    pick();
    next.leaves++;
    next.message = "쉼표 잎사귀 획득! 가방에서 사용하면 체력 25를 회복해요.";
  }
  if (tile === "C") {
    pick();
    next.seeds++;
    next.message = "마음의 씨앗을 발견했어요. 작은 관심이 모이고 있어요.";
  }
  if (tile === "R")
    next.message = "포근한 쉼터예요. 상호작용(E)을 누르면 체력 25를 회복해요.";
  if (tile === "H") {
    next.energy = Math.max(
      0,
      next.energy - (state.difficulty === "easy" ? 8 : 12)
    );
    next.message =
      "소음 소용돌이를 지나며 기운이 줄었어요. 다른 길을 찾거나 물과 쉼터로 회복해요.";
  }
  if (next.energy <= 0)
    return {
      ...next,
      phase: "rest",
      message: "오늘은 잠깐 쉬어가요. 이 구간에서 다시 출발할 수 있어요.",
    };
  if (tile === "G")
    return {
      ...next,
      phase: state.level === chapters.length - 1 ? "won" : "checkpoint",
      message:
        state.level === chapters.length - 1
          ? "드디어 집에 도착했어요. 오늘도 무사히, 함께여서 가능했어요."
          : "길 하나가 다시 이어졌어요. 다음 구간에 가기 전 충분히 쉬어가요.",
    };
  return next;
}
export function interact(state: GameState): GameState {
  if (state.phase !== "playing") return state;
  const chapter = chapters[state.level];
  if (!state.repaired && near(state.position, findTile(state.level, "Q"))) {
    if (!state.tool)
      return {
        ...state,
        message: `${chapter.tool}가 필요해요. ${chapter.hint}`,
      };
    return {
      ...state,
      repaired: true,
      tool: false,
      message: `${chapter.repair} 완료! 이제 집 방향 표지까지 이동할 수 있어요.`,
    };
  }
  const rest = chapter.rows.some((row) => row.includes("R"))
    ? findTile(state.level, "R")
    : null;
  if (rest && near(state.position, rest))
    return {
      ...state,
      energy: Math.min(100, state.energy + 25),
      message:
        "쉼터에서 숨을 골랐어요. 체력 +25. 쉬어가는 것도 모험의 일부예요.",
    };
  return {
    ...state,
    message: "퀘스트 시련이나 쉼터 바로 옆에서 상호작용해요.",
  };
}
export function consumeLeaf(state: GameState): GameState {
  if (state.phase !== "playing") return state;
  if (!state.leaves)
    return {
      ...state,
      message: "아직 잎사귀가 없어요. 길에서 초록 잎사귀를 찾아봐요.",
    };
  if (state.energy >= 100)
    return {
      ...state,
      message: "지금은 기운이 가득해요. 잎사귀를 아껴둘게요.",
    };
  return {
    ...state,
    leaves: state.leaves - 1,
    energy: Math.min(100, state.energy + 25),
    message: "쉼표 잎사귀를 사용했어요. 체력 +25.",
  };
}
export function nextChapter(state: GameState): GameState {
  if (state.phase !== "checkpoint") return state;
  return startGame(
    state.difficulty,
    state.level + 1,
    state.bankedSeeds + state.seeds,
    state.moves
  );
}
export function retryChapter(state: GameState): GameState {
  return startGame(
    state.difficulty,
    state.level,
    state.bankedSeeds,
    state.moves
  );
}
export function pauseGame(state: GameState): GameState {
  if (state.phase === "playing")
    return {
      ...state,
      phase: "paused",
      message: "잠깐 쉬는 중이에요. 준비되면 이어서 걸어요.",
    };
  if (state.phase === "paused")
    return {
      ...state,
      phase: "playing",
      message: "다시 출발! 내 속도로 걸어가요.",
    };
  return state;
}
