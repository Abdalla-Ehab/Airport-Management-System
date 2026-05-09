export function showToast(message, type = 'info') {

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    const container =
        document.getElementById('toast-container');

    const toast =
        document.createElement('div');

    toast.className =
        `toast toast-${type}`;

    toast.innerHTML = `
        <span class="toast-icon">
            ${icons[type]}
        </span>

        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.animation =
            'slideOut 0.3s cubic-bezier(.4,0,.2,1) forwards';

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3800);
}