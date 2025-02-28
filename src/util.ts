import * as cg from './types.js';

export const createEl = (tagName: string, className?: string): HTMLElement => {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  return el;
};
export const translate = (el: HTMLElement, pos: cg.NumberPair): void => {
  el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
};
export const posToTranslate =
  (bounds: DOMRectReadOnly): ((pos: cg.Pos, asRed: boolean) => cg.NumberPair) =>
  (pos, asRed) => [
    ((asRed ? pos[0] : 10 - pos[0]) * bounds.width) / 12,
    ((asRed ? 11 - pos[1] : pos[1]) * bounds.height) / 13,
  ];

export function memo<A>(f: () => A): cg.Memo<A> {
  let v: A | undefined;
  const ret = (): A => {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = () => {
    v = undefined;
  };
  return ret;
}
export const opposite = (c: cg.Color): cg.Color => (c === 'red' ? 'blue' : 'red');

export const allKeys: readonly cg.Key[] = (() => {
  let allKeys: cg.Key[] = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 11; j++) {
      allKeys.push(`${i}-${j}`);
    }
  }
  return allKeys;
})();

export const samePiece = (p1: cg.Piece, p2: cg.Piece): boolean =>
  p1.role === p2.role && p1.color === p2.color;

export const distanceSq = (pos1: cg.Pos, pos2: cg.Pos): number => {
  const dx = pos1[0] - pos2[0],
    dy = pos1[1] - pos2[1];
  return dx * dx + dy * dy;
};
