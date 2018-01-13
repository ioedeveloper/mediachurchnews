var admobid = {}
if (/(android)/i.test(navigator.userAgent)) {
  admobid = {
    banner: 'ca-app-pub',
    interstitial: 'ca-app-pub',
  }
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
  admobid = {
    banner: 'ca-app-pub',
    interstitial: 'ca-app-pub',
  }
}

document.addEventListener('deviceready', function() {
  admob.banner.config({
    id: admobid.banner,
    autoShow: true,
  });
  admob.banner.prepare();

  admob.interstitial.config({
    id: admobid.interstitial,
    autoShow: true,
  });
  admob.interstitial.prepare();
}, false);