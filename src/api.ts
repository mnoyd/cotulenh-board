import { State } from './state.js';
import * as cg from './types.js';
import * as board from './board.js';
import { applyAnimation, Config, configure } from './config.js';
import { anim, render } from './anim.js';

export interface Api {
  redrawAll: any;
  set(config: Config): void;
  state: State;
  // change the view angle
  toggleOrientation(): void;
}

export function start(state: State, redrawAll: cg.Redraw): Api {
  function toggleOrientation(): void {
    board.toggleOrientation(state);
    redrawAll();
  }

  return {
    set(config): void {
      if (config.orientation && config.orientation !== state.orientation) toggleOrientation();
      applyAnimation(state, config);
      (config.fen ? anim : render)(state => configure(state, config), state);
    },
    redrawAll,
    state,
    toggleOrientation,
  };
}
