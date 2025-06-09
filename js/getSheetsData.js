//a function to retrieve data from a google sheets spreadsheet.
//the sheets ID, Name and Range are required to fetch data

async function getSheetData(sheetsDetails) {
  if (sheetsDetails === undefined) {
    return "no sheet ID";
  }
  let SHEET_ID, SHEET_TITLE, SHEET_RANGE, FULL_URL;

    SHEET_ID = sheetsDetails.sheetID;
    SHEET_TITLE = sheetsDetails.sheetName;
    SHEET_RANGE = sheetsDetails.sheetRange;
    FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

    fetch(FULL_URL)
      .then((res) => res.text())
      .then(async (rep) => {
        let sheetData = JSON.parse(rep.substring(47).slice(0, -2));
        console.log("fetched:", sheetData);
        const tableData = await sheetDataToObject(sheetData.table);

        const headers = sheetData.table.cols.map((obj) => obj["label"]);
        //return data to the main script
        loadData(headers, tableData);
      });
  }

//make an Array of objects from the Google Sheets Data
//the google sheet data is returned in columns and rows
//columns in the range are keys and
//rows are values
async function sheetDataToObject(sheetData) {
  if (typeof sheetData === "object") {
    const keys = sheetData.cols;
    const values = [];
    for (let i = 0; i < sheetData.rows.length; i++) {
      const rowValues = sheetData.rows[i];
      const obj = {};
      for (let j = 0; j < keys.length; j++) {
        if (!Object.is(rowValues.c[j], null)) {
          obj[keys[j].label] = rowValues.c[j].v;
        }
      }
      values.push(obj);
    }
    return values;
  }
}

//make an Array of objects from the Google Sheets Data Rows
//if the data is only in the rows of the fetched table
//row 1 in the range are keys and
//row 2+ are values
function sheetRowsToObject(arr) {
  if (Array.isArray(arr)) {
    const keys = arr[0].c;
    const slides = [];
    for (let i = 0; i < arr.length; i++) {
      const values = arr[i].c;
      const obj = {};
      for (let j = 0; j < keys.length; j++) {
        if (!Object.is(values[j], null)) {
          obj[keys[j].v] = values[j].v;
        }
      }
      slides.push(obj);
    }
    return slides;
  }

}