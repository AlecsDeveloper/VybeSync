export type querySelector = Element | null;
export type querySelectorAll = NodeListOf<Element>;

export const $ = (q: string): querySelector => document.querySelector(q);
export const $$ = (q: string): querySelectorAll => document.querySelectorAll(q);