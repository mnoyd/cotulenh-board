import * as cg from './types.js';

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

function determineCarrier(origPiece: cg.Piece, destPiece: cg.Piece): [cg.Piece, cg.Piece] | undefined {
  const blueprint1 = carrierBlueprints[origPiece.role];
  const blueprint2 = carrierBlueprints[destPiece.role];

  if (blueprint1 && !blueprint2) {
    return [origPiece, destPiece];
  } else if (!blueprint1 && blueprint2) {
    return [destPiece, origPiece];
  } else if (blueprint1 && blueprint2) {
    // Both can carry, check if one can carry the other
    if (canCombine(origPiece, destPiece)) {
      return [origPiece, destPiece];
    } else if (canCombine(destPiece, origPiece)) {
      return [destPiece, origPiece];
    } else {
      return undefined; // Neither can carry the other
    }
  } else {
    return undefined; // Neither is a carrier
  }
}

// The main function to try combining pieces
export function tryCombinePieces(origPiece: cg.Piece, destPiece: cg.Piece): cg.Piece | undefined {
  const carrierAndCarried = determineCarrier(origPiece, destPiece);
  if (!carrierAndCarried) {
    return undefined; // Combination not possible
  }

  const [carrier, carried] = carrierAndCarried;
  const piecesToCarry = [carried, ...(carried.carrying || [])];

  if (canCombineMultiple(carrier, piecesToCarry)) {
    const combined = { ...carrier }; // Create a *copy* of the carrier
    if (!combined.carrying) {
      combined.carrying = [];
    }
    combined.carrying.push(...piecesToCarry);
    return combined;
  }

  return undefined; // Combination failed even with a valid carrier
}
