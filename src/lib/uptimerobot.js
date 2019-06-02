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

//get monitors list -------------------------------------------------
//get information about monitors
const getMonitorsInfo = async (metadata, project) => {
  const searchString = project.id.substring(0,6)
  const myparams = new URLSearchParams();
  myparams.append('api_key', metadata.uptimeRobotApiKey);
  myparams.append('search', searchString);
  myparams.append('logs', '1');
  myparams.append('response_times', '1');
  const response = await fetch( `${API_BASE_URL}/getMonitors`, {
    method: "POST",
    body: myparams
  })
  const json = await response.json();

  return json
}

module.exports = {
  getUserInfo,
  getMonitorsInfo
};
