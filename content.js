// RiceCity Auto Submit - Content Script
// Inject script vào page context để có thể override window.alert

(function() {
  'use strict';

  console.log('🔧 [Content Script] Đang inject script vào page context...');

  // Inject inject.js vào page context
  function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
      console.log('✅ [Content Script] inject.js đã được inject thành công!');
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // Inject ngay lập tức
  injectScript();

  // Message listener từ popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 [Content Script] Nhận message:', request);

    if (request.action === 'start') {
      // Gửi message tới inject.js thông qua window.postMessage
      window.postMessage({ type: 'AUTO_SUBMIT_START' }, '*');
      sendResponse({ success: true });
    } else if (request.action === 'stop') {
      window.postMessage({ type: 'AUTO_SUBMIT_STOP' }, '*');
      sendResponse({ success: true });
    } else if (request.action === 'status') {
      // Hỏi status từ inject.js
      window.postMessage({ type: 'AUTO_SUBMIT_STATUS' }, '*');

      // Đợi response từ inject.js
      const messageHandler = (event) => {
        if (event.source !== window) return;
        if (event.data.type === 'AUTO_SUBMIT_STATUS_RESPONSE') {
          window.removeEventListener('message', messageHandler);
          sendResponse({ isRunning: event.data.isRunning });
        }
      };

      window.addEventListener('message', messageHandler);

      // Timeout nếu không nhận được response
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        sendResponse({ isRunning: false });
      }, 1000);

      return true; // Keep channel open for async response
    }

    return true;
  });

  console.log('✅ [Content Script] Extension đã sẵn sàng!');

})();
