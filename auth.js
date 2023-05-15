const docusign = require('docusign-esign')
const fs = require('fs')
const path = require('path')

async function checkToken(req) {
    if (req.session.access_token && Date.now() < req.session.expires_at) {
        console.log("Re-using access token", req.session.access_token)
    } else {
        console.log("Generating a new token")
        let dsApiClient = new docusign.ApiClient();
        dsApiClient.setBasePath(process.env.BASE_PATH);
        const results = await dsApiClient.requestJWTUserToken(process.env.INTERGATION_KEY, process.env.USER_ID, "signature", fs.readFileSync(path.join(__dirname, "private.key")), 3600);
        req.session.access_token = results.body.access_token;
        req.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000
    }
}

module.exports =  {checkToken}