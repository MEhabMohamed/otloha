
/* global google */

import { jwtDecode } from "jwt-decode";

/* global gapi */
export const ClientId = process.env.REACT_APP_CLIENT_ID;
export const API_KEY = process.env.REACT_APP_API_KEY;
    // Discovery doc URL for APIs used by the quickstart
export const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const SCOPES = 'https://www.googleapis.com/auth/drive';

let tokenClient;

export function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

export function handleCallbackResponse(response) {
    let userObject = jwtDecode(response.credential)
    console.log("Encoded JWT ID token" + response.credential)
    console.log(userObject)
}

export function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: ClientId,
        scope: SCOPES,
        callback: handleCallbackResponse
    });
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick() {
tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    document.getElementById('signout_button').style.display = 'block';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listFiles();
};

if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
} else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
}
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
const token = gapi.client.getToken();
if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.display = 'none';
}
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
let response;
try {
    response = await gapi.client.drive.files.list({
    'pageSize': 50,
    'fields': 'files(id, name)',
    });
} catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
}
const files = response.result.files;
if (!files || files.length === 0) {
    document.getElementById('content').innerText = 'No files found.';
    return;
}
// Flatten to string to display
const output = files.reduce(
    (str, file) => `${str}${file.name} (${file.id})\n`,
    'Files:\n');
document.getElementById('content').innerText = output;
}