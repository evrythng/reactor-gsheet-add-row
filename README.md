# reactor-gsheet-add-row

Reactor Extension script that adds a row to a Google Sheet spreadsheet each time
an appropriate action is created. The action's `customFields` contain an object
whose keys are Sheet column headings, and values are the values for the new row.


## Installation

1. `git clone https://github.com/evrythng/reactor-gsheet-add-row`
2. Copy `main.js` to a Reactor script configuration screen in the EVRYTHNG
   Dashboard on an application details page.
3. Set up the configuration values as detailed in _Usage_ below.


## Usage

1. Create a Google Sheet and note the ID in the URL, or use an existing one.
2. Enter the headers in row 1 - these will be `customFields` keys.
3. Create a Service Account in Google API Console (with Sheets API enabled) and
   save the credentials JSON file offered.
4. Share the Sheet with the Service Account user by email address with the edit
   permission enabled.
5. Set the` SHEET_ID`, then the `SECRET_CREDS` in the Reactor script with values
   from the downloaded JSON file, then save the Reactor script.
5. Create an action of type `_AddRow` with row data as `customField` values. An
   example is shown below:

```
POST /actions/_AddRow
Content-Type: application/json
Authorization: $TRUSTED_APPLICATION_API_KEY

{
  "type": "_AddRow",
  "customFields": {
    "Index": "1",
    "Date": "21/12/18",
    "Updated": "28397",
    "Deleted": "23"
  }
}
```

The above will result in the following sheet layout (if it was the first row 
added):

```
Index  Date      Updated  Deleted
1      21/12/18  28397    23
```

Each subsequent action will add another row from the first blank row found, from
the top of the worksheet.

> Note: Due to how `google-spreadsheet` works, there can be no blank rows, and
> the headers must be in row 1.
