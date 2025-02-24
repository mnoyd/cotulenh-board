export interface HeadlessState {
    orientation?: 'red' | 'blue';
}

export interface State extends HeadlessState {
    dom: any;
  }

export function defaults(): HeadlessState {
  return {
    orientation: 'red'
  };
}
