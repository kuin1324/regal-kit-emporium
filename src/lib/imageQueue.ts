/**
 * Globale wachtrij die het aantal gelijktijdige foto-downloads beperkt.
 * Te veel parallelle requests laat de browser verbindingen afbreken
 * (ERR_INSUFFICIENT_RESOURCES) waardoor foto's als placeholder eindigen.
 */
const MAX_PARALLEL = 6;

let active = 0;
const queue: Array<() => void> = [];

const pump = () => {
  while (active < MAX_PARALLEL && queue.length) {
    const next = queue.shift()!;
    active++;
    next();
  }
};

/** Vraag een slot aan; roept `start` aan zodra er ruimte is. Geeft een annuleer-functie terug. */
export const acquireImageSlot = (start: () => void) => {
  let cancelled = false;
  const task = () => {
    if (cancelled) {
      active--;
      pump();
      return;
    }
    start();
  };
  queue.push(task);
  pump();
  return () => {
    cancelled = true;
    const i = queue.indexOf(task);
    if (i >= 0) queue.splice(i, 1);
  };
};

/** Meld dat een foto klaar is (geladen of mislukt) zodat het volgende slot vrijkomt. */
export const releaseImageSlot = () => {
  if (active > 0) active--;
  pump();
};
