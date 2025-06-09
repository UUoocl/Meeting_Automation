const obs = new OBSWebSocket();
obs.connected = false;

//get web socket details from a message
window.addEventListener(`ws-details`, async function (event) {
  //event wss details
  console.log("message received: ", event)
  if(event.detail.hasOwnProperty('wssDetails')){
    await connectOBS(event.detail.wssDetails);
  }
})

//check local storage for OBS Web Socket Details
//on load, if storage item exists
let connectCount = 0;
window.addEventListener('load', async function() {
  if(localStorage.getItem('wssDetails') !== null){
    //try to connect
    console.log("try saved websocket details")
    setTimeout(() => connectOBS(JSON.parse(window.localStorage.getItem('wssDetails'))), 2000);
  }
})

async function connectOBS(wssDetails) {
  //connect to OBS web socket server
  try {
    //avoid duplicate connections
    await disconnect();
    
    //connect to OBS Web Socket Server
    const { obsWebSocketVersion, negotiatedRpcVersion } = 
    await obs.connect(`ws://${wssDetails.IP}:${wssDetails.PORT}`,wssDetails.PW,{rpcVersion: 1,});
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
    localStorage.setItem("wssDetails",JSON.stringify(wssDetails))
    return "connected";
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
    //localStorage.setItem("wssDetails",null)
    return "failed";
  }
  //console.log(`ws://${wssDetails.IP}:${wssDetails.PORT}`);
}

  async function disconnect () {
    try{
      await obs.disconnect()
      console.log("disconnected")
      obs.connected = false
    } catch(error){
      console.error("disconnect catch",error)
    }
    
  }

obs.on('ConnectionOpened', () => {
  console.log('Connection to OBS WebSocket successfully opened');
  obs.status = "connected";
});

obs.on('ConnectionClosed', () => {
  console.log('Connection to OBS WebSocket closed');
  obs.status = "disconnected";
});

obs.on('ConnectionError', err => {
  console.error('Connection to OBS WebSocket failed', err);
});

obs.on('Identified', data => {
  console.log('OBS WebSocket successfully identified', data);
});


obs.on("error", (err) => {
  console.error("Socket error:", err);
});
