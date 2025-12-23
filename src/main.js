import './styles/main.css'

import { PrettyMagnetic } from 'pretty-magnetic'

// Initialize magnetic hover
try {
    const magnetic = new PrettyMagnetic('[data-magnetic]', {
        magneticRadius: 200,
        magneticStrength: 0.2,
    });

    const magneticSubmits = new PrettyMagnetic('[type="submit"]');
    // If you need to tear down later, keep a reference to `magnetic` and call `magnetic.destroy()`
} catch (err) {
	// Fail silently if the DOM isn't ready or the selector matches nothing
}
