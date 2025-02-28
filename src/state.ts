import * as cg from './types.js';
import * as fen from './fen.js';
import { AnimCurrent } from './anim.js';
import { Drawable } from './draw.js';

export interface HeadlessState {
  orientation: cg.Color;
  coordinates?: boolean;
  turnColor: cg.Color; // turn to play.
  pieces: cg.Pieces;
  check?: cg.Key;
  lastMove?: cg.Key[]
  animation: {
    enabled: boolean;
    duration: number;
    current?: AnimCurrent;
  };
  movable: {
    free: boolean; // all moves are valid - board editor
    color?: cg.Color | 'both'; // color that can move. white | black | both
    dests?: cg.Dests; // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
    showDests: boolean; // whether to add the move-dest class on squares
    events: {
      after?: (orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata) => void; // called after the move has been played
      afterNewPiece?: (role: cg.Role, key: cg.Key, metadata: cg.MoveMetadata) => void; // called after a new piece is dropped on the board
    };
  };
  drawable: Drawable;
  premovable: {
    enabled: boolean; // allow premoves for color that can not move
    showDests: boolean; // whether to add the premove-dest class on squares
    castle: boolean; // whether to allow king castle premoves
    dests?: cg.Key[]; // premove destinations for the current selection
    customDests?: cg.Dests; // use custom valid premoves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
    current?: cg.KeyPair; // keys of the current saved premove ["e2" "e4"]
    events: {
      set?: (orig: cg.Key, dest: cg.Key, metadata?: cg.SetPremoveMetadata) => void; // called after the premove has been set
      unset?: () => void; // called after the premove has been unset
    };
  };
  selected?: cg.Key;
}

export interface State extends HeadlessState {
  dom: cg.Dom;
}

export function defaults(): HeadlessState {
  return {
    pieces: fen.read(fen.initial),
    orientation: 'red',
    turnColor: 'red',
    coordinates: true,
    animation: {
      enabled: true,
      duration: 200,
    },
    movable: {
      free: true,
      color: 'both',
      showDests: true,
      events: {},
    },
    premovable: {
      enabled: true,
      showDests: true,
      castle: true,
      events: {},
    },
    drawable: {
      enabled: true, // can draw
      visible: true, // can view
      defaultSnapToValidMove: true,
      eraseOnClick: true,
      shapes: [],
      autoShapes: [],
      brushes: {
        green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
        red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
        blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
        yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
        paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
        paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
        paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
        paleGrey: {
          key: 'pgr',
          color: '#4a4a4a',
          opacity: 0.35,
          lineWidth: 15,
        },
        purple: { key: 'purple', color: '#68217a', opacity: 0.65, lineWidth: 10 },
        pink: { key: 'pink', color: '#ee2080', opacity: 0.5, lineWidth: 10 },
        white: { key: 'white', color: 'white', opacity: 1, lineWidth: 10 },
      },
      prevSvgHash: '',
    },
  };
}
