//dependencies
const fetch               = require('node-fetch')
const { URLSearchParams } = require('url');


const API_BASE_URL = 'https://api.uptimerobot.com/v2';

//get user account details -------------------------------------------
const getUserInfo = async (metadata) => {
  const myparams = new URLSearchParams();
  myparams.append('api_key', metadata.uptimeRobotApiKey);
  const response = await fetch( `${API_BASE_URL}/getAccountDetails`, {
    method: "POST",
    body: myparams
  })
  const json = await response.json();
  return json;
}

//get monitors list & info -------------------------------------------------
const getMonitorsInfo = async (metadata, project) => {
  const searchString = project.name
  const myparams = new URLSearchParams();
  myparams.append('api_key', metadata.uptimeRobotApiKey);
  myparams.append('search', searchString);
  myparams.append('logs', '1');
  myparams.append('response_times', '1');
  console.log("[>] Searching Monitors: " , myparams);
  const response = await fetch( `${API_BASE_URL}/getMonitors`, {
    method: "POST",
    body: myparams
  })
  const json = await response.json();

  return json
}

// create a new monitor ----------------------------------------------------
const createNewMonitor = async (metadata, monitorName, urlToMonitor, monitorType, monitorInterval) => {
  const myparams = new URLSearchParams();
  myparams.append('api_key', metadata.uptimeRobotApiKey);
  myparams.append('friendly_name', monitorName);
  myparams.append('url', urlToMonitor);
  myparams.append('type', monitorType);
  myparams.append('interval', monitorInterval);
  console.log("[>] Creating Monitor: " , myparams);
  const response = await fetch(`${API_BASE_URL}/newMonitor`, {
    method: 'POST',
    body: myparams
  })
  const json = await response.json();

  return json
}

const deleteMonitor = async (metadata, monitorToDelete) => {
  const myparams = new URLSearchParams();
  myparams.append('api_key', metadata.uptimeRobotApiKey);
  myparams.append('id', monitorToDelete);
  const response = await fetch(`${API_BASE_URL}/deleteMonitor`, {
    method: 'POST',
    body: myparams
  })
  const json = await response.json();

  return json
}

module.exports = {
  getUserInfo,
  getMonitorsInfo,
  createNewMonitor,
  deleteMonitor
};
