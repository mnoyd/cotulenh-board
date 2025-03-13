// /src/air-defense.ts
import * as cg from './types.js';
import { key2pos, pos2key } from './util.js';
import { State } from './state.js';

// Define Influence Zone Data
type AirDefenseInfluenceZone = {
  [key in cg.Role]?: (pos: cg.Pos) => cg.Pos[];
};

// Helper function to check if a position is valid on the board
function isValidPos(pos: number[]): pos is cg.Pos {
  return pos.length === 2 && pos[0] >= 0 && pos[0] <= 11 && pos[1] >= 0 && pos[1] <= 11;
}

export const airDefenseInfluenceZones: AirDefenseInfluenceZone = {
  anti_air: (pos: cg.Pos) => {
    const potentialPositions: number[][] = [
      [pos[0], pos[1] + 1], // up
      [pos[0], pos[1] - 1], // down
      [pos[0] - 1, pos[1]], // left
      [pos[0] + 1, pos[1]], // right
      pos, // self
    ];
    return potentialPositions.filter(isValidPos);
  },
  navy: (pos: cg.Pos) => {
    const potentialPositions: number[][] = [
      [pos[0], pos[1] + 1], // up
      [pos[0], pos[1] - 1], // down
      [pos[0] - 1, pos[1]], // left
      [pos[0] + 1, pos[1]], // right
      pos, // self
    ];
    return potentialPositions.filter(isValidPos);
  },
  missile: (pos: cg.Pos) => {
    const potentialPositions: number[][] = [
      // Direct intersections
      [pos[0], pos[1] + 1], // up 1
      [pos[0], pos[1] + 2], // up 2
      [pos[0], pos[1] - 1], // down 1
      [pos[0], pos[1] - 2], // down 2
      [pos[0] - 1, pos[1]], // left 1
      [pos[0] - 2, pos[1]], // left 2
      [pos[0] + 1, pos[1]], // right 1
      [pos[0] + 2, pos[1]], // right 2
      // Diagonals
      [pos[0] - 1, pos[1] - 1], // down left
      [pos[0] - 1, pos[1] + 1], // up left
      [pos[0] + 1, pos[1] - 1], // down right
      [pos[0] + 1, pos[1] + 1], // up right
      pos, // self
    ];
    return potentialPositions.filter(isValidPos);
  },
};

// Generic function to update influence zones
export function updateAirDefenseInfluenceZones(s: State, airForceColor: cg.Color) {
  const pieces = s.pieces;
  const airDefenseRoles: cg.Role[] = ['anti_air', 'navy', 'missile'];
  s.highlight.custom.clear();

  for (const [key, piece] of pieces) {
    if (airDefenseRoles.includes(piece.role) && piece.color !== airForceColor) {
      const getInfluence = airDefenseInfluenceZones[piece.role];
      if (!getInfluence) continue; // No influence defined for this piece type

      const pos = key2pos(key as cg.Key);
      const influence = getInfluence(pos);
      influence.forEach(infPos => {
        s.highlight.custom.set(pos2key(infPos), 'air-defense-influence');
      });
    }
  }
}
