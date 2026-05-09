
export function navigate(viewId) {

    document
        .querySelectorAll('.view')
        .forEach(v => v.classList.add('hidden'));

    const view = document.getElementById(viewId);

    if (view) {
        view.classList.remove('hidden');
    }
}
