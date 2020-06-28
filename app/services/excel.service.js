const XLSX = require('xlsx');
const moment = require('moment');

const folderConfig = require('../../config/folder.config');

const logger = require('../util/logger');

module.exports = {
    exportData: (data, fileName, { prependTimestamp = true } = {}) => {
        // add timestamp to fileName if prependTimestamp is set to true, in order to prevent file overwrite
        const finalFileName = (prependTimestamp ? `${moment().format()}_` : '') + fileName;

        logger.info(`writing excel file ${finalFileName}`);

        if (!Array.isArray(data) || data.length === 0) {
            logger.warn(`no data for excel file ${finalFileName}`);
            return false;
        }

        try {
            const wb = XLSX.utils.book_new();
            const wsName = 'sheet';
            const header = Object.keys(data[0]);

            const wsData = [
                header
            ];

            for (const datum of data) {
                const row = [];
                for (const key of header) {
                    row.push(datum[key]);
                }
                wsData.push(row);
            }

            const ws = XLSX.utils.aoa_to_sheet(wsData);

            /* Add the worksheet to the workbook */
            XLSX.utils.book_append_sheet(wb, ws, wsName);
            const fullPath = `${folderConfig.excel}/${finalFileName}.xlsb`;
            XLSX.writeFile(wb, fullPath);

            return fullPath;
        }
        catch (e) {
            logger.error('unable to write excel file', e);
            return false;
        }
    }
};
