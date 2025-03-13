import * as cg from './types.js';
import { invRanks, pos2key } from './util.js';

export const initial: string =
  '6c4/1n2fh1hf2/3a2s2a1/2n1gt1tg2/2i3m3i/10/10/2I3M3I/2N1GT1TG2/3A2S2A1/1N2FH1HF2/6C4';

const roles: { [letter: string]: cg.Role } = {
  c: 'commander',
  i: 'infantry',
  t: 'tank',
  m: 'militia',
  e: 'engineer',
  a: 'artillery',
  g: 'anti_air',
  s: 'missile',
  f: 'air_force',
  n: 'navy',
  h: 'headquarter',
};

const letters: { [role in cg.Role]: string } = {
  commander: 'c',
  infantry: 'i',
  tank: 't',
  militia: 'm',
  engineer: 'e',
  artillery: 'a',
  anti_air: 'g',
  missile: 's',
  air_force: 'f',
  navy: 'n',
  headquarter: 'h',
};

export function read(fen: string): cg.Pieces {
  if (fen === 'start') fen = initial;
  const pieces: cg.Pieces = new Map();
  let row = 11,
    col = 0;
  let promoteNextPiece = false;
  for (const c of fen) {
    switch (c) {
      case ' ':
      case '[':
        return pieces;
      case '/':
        --row;
        if (row < 0) return pieces;
        col = 0;
        break;
      case '+':
        promoteNextPiece = true;
        break;
      default: {
        const nb = c.charCodeAt(0);
        if (nb < 57) col += nb - 48;
        else {
          const role = c.toLowerCase();
          pieces.set(pos2key([col, row]), {
            role: roles[role],
            color: c === role ? 'blue' : 'red',
            position: [col, row],
            promoted: promoteNextPiece,
          });
          promoteNextPiece = false;
          ++col;
        }
      }
    }
  }
  return pieces;
}

export function write(pieces: cg.Pieces): cg.FEN {
  return invRanks
    .map(y =>
      cg.files
        .map(x => {
          const piece = pieces.get(`${x}-${y}` as cg.Key);
          if (piece) {
            let p = letters[piece.role];
            if (piece.color === 'red') p = p.toUpperCase();
            if (piece.promoted) p = '+' + p;
            return p;
          } else return '1';
        })
        .join(''),
    )
    .join('/')
    .replace(/1{2,}/g, s => s.length.toString());
}
