export interface Api {
  redrawAll: any;
  state: any;
}

export function start(state: any, redrawAll: any): Api {
  return {
    redrawAll,
    state,
  };
}
