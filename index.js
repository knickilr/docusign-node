const express = require('express');
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const session = require("express-session")
dotenv.config();

const checkToken = require('./auth')
const dockSignEnv = require('./utils')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(session({
    secret: "flkskiek88j",
    resave: "true",
    saveUninitialized: true,
}))

app.get("/", async (req, res) => {
    res.send("docusign node app")
})

app.post('/docu-sign', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        await checkToken.checkToken(req);
        let envelopesApi = dockSignEnv.getEnvelopes(req);
        let envelope = dockSignEnv.makeEnvelope(req.body)
        let results = await envelopesApi.createEnvelope(
            process.env.ACCOUNT_ID, { envelopeDefinition: envelope });
        let viewRequest = dockSignEnv.makeRecipientViewRequest(req.body.name, req.body.email);
        results = await envelopesApi.createRecipientView(process.env.ACCOUNT_ID, results.envelopeId,
            { recipientViewRequest: viewRequest });
        console.log('result success', results.url)
        res.send({url: results.url})
    } catch (error) {
        console.log("Error message:", error)
    }
})

app.listen(8585, () => {
    console.log('server started')
})