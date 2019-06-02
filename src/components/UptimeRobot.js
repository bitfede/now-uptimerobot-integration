//dependencies
const { htm } = require("@zeit/integration-utils");

const buildAuthSection = (userData) => {
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
  `
}

module.exports = ( {options} ) => {
  //options passed from index
  const { userData } = options;


  return htm`
    ${buildAuthSection(userData)}
  `;
};
