const GoogleSpreadsheet = require('google-spreadsheet');

/** The Google Sheet ID, obtained from the URL. */
const SHEET_ID = '';
/** The worksheet number within the Sheet, starting at 1. */
const SHEET_NUMBER = 1;
/** Secret credentials issued from Google API Console. Only these two are required. */
const SECRET_CREDS = {
  client_email: '',
  private_key: '',
};

/**
 * Authenticate the sheet by applying secret credentials.
 *
 * @param {object} sheet - The google-spreadsheet object.
 * @returns {Promise} Promise that resolves when google-spreadsheet calls back.
 */
const authenticate = sheet => new Promise(res => sheet.useServiceAccountAuth(SECRET_CREDS, res));

/**
 * Add a row to the Sheet using the google-spreadsheet library.
 *
 * @param {object} sheet - The google-spreadsheet object.
 * @param {object} customFields - The row data as key-value (header-value) pairs.
 * @returns {Promise} Promise that resolves when the row has been added.
 */
const addRow = (sheet, customFields) => new Promise((resolve, reject) => {
  sheet.addRow(SHEET_NUMBER, customFields, (err, row) => {
    if (err) {
      reject(err);
      return;
    }
    
    resolve(row);
  });
});

/**
 * Run an async function and take care of calling done() and catching any errors.
 *
 * @param {function} f - The function to run.
 */
const runAsync = f => f().catch(e => logger.error(e.message || (e.errors && e.errors[0]) || e)).then(done);

// @filter(onActionCreated) action.type=_AddRow
const onActionCreated = event => runAsync(async () => {
  logger.info(`Got data: ${JSON.stringify(event.action.customFields)}`);

  const sheet = new GoogleSpreadsheet(SHEET_ID);
  await authenticate(sheet);

  const row = await addRow(sheet, event.action.customFields);
  logger.info(`Row added: ${JSON.stringify(row)}`);
});

module.exports = {
  onActionCreated,
}
