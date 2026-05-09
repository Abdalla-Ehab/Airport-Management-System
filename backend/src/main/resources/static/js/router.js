export function navigate(viewId) {

    document
        .querySelectorAll('.view')
        .forEach(v => {

            v.classList.add('hidden');
            v.classList.remove('active');
        });

    const target =
        document.getElementById(
            `view-${viewId}`
        );

    if (!target) return;

    target.classList.remove('hidden');

    target.classList.add('active');
}