import { Cookie } from "./helpers.js";

Cookie.set('index_timestamp_in', new Date().toJSON(), {secure: true, "max-age": 3600})

const telemetry_spans = ['launch_timestamp_in', 'launch_timestamp_out', 'after_auth_timestamp_in', 'after_auth_timestamp_out', 'after_auth_timestamp_out', 'index_timestamp_in']
telemetry_spans.forEach(field_name => document.getElementById(field_name).textContent= Cookie.get(field_name))

document.getElementById('duration').textContent = ((new Date(Cookie.get('index_timestamp_in')) - new Date(Cookie.get('launch_timestamp_in'))) / 1000).toFixed(3)

const launch_url = Cookie.get('launch_url')
document.getElementById('mgw-launch-url').textContent=launch_url;
document.getElementById('mgw-launch-url').href=launch_url;

const fhirUrl = Cookie.get("fhir_url")
let token_data_cookie = Cookie.get('token_data')
const token_data = token_data_cookie != undefined ? JSON.parse(token_data_cookie) : null;
const mgw_eat_active = Cookie.get('mgw_eat_active')

if (mgw_eat_active == "1"){
    document.getElementById('mgw-data-token-type').textContent= 'EAT'
}

let toggle_token_type = function() {
    if(mgw_eat_active == "1"){
        Cookie.set('mgw_eat_active', 0, {secure: true, "max-age": 3600})
    }
    else {
        Cookie.set('mgw_eat_active', 1, {secure: true, "max-age": 3600})
    }
    
    location.assign(launch_url);
}

document.getElementById('mgw-data-token').textContent= JSON.stringify(token_data)
document.getElementById ("mgw-toggle-token-type").addEventListener ("click", toggle_token_type, false);

async function getPatient() {

    if (!token_data.access_token || !token_data.patient) {
        console.log('no access token or patient found in cookie')
        return
    }

    let response = await fetch(fhirUrl + '/Patient/' + token_data.patient, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token_data.access_token}`
        }
    })
    return await response.json()
}

getPatient().then((data) => {
    console.log(data)
    document.getElementById('mgw-data-url').textContent = fhirUrl + '/Patient/' + token_data.patient
    document.getElementById('mgw-data-content').textContent= JSON.stringify(data)
}).catch((err) => {
    debugger
    console.log('error fetching patient data')
})
