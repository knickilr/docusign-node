const docusign = require('docusign-esign')
const dotenv = require("dotenv")
dotenv.config();

function makeEnvelope(reqBody) {
    let env = new docusign.EnvelopeDefinition();
    env.templateId = process.env.TEMPLATE_ID;
    let text = docusign.Text.constructFromObject({
        tabLabel: "company_name", value: reqBody.company});
  
     // Pull together the existing and new tabs in a Tabs object:
     let tabs = docusign.Tabs.constructFromObject({
        textTabs: [text],
     });

    let signer1 = docusign.TemplateRole.constructFromObject({
        email: reqBody.email,
        name: reqBody.name,
        tabs: tabs,
        clientUserId: process.env.CLIENT_USER_ID,
        roleName: 'Manager'
    });
    env.templateRoles = [signer1];
    env.status = "sent";

    return env;
}

function getEnvelopes(req) {
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.BASE_PATH);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.access_token);
    return new docusign.EnvelopesApi(dsApiClient);
}


function makeRecipientViewRequest(name, email) {
    let viewRequest = new docusign.RecipientViewRequest();
    viewRequest.returnUrl = 'http://localhost:3000';
    viewRequest.authenticationMethod = 'none';
    viewRequest.email = email;
    viewRequest.userName = name;
    viewRequest.clientUserId = process.env.CLIENT_USER_ID;
    return viewRequest
}

module.exports =  {makeEnvelope, makeRecipientViewRequest, getEnvelopes}