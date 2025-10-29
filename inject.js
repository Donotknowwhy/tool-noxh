// Script được inject trực tiếp vào page context (không phải content script)
// Có thể override window.alert thực sự

(function() {
  'use strict';

  console.log('🔧 [AutoSubmit Inject] Script đã được inject vào page context');

  // State
  let isRunning = false;
  let retryCount = 0;
  let successCount = 0;
  let failCount = 0;
  let baseDelay = 2000; // ms - delay cơ bản
  let minDelay = 1500; // ms - delay tối thiểu
  let maxDelay = 5000; // ms - delay tối đa
  let originalAlert = window.alert;
  let alertBlocked = false;

  // Hàm tính delay thông minh
  function calculateSmartDelay() {
    // Random delay từ 1.5s đến 5s
    const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);

    // Tăng delay dần khi submit nhiều (mỗi 10 lần submit, tăng thêm 500ms)
    const progressiveDelay = Math.floor(retryCount / 10) * 500;

    // Tổng delay (nhưng không quá maxDelay)
    const totalDelay = Math.min(randomDelay + progressiveDelay, maxDelay);

    return Math.floor(totalDelay);
  }

  // Override window.alert NGAY LẬP TỨC
  window.alert = function(message) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📢 [ALERT INTERCEPTED]: "${message}"`);
    console.log(`🏃 isRunning: ${isRunning}`);

    // Kiểm tra nếu là lỗi "quá tải" hoặc "nhiều người"
    const isServerBusy = message.includes('quá tải') ||
                        message.includes('nhiều người') ||
                        message.includes('thử lại') ||
                        message.includes('busy') ||
                        message.toLowerCase().includes('please try again');

    console.log(`⚠️ Server busy detected: ${isServerBusy}`);

    // QUAN TRỌNG: Chặn HOÀN TOÀN alert lỗi server (kể cả khi tool đã dừng)
    if (isServerBusy) {
      console.log(`🚫 [ALERT BLOCKED] Chặn alert lỗi server (isRunning=${isRunning})`);

      // Nếu tool đang chạy, tự động retry
      if (isRunning) {
        console.log('✅ [AUTO RETRY] Tool đang chạy, tự động retry...');
        alertBlocked = true;
        failCount++;

        // Hiển thị notification với nội dung alert
        log(`⚠️ Alert: "${message}"`, 'error');

        // Tính delay thông minh trước khi retry
        const retryDelay = calculateSmartDelay();
        log(`🔄 Tự động retry sau ${(retryDelay/1000).toFixed(1)}s...`, 'warning');

        // Tự động retry với delay thông minh
        setTimeout(() => {
          console.log('🔄 Retry ngay...');
          autoSubmit();
        }, retryDelay);
      } else {
        // Tool đã dừng, nhưng vẫn KHÔNG hiển thị alert lỗi server
        console.log('ℹ️ Tool đã dừng, nhưng vẫn chặn alert lỗi server');
        console.log(`ℹ️ Alert bị chặn: "${message}"`);
      }

      // KHÔNG hiển thị alert popup trong mọi trường hợp
      return undefined;
    }

    // Các trường hợp khác (có thể là thông báo thành công)
    console.log('⚠️ PHÁT HIỆN ALERT KHÁC - Dừng auto submit!');
    console.log(`Alert message: "${message}"`);

    // DỪNG auto submit
    if (isRunning) {
      isRunning = false;
      log(`🎉 Có alert khác xuất hiện - Dừng auto submit!`, 'success');
      log(`📢 Alert: "${message}"`, 'success');
      updateControlsUI();
    }

    // Hiển thị alert bình thường
    return originalAlert.call(window, message);
  };

  console.log('✅ window.alert đã được override thành công!');

  // Hàm tìm và click vào captcha checkbox (nếu cần)
  function tryClickCaptchaCheckbox() {
    // Tìm iframe captcha
    const captchaIframe = document.querySelector('iframe[src*="turnstile"], iframe[src*="cloudflare"], iframe[src*="challenges"]');

    if (captchaIframe) {
      try {
        // Click vào iframe để trigger captcha
        const rect = captchaIframe.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        console.log('🖱️ [Captcha] Trying to click captcha iframe at', x, y);

        // Simulate click
        captchaIframe.click();

        // Hoặc click vào parent container
        if (captchaIframe.parentElement) {
          captchaIframe.parentElement.click();
          console.log('🖱️ [Captcha] Clicked captcha parent container');
        }

        return true;
      } catch (e) {
        console.log('⚠️ [Captcha] Cannot click iframe:', e.message);
      }
    }

    // Tìm checkbox/input trong captcha container
    const captchaCheckbox = document.querySelector('input[type="checkbox"][id*="captcha"], input[type="checkbox"][class*="captcha"]');
    if (captchaCheckbox && !captchaCheckbox.checked) {
      console.log('🖱️ [Captcha] Found unchecked captcha checkbox, clicking...');
      captchaCheckbox.click();
      return true;
    }

    return false;
  }

  // Hàm check Cloudflare Turnstile captcha đã verify chưa
  function isCaptchaVerified() {
    // Cloudflare Turnstile thường có các dấu hiệu sau khi verify thành công:

    // 1. Check input hidden có value (Turnstile response token) - PHƯƠNG PHÁP CHÍNH
    const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]');
    if (turnstileInput && turnstileInput.value && turnstileInput.value.length > 0) {
      console.log('✅ Captcha verified: Found turnstile response token (length:', turnstileInput.value.length + ')');
      return true;
    }

    // 2. Check text "Thành công!" xuất hiện (như trong Cloudflare Turnstile)
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const text = el.textContent?.trim();
      // Chỉ check các element nhỏ (không phải body hay container lớn)
      if (text === 'Thành công!' && el.children.length === 0) {
        console.log('✅ Captcha verified: Found "Thành công!" text');
        return true;
      }
    }

    // 3. Check SVG checkmark (dấu tick xanh) của Cloudflare
    const checkmarkSvg = document.querySelector('svg[aria-label*="success"], svg[aria-label*="Success"], svg path[fill="#00ff00"], svg path[fill="green"]');
    if (checkmarkSvg) {
      console.log('✅ Captcha verified: Found success checkmark SVG');
      return true;
    }

    // 4. Check iframe captcha có class "success" hoặc tương tự
    const captchaIframe = document.querySelector('iframe[src*="turnstile"], iframe[src*="cloudflare"], iframe[src*="challenges"]');
    if (captchaIframe) {
      const parent = captchaIframe.parentElement;
      if (parent) {
        const parentClass = parent.className || '';
        if (parentClass.includes('success') || parentClass.includes('verified') || parentClass.includes('complete')) {
          console.log('✅ Captcha verified: Parent has success class');
          return true;
        }
      }
    }

    // 5. Check container captcha có data-attribute success
    const captchaContainer = document.querySelector('[data-state="success"], [data-status="success"], [data-verified="true"]');
    if (captchaContainer) {
      console.log('✅ Captcha verified: Found success data attribute');
      return true;
    }

    return false;
  }

  // Hàm đợi captcha verify (với timeout)
  async function waitForCaptchaVerify(maxWaitTime = 60000) {
    const startTime = Date.now();
    let logCount = 0;
    let userNotified = false;
    let autoClickAttempts = 0;
    let maxAutoClickAttempts = 3;

    console.log('🔍 [Captcha Check] Bắt đầu kiểm tra captcha...');

    while (Date.now() - startTime < maxWaitTime) {
      if (isCaptchaVerified()) {
        log('✅ Captcha đã verify thành công!', 'success');
        console.log('✅ [Captcha Check] THÀNH CÔNG - Captcha đã verify!');
        return true;
      }

      // Log mỗi vài giây để user biết đang đợi
      logCount++;
      if (logCount === 1) {
        log('⏳ Đang đợi captcha verify...', 'warning', 5000);
      } else if (logCount === 6) {
        // Sau 3s (6 * 500ms), thử click vào captcha lần 1
        console.log('🤖 [Captcha Auto] Thử tự động click captcha (lần 1)...');
        if (tryClickCaptchaCheckbox()) {
          log('🖱️ Đã thử click captcha tự động...', 'info', 3000);
          autoClickAttempts++;
        }
      } else if (logCount === 14) {
        // Sau 7s (14 * 500ms), thử click vào captcha lần 2
        console.log('🤖 [Captcha Auto] Thử tự động click captcha (lần 2)...');
        if (tryClickCaptchaCheckbox()) {
          autoClickAttempts++;
        }
      } else if (logCount === 20 && !userNotified) {
        // Sau 10s (20 * 500ms) vẫn chưa verify
        console.log('⚠️ [Captcha Check] Captcha chưa verify sau 10s');
        console.log('💡 [Captcha Check] Có thể captcha yêu cầu thao tác thủ công');
        console.log(`🤖 [Captcha Auto] Đã thử auto-click ${autoClickAttempts} lần`);
        log('⚠️ Captcha có thể cần tích thủ công!', 'warning', 8000);
        userNotified = true;

        // Thử click lần 3
        if (autoClickAttempts < maxAutoClickAttempts) {
          console.log('🤖 [Captcha Auto] Thử tự động click captcha (lần 3)...');
          tryClickCaptchaCheckbox();
          autoClickAttempts++;
        }
      } else if (logCount % 10 === 0) {
        // Log mỗi 5s (10 lần * 500ms)
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`⏳ [Captcha Check] Đã đợi ${elapsed}s... (đang chờ captcha)`);
      }

      // Check mỗi 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    log('❌ Timeout: Captcha chưa verify sau 60 giây', 'error');
    log('💡 Thử refresh trang hoặc đợi ít submit hơn', 'warning', 10000);
    console.log('❌ [Captcha Check] TIMEOUT - Captcha chưa verify sau 60 giây');
    console.log(`🤖 [Captcha Auto] Đã thử auto-click ${autoClickAttempts} lần nhưng không thành công`);
    console.log('💡 [Captcha Check] Khuyến nghị: Refresh trang hoặc đợi vài phút để IP không bị đánh dấu');
    return false;
  }

  // Hàm tìm submit button
  function findSubmitButton() {
    const selectors = [
      '#btn-upload-file',
      'button[type="submit"]',
      'input[type="submit"]',
      'button.submit',
      'button[class*="submit"]',
      'button[class*="Submit"]',
      'button.btn-submit',
      'button#submit'
    ];

    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && button.offsetParent !== null) {
        console.log(`✅ Tìm thấy submit button: ${selector}`);
        return button;
      }
    }
    return null;
  }

  // Container cho tất cả notifications
  let notificationContainer = null;

  function getNotificationContainer() {
    if (!notificationContainer || !document.body.contains(notificationContainer)) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'autoSubmitNotifications';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 500px;
        min-width: 300px;
      `;
      document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
  }

  // Hàm log với notification
  function log(message, type = 'info', duration = 3000) {
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [AutoSubmit] ${message}`);

    // Hiển thị notification
    const timestamp = new Date().toLocaleTimeString();
    const notification = document.createElement('div');
    notification.textContent = `[${timestamp}] ${icon} ${message}`;

    // Màu background theo type
    let bgColor = '#333';
    if (type === 'success') bgColor = '#4CAF50';
    if (type === 'error') bgColor = '#f44336';
    if (type === 'warning') bgColor = '#ff9800';

    notification.style.cssText = `
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      word-wrap: break-word;
      animation: slideInDown 0.3s ease-out;
      pointer-events: auto;
      text-align: center;
    `;

    // Thêm CSS animation nếu chưa có
    if (!document.getElementById('autoSubmitNotificationStyles')) {
      const style = document.createElement('style');
      style.id = 'autoSubmitNotificationStyles';
      style.textContent = `
        @keyframes slideInDown {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideOutUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const container = getNotificationContainer();
    container.appendChild(notification);

    // Alert messages hiển thị lâu hơn (5s)
    const displayTime = message.includes('Alert:') ? 5000 : duration;
    setTimeout(() => {
      notification.style.animation = 'slideOutUp 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, displayTime);
  }

  // Hàm highlight button khi click
  function highlightButton(button) {
    const originalBg = button.style.background;
    const originalBorder = button.style.border;

    button.style.background = '#ff0000';
    button.style.border = '3px solid #ffff00';
    button.style.transition = 'all 0.3s';

    setTimeout(() => {
      button.style.background = originalBg;
      button.style.border = originalBorder;
    }, 500);
  }

  // Hàm tự động submit
  async function autoSubmit() {
    if (!isRunning) {
      log('Dừng auto submit');
      return;
    }

    const submitButton = findSubmitButton();

    if (!submitButton) {
      log('❌ KHÔNG TÌM THẤY NÚT SUBMIT!', 'error');
      log('Đang thử tìm lại sau 3 giây...', 'warning');
      setTimeout(autoSubmit, 3000);
      return;
    }

    retryCount++;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔄 [SUBMIT #${retryCount}] Bắt đầu lần submit thứ ${retryCount}`);
    console.log(`📍 Submit button text: "${submitButton.textContent || submitButton.value}"`);
    console.log(`📍 Submit button ID: ${submitButton.id || 'N/A'}`);
    console.log(`📍 Submit button class: ${submitButton.className || 'N/A'}`);

    log(`🔄 Lần submit thứ ${retryCount}...`, 'info');

    // Reset alert blocked flag
    alertBlocked = false;

    // Scroll vào view submit button
    submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 300));

    // **QUAN TRỌNG: ĐỢI CAPTCHA VERIFY TRƯỚC KHI SUBMIT**
    log('🔍 Kiểm tra captcha...', 'warning');
    const captchaVerified = await waitForCaptchaVerify(30000);

    if (!captchaVerified) {
      log('❌ Captcha chưa verify! Skip lần này và retry...', 'error');
      if (isRunning) {
        setTimeout(autoSubmit, 2000);
      }
      return;
    }

    // Captcha đã OK, tiến hành click submit
    console.log(`✅ Captcha OK! Đang CLICK submit button...`);
    console.log(`⏰ Thời gian: ${new Date().toLocaleTimeString()}`);

    log(`🖱️ ĐANG CLICK SUBMIT BUTTON...`, 'success', 2000);

    // Highlight button để dễ thấy
    highlightButton(submitButton);

    // Click submit
    submitButton.click();
    console.log(`✅ ĐÃ CLICK submit button!`);

    // Đợi để xem có alert không
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`📊 Alert blocked: ${alertBlocked}`);
    console.log(`📊 Is running: ${isRunning}`);

    // Nếu alert bị block, retry sẽ được gọi từ window.alert override
    if (!alertBlocked && isRunning) {
      // Không có alert lỗi, có thể thành công hoặc chưa phản hồi
      // Tính delay thông minh
      const nextDelay = calculateSmartDelay();
      const delaySeconds = (nextDelay / 1000).toFixed(1);

      console.log(`⏳ Chờ ${nextDelay}ms (${delaySeconds}s) trước lần submit tiếp theo...`);
      console.log(`📈 Stats: Success=${successCount}, Fail=${failCount}, Total=${retryCount}`);
      log(`⏳ Chờ ${delaySeconds}s trước lần tiếp...`, 'info');

      setTimeout(autoSubmit, nextDelay);
    }
  }

  // Update UI controls
  function updateControlsUI() {
    const startBtn = document.getElementById('autoSubmitStart');
    const stopBtn = document.getElementById('autoSubmitStop');
    const status = document.getElementById('autoSubmitStatus');

    if (isRunning) {
      if (startBtn) startBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'inline-block';
      if (status) {
        const successRate = retryCount > 0 ? ((successCount / retryCount) * 100).toFixed(0) : 0;
        status.innerHTML = `🟢 Đang chạy - Lần ${retryCount}<br><small style="font-size: 10px; opacity: 0.8;">✅${successCount} | ❌${failCount}</small>`;
        status.style.color = '#4CAF50';
      }
    } else {
      if (startBtn) startBtn.style.display = 'inline-block';
      if (stopBtn) stopBtn.style.display = 'none';
      if (status) {
        if (retryCount > 0) {
          status.innerHTML = `⏸️ Đã dừng<br><small style="font-size: 10px; opacity: 0.8;">Tổng: ${retryCount} | ✅${successCount} | ❌${failCount}</small>`;
        } else {
          status.textContent = '⏸️ Đã dừng';
        }
        status.style.color = 'white';
      }
    }
  }

  // Hàm start
  function start() {
    if (isRunning) {
      log('Auto submit đang chạy rồi!', 'warning');
      return;
    }

    isRunning = true;
    retryCount = 0;
    successCount = 0;
    failCount = 0;
    log('🚀 Bắt đầu auto submit!', 'success');
    log(`⚙️ Chạy liên tục cho đến khi bấm Dừng`, 'info');
    log(`⏱️ Delay: ${minDelay/1000}s - ${maxDelay/1000}s (random)`, 'info');

    // Kiểm tra DevTools có đang mở không
    const isDevToolsOpen = window.outerWidth - window.innerWidth > 160 ||
                           window.outerHeight - window.innerHeight > 160;
    if (isDevToolsOpen) {
      console.log('⚠️ [WARNING] DevTools (F12) đang mở!');
      console.log('💡 [TIP] Captcha có thể yêu cầu thao tác thủ công');
      console.log('💡 [TIP] Để captcha auto-verify, khuyến nghị đóng DevTools');
      log('⚠️ DevTools đang mở - Captcha có thể cần tích thủ công', 'warning', 8000);
    } else {
      console.log('✅ [INFO] DevTools đã đóng - Captcha sẽ auto-verify');
      log('✅ Captcha sẽ tự động verify', 'success', 3000);
    }

    updateControlsUI();
    autoSubmit();
  }

  // Hàm stop
  function stop() {
    if (!isRunning) {
      log('Auto submit chưa chạy!', 'warning');
      return;
    }

    isRunning = false;
    log(`⏹️ Dừng auto submit. Tổng: ${retryCount} lần thử`, 'warning');

    updateControlsUI();
  }

  // Hàm tạo UI controls
  function createControls() {
    if (document.getElementById('autoSubmitControls')) {
      return;
    }

    const controls = document.createElement('div');
    controls.id = 'autoSubmitControls';
    controls.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      min-width: 220px;
    `;

    const title = document.createElement('div');
    title.textContent = '🚀 Auto Submit v2';
    title.style.cssText = 'font-size: 16px; font-weight: bold; margin-bottom: 10px;';

    const status = document.createElement('div');
    status.id = 'autoSubmitStatus';
    status.textContent = '⏸️ Đã dừng';
    status.style.cssText = 'font-size: 12px; margin-bottom: 10px; opacity: 0.9;';

    const startBtn = document.createElement('button');
    startBtn.id = 'autoSubmitStart';
    startBtn.textContent = '▶️ Bắt đầu';
    startBtn.onclick = start;
    startBtn.style.cssText = `
      background: #4CAF50;
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 5px;
      font-weight: bold;
    `;
    startBtn.onmouseover = () => startBtn.style.background = '#45a049';
    startBtn.onmouseout = () => startBtn.style.background = '#4CAF50';

    const stopBtn = document.createElement('button');
    stopBtn.id = 'autoSubmitStop';
    stopBtn.textContent = '⏹️ Dừng';
    stopBtn.onclick = stop;
    stopBtn.style.display = 'none';
    stopBtn.style.cssText = `
      background: #f44336;
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 5px;
      font-weight: bold;
      display: none;
    `;
    stopBtn.onmouseover = () => stopBtn.style.background = '#da190b';
    stopBtn.onmouseout = () => stopBtn.style.background = '#f44336';

    controls.appendChild(title);
    controls.appendChild(status);
    controls.appendChild(startBtn);
    controls.appendChild(stopBtn);

    document.body.appendChild(controls);

    // Auto update status
    setInterval(updateControlsUI, 500);
  }

  // Load UI khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createControls);
  } else {
    createControls();
  }

  // Expose functions
  window.autoSubmitStart = start;
  window.autoSubmitStop = stop;
  window.autoSubmitGetStatus = () => ({ isRunning, retryCount });

  // Listen cho messages từ content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'AUTO_SUBMIT_START') {
      start();
    } else if (event.data.type === 'AUTO_SUBMIT_STOP') {
      stop();
    } else if (event.data.type === 'AUTO_SUBMIT_STATUS') {
      window.postMessage({
        type: 'AUTO_SUBMIT_STATUS_RESPONSE',
        isRunning: isRunning,
        retryCount: retryCount
      }, '*');
    }
  });

  log('✅ Extension v2 đã được load! Override window.alert thành công!', 'success');

})();
