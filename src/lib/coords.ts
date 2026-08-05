/** Logical game resolution used by bridge layout. */
export const STAGE_WIDTH = 640;
export const STAGE_HEIGHT = 442;
export const STATUS_BAR_HEIGHT = 20;

/** BridgeScreen level-3 communicator geometry (relative to 640×442 stage). */
export const MESSAGE_RECT = { x: 342, y: 260, w: 298, h: 182 };
export const MESSAGE_OPEN_HIT = { x: 572, y: 292, w: 68, h: 170 };
/**
 * Closed tab sprite — full right strip of MESSAGE_RECT (not just the hitbox).
 * The open-hit rect starts 32px lower and would crop the tab’s rounded top.
 */
export const MESSAGE_CLOSED_TAB = {
  x: MESSAGE_OPEN_HIT.x,
  y: MESSAGE_RECT.y,
  w: MESSAGE_OPEN_HIT.w,
  h: MESSAGE_RECT.h,
};
export const MESSAGE_LIST = { x: 355, y: 287, w: 180, h: 138 };
export const ROW_HEIGHT = 25;

/**
 * Viewscreen overlay — left of the open screen menu (gap ~½ of prior),
 * tall enough to reach the bottom of the stage so long copy can scroll
 * underneath the communicator when it is open.
 */
export const VIEWSCREEN = { x: 36, y: 68, w: 420, h: 366 };

export const OPEN_FRAME_COUNT = 41;
export const CLOSE_FRAME_COUNT = 41;
export const FRAME_MS = Math.round(1000 / 17.89);
