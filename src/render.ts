import { HeadlessState, State } from './state.js';
import * as cg from './types.js';
import { createEl, translate, posToTranslate as posToTranslateFromBounds } from './util.js';

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
