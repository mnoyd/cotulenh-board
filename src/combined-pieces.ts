import * as cg from './types.js';

export interface CarrierBlueprint {
  canCarryRoles: cg.Role[][]; // 2D array: outer array = slots, inner array = allowed roles for that slot
}

export const humanlikeRoles: cg.Role[] = ['commander', 'infantry', 'militia'];
const heavyEquipment: cg.Role[] = ['artillery', 'anti_air', 'missile'];

const navyBlueprint: CarrierBlueprint = {
  canCarryRoles: [
    ['air_force'], // Slot 0: tank or airforce
    [...humanlikeRoles, 'tank'], // Slot 1: humanlike or tank
  ],
};

const tankBlueprint: CarrierBlueprint = {
  canCarryRoles: [humanlikeRoles], // Slot 0: can carry humanlike role
};

const engineerBlueprint: CarrierBlueprint = {
  canCarryRoles: [heavyEquipment], // Slot 0: can carry heavy equipment
};

const airForceBlueprint: CarrierBlueprint = {
  canCarryRoles: [
    ['tank'], // Slot 0: can carry tank
    humanlikeRoles, // Slot 1: can carry humanlike roles
  ],
};

const headquarterBlueprint: CarrierBlueprint = {
  canCarryRoles: [['commander']], // Slot 0: can carry commander
};

const carrierBlueprints: { [key in cg.Role]?: CarrierBlueprint } = {
  navy: navyBlueprint,
  tank: tankBlueprint,
  engineer: engineerBlueprint,
  air_force: airForceBlueprint,
  headquarter: headquarterBlueprint,
};

function canCombine(carrier: cg.Piece, carried: cg.Piece): boolean {
  const blueprint = carrierBlueprints[carrier.role];
  if (!blueprint) {
    return false; // Role doesn't have a blueprint, can't carry anything
  }
  // Flatten all the pieces that need to be carried
  const allToBeCarried = [carried, ...(carried.carrying || []), ...(carrier.carrying || [])];

  if (allToBeCarried.length > blueprint.canCarryRoles.length) {
    return false; // Can't carry more than max capacity
  }
  const blueprintSlots = blueprint.canCarryRoles.slice();
  for (const piece of allToBeCarried) {
    // Find the first slot that can carry this role
    const index = blueprintSlots.findIndex(allowedRoles => allowedRoles.includes(piece.role));
    if (index < 0) {
      return false; // No slot available for this role
    }
    blueprintSlots.splice(index, 1); // Remove the slot from the blueprint
  }

  return true;
}

function determineCarrier(origPiece: cg.Piece, destPiece: cg.Piece): [cg.Piece, cg.Piece] | undefined {
  const blueprintOrig = carrierBlueprints[origPiece.role];
  const blueprintDest = carrierBlueprints[destPiece.role];

  if (blueprintOrig && canCombine(origPiece, destPiece)) {
    return [origPiece, destPiece];
  }
  if (blueprintDest && canCombine(destPiece, origPiece)) {
    return [destPiece, origPiece];
  }
  return undefined;
}

// The main function to try combining pieces
export function tryCombinePieces(origPiece: cg.Piece, destPiece: cg.Piece): cg.Piece | undefined {
  const carrierAndCarried = determineCarrier(origPiece, destPiece);
  if (!carrierAndCarried) {
    return undefined; // Combination not possible
  }

  const [carrier, carried] = carrierAndCarried;
  const piecesToCarry = [carried, ...(carried.carrying || [])];
  carried.carrying = undefined; // Clear the carrying as it have been flattened

  const combined = { ...carrier }; // Create a *copy* of the carrier
  if (!combined.carrying) {
    combined.carrying = [];
  }
  combined.carrying.push(...piecesToCarry);
  return combined;
}

export function findCarriedPieceMatching(
  piece: cg.Piece,
  predicate: (p: cg.Piece) => boolean,
): cg.Piece | undefined {
  if (!piece.carrying) {
    return undefined;
  }
  return piece.carrying.find(predicate);
}
