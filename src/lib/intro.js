/*
  First-visit intro: the PS logo on navy, the same screen used between pages.
  Pages that run an entrance animation wait for it with whenIntroDone(), so
  their animation plays after the logo lifts instead of behind it.
*/

let done = false;
const listeners = new Set();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function isIntroDone() {
  return done;
}

/** Calls fn once the intro has lifted (immediately if it already has). Returns an unsubscribe. */
export function whenIntroDone(fn) {
  if (done) { fn(); return () => {}; }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
