export type querySelector = Element | null;
export type querySelectorAll = NodeListOf<Element>;

export const $ = (q: string): querySelector => document.querySelector(q);
export const $$ = (q: string): querySelectorAll => document.querySelectorAll(q);
export const durationFormat = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}