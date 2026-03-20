// (function(){console.log("rtag loaded");})();
(function () {

    const API_URL = "https://yourdomain.com/collect";
    const UID_COOKIE = "rt_uid";
    const CLICK_COOKIE = "rt_click_id";
  
    const config = window.rtag_config || {};
    const SECRET_KEY = "k3y123"; 
  
    // 🔹 Cookie helpers
    function getCookie(name) {
      const v = document.cookie.split('; ').find(r => r.startsWith(name + '='));
      return v ? v.split('=')[1] : null;
    }
  
    function setCookie(name, value, days = 30) {
      const exp = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = name + "=" + value + "; expires=" + exp + "; path=/";
    }
  
    // 🔹 Generate UUID
    function generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
  
    // 🔹 Device detection
    function getDevice() {
      const ua = navigator.userAgent;
      if (/Mobi|Android/i.test(ua)) return "Mobile";
      if (/Tablet|iPad/i.test(ua)) return "Tablet";
      return "Desktop";
    }
  
    // 🔹 Get/Create UID
    let uid = getCookie(UID_COOKIE);
    if (!uid) {
      uid = generateId();
      setCookie(UID_COOKIE, uid);
    }
  
    // 🔹 Capture click_id
    const params = new URLSearchParams(window.location.search);
    let clickId = params.get("click_id");
  
    if (clickId) {
      setCookie(CLICK_COOKIE, clickId);
    } else {
      clickId = getCookie(CLICK_COOKIE);
    }
  
    // 🔐 Encrypt (XOR + Base64)
    function encrypt(data) {
      let str = JSON.stringify(data);
      let key = SECRET_KEY;
      let result = "";
  
      for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(
          str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
  
      return btoa(result);
    }
  
    // 🔹 Send request
    function send(payload) {
      try {
        navigator.sendBeacon(API_URL, JSON.stringify(payload));
      } catch (e) {
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    }
  
    // 🔹 Main track function
    function track(event, extra = {}) {
  
      // respect config
      if (config.allowed_events && !config.allowed_events.includes(event)) {
        return;
      }
  
      const visible = {
        e: event,
        cid: clickId || null
      };
  
      const hidden = encrypt({
        uid,
        url: location.href,
        ref: document.referrer,
        device: getDevice(),
        ts: Date.now(),
        ...extra
      });
  
      send({
        ...visible,
        d: hidden
      });
    }
  
    // 🔹 Global function
    window.rtag = function (event, data) {
      track(event, data);
    };
  
    // 🔹 Page view (only if allowed)
    if (config.track_pageview !== false) {
      track("page_view");
    }
  
  })();