export type Color = (typeof colors)[number];
export type Role = (typeof roles)[number];
export type File = typeof files;
export type Rank = typeof ranks;
export type Key = '0-0' | `${File}-${Rank}`;
export type Pos = [number, number];

export const colors = ['red', 'blue'] as const;
export const roles = [
  'commander',
  'infantry',
  'tank',
  'militia',
  'engineer',
  'artillery',
  'anti_air',
  'missile',
  'air_force',
  'navy',
  'headquarter',
] as const;
export const files = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | (10 as const);
export const ranks = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | (11 as const);

export interface KeyedNode extends HTMLElement {
  cgKey: Key;
}
export interface PieceNode extends KeyedNode {
  tagName: 'PIECE';
  cgPiece: string;
}
export interface SquareNode extends KeyedNode {
  tagName: 'SQUARE';
}
export interface Piece {
  role: Role;
  color: Color;
  position: [File, Rank];
  promoted?: boolean;
}
export interface Drop {
  role: Role;
  key: Key;
}
export type Pieces = Map<Key, Piece>;
export type NumberPair = [number, number];

export interface Elements {
  board: HTMLElement;
  wrap: HTMLElement;
  container: HTMLElement;
  ghost?: HTMLElement;
  svg?: SVGElement;
  customSvg?: SVGElement;
  autoPieces?: HTMLElement;
}
export interface Dom {
  elements: Elements;
  bounds: Memo<DOMRectReadOnly>;
  destroyed?: boolean;
}

export interface Memo<A> {
  (): A;
  clear: () => void;
}
