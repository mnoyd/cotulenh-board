import { HeadlessState } from './state';
import { opposite } from './util';
import * as cg from './types.js'
import { premove } from './premove.js';

export function toggleOrientation(state: HeadlessState): void {
  state.orientation = opposite(state.orientation);
}

export function setCheck(state: HeadlessState, color: cg.Color | boolean): void {
  state.check = undefined;
  if (color === true) color = state.turnColor;
  if (color)
    for (const [k, p] of state.pieces) {
      //TODO: Should hightlight check for both navy and air_force as well
      if (p.role === 'commander' && p.color === color) {
        state.check = k;
      }
    }
}

export function setSelected(state: HeadlessState, key: cg.Key): void {
  state.selected = key;
  if (isPremovable(state, key)) {
    // calculate chess premoves if custom premoves are not passed
    if (!state.premovable.customDests) {
      state.premovable.dests = premove(state.pieces, key, state.premovable.castle);
    }
  } else state.premovable.dests = undefined;
}

function isPremovable(state: HeadlessState, orig: cg.Key): boolean {
  const piece = state.pieces.get(orig);
  return (
    !!piece &&
    state.premovable.enabled &&
    state.movable.color === piece.color &&
    state.turnColor !== piece.color
  );
}