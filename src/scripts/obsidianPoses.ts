import * as THREE from "three";

/**
 * The sculpture is always the same 32 chrome ribs. A pose decides where each
 * rib sits, so every page can arrange them into a form that says something
 * about its subject. Poses are pure functions of the reading progress, which
 * lets scrolling drive them and lets the renderer morph between two poses.
 *
 * Pose space: y is up, the form is centered on the origin and should fit a
 * box roughly 4.4 wide and 6.4 tall. A rib at scale 1 is a rounded loop lying
 * flat in the XZ plane, 3.3 wide (x) and 2.24 deep (z).
 */
export const RIB_COUNT = 32;

export interface RibTarget {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  /** x and z scale the loop, y scales its thickness. */
  scale: THREE.Vector3;
  opacity: number;
}

export interface PoseContext {
  /** Reading progress through the page, 0 at the top and 1 at the end. */
  progress: number;
  /** Seconds of idle motion. Only advances for poses with `idle` above 0. */
  time: number;
}

export interface Pose {
  /** What the form shows, and what scrolling does to it. */
  caption?: [form: string, scrolling?: string];
  /** How much the form keeps moving on its own. 0 renders only on demand. */
  idle: number;
  /** Resting rotation of the whole form. */
  rotation: [x: number, y: number, z: number];
  /** Extra turn around the vertical axis by the end of the page. */
  spin: number;
  /** Per-frame work shared by all ribs. */
  prepare?(context: PoseContext): void;
  place(index: number, context: PoseContext, out: RibTarget): void;
}

const N = RIB_COUNT;
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const euler = new THREE.Euler();
const direction = new THREE.Vector3();
const scratchPosition = new THREE.Vector3();
const scratchQuaternion = new THREE.Quaternion();
const basis = new THREE.Matrix4();

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (from: number, to: number, value: number) => {
  const x = clamp01((value - from) / (to - from));
  return x * x * (3 - 2 * x);
};
const bell = (value: number) => Math.exp(-value * value);
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
/** Stable pseudo-random number in [0, 1) for a rib. */
const noise = (index: number, seed = 0) => {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
/** Each rib's rank in a fixed shuffle, as a fraction. Gives exact proportions. */
const shuffledRank = (seed: number) => {
  const order = Array.from({ length: N }, (_, index) => index)
    .sort((a, b) => noise(a, seed) - noise(b, seed));
  const rank = new Array<number>(N);
  order.forEach((rib, position) => { rank[rib] = position / N; });
  return rank;
};

const turn = (out: RibTarget, x: number, y: number, z: number) => {
  out.quaternion.setFromEuler(euler.set(x, y, z));
};
/** A round rib of the given size. Smaller ribs keep some thickness so they stay visible. */
const size = (out: RibTarget, radius: number, thickness = 0.55 + 0.45 * radius) => {
  out.scale.set(radius, thickness, radius);
};
/** Point the rib's flat face along a direction. */
const face = (out: RibTarget, normal: THREE.Vector3) => {
  out.quaternion.setFromUnitVectors(UP, normal);
};

/** Home: one whole column. A swell travels down it to mark your place on the page. */
const column: Pose = {
  idle: 1,
  rotation: [0.24, 0.35, -0.32],
  spin: 0.9,
  place(index, { progress, time }, out) {
    const along = index / (N - 1);
    const level = 1 - 2 * along;
    const swell = smoothstep(0.01, 0.1, progress) * bell((along - progress) / 0.1);
    out.position.set(Math.sin(level * 2.1 + time * 0.12) * 0.3, level * 2.7, 0);
    turn(out, 0, level * (0.92 + progress * 1.3) + time * 0.055, 0);
    size(out, 0.8 + 0.16 * Math.cos(level * 2.8) + swell * 0.28, 1);
    out.opacity = 1;
  },
};

/** Medical imaging: a deck of scan slices. Scrolling lifts one slice out at a time. */
const slices: Pose = {
  caption: ["A stack of scan slices.", "Scrolling steps through the study."],
  idle: 0,
  rotation: [0.06, -0.52, 0.05],
  spin: 0.3,
  place(index, { progress }, out) {
    const along = index / (N - 1);
    const offset = along - (0.1 + 0.8 * progress);
    const picked = bell(offset / 0.024);
    const parting = Math.tanh(offset / 0.05);
    out.position.set(
      0.1,
      0.25 + (0.5 - along) * 3.6 - parting * 0.3 + picked * 0.1,
      (along - 0.5) * 2.1 + picked * 1.1,
    );
    turn(out, Math.PI / 2 - 0.4 * (1 - picked), 0, 0);
    size(out, 0.62 + picked * 0.2, 0.9);
    out.opacity = 1;
  },
};

/** Apolloon: three hosts side by side. Operations a host is missing arrive as you scroll. */
const replicaRank = shuffledRank(3);
const replicas: Pose = {
  caption: ["Three hosts, each with its own copy.", "Missing operations arrive as you scroll."],
  idle: 0,
  rotation: [0.3, 0.12, -0.05],
  spin: 0.22,
  place(index, { progress }, out) {
    const host = index % 3;
    const level = Math.floor(index / 3);
    const height = (5 - level) * 0.42;
    // Most of each log is already in place. The rest catches up in a fixed order.
    const rank = replicaRank[index];
    const arrives = rank < 0.6 ? -1 : mix(0.06, 0.86, (rank - 0.6) / 0.4);
    const settled = smoothstep(arrives - 0.1, arrives + 0.02, progress);

    // In flight: a small ring in the gap, coming over from a neighbouring host.
    const source = host === 1 ? (level % 2 === 0 ? 0 : 2) : 1;
    out.position.set((host + source - 2) * 0.75, height, 0.2);
    turn(out, Math.PI / 2, 0, 0);
    scratchPosition.set((host - 1) * 1.5, height, 0);
    scratchQuaternion.setFromEuler(euler.set(0, level * 0.08, 0));

    out.position.lerp(scratchPosition, settled);
    out.quaternion.slerp(scratchQuaternion, settled);
    size(out, mix(0.11, 0.33, settled), mix(1.1, 0.7, settled));
    out.opacity = 1;
  },
};

/** AWS: a load balancer over two zones inside one network. Tasks scale out as you scroll. */
const zones: Pose = {
  caption: ["Two zones inside one private network.", "Tasks scale out as you scroll."],
  idle: 0,
  rotation: [0.4, 0.5, -0.1],
  spin: 0.6,
  place(index, { progress }, out) {
    out.opacity = 1;
    if (index === 0) {
      // The load balancer: the only way in, spanning both zones.
      out.position.set(0, 2.45, 0);
      turn(out, 0, 0, 0);
      size(out, 1, 1.5);
    } else if (index <= 3) {
      // The network boundary.
      out.position.set(0, 1.5 - (index - 1) * 1.6, 0);
      turn(out, 0, 0, 0);
      size(out, 1.1, 0.6);
    } else if (index <= 29) {
      const zone = (index - 4) % 2 === 0 ? -1 : 1;
      const level = Math.floor((index - 4) / 2);
      const running = 4 + 9 * progress;
      const started = smoothstep(0, 1, running - level);
      const top = Math.min(level, running - 1);
      out.position.set(zone * 0.76, -1.75 + top * 0.265, 0);
      turn(out, 0, level * 0.16 * zone, 0);
      size(out, mix(0.24, 0.39, started));
      out.opacity = started;
    } else {
      // Vault sits outside the network: two crossed rings.
      const crossed = index === 31;
      out.position.set(0, -2.7, 0);
      turn(out, crossed ? Math.PI / 2 : 0, progress * 2.4, 0);
      size(out, 0.33, 1);
    }
  },
};

/** Financial agent: one orchestrator with five services in orbit around it. */
const orbit: Pose = {
  caption: ["One agent, five services in orbit.", "Scrolling turns the system."],
  idle: 0,
  rotation: [0.2, 0.42, -0.2],
  spin: 0.5,
  place(index, { progress }, out) {
    out.opacity = 1;
    if (index < 8) {
      out.position.set(0, (3.5 - index) * 0.22, 0);
      turn(out, 0, index * 0.22 + progress * 2, 0);
      size(out, 0.6);
      return;
    }
    const member = index - 8;
    const service = Math.min(4, Math.floor(member / 5));
    const slot = member - service * 5;
    const angle = service * TAU / 5 + progress * 2.6;
    // The orbit is tipped up so the system fills the tall space beside the text.
    direction.set(Math.cos(angle), Math.sin(angle) * 0.883, Math.sin(angle) * 0.469).normalize();
    out.position.copy(direction).multiplyScalar(1.95 + (slot - 2) * 0.14);
    face(out, direction);
    size(out, 0.3);
  },
};

/** Azure ML: the model lifecycle as a closed loop. A swell marks the current stage. */
const lifecycle: Pose = {
  caption: ["The model lifecycle as one closed loop.", "Scrolling moves through its stages."],
  idle: 0,
  rotation: [0.2, -0.62, 0.05],
  spin: 0.4,
  place(index, { progress }, out) {
    const angle = Math.PI / 2 - index / N * TAU;
    const stage = Math.PI / 2 - progress * TAU;
    const distance = Math.atan2(Math.sin(angle - stage), Math.cos(angle - stage));
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    out.position.set(cos * 1.7, sin * 1.7, 0);
    // The rib's face follows the loop and its long side points into the screen.
    basis.set(
      0, -sin, -cos, 0,
      0, cos, -sin, 0,
      1, 0, 0, 0,
      0, 0, 0, 1,
    );
    out.quaternion.setFromRotationMatrix(basis);
    size(out, 0.38 + 0.15 * bell(distance / 0.4), 0.9);
    out.opacity = 1;
  },
};

/** Blog: a bud where a fifth of the ribs start solid. Scrolling labels the rest. */
const labelRank = shuffledRank(7);
const labels: Pose = {
  caption: ["A fifth of the data starts out labelled.", "Scrolling labels the rest."],
  idle: 0,
  rotation: [0.22, 0.3, -0.2],
  spin: 1.1,
  place(index, { progress }, out) {
    const along = index / (N - 1);
    const level = 1 - 2 * along;
    const labelled = 1 - smoothstep(-0.02, 0.02, labelRank[index] - (0.2 + 0.78 * progress));
    const profile = 0.3 + 0.62 * Math.sin(Math.PI * along) ** 0.75;
    out.position.set(Math.sin(level * 2.4) * 0.18, level * 2.6, 0);
    turn(out, 0, level * 1.5 + progress * 1.2, 0);
    size(out, profile * mix(0.84, 1, labelled), mix(0.6, 1, labelled));
    out.opacity = mix(0.13, 1, labelled);
  },
};

/** XPO chatbot: short questions and longer answers. The conversation grows as you read. */
const turns = (() => {
  const group: number[] = [];
  const depth: number[] = [];
  const end: number[] = [];
  let cursor = 0;
  let rib = 0;
  for (let index = 0; rib < N; index++) {
    const count = Math.min(index % 2 === 0 ? 2 : 4, N - rib);
    for (let member = 0; member < count; member++, rib++) {
      group.push(index);
      depth.push(cursor);
      cursor += 0.125;
    }
    end.push(cursor);
    cursor += 0.19;
  }
  return { group, depth, end };
})();
let conversationHeight = 0;
let conversationTurns = 0;
const conversation: Pose = {
  caption: ["Short questions, longer answers.", "The conversation grows as you read."],
  idle: 0,
  rotation: [0.3, 0.32, -0.12],
  spin: 0.5,
  prepare({ progress }) {
    const last = turns.end.length - 1;
    conversationTurns = 4 + (turns.end.length - 4) * progress;
    const whole = Math.floor(conversationTurns);
    const partial = smoothstep(0, 1, conversationTurns - whole);
    // The form stays centered on however much of the conversation is showing.
    conversationHeight = mix(
      turns.end[Math.min(last, Math.max(0, whole - 1))],
      turns.end[Math.min(last, whole)],
      partial,
    );
  },
  place(index, _context, out) {
    const group = turns.group[index];
    const answer = group % 2 === 1;
    const shown = smoothstep(0, 1, conversationTurns - group);
    out.position.set(answer ? 0.45 : -0.7, conversationHeight / 2 - turns.depth[index], 0);
    turn(out, 0, index * 0.05 + (answer ? 0.25 : -0.35), 0);
    size(out, (answer ? 0.68 : 0.42) * mix(0.5, 1, shown));
    out.opacity = shown;
  },
};

/** Dataset query: a client and a server, with requests and results in flight between them. */
const clientServer: Pose = {
  caption: ["A client and the server that keeps the data.", "Scrolling sends queries across."],
  idle: 0,
  rotation: [0.26, 0.36, -0.08],
  spin: 0.45,
  place(index, { progress }, out) {
    out.opacity = 1;
    if (index < 16) {
      out.position.set(1, -2.5 + index * 0.25, 0);
      turn(out, 0, index * 0.09, 0);
      size(out, 0.62);
    } else if (index < 24) {
      out.position.set(-1.25, -2.5 + (index - 16) * 0.25, 0);
      turn(out, 0, -(index - 16) * 0.12, 0);
      size(out, 0.4);
    } else {
      const travelled = ((index - 24) / 8 + progress * 3) % 1;
      const lift = Math.sin(Math.PI * travelled);
      out.position.set(mix(-1.25, 1, travelled), mix(-0.5, 1.55, travelled) + lift * 0.85, 0);
      direction.set(2.25, 2.05 + Math.cos(Math.PI * travelled) * Math.PI * 0.85, 0).normalize();
      face(out, direction);
      size(out, 0.17, 1.1);
      out.opacity = smoothstep(0, 0.12, travelled) * smoothstep(1, 0.88, travelled);
    }
  },
};

/** Athas: lines of code. Merged changes slide into the file as you scroll. */
const indents = [0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 1, 2, 2, 3, 3, 2, 1, 1, 2, 2, 1, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0];
const mergeAt = (index: number) => {
  if (index >= 5 && index <= 8) return 0.12;
  if (index >= 16 && index <= 19) return 0.42;
  if (index >= 25 && index <= 27) return 0.68;
  return -1;
};
const lineShown = new Array<number>(N).fill(1);
const lineRow = new Array<number>(N).fill(0);
let lineTotal = N;
const code: Pose = {
  caption: ["Lines of code in an editor.", "Merged changes slide in as you scroll."],
  idle: 0,
  rotation: [0.22, 0.3, -0.03],
  spin: 0.3,
  prepare({ progress }) {
    let row = 0;
    for (let index = 0; index < N; index++) {
      const at = mergeAt(index);
      lineShown[index] = at < 0 ? 1 : smoothstep(at, at + 0.16, progress);
      lineRow[index] = row;
      row += lineShown[index];
    }
    lineTotal = row;
  },
  place(index, _context, out) {
    const shown = lineShown[index];
    const length = 0.3 + 0.5 * noise(index, 11);
    const left = -1.75 + indents[index] * 0.3;
    out.position.set(left + 1.65 * length + (1 - shown) * 1.5, (lineTotal / 2 - lineRow[index]) * 0.175, 0);
    // Tipped toward the viewer so each line catches the light.
    turn(out, 0.5, 0, 0);
    out.scale.set(length, 1.3, 0.16);
    out.opacity = shown;
  },
};

/** Page not found: the column with its middle knocked out. */
const broken: Pose = {
  caption: ["Some pieces are missing."],
  idle: 1,
  rotation: [0.24, 0.35, -0.32],
  spin: 0,
  place(index, { time }, out) {
    const along = index / (N - 1);
    const level = 1 - 2 * along;
    const lost = index >= 11 && index <= 20;
    if (!lost) {
      out.position.set(Math.sin(level * 2.1) * 0.3, level * 2.5, 0);
      turn(out, 0, level * 0.92 + time * 0.04, 0);
      size(out, 0.8 + 0.16 * Math.cos(level * 2.8), 1);
      out.opacity = 1;
      return;
    }
    const drift = time * (0.05 + noise(index, 2) * 0.08);
    out.position.set(
      (noise(index, 13) - 0.5) * 3.6,
      (noise(index, 17) - 0.5) * 2.6 + Math.sin(drift * 2 + index) * 0.12,
      (noise(index, 19) - 0.5) * 2.4,
    );
    turn(out, noise(index, 23) * TAU + drift, noise(index, 29) * TAU, noise(index, 31) * TAU + drift * 0.6);
    size(out, 0.3 + noise(index, 37) * 0.25, 0.9);
    out.opacity = 0.55;
  },
};

/** Where the ribs start before the first pose assembles. */
export const seed: Pose = {
  idle: 0,
  rotation: [0.24, 0.35, -0.32],
  spin: 0,
  place(index, _context, out) {
    out.position.set(0, (0.5 - index / (N - 1)) * 0.4, 0);
    turn(out, 0, index * 0.2, 0);
    out.scale.set(0.05, 0.4, 0.05);
    out.opacity = 0;
  },
};

/** Keyed by the page's `data-pose` attribute. */
export const poses: Record<string, Pose> = {
  home: column,
  "medical-imaging": slices,
  apolloon: replicas,
  "aws-fargate-vault": zones,
  "financial-agent": orbit,
  "azure-mlops": lifecycle,
  blog: labels,
  "xpo-chatbot": conversation,
  "dataset-query": clientServer,
  athas: code,
  "not-found": broken,
};

export const poseFor = (key: string | undefined) => poses[key ?? "home"] ?? column;
