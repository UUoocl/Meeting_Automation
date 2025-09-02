async function fetchLoop(sheetURL) {
    fetch(sheetURL)
        .then((res) => res.text())
        .then(async (rep) => {
            data = JSON.parse(rep.substr(47).slice(0, -2));
            // console.log(data)
            //if(!Array.isArray(currentData)){

            //set the currentData variable on page load
            if ((typeof currentData) !== 'object') {
                console.log("init currentData", data.table.rows)
                //update currentData variable for next comparison
                currentData = data.table.rows;
            }

            //if Sheet values changed
            if (JSON.stringify(currentData) !== JSON.stringify(data.table.rows)) {
                //convert new sheet data to an array
                const newDataArray = rowObjectToArray(data.table.rows);
                console.log("new data after rows to object",newDataArray); // Output: 
                
                //convert current sheet data to an array
                const currentDataArray = rowObjectToArray(currentData);
                console.log("current data after rows to object",currentDataArray); // Output: 
                //find changed values

                const newValues = findChanges(currentDataArray, newDataArray);
                console.log("newValues", newValues)


                newValues.forEach( async (value) => {
                    value = JSON.parse(value)
                    console.log(value)
                //Change lower third Content
                    if (value.hasOwnProperty('lowerThirdSlideNumber')) {
                        console.log("lowerthird found")
                        //Transition slides when changing sections
                        msg = { setSection: value.lowerThirdSlideNumber };
                        console.log(msg)
                        await obs.call("CallVendorRequest", {
                            vendorName: "obs-browser",
                            requestType: "emit_event",
                            requestData: {
                                event_name: "lowerSectionChange",
                                event_data: { msg },
                            },
                        });
                        //hide
                        // disableSource('Meeting', 'lower_Thirds+').then(async () =>
                        //Show
                        // {
                        //     await setTimeout(() => {
                        //         enableSource('Meeting', 'lower_Thirds+')
                        //     }
                        //         , 300);
                        //     msg = { setSection: value.lowerThirdSlideNumber };
                        //     console.log(msg)
                        //     await obs.call("CallVendorRequest", {
                        //         vendorName: "obs-browser",
                        //         requestType: "emit_event",
                        //         requestData: {
                        //             event_name: "lowerSectionChange",
                        //             event_data: { msg },
                        //         },
                        //     });
                        // }
                        // )
                    }

                //Color Changed
                    if (value.hasOwnProperty('Color')) {
                        msg = { setColor: value.Color };
                        await obs.call("CallVendorRequest", {
                            vendorName: "obs-browser",
                            requestType: "emit_event",
                            requestData: {
                                event_name: "colorChange",
                                event_data: { msg },
                            },
                        });

                    }
                
                    //Slide Visibity changed 
                    if (value.hasOwnProperty('SlideVisibility')) {
                        if (value.SlideVisibility === "Show") {
                            enableSource('Meeting', 'sheet_Slides+')
                            enableSource('Cameras Segment', 'Speaker Segment')
                        }
                        else {
                            disableSource('Meeting', 'sheet_Slides+')
                            setTimeout(() => disableSource('Cameras Segment', 'Speaker Segment'), 200)
                        }
                    }

                    //Change Slide Content
                    if (value.hasOwnProperty('SlideNumber')) {
                        //Transition slides when changing sections
                        //if (value.SlideVisibility === "Show" && value.Camera === "Speaker") {
                            msg = { setSection: value.SlideNumber };
                            await obs.call("CallVendorRequest", {
                                vendorName: "obs-browser",
                                requestType: "emit_event",
                                requestData: {
                                    event_name: "SlideChange",
                                    event_data: { msg },
                                },
                            });
                        //}

                    }

                    //show word of the day
                    if (value.hasOwnProperty('showWord')) {
                        //Transition slides when changing sections
                        //if (value.SlideVisibility === "Show" && value.Camera === "Speaker") {
                            //msg = { setSection: value.SlideNumber };
                            // await obs.call("CallVendorRequest", {
                            //     vendorName: "obs-browser",
                            //     requestType: "emit_event",
                            //     requestData: {
                            //         event_name: "showWord",
                            //         // event_data: { msg },
                            //     },
                            // });

                        await obs.call("SetSceneItemEnabled", {
                            sceneName: "Word",
                            sceneItemId: 2,
                            sceneItemEnabled: true
                        }).then(setTimeout(async () => {
                            obs.call("SetSceneItemEnabled", {
                                sceneName: "Word",
                                sceneItemId: 2,
                                sceneItemEnabled: false
                            })
                        }, 5000))
            
                    }

                    //Camera Changed
                    if (value.hasOwnProperty('Camera')) {
                        if (value.Camera === "Speaker") {
                            enableSource('Cameras', 'Speaker')
                        }
                        if (value.Camera === "Audience") {
                            disableSource('Cameras', 'Speaker')
                            enableSource('Cameras', 'Audience')
                        }
                        if (value.Camera === "Zoom") {
                            disableSource('Cameras', 'Speaker')
                            disableSource('Cameras', 'Audience')
                        }
                        // else {
                        //     disableSource('TM-Timer-App', 'Camera Speaker')
                        //     disableSource('TM-Timer-App', 'Camera Speaker Segment')
                        //     disableSource('TM-Timer-App', 'Browser Agenda Slides')
                        // }
                    }
                    //run OBS command
                    // switch(value.type){
                    //     //SetCurrentProgramScene, sceneName
                    //     case 'Scene':{
                    //         await obs.call("SetCurrentProgramScene",{sceneName: value.name})
                    //         break;
                    //     }
                    //     //SetSceneItemEnabled, sceneItemId
                    //     case 'Group':
                    //     case 'Source':{
                    //         await obs.call("SetSceneItemEnabled",{
                    //             sceneName: value.sceneName,
                    //       		sceneItemId: Number(value.itemID),
                    //             sceneItemEnabled: value.visibility,
                    //         })
                    //         break;
                    //     }
                    //     //SetSourceFilterEnabled, filterName                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    //     case 'Filter':{
                    //         await obs.call("SetSourceFilterEnabled",{
                    //             sourceName: value.sourceName,
                    //       		filterName: value.name,
                    //             filterEnabled: value.visibility
                    //         })
                    //         break;
                    //     }

                    // }
                })
            }
            //update currentData variable for next comparison
            currentData = data.table.rows;
        });
}

function rowObjectToArray(sheetRows) {
    const keysLength = Object.keys(sheetRows).length
    const flatArray = [];
    console.log(sheetRows)
    for (let i = 0; i < keysLength; i++) {
        flatArray.push(sheetRows[i].c[0].v);
        flatArray.push(sheetRows[i].c[1].v);
    }
    return flatArray;
}

function findChanges(original, modified) {
    const changes = [];
    console.log("original", original)
    console.log("modified", modified)
    for (const key in modified) {
        if (modified.hasOwnProperty(key)) {
            if (!original.hasOwnProperty(key) || original[key] !== modified[key]) {
                changes.push(modified[key]);
            }
        }
    }
    console.log("changes", typeof changes, changes)
    return changes;
}