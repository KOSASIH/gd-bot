export function isSafari() {
  let userAgentString = navigator.userAgent.toLowerCase();
  let chromeAgent = userAgentString.indexOf('Chrome') > -1;

  let safariAgent = userAgentString.indexOf('Safari') > -1;

  if (chromeAgent && safariAgent) safariAgent = false;

  return safariAgent;
}

export function getBrowserName() {
  var name = 'Unknown';
  if (navigator.userAgent.indexOf('MSIE') != -1) {
    name = 'MSIE';
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    name = 'Firefox';
  } else if (navigator.userAgent.indexOf('Opera') != -1) {
    name = 'Opera';
  } else if (navigator.userAgent.indexOf('Chrome') != -1) {
    name = 'Chrome';
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    name = 'Safari';
  }
  return name;
}

export function isiOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

export function isPhone() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) { return true }
  if (/iPhone|iPad|iPod/i.test(userAgent)) { return true }
  return false;
}

export function isWebPlatform(tgClient) {
  return tgClient?.platform === 'weba';
}