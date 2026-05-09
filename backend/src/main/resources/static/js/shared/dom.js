export function $(id) {
    return document.getElementById(id);
}

export function show(el) {
    el.classList.remove('hidden');
}

export function hide(el) {
    el.classList.add('hidden');
}

export function activate(el) {
    el.classList.add('active');
}

export function deactivate(el) {
    el.classList.remove('active');
}