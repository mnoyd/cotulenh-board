import { redPov } from './board.js';
import { HeadlessState, State } from './state.js';
import * as cg from './types.js';
import { createEl, translate, posToTranslate as posToTranslateFromBounds, key2pos } from './util.js';

export function render(s: State): void {
  const asRed: boolean = orientRed(s);
  const posToTranslate = posToTranslateFromBounds(s.dom.bounds());
  const pieces: cg.Pieces = s.pieces;
  const boardEl: HTMLElement = s.dom.elements.board;

  let el: cg.PieceNode | cg.SquareNode | undefined;

  el = boardEl.firstChild as cg.PieceNode | cg.SquareNode | undefined;
  while (el) {}
  for (const [k, p] of pieces) {
    const pieceName = pieceNameOf(p),
      pieceNode = createEl('piece', pieceName) as cg.PieceNode,
      pos = p.position;

    pieceNode.cgPiece = pieceName;
    pieceNode.cgKey = k;
    translate(pieceNode, posToTranslate(pos, asRed));

    boardEl.appendChild(pieceNode);
  }
}
const pieceNameOf = (piece: cg.Piece): string => `${piece.color} ${piece.role}`;

export const orientRed = (s: HeadlessState): boolean => s.orientation === 'red';

export function updateBounds(s: State): void {
  const bounds = s.dom.elements.wrap.getBoundingClientRect();
  const container = s.dom.elements.container;
  const ratio = bounds.height / bounds.width;
  const width = (Math.floor((bounds.width * window.devicePixelRatio) / 12) * 12) / window.devicePixelRatio;
  const height = width * ratio;
  container.style.width = width + 'px';
  container.style.height = height + 'px';
  s.dom.bounds.clear();

  s.addDimensionsCssVarsTo?.style.setProperty('---cg-width', width + 'px');
  s.addDimensionsCssVarsTo?.style.setProperty('---cg-height', height + 'px');
}

export function renderResized(s: State): void {
  const asRed: boolean = redPov(s),
    posToTranslate = posToTranslateFromBounds(s.dom.bounds());
  let el = s.dom.elements.board.firstChild as cg.PieceNode | cg.SquareNode | undefined;
  while (el) {
    if ((isPieceNode(el) && !el.cgAnimating) || isSquareNode(el)) {
      translate(el, posToTranslate(key2pos(el.cgKey), asRed));
    }
    el = el.nextSibling as cg.PieceNode | cg.SquareNode | undefined;
  }
}

const isPieceNode = (el: cg.PieceNode | cg.SquareNode): el is cg.PieceNode => el.tagName === 'PIECE';
const isSquareNode = (el: cg.PieceNode | cg.SquareNode): el is cg.SquareNode => el.tagName === 'SQUARE';
