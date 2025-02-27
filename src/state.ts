import * as cg from './types.js';
import * as fen from './fen.js';

export interface HeadlessState {
  orientation?: 'red' | 'blue';
  coordinates?: boolean;
  pieces: cg.Pieces;
}

export interface State extends HeadlessState {
  dom: cg.Dom;
}

export function defaults(): HeadlessState {
  return {
    pieces: fen.read(fen.initial),
    orientation: 'red',
    coordinates: true,
  };
}
