document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('[data-menu-toggle]');
    const backdrop = document.getElementById('sidebarBackdrop');
    const body = document.body;

    const closeSidebar = () => body.classList.remove('sidebar-open');

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            body.classList.toggle('sidebar-open');
        });
    });

    backdrop?.addEventListener('click', closeSidebar);

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            body.classList.remove('sidebar-open');
        }
    });
});

