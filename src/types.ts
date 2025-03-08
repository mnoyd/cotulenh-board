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
  cgAnimating?: boolean;
  cgFading?: boolean;
  cgDragging?: boolean;
  cgScale?: number;
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
export type NumberQuad = [number, number, number, number];

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
  redraw: () => void;
  redrawNow: (skipSvg?: boolean) => void;
  unbind?: Unbind;
  destroyed?: boolean;
}

export interface Memo<A> {
  (): A;
  clear: () => void;
}

export type Redraw = () => void;
export type Unbind = () => void;
export type FEN = string;
export type KHz = number;
export type Dests = Map<Key, Key[]>;
export interface MoveMetadata {
  premove: boolean;
  ctrlKey?: boolean;
  holdTime?: number;
  captured?: Piece;
  predrop?: boolean;
}
export type BrushColor = 'green' | 'red' | 'blue' | 'yellow';
export type KeyPair = [Key, Key];

export interface SetPremoveMetadata {
  ctrlKey?: boolean;
}
export type MouchEvent = Event & Partial<MouseEvent & TouchEvent>;

export interface Timer {
  start: () => void;
  cancel: () => void;
  stop: () => number;
}
export type SquareClasses = Map<Key, string>;
export interface Exploding {
  stage: number;
  keys: readonly Key[];
}
