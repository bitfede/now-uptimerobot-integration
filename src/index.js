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
const { getUserInfo, getMonitorsInfo, createNewMonitor, deleteMonitor } = require("./lib/uptimerobot");

module.exports = withUiHook( async ({ payload, zeitClient }) => {
  //get metadata info
  const metadata = await zeitClient.getMetadata();
  console.log("[*] Metadata: ", metadata); //DEBUG
  //extract useful vars from payload
  const { clientState, action, project } = payload;
  //variables definitions
  let userData, monitorsData, nowProjectId, projectAliases, newMonitor, monitorCreated, monitorDeleted;

  // ACTIONS -----------------------------------------------------
  if (action === 'submit-uptrobot-api-key') {
    metadata.uptimeRobotApiKey = clientState.UptRobApiKey;
    await zeitClient.setMetadata(metadata);
    userData = await getUserInfo(metadata);
  }

  if (action === 'uptimerobot-logout') {
    metadata.uptimeRobotApiKey = null;
    await zeitClient.setMetadata(metadata);
    userData = null;
  }

  if (action === 'show-monitor-creation') {
    newMonitor = clientState.domaintouse + '/';
  }

  if (action === 'submit-new-monitor') {
    if (!clientState.monitorPath) { clientState.monitorPath = "" }
    let monitorCreated, monitorName, urlToMonitor, monitorType, monitorInterval;
    monitorName = `[${project.name}] ${clientState.monitorFriendlyName}`;
    urlToMonitor = `https://${clientState.monitorDomain}${clientState.monitorPath}`;
    monitorType = "1";
    monitorInterval = "900";
    monitorCreated = await createNewMonitor(metadata, monitorName, urlToMonitor, monitorType, monitorInterval);
    console.log("[+] Monitor Creation: ", monitorCreated);

  }

  if (action === 'delete-monitor') {
    let monitorToDelete = clientState.monitorToDelete;
    monitorDeleted = await deleteMonitor(metadata, monitorToDelete)
    console.log("[-] Monitor Deletion: ", monitorDeleted);
  }

  //regular view flow
  // check if user authenticated and set variables accordingly
  if (metadata.uptimeRobotApiKey) {
     userData = await getUserInfo(metadata);
  }

  //check if project is selected
  if (!project) {
    monitorsData = null;
  } else {
    monitorsData = await getMonitorsInfo(metadata, project);
    console.log("[*] Monitor Data: ", monitorsData.monitors);
    const apiUrlCli = `/v4/now/aliases?limit=10&projectId=${project.id}`
    projectAliases = await zeitClient.fetchAndThrow(apiUrlCli, {method: 'GET'});
  }

  //pass all useful variables to the component to display
  const uptRobotOptions = {
    userData,
    monitorsData,
    projectAliases,
    newMonitor
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
