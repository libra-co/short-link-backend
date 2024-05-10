import { getBrowserType, getDeviceType, getUserOsType } from './util.js';

const navigator = window.navigator;
const { userAgent, platform } = navigator;
const userAgentLowerCase = userAgent.toLowerCase();

const visitorOsType = getUserOsType(userAgentLowerCase);
const visitorBrowserType = getBrowserType(userAgentLowerCase);
const visitorDeviceType = getDeviceType(platform);
const shortCode = window.location.pathname.slice(1);
const protocol = window.location.protocol;
const api = `${protocol}//${window.location.host}/api/visit-record/record/${shortCode}`;
fetch(api, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    visitorOsType,
    visitorBrowserType,
    visitorDeviceType,
    userAgent,
  }),
}).then((response) => {
  // if (response.ok) {
    return response.json();
  // }
}).then((data) => {
  if (data.code === 308) {
    window.location.replace(data.url);
  }
}).catch((error) => {
  console.error('Failed to send user data', error);
});
