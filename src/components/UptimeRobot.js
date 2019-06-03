//dependencies
const { htm } = require("@zeit/integration-utils");

const buildMonitorsSection = (userData, monitorsData, projectAliases, newMonitor) => {
  let monitorsection, monitorsLi, monitorsCreate, monitorsDelete;

  if (!userData) {
    monitorsection = htm`
    <Box>
      <P>Please authenticate to continue</P>
    </Box>
    `
  } else if (!monitorsData) {
    monitorsection = htm`
      <Box>
        <H2>Please pick a project to continue</H2>
        <ProjectSwitcher />
      </Box>
    `
  } else {
    //check if we have a list of monitors
    if (monitorsData.monitors.length === 0) {
      monitorsLi = htm`<P>There are no monitors for this project</P>`
      monitorsDelete = htm`<P>There are no monitors to delete</P>`

    } else {
      const formatStatus = (status) => {
        if (status === 2) {
          return "UP ✅"
        } else if (status === 9 || status === 8) {
          return "DOWN ⛔️"
        }
      }
      monitorsLi = htm`
        <UL listStyle="none">
          ${monitorsData.monitors.map( (monitor) => {
            return htm`
            <LI>
              <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="baseline" border="1px lightgray solid" borderRadius="20px">
                <P><B>Id:</B>${monitor.id}</P>
                <P><B>Name:</B>${monitor.friendly_name}</P>
                <P><B>Status:</B>${formatStatus(monitor.status)}</P>
                <P><B>Avg. Response Time:</B>${parseInt(monitor.average_response_time)}ms</P>
              </Box>
            </LI>
            `

          })}
        </UL>
      `
      monitorsDelete = htm`
      <P>Pick the monitor that you want to delete</P>
      <Select name="monitorToDelete" >
        <Option value=${null} caption="Select Option" />
        ${monitorsData.monitors.map( monitor => htm`<Option value=${monitor.id} caption=${monitor.friendly_name} />`)}
      </Select>
      <Button action="delete-monitor">Delete it </Button>
      `
    }

    if (projectAliases.aliases.length === 0) {
      monitorsCreate = htm`
        <P>This project has no Aliases set, please create an alias to continue</P>
      `
    } else if (projectAliases.aliases.length > 0 && !newMonitor) {
      monitorsCreate = htm`
        <P>Pick an alias that you want to start monitoring</P>
        <Select name="domaintouse" action="show-monitor-creation" >
          <Option value=${null} caption="Select Option" />
          ${projectAliases.aliases.map( aliasItem => htm`<Option value=${aliasItem.alias} caption=${aliasItem.alias} />`)}
        </Select>
      `
    } else {
      //UI to create a new monitor
      monitorsCreate = htm`
      <Box >
        <P><B>Domain selected</B></P>
        <Input width="30vw" name="monitorDomain" value=${newMonitor} disabled />
        <P><B>Insert a name for the monitor</B></P>
        <Input name="monitorFriendlyName" placeholder="monitor name" />
        <P><B>Insert URL to monitor (leave blank for homepage)</B></P>
        <Box marginBottom="1rem" display="flex" flexDirection="row" alignItems="flex-end">
          <P>${newMonitor}</P><Input name="monitorPath" placeholder="pathname" />
        </Box>
        <Button action="submit-new-monitor">Submit</Button>
      </Box>
      `
    }

    monitorsection = htm`
      <Box>
        <ProjectSwitcher />
        <Box marginTop="1.3rem">
          <H1>Monitors</H1>
        </Box>
        <Box marginTop="1.3rem">
          <H2>Active</H2>
          ${monitorsLi}
        </Box>
        <Box marginTop="1.3rem">
          <H2>Create New</H2>
          ${monitorsCreate}
        </Box>
        <Box marginTop="1.3rem">
          <H2>Delete Existing</H2>
          ${monitorsDelete}
        </Box>
      </Box>
    `
  }

  return htm`
    <Fieldset>
      <FsContent>
      ${monitorsection}
      </FsContent>
      <FsFooter>
        <P>For more advanced functionalities and settings, go to the UptimeRobot <Link target="_blank" href="https://uptimerobot.com/dashboard">dashboard</Link> or you are welcome to <Link target="_blank" href="https://github.com/bitfede/now-uptimerobot-integration">contribute</Link></P>
      </FsFooter>
    </Fieldset>
  `

}

const buildAuthSection = (userData, monitorsData, projectAliases, newMonitor) => {
  let authsection;
  if (!userData) {
    authsection = htm`
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box width="50vw" marginRight="10px">
          <Input width="50vw" name="UptRobApiKey" label="UPTIMEROBOT MAIN API KEY" placeholder="authentication-token" />
        </Box>
        <Box marginTop="23px">
          <Button action="submit-uptrobot-api-key">Login</Button>
        </Box>
      </Box>
    `
  } else {
    authsection = htm`
      <P>Succesfully logged in UptimeRobot as <B>${userData.account.email}</B> (<Link action="uptimerobot-logout">Log Out</Link>)</P>
    `
  }

  return htm`
  <Fieldset>
    <FsContent>
    <Box marginBottom="1.3rem">
      <H1>Authentication</H1>
    </Box>
    ${authsection}
    </FsContent>
    <FsFooter>
      <P>To get an UptimeRobot <B>MAIN API KEY</B> click <Link href="https://uptimerobot.com/">here</Link></P>
    </FsFooter>
  </Fieldset>
  ${buildMonitorsSection(userData, monitorsData, projectAliases, newMonitor)}
  `
}

module.exports = ( {options} ) => {
  //options passed from index
  const { userData, monitorsData, projectAliases, newMonitor } = options;

  return htm`
    ${buildAuthSection(userData, monitorsData, projectAliases, newMonitor)}
  `;
};
