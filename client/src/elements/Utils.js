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

function formatDateSlash(isoDate) {
    const date = new Date(isoDate);

    const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
                      `${date.getDate().toString().padStart(2, '0')}/` +
                      `${date.getFullYear().toString().slice(-2)}`

    return formatted;
}

function formatDateLong(isoDate) {
    const date = new Date(isoDate);

    const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return formatted;
}


function parseCite(authors, publisher, publishDateISO) {
    const getLastName = (fullName) => {
        const parts = fullName.trim().split(' ');
        return parts[parts.length - 1]
    }

    var name;
    if (authors?.length === 0 || !authors) {
        name = publisher
    } else if (authors?.length === 1) {
        name = getLastName(authors[0])
    } else if (authors?.length === 2) {
        name = getLastName(authors[0]) + ' & ' + getLastName(authors[1]);
    } else {
        name = getLastName(authors[0]) + "et al"
    }

    const publishDate = new Date(publishDateISO)
    return name + ' ' + publishDate.getFullYear().toString().slice(-2);
}

function parseSource(card) {
    return `[${card.source?.join(', ')},
            "${card.title}",
            Published ${formatDateLong(card.datePublished)},
            Accessed ${formatDateLong(card.dateScraped)}
            ${card.url},
            ]`
}

module.exports = {
    sanitizeInput,
    sanitizeFilename,
    sanitizeJudgeNotes,
    formatDateSlash,
    formatDateLong,
    parseCite,
    parseSource
}