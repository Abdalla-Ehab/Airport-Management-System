import {
    showToast
}
from '../shared/toast.js';

export function initBaggageDrop() {

    const btn =
        document.getElementById(
            'baggage-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        submitBaggage
    );
}

async function submitBaggage() {

    const weight =
        document.getElementById(
            'baggage-weight'
        ).value;

    const tag =
        document.getElementById(
            'baggage-tag'
        ).value;

    if (!weight || !tag) {

        showToast(
            'Please complete baggage info',
            'error'
        );

        return;
    }

    showToast(
        'Baggage checked successfully',
        'success'
    );
}