import { State } from './state.js';
import * as cg from './types.js';
import { baseMove, baseNewPiece } from './board.js';

export interface CarrierBlueprint {
  maxCapacity: number;
  canCarryRoles: cg.Role[][]; // 2D array: outer array = slots, inner array = allowed roles for that slot
}

export const humanlikeRoles: cg.Role[] = ['commander', 'infantry', 'militia'];
const heavyEquipment: cg.Role[] = ['artillery', 'anti_air', 'missile'];

const navyBlueprint: CarrierBlueprint = {
  maxCapacity: 2,
  canCarryRoles: [
    ['tank', 'air_force'], // Slot 0: tank or airforce
    [...humanlikeRoles, 'tank'], // Slot 1: humanlike or tank
  ],
};

const tankBlueprint: CarrierBlueprint = {
  maxCapacity: 1,
  canCarryRoles: [humanlikeRoles], // Slot 0: can carry humanlike role
};

const engineerBlueprint: CarrierBlueprint = {
  maxCapacity: 1,
  canCarryRoles: [heavyEquipment], // Slot 0: can carry heavy equipment
};

const airForceBlueprint: CarrierBlueprint = {
  maxCapacity: 2,
  canCarryRoles: [
    ['tank'], // Slot 0: can carry tank
    humanlikeRoles, // Slot 1: can carry humanlike roles
  ],
};

const headquarterBlueprint: CarrierBlueprint = {
  maxCapacity: 1,
  canCarryRoles: [['commander']], // Slot 0: can carry commander
};

export const carrierBlueprints: { [key in cg.Role]?: CarrierBlueprint } = {
  navy: navyBlueprint,
  tank: tankBlueprint,
  engineer: engineerBlueprint,
  air_force: airForceBlueprint,
  headquarter: headquarterBlueprint,
};

export function canCombine(carrier: cg.Piece, carried: cg.Piece): boolean {
  const blueprint = carrierBlueprints[carrier.role];
  if (!blueprint) {
    return false; // Role doesn't have a blueprint, can't carry anything
  }

  if (!carrier.carrying) {
    return blueprint.maxCapacity > 0; // Can carry if no carried pieces yet
  }

  if (carrier.carrying.length >= blueprint.maxCapacity) {
    return false; // Already at max capacity
  }

  const slotIndex = carrier.carrying.length; // Next available slot
  const allowedRolesForSlot = blueprint.canCarryRoles[slotIndex];

  if (!allowedRolesForSlot) {
    return false; // No more slots defined for carrying
  }

  return allowedRolesForSlot.includes(carried.role);
}

// function findCarrierPiece(
//   origPiece: cg.Piece,
//   destPiece: cg.Piece
// ): cg.Piece | undefined {
//   if(canCarry(origPiece.role, destPiece.role)){
//       return origPiece;
//   }
//   if(canCarry(destPiece.role, origPiece.role)){
//     return destPiece;
//   }
//   return undefined;
// }
// function canCarry(carrierRole: cg.Role, carriedRole: cg.Role): boolean{
//     const blueprint = carrierBlueprints[carrierRole];
//     if (!blueprint) return false;
//     return blueprint.canCarryRoles.some(slot => slot.includes(carriedRole));
// }
export function canCombineMultiple(carrier: cg.Piece, carried: cg.Piece[]): boolean {
  if (carried.length == 0) {
    return true;
  }
  for (const piece of carried) {
    if (!canCombine(carrier, piece)) {
      return false;
    }
  }
  if (
    carrier.carrying &&
    carrier.carrying.length + carried.length > carrierBlueprints[carrier.role]!.maxCapacity
  ) {
    return false;
  }
  return true;
}
// New combinePieces function
export function combinePieces(
  // state: State,
  carrier: cg.Piece,
  piecesToCarry: cg.Piece[],
): cg.Piece | undefined {
  if (canCombineMultiple(carrier, piecesToCarry)) {
    if (!carrier.carrying) carrier.carrying = [];
    carrier.carrying.push(...piecesToCarry);
    return carrier;
  }
  return undefined;
}

function flattenCarrying(piece: cg.Piece): cg.Piece[] {
  const flattened: cg.Piece[] = [];
  if (piece.carrying) {
    for (const carried of piece.carrying) {
      flattened.push(carried);
      flattened.push(...flattenCarrying(carried)); // Recursively flatten nested carrying
    }
  }
  return flattened;
}

export function movePiece(state: State, orig: cg.Key, dest: cg.Key, force?: boolean) {
  const origPiece = state.pieces.get(orig);
  const destPiece = state.pieces.get(dest);
  if (!origPiece) return;
  if (destPiece && destPiece.role === 'air_force' && origPiece.role === 'tank' && origPiece.carrying) {
    // If we jump on carrier
    const piecesToCarry = [origPiece, ...flattenCarrying(origPiece)];
    const combined = combinePieces(destPiece, piecesToCarry);
    if (combined) {
      state.pieces.delete(orig);
      state.pieces.set(dest, combined);
      return;
    }
  }
  if (!origPiece.carrying || origPiece.carrying.length === 0) {
    baseMove(state, orig, dest);
  }
  if (origPiece.carrying) {
    let tmp: cg.Piece = {
      role: origPiece.role,
      color: origPiece.color,
      carrying: origPiece.carrying,
    };
    baseNewPiece(state, tmp, dest, force);
    state.pieces.delete(orig);
  }
}
