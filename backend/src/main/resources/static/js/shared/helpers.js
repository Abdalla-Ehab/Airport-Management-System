export function escHtml(str) {

    if (!str) return '';

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function formatTime(dateString) {

    return new Date(dateString)
        .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
}