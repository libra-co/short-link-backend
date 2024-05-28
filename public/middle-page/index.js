import { getBrowserType, getDeviceType, getUserOsType } from './util.js';

const navigator = window.navigator;
const { userAgent, platform } = navigator;
const userAgentLowerCase = userAgent.toLowerCase();

const visitorOsType = getUserOsType(userAgentLowerCase);
const visitorBrowserType = getBrowserType(userAgentLowerCase);
const visitorDeviceType = getDeviceType(platform);
const shortCode = window.location.pathname.slice(1);
const protocol = window.location.protocol;
const recordInfoApi = `${protocol}//${window.location.host}/api/visit-record/record/${shortCode}`;

const recordAccessFail = (recordId) => {
  const recordAccessStatusApi = `${protocol}//${window.location.host}/api/visit-record/access-failed/${recordId}`;
  fetch(recordAccessStatusApi, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    return response.ok;
  }).catch((e) => {
    console.error('Failed to send record access status');
  });
};

// Detect target url availability
const detectIsAvailable = (url, recordId) => {
  return fetch(url, {
    method: 'HEAD',
  }).then((response) => {
    console.log('success');
    return response.ok;
  }).catch(() => {
    console.log('false');
    recordAccessFail(recordId);
    return false;
  });
};

const JumpToTargetUrl = (url) => {
  window.location.replace(url);
};

// Jump to the target page
fetch(recordInfoApi, {
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
}).then(async ({ data, code }) => {
  if (code === 308) {
    await detectIsAvailable(data.url, data.recordId);
    JumpToTargetUrl(data.url);
  }
}).catch((error) => {
  console.error('Failed to send user data', error);
});

