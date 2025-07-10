import {Cookie, generateCodeVerifier, generateCodeChallenge} from "./helpers.js";
import {clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

let fhirUrl = urlParams.get('iss')

Cookie.set('fhir_url', fhirUrl, {secure: true, "max-age": 3600})

let code_verifier = generateCodeVerifier()
let codeChallenge = ''
Cookie.set('code_verifier', code_verifier, {secure: true, "max-age": 3600})


Cookie.set('launch_url', window.location.toString(), {secure: true, "max-age": 3600})
Cookie.set('launch_timestamp_in', new Date().toJSON(), {secure: true, "max-age": 3600})

const token_endpoint_eat = "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/hosts/apigee.test/protocols/oauth2/profiles/smart-v1/token"
const mgw_eat_active = Cookie.get('mgw_eat_active')


const launchId = urlParams.get('launch')

async function getWellKnown() {
    let response = await fetch(fhirUrl + '/.well-known/smart-configuration', {
        headers: {
            Accept: 'application/json'
        }
    })

    return await response.json()
}

function authorize(data) {

    let authEndpoint = data.authorization_endpoint;
    let token_endpoint = mgw_eat_active == "1" ? data.token_endpoint : data.token_endpoint.replace("allowed.host", "non-eat");

    Cookie.set('token_endpoint', token_endpoint, {secure: true, "max-age": 3600})

    debugger;
    Cookie.set('launch_timestamp_out', new Date().toJSON(), {secure: true, "max-age": 3600})
    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURI(redirectUri)}&` +
        `launch=${launchId}&` +
        `scope=${encodeURIComponent("user/Patient.rs user/Practitioner.rs launch")}&` +
        "state=98wrghuwuogerg97&" +
        `aud=${fhirUrl}&` +
        "code_challenge_method=S256&" +
        `code_challenge=${codeChallenge}`
    location.assign(auth_location)
}
generateCodeChallenge(code_verifier).then(hash => {
    codeChallenge = hash;
    getWellKnown().then((data) => {
        authorize(data)
    }).catch((err) => {
        debugger
        console.log('error fetching well-known')
    })
});





