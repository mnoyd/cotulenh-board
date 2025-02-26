export interface HeadlessState {
  orientation?: 'red' | 'blue';
  coordinates?: boolean;
}

export interface State extends HeadlessState {
  dom: any;
  coordinates: boolean;
}

export function defaults(): HeadlessState {
  return {
    orientation: 'red',
    coordinates: true,
  };
}
