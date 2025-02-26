export const initial: string = '6c4/1h2fh1hf2/3a2g2a1/2h1gt1tg2/2i3d3i/10/10/2I3D3I/2N1GT1TG2/3A2G2A1/1H2FH1HF2/6C4';

export type File = (typeof files);
export type Rank = (typeof ranks);
export type Key = '0-0' | `${File}-${Rank}`;

const roles: { [letter: string]: string } = {
  c: 'commander',
  i: 'infantry',
  t: 'tank',
  d: 'militia',
  e: 'engineer',
  a: 'artillery',
  g: 'anti_air',
  m: 'missile',
  f: 'airforce',
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

export interface Piece {
  role: string;
  color: string;
  promoted?: boolean;
}

export type Pieces = Map<Key, Piece>;

export function read(fen: string): Pieces {
  if (fen === 'start') fen = initial;
  const pieces: Pieces = new Map();
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
      case '~': {
        const piece = pieces.get(pos2key([col - 1, row]));
        if (piece) piece.promoted = true;
        break;
      }
      default: {
        const nb = c.charCodeAt(0);
        if (nb < 57) col += nb - 48;
        else {
          const role = c.toLowerCase();
          pieces.set(pos2key([col, row]), {
            role: roles[role],
            color: c === role ? 'blue' : 'red',
          });
          ++col;
        }
      }
    }
  }
  return pieces;
}

export const files = 0|1|2|3|4|5|6|7|8|9|10 as const;
export const ranks = 0|1|2|3|4|5|6|7|8|9|10|11 as const;

function pos2key([x, y]: [number, number]): Key {
  return `${x}-${y}` as Key;
}
console.log('read',read(initial))