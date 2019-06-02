// ###############
// Title: Uptimerobot integration for Now
// Author: Federico de Faveri
// Purpose: to monitor your now deployments' uptime and response time
// ###############

//dependencies
const { withUiHook, htm } = require('@zeit/integration-utils');

//UI components
const { UptimeRobot } = require("./components");

module.exports = withUiHook( async ({ payload, zeitClient }) => {
  //get metadata info
  const metadata = await zeitClient.getMetadata();
  console.log("METADATA >>>", metadata); //DEBUG
  //variables definitions
  let userData;

  // ACTIONS -----------------------------------------------------



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
