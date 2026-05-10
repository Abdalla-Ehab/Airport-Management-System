export function show(element) {

    if (!element) return;

    element.classList.remove('hidden');
}

export function hide(element) {

    if (!element) return;

    element.classList.add('hidden');
}

export function toggle(element) {

    if (!element) return;

    element.classList.toggle('hidden');
}

export function qs(selector) {

    return document.querySelector(selector);
}

export function qsa(selector) {

    return document.querySelectorAll(selector);
}