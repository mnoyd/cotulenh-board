import { State } from './state.js';
import * as cg from './types.js';
import { createEl, translate, posToTranslate } from './util.js';
import * as board from './board.js';
import * as util from './util.js';
import * as drag from './drag.js';

// interface CombinedPiecePopup {
//   containerEl: HTMLElement;
//   originalPiece: cg.Piece;
//   originalKey: cg.Key;
//   pieces: cg.Piece[];
// }

export function showCombinedPiecePopup(s: State, key: cg.Key, piece: cg.Piece, event: cg.MouchEvent): void {
  if (!piece.carrying || piece.carrying.length === 0) return;

  // Create popup container
  const containerEl = createEl('div', 'combined-piece-popup') as HTMLElement;
  const bounds = s.dom.bounds();
  const asRed = board.redPov(s);
  const posToTranslateFn = posToTranslate(bounds);
  const position = util.eventPosition(event)!;
  const pieceKey = board.getKeyAtDomPos(position, asRed, bounds);

  if (!pieceKey) return;

  // Position the popup closer to the clicked piece
  const piecePos = posToTranslateFn(util.key2pos(pieceKey), asRed);
  const totalPieces = piece.carrying.length + 1;
  const pieceWidth = 50;
  const gap = 8;
  const padding = 8;
  const popupWidth = totalPieces * pieceWidth + (totalPieces - 1) * gap + padding * 2;

  translate(containerEl, [
    piecePos[0] - popupWidth / 2, // Center horizontally
    piecePos[1] - 60, // Position closer to piece
  ]);

  // Add carrier piece to popup with drag support
  const carrierEl = createEl('piece', `${piece.color} ${piece.role}`) as cg.PieceNode;
  carrierEl.classList.add('carrier-piece');
  carrierEl.setAttribute('data-key', key);
  if (piece.promoted) {
    const pieceStar = createEl('cg-piece-star') as HTMLElement;
    pieceStar.style.zIndex = '3';
    carrierEl.appendChild(pieceStar);
  }

  // Make carrier piece interactive with both click and drag
  carrierEl.addEventListener('mousedown', (e: MouseEvent) => {
    e.stopPropagation();
    if (e.button === 0) {
      // Left click only
      if (e.ctrlKey || e.shiftKey) {
        // Handle selection for the whole stack
        handlePieceSelection(s, key);
        removeCombinedPiecePopup(s);
      } else {
        // Start dragging the whole stack
        drag.dragNewPiece(s, piece, e, false, key);
        removeCombinedPiecePopup(s);
      }
    }
  });

  containerEl.appendChild(carrierEl);

  // Add carried pieces to popup with drag support
  piece.carrying.forEach((carriedPiece, index) => {
    const pieceEl = createEl('piece', `${carriedPiece.color} ${carriedPiece.role}`) as cg.PieceNode;
    pieceEl.setAttribute('data-index', index.toString());
    pieceEl.style.cursor = 'grab';

    if (carriedPiece.promoted) {
      const pieceStar = createEl('cg-piece-star') as HTMLElement;
      pieceStar.style.zIndex = '3';
      pieceEl.appendChild(pieceStar);
    }

    // Handle both click and drag for carried pieces
    pieceEl.addEventListener('mousedown', (e: MouseEvent) => {
      e.stopPropagation();
      if (e.button === 0) {
        // Left click only
        if (e.ctrlKey || e.shiftKey) {
          // Handle selection
          handleCarriedPieceSelection(s, key, piece, index);
        } else {
          // Start dragging the individual piece
          startCarriedPieceDrag(s, key, piece, index, e);
        }
        removeCombinedPiecePopup(s);
      }
    });

    containerEl.appendChild(pieceEl);
  });

  // Add popup to DOM and handle positioning
  s.dom.elements.board.appendChild(containerEl);

  // Ensure popup stays within board bounds
  const popupBounds = containerEl.getBoundingClientRect();
  const boardBounds = s.dom.elements.board.getBoundingClientRect();

  // Adjust horizontal position if needed
  if (popupBounds.left < boardBounds.left) {
    translate(containerEl, [0, popupBounds.top - boardBounds.top]);
  } else if (popupBounds.right > boardBounds.right) {
    translate(containerEl, [boardBounds.width - popupBounds.width, popupBounds.top - boardBounds.top]);
  }

  // Adjust vertical position if needed
  if (popupBounds.top < boardBounds.top) {
    translate(containerEl, [
      popupBounds.left - boardBounds.left,
      piecePos[1] + 100, // Show below the piece if not enough space above
    ]);
  }

  // Close popup when clicking outside
  const closeHandler = (e: MouseEvent) => {
    if (!containerEl.contains(e.target as Node)) {
      removeCombinedPiecePopup(s);
      document.removeEventListener('mousedown', closeHandler);
    }
  };
  document.addEventListener('mousedown', closeHandler);
}

// New function to handle piece selection
function handlePieceSelection(s: State, key: cg.Key): void {
  board.selectSquare(s, key);
  s.dom.redraw();
}

// New function to handle carried piece selection
function handleCarriedPieceSelection(
  s: State,
  originalKey: cg.Key,
  originalPiece: cg.Piece,
  pieceIndex: number,
): void {
  //   const carriedPiece = originalPiece.carrying![pieceIndex];

  // Store the selection info without modifying the pieces map
  s.selectedPieceInfo = {
    originalKey,
    originalPiece,
    carriedPieceIndex: pieceIndex,
    isFromStack: true,
  };

  // Select the original key to maintain the visual state
  s.selected = originalKey;

  s.dom.redraw();
}

// Add this function to check if a piece in a stack is selected
export function isStackPieceSelected(s: State, index: number): boolean {
  return !!(
    s.selectedPieceInfo?.isFromStack &&
    s.selectedPieceInfo.originalKey === s.selected &&
    s.selectedPieceInfo.carriedPieceIndex === index
  );
}

// New function to handle dragging a carried piece
function startCarriedPieceDrag(
  s: State,
  originalKey: cg.Key,
  originalPiece: cg.Piece,
  pieceIndex: number,
  e: MouseEvent,
): void {
  const carriedPiece = originalPiece.carrying![pieceIndex];

  // Store the selection info for the move handling
  s.selectedPieceInfo = {
    originalKey,
    originalPiece,
    carriedPieceIndex: pieceIndex,
    isFromStack: true,
  };

  // Start the drag operation
  drag.dragNewPiece(s, carriedPiece, e, false);
}

function removeCombinedPiecePopup(s: State): void {
  const popup = s.dom.elements.board.querySelector('.combined-piece-popup');
  if (popup) {
    popup.remove();
  }
}
