

import { HeadlessState } from "./state";
import { opposite } from "./util";

export function toggleOrientation(state: HeadlessState): void {
    state.orientation = opposite(state.orientation);
}