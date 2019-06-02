const { withUiHook } = require('@zeit/integration-utils')

let count = 0

module.exports = withUiHook(({ payload, zeitClient }) => {
  count += 1
  return `
    <Page>
      <Box display="flex" justifyContent="center" margin-bottom="1.5rem" margin-top="1.5rem" >
        <Img src="https://www.datocms-assets.com/4723/1521569184-uptime-robot.png" height="75px"/>
      </Box>
      TODO
    </Page>
  `
})
