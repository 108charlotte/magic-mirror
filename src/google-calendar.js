const CLIENT_ID = '88942946394-7a0efu7ror7lhhoqjft9bod098r33eu0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA9_NUnPURqgh8GtAoox3bD9Xim6qUlO9k';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('authorize_button').style.visibility = 'hidden';
    document.getElementById('signout_button').style.visibility = 'hidden';
})

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();

    // Try silent token request
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            // User interaction required
            return;
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listUpcomingEvents();
    };
    tokenClient.requestAccessToken({prompt: ''});
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await listUpcomingEvents();
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

      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('event-table').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      // this is the part i am editing from the tutorial
    async function listUpcomingEvents() {
        let response;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        try {
            const request = {
                'calendarId': 'primary',
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
                'timeMin': startOfDay.toISOString(), 
                'timeMax': endOfDay.toISOString(),
            };
            response = await gapi.client.calendar.events.list(request);
        } catch (err) {
            document.getElementById('event-table').innerText = err.message;
            return;
    }

    const events = response.result.items;
        if (!events || events.length == 0) {
            document.getElementById('event-table').innerText = 'No events today.';
            return;
        }

        let tableHTML = `<table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
          </thead>
          <tbody>`; 
        
          events.forEach(event => {
            let start = event.start.dateTime || event.start.date
            let end = event.end.dateTime || event.end.date
            tableHTML += `<tr>
                <td style="padding:4px;">${event.summary || '(No title)'}</td>
                <td style="padding:4px;">${new Date(start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit'})}</td>
                <td style="padding:4px;">${new Date(end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit'})}</td>
            </tr>`
          })

          tableHTML += `</tbody></table>`

          document.getElementById('event-table').innerHTML = tableHTML;
}

window.handleAuthClick = handleAuthClick;
window.handleSignoutClick = handleSignoutClick;
window.listUpcomingEvents = listUpcomingEvents;
window._gapiLoaded = gapiLoaded;
window._gisLoaded = gisLoaded;

function loadGoogleApiScripts() {
  const gapiScript = document.createElement('script');
  gapiScript.src = 'https://apis.google.com/js/api.js';
  gapiScript.onload = () => window.gapiLoaded();
  document.head.appendChild(gapiScript);

  const gisScript = document.createElement('script');
  gisScript.src = 'https://accounts.google.com/gsi/client';
  gisScript.onload = () => window.gisLoaded();
  document.head.appendChild(gisScript);
}

document.addEventListener('DOMContentLoaded', loadGoogleApiScripts); 