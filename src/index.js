// ###############
// Title: Uptimerobot integration for Now
// Author: Federico de Faveri
// Purpose: to monitor your now deployments' uptime and response time
// ###############

//dependencies
const { withUiHook, htm } = require('@zeit/integration-utils');

//UI components
const { UptimeRobot } = require("./components");

//Services
const { getUserInfo } = require("./lib/uptimerobot");

module.exports = withUiHook( async ({ payload, zeitClient }) => {
  //get metadata info
  const metadata = await zeitClient.getMetadata();
  console.log("METADATA >>>", metadata); //DEBUG
  //extract useful vars from payload
  const { clientState, action } = payload;
  //variables definitions
  let userData;

  // ACTIONS -----------------------------------------------------
  if (action === 'submit-uptrobot-api-key') {
    metadata.uptimeRobotApiKey = clientState.UptRobApiKey;
    await zeitClient.setMetadata(metadata);
    userData = await getUserInfo(metadata);
  }

  if (payload.action === 'uptimerobot-logout') {
    metadata.uptimeRobotApiKey = null;
    await zeitClient.setMetadata(metadata);
    userData = null;
  }


  // check if user authenticated and set variables accordingly
  if (metadata.uptimeRobotApiKey) {
     userData = await getUserInfo(metadata);
  }

  //pass all useful variables to the component to display
  const uptRobotOptions = {
    userData
  }

  return htm`
    <Page>
      <Box display="flex" justifyContent="center" margin-bottom="1.5rem" margin-top="1.5rem" >
        <Img src="https://www.datocms-assets.com/4723/1521569184-uptime-robot.png" height="75px"/>
      </Box>
      <${UptimeRobot} options=${uptRobotOptions} />
    </Page>
  `
})
