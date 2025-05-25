export type querySelector = Element | null;
export type querySelectorAll = NodeListOf<Element>;

export const $ = (q: string): querySelector => document.querySelector(q);
export const $$ = (q: string): querySelectorAll => document.querySelectorAll(q);

export const durationFormat = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const timeFormat = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hrs > 0) parts.push(`${hrs}hr${hrs > 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins}min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}sec`);

  return parts.join(" ");
};