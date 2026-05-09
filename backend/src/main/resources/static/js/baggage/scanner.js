import {
    showToast
}
from '../shared/toast.js';

export function initScanner() {

    const btn =
        document.getElementById(
            'scan-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        scanBag
    );
}

function scanBag() {

    const code =
        document.getElementById(
            'scan-code'
        ).value;

    if (!code) {

        showToast(
            'Enter barcode',
            'error'
        );

        return;
    }

    showToast(
        `Bag ${code} scanned`,
        'success'
    );
}