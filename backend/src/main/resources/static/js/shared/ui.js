export function initUI() {

    initDropdowns();

    initTabs();

    initSidebar();

    initCardHover();

    initAnimatedButtons();
}

function initDropdowns() {

    document
        .querySelectorAll('.dropdown-toggle')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const menu =
                    btn.nextElementSibling;

                if (!menu) return;

                menu.classList.toggle('show');
            });
        });

    document.addEventListener('click', e => {

        document
            .querySelectorAll('.dropdown-menu')
            .forEach(menu => {

                if (
                    !menu.previousElementSibling?.contains(e.target) &&
                    !menu.contains(e.target)
                ) {

                    menu.classList.remove('show');
                }
            });
    });
}

function initTabs() {

    document
        .querySelectorAll('[data-tab]')
        .forEach(tab => {

            tab.addEventListener('click', () => {

                const target =
                    tab.dataset.tab;

                const parent =
                    tab.closest('.tabs-container');

                if (!parent) return;

                parent
                    .querySelectorAll('[data-tab]')
                    .forEach(t => {
                        t.classList.remove('active');
                    });

                parent
                    .querySelectorAll('.tab-content')
                    .forEach(c => {
                        c.classList.add('hidden');
                    });

                tab.classList.add('active');

                const content =
                    document.getElementById(target);

                if (content) {
                    content.classList.remove('hidden');
                }
            });
        });
}

function initSidebar() {

    const toggle =
        document.getElementById('sidebar-toggle');

    const sidebar =
        document.getElementById('sidebar');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {

        sidebar.classList.toggle('collapsed');
    });
}

function initCardHover() {

    document
        .querySelectorAll('.hover-lift')
        .forEach(card => {

            card.addEventListener('mouseenter', () => {

                card.style.transform =
                    'translateY(-4px)';
            });

            card.addEventListener('mouseleave', () => {

                card.style.transform =
                    '';
            });
        });
}

function initAnimatedButtons() {

    document
        .querySelectorAll('.btn-primary')
        .forEach(btn => {

            btn.addEventListener('mouseenter', () => {

                btn.style.transform =
                    'scale(1.03)';
            });

            btn.addEventListener('mouseleave', () => {

                btn.style.transform =
                    '';
            });
        });
}