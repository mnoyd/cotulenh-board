import { HeadlessState } from './state.js';
import { createEl } from './util.js';

export function renderWrap(element: HTMLElement, s: HeadlessState): any {
  element.innerHTML = '';

  // ensure the cg-wrap class is set
  // so bounds calculation can use the CSS width/height values
  // add that class yourself to the element before calling chessground
  // for a slight performance improvement! (avoids recomputing style)
  element.classList.add('cg-wrap');
  const container = createEl('cg-container');
  element.appendChild(container);
  const board = createEl('cg-board');
  if (s.orientation === 'blue') board.classList.add('board-orientation-blue');
  container.appendChild(board);

  return {};
}
