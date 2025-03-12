import * as cg from './types.js';

export const initial: string =
  '6c4/1n2fh1hf2/3a2s2a1/2n1gt1tg2/2i3s3i/10/10/2I3S3I/2N1GT1TG2/3A2S2A1/1N2FH1HF2/6C4';

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

// const letters = {
//   commander: '*',
//   infantry: 'b',
//   tank: 't',
//   militia: 'd',
//   engineer: 'c',
//   artillery: 'p',
//   anti_air: 'f',
//   missile: 'l',
//   airforce: 'k',
//   navy: 'h',
//   headquarter: 's',
// };

export function read(fen: string): cg.Pieces {
  if (fen === 'start') fen = initial;
  const pieces: cg.Pieces = new Map();
  let row = 11,
    col = 0;
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
      default: {
        const nb = c.charCodeAt(0);
        if (nb < 57) col += nb - 48;
        else {
          const role = c.toLowerCase();
          pieces.set(pos2key([col, row]), {
            role: roles[role],
            color: c === role ? 'blue' : 'red',
            position: [col, row],
          });
          ++col;
        }
      }
    }
  }
  return pieces;
}

function pos2key([x, y]: [number, number]): cg.Key {
  return `${x}-${y}` as cg.Key;
}
console.log('read', read(initial));
