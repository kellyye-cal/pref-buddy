const validator = require('validator');

function sanitizeInput(input) {
    return validator.escape(input.trim());
}

function sanitizeFilename(input) {
    return input
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .replace(/\s+/g, ' ')             
        .trim();
}

function sanitizeJudgeNotes(input) {
    return validator.escape(input)
}

module.exports = {
    sanitizeInput,
    sanitizeFilename,
    sanitizeJudgeNotes,
}