import './styles/main.css'
import '@hotwired/turbo'

import { PrettyMagnetic } from 'pretty-magnetic'

function initUI() {
    try {
        new PrettyMagnetic('[data-magnetic]', {
            magneticRadius: 200,
            magneticStrength: 0.2,
        });
        new PrettyMagnetic('[type="submit"]');
    } catch (_) {
        // Fail silently
    }
}

// Initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}

// Re-run after Turbo navigations and form submissions
document.addEventListener('turbo:load', initUI);
