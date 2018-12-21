const GoogleSpreadsheet = require('google-spreadsheet');

/**
 * The Google Sheet ID, obtained from the URL.
 */
const SHEET_ID = '';
/**
 * Secret credentials issued from Google API Console. Only these two are required.
 */
const SECRET_CREDS = {
  client_email: '',
  private_key: '',
};
/**
 * The worksheet number within the Sheet, starting at 1.
 */
const SHEET_NUMBER = 1;

/**
 * Load the sheet using the SHEET_ID
 * @returns {Promise} Promise that resolves to the google-spreadsheet object.
 */
const loadSheet = () => new Promise(resolve => resolve(new GoogleSpreadsheet(SHEET_ID)));

/**
 * Authenticate the sheet by applying secret credentials.
 *
 * @param {object} sheet - The google-spreadsheet object.
 * @returns {Promise} Promise that resolves when google-spreadsheet calls back.
 */
const authenticate = sheet => new Promise((resolve) => {
  sheet.useServiceAccountAuth(SECRET_CREDS, () => resolve(sheet));
});

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

// @filter(onActionCreated) action.type=_AddRow
const onActionCreated = (event) => {
  const { customFields } = event.action;
  loadSheet()
    .then(authenticate)
    .then(sheet => addRow(sheet, customFields))
    .then(res => logger.info(`Row added: ${JSON.stringify(res)}`))
    .catch(logger.error)
    .then(done);
};
