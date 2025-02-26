import { Api, start } from './api.js';
import { defaults, HeadlessState, State } from './state.js';
import { renderWrap } from './wrap.js';

export function CommanderChessBoard(element: HTMLElement, config?: any): Api {
  console.log('CommanderChessBoard');
  const maybeState: HeadlessState = { ...defaults(), ...config };
  function redrawAll(): State {
    const elements = renderWrap(element, maybeState);
    const state = maybeState as State;
    state.dom = {
      elements,
    };
    return state;
  }
  return start(redrawAll(), redrawAll);
}
