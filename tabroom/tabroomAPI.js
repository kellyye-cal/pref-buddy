const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { format } = require('fast-csv');
require('dotenv').config({ path: '../.env.development' });

const {db, getPrefs} = require('../server/services/utils');

async function export_prefs_csv({t_id, u_id, filePath}) {
    try {
        const [prefs] = await getPrefs({t_id, u_id})

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const ws = fs.createWriteStream(filePath);
        const csvStream = format({ headers: true });

        csvStream.pipe(ws);
        prefs.forEach(row => csvStream.write(row));
        csvStream.end();

        return {status: "success", fileName: filePath}
    } catch (error) {
        console.error("Error exporting CSV: ", error);
        return {status: 'error', message: error.message}
    }
}

module.exports = {
    export_prefs_csv,
}