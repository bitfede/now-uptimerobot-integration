//dependencies
const { htm } = require("@zeit/integration-utils");

const buildMonitorsSection = (monitorsData, projectAliases) => {
  let monitorsection, monitorsLi, monitorsCreate;
  if (!monitorsData) {
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
    } else {
      monitorsLi = htm`
        <UL>
          ${monitorsData.monitors.map( monitor => htm`<LI>[${monitor.id}] ${monitor.friendly_name}</LI>`)}
        </UL>
      `
    }

    if (projectAliases.aliases.length === 0) {
      monitorsCreate = htm`
        <P>This project has no Aliases set, please create an alias to start monitoring it</P>
      `
    } else {
      monitorsCreate = htm`
        <P>Pick an alias that you want to start monitoring</P>
        <Select name="domaintouse">
          <Option value=${null} caption="Select Option" />
          ${projectAliases.aliases.map( aliasItem => htm`<Option value=${aliasItem.alias} caption=${aliasItem.alias} action="show-monitor-creation" />`)}
        </Select>
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
      </Box>
    `
  }

  return htm`
    <Fieldset>
      <FsContent>
      ${monitorsection}
      </FsContent>

    </Fieldset>
  `

}

const buildAuthSection = (userData, monitorsData, projectAliases) => {
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
  ${buildMonitorsSection(monitorsData, projectAliases)}
  `
}

module.exports = ( {options} ) => {
  //options passed from index
  const { userData, monitorsData, projectAliases } = options;

  return htm`
    ${buildAuthSection(userData, monitorsData, projectAliases)}
  `;
};
