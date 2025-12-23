import './styles/main.css'

import { PrettyMagnetic } from 'pretty-magnetic'

// Simple SPA router: intercept internal links and form submits,
// fetch the server-rendered HTML, and swap #app content.

function initUI() {
    try {
        // Re-init magnetic hover for new content
        new PrettyMagnetic('[data-magnetic]', {
            magneticRadius: 200,
            magneticStrength: 0.2,
        });
        new PrettyMagnetic('[type="submit"]');
    } catch (_) {
        // Fail silently
    }
}

async function fetchAppContent(url, options = {}) {
    const res = await fetch(url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || undefined,
        credentials: 'same-origin',
    });
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const appEl = doc.querySelector('#app');
    return appEl ? appEl.innerHTML : doc.body.innerHTML;
}

async function navigate(url, { replace = false } = {}) {
    try {
        const app = document.getElementById('app');
        if (!app) {
            // No SPA container; fallback
            location.assign(url);
            return;
        }
        const inner = await fetchAppContent(url);
        app.innerHTML = inner;
        if (replace) {
            history.replaceState({}, '', url);
        } else {
            history.pushState({}, '', url);
        }
        initUI();
    } catch (_) {
        // Network or parse issue: fallback to full navigation
        location.assign(url);
    }
}

function shouldHandleLink(a) {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return false;
    // Only handle declared SPA links to be safe
    return a.hasAttribute('data-link');
}

function wireLinkInterception() {
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        if (!shouldHandleLink(a)) return;
        e.preventDefault();
        const url = a.getAttribute('href');
        if (!url) return;
        navigate(url);
    });
}

function wireFormInterception() {
    document.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        const action = form.getAttribute('action') || location.pathname;
        const method = (form.getAttribute('method') || 'GET').toUpperCase();
        // Intercept only POST forms within our app
        if (method !== 'POST') return;
        e.preventDefault();
        try {
            const fd = new FormData(form);
            const body = new URLSearchParams();
            for (const [k, v] of fd.entries()) {
                body.append(k, v);
            }
            const app = document.getElementById('app');
            if (!app) {
                form.submit();
                return;
            }
            const inner = await fetchAppContent(action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            app.innerHTML = inner;
            // Stay on the same URL (replace)
            history.replaceState({}, '', action);
            initUI();
        } catch (_) {
            form.submit();
        }
    });
}

function boot() {
    wireLinkInterception();
    wireFormInterception();
    initUI();
}

window.addEventListener('popstate', () => {
    navigate(location.pathname, { replace: true });
});

// Start the SPA enhancements after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
