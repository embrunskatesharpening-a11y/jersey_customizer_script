// JerseyNameNumber8_WORKING.jsx

// Function to guard against null/empty templatePath in importJerseyTemplate
function importJerseyTemplate(templatePath) {
    if (!templatePath) {
        throw new Error('Template path cannot be null or empty');
    }
    // existing code...
}

// Function to read template dimensions with guard against null/empty templatePath
function readTemplateDimensions(templatePath) {
    if (!templatePath) {
        throw new Error('Template path cannot be null or empty');
    }
    // existing code...
}

// CSV line parser that respects quoted fields
function parseCSV(line) {
    const result = []; 
    let current = ''; 
    let inQuotes = false; 

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = ''; 
        } else {
            current += char;
        }
    }
    result.push(current); // Add the last value
    return result;
}

// Update parsePresetsCSV to use the new CSV parser
function parsePresetsCSV(line) {
    return parseCSV(line);
}

// Adding divide-by-zero guards in scaleToFitArtboard
function scaleToFitArtboard(scaleFactor) {
    if (scaleFactor === 0) {
        throw new Error('Scale factor cannot be zero');
    }
    // existing code...
}

// Clamp critical numeric CFG values after dialog apply
function applyCFGValues(cfg) {
    cfg.jerseyRatio = Math.max(cfg.jerseyRatio, 0); // example clamp
    cfg.proofMargin = Math.max(0, Math.min(cfg.proofMargin, 100)); // example range
    // existing code...
}

// Wrap templateLayer.opacity assignment in try/catch
function setOpacity(templateLayer, value) {
    try {
        templateLayer.opacity = value;
    } catch (e) {
        console.error('Error setting opacity:', e);
    }
}

// In restoreLastCFG ignore keys beginning with '_'
function restoreLastCFG(cfg) {
    for (const key in cfg) {
        if (!key.startsWith('_')) {
            // restore logic...
        }
    }
}