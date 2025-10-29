// Popup script
document.getElementById('startBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Kiểm tra xem có phải trang ricecitylongchau.com không
    const url = tabs[0].url;
    if (!url.includes('ricecitylongchau.com')) {
      document.getElementById('status').textContent = '⚠️ Vui lòng mở trang ricecitylongchau.com';
      document.getElementById('status').style.color = '#ff6b6b';
      return;
    }
    
    // Gửi message với error handling
    chrome.tabs.sendMessage(tabs[0].id, { action: 'start' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script chưa sẵn sàng');
        document.getElementById('status').textContent = '⚠️ Refresh trang web rồi thử lại';
        document.getElementById('status').style.color = '#ff6b6b';
      } else {
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'block';
        document.getElementById('status').textContent = '🟢 Đang chạy...';
        document.getElementById('status').style.color = '#4CAF50';
      }
    });
  });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, (response) => {
      if (!chrome.runtime.lastError) {
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('stopBtn').style.display = 'none';
        document.getElementById('status').textContent = '⏸️ Đã dừng';
        document.getElementById('status').style.color = 'white';
      }
    });
  });
});

// Check status khi mở popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;
  
  if (url.includes('ricecitylongchau.com')) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'status' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script chưa chạy
        document.getElementById('status').textContent = 'ℹ️ Sẵn sàng';
        document.getElementById('status').style.color = 'white';
      } else if (response && response.isRunning) {
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'block';
        document.getElementById('status').textContent = '🟢 Đang chạy...';
        document.getElementById('status').style.color = '#4CAF50';
      }
    });
  } else {
    document.getElementById('status').textContent = '⚠️ Vui lòng mở trang ricecitylongchau.com';
    document.getElementById('status').style.color = '#ff6b6b';
  }
});

