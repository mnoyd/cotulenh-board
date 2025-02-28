import * as cg from './types.js';

export interface DrawShape {
  orig: cg.Key;
  dest?: cg.Key;
  brush?: string; // if no brush, no shape. label moved to top right of square
  modifiers?: DrawModifiers;
  piece?: DrawShapePiece;
  customSvg?: { html: string; center?: 'orig' | 'dest' | 'label' }; // 100 x 100 viewbox cenetered at [50,50]
  label?: { text: string; fill?: string }; // fill is in '#rrggbb' format
}

export interface DrawModifiers {
  lineWidth?: number;
  hilite?: boolean;
}

export interface DrawShapePiece {
  role: cg.Role;
  color: cg.Color;
  scale?: number;
}

export interface DrawBrush {
  key: string;
  color: string;
  opacity: number;
  lineWidth: number;
}

export interface DrawBrushes {
  green: DrawBrush;
  red: DrawBrush;
  blue: DrawBrush;
  yellow: DrawBrush;
  [color: string]: DrawBrush;
}

export interface Drawable {
    enabled: boolean; // can draw
    visible: boolean; // can view
    defaultSnapToValidMove: boolean;
    eraseOnClick: boolean;
    onChange?: (shapes: DrawShape[]) => void;
    shapes: DrawShape[]; // user shapes
    autoShapes: DrawShape[]; // computer shapes
    current?: DrawCurrent;
    brushes: DrawBrushes;
    prevSvgHash: string;
  }


export interface DrawCurrent {
    orig: cg.Key; // orig key of drawing
    dest?: cg.Key; // shape dest, or undefined for circle
    mouseSq?: cg.Key; // square being moused over
    pos: cg.NumberPair; // relative current position
    brush: cg.BrushColor; // brush name for shape
    snapToValidMove: boolean; // whether to snap to valid piece moves
  }