import {
  VisitorOsType,
  VisitorBrowserType,
  VisitorDeviceType,
} from './const.js';

export const getUserOsType = (userAgent) => {
  if (userAgent.indexOf('Android'.toLowerCase()) !== -1)
    return VisitorOsType.ANDROID;
  if (userAgent.indexOf('Windows NT'.toLowerCase()) !== -1)
    return VisitorOsType.WINDOWS;
  if (userAgent.indexOf('Mac'.toLowerCase()) !== -1) return VisitorOsType.IOS; // 'Mac/iOS'
  // if (userAgent.indexOf('X11'.toLowerCase()) !== -1) return 'UNIX';
  if (userAgent.indexOf('Linux'.toLowerCase()) !== -1)
    return VisitorOsType.LINUX;
  return 'UNKNOWN';
};

export const getBrowserType = () => {
  let ua = navigator.userAgent.toLocaleLowerCase();
  let browserType = null;
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = VisitorBrowserType.IE;
  } else if (ua.match(/firefox/) != null) {
    browserType = VisitorBrowserType.FIREFOX;
  } else if (ua.match(/ucbrowser/) != null) {
    browserType = 'UC';
  } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
    browserType = 'opera';
  } else if (ua.match(/bidubrowser/) != null) {
    browserType = 'baidu';
  } else if (ua.match(/metasr/) != null) {
    browserType = 'sougou';
  } else if (
    ua.match(/tencenttraveler/) != null ||
    ua.match(/qqbrowse/) != null
  ) {
    browserType = 'QQ';
  } else if (ua.match(/maxthon/) != null) {
    browserType = 'maxthon';
  } else if (ua.match(/chrome/) != null) {
    browserType = VisitorBrowserType.CHROME;
  } else if (ua.match(/safari/) != null) {
    browserType = VisitorBrowserType.SAFARI;
  } else {
    browserType = VisitorBrowserType.UNKNOWN;
  }
  // Ignore other browsers
  if (typeof browserType !== 'number') {
    browserType = VisitorBrowserType.UNKNOWN;
  }
  return browserType;
};

export const getDeviceType = (platform) => {
  if (platform.indexOf('Win') !== -1) return VisitorDeviceType.PC;
  if (platform.indexOf('Mac') !== -1) return VisitorDeviceType.PC;
  if (platform.indexOf('X11') !== -1) return VisitorDeviceType.PC;
  if (platform.indexOf('Linux') !== -1) return VisitorDeviceType.PC;
  return VisitorDeviceType.MOBILE;
};
