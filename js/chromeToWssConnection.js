var obs = new OBSWebSocket();
let connecting = false;

//1. listen for a button press to start 
async function wsConnectButton() {
  //change to this.
  wssDetails = {
    IP: document.getElementById("IP").value,
    PORT: document.getElementById("Port").value,
    PW: document.getElementById("PW").value,
  };

  await connectOBS(wssDetails).then(async (result) => {
    if (result === "failed") {
      document.getElementById("WSconnectButton").style.background = "#ff0000";
    }
    if (result === "connected") {
      document.getElementById("WSconnectButton").style.background = "#00ff00";
    }
  });
}

//connect to OBS web socket server
async function connectOBS(wssDetails) {
  console.log("connectOBS", wssDetails);
  try {
    //avoid duplicate connections
    await disconnect();

    //connect to OBS Web Socket Server
    const { obsWebSocketVersion, negotiatedRpcVersion } = 
    await obs.connect(`ws://${wssDetails.IP}:${wssDetails.PORT}`,wssDetails.PW,{rpcVersion: 1,});
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
    
    localStorage.setItem("wssDetails", JSON.stringify(wssDetails));  

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