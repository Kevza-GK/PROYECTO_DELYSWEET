export const qs = (selector, raiz = document) => raiz.querySelector(selector);
export const qsa = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];
export const on = (elemento, evento, handler) => elemento.addEventListener(evento, handler);
export const crear = (etiqueta) => document.createElement(etiqueta);
export const limpiar = (elemento) => elemento.replaceChildren();
