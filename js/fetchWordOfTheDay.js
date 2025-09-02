async function setWord(){
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    console.log(searchParams)
    
    const SHEET_ID = searchParams.get("sheetID");
    const SHEET_TITLE = "Word";
    const SHEET_RANGE = "A1:A1";
    let sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
     fetch(sheetUrl)
        .then((res) => res.text())
        .then(async (rep) => {
            let sheetData = JSON.parse(rep.substring(47).slice(0, -2));
            await obs.call("SetInputSettings", {
                "inputName": "Word",
                "inputSettings": {
                    text: sheetData.table.rows[0].c[0].v
                }
            })
        })
}
