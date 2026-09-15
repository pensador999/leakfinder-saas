// ==============================================================================
// 🛡️ ADSHIELD SENTINEL • BACKGROUND SERVICE WORKER (MANIFEST V3)
// Handles 24/7 continuous store monitoring, badge alarms, periodic health
// pings, and notification triggers for detected ruptures.
// ==============================================================================

const ALARM_NAME = 'ADSHIELD_WATCHDOG_CHECK';
const CHECK_INTERVAL_MINUTES = 30;

// Initialize on install or startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[AdShield Sentinel] Service Worker installed:', details.reason);
  
  // Setup recurring alarm for 24/7 background audits
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });

  // Default settings
  chrome.storage.local.get(['monitoredStores', 'sentinelEnabled'], (data) => {
    if (!data.monitoredStores) {
      chrome.storage.local.set({ monitoredStores: [] });
    }
    if (data.sentinelEnabled === undefined) {
      chrome.storage.local.set({ sentinelEnabled: true });
    }
  });
});

// Listen to scheduled alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    runBackgroundStoreAudits();
  }
});

// Perform periodic audits of monitored stores
async function runBackgroundStoreAudits() {
  chrome.storage.local.get(['monitoredStores', 'sentinelEnabled'], async (data) => {
    if (!data.sentinelEnabled || !data.monitoredStores || data.monitoredStores.length === 0) {
      return;
    }

    console.log(`[AdShield Sentinel] Running background audit for ${data.monitoredStores.length} stores...`);

    for (const store of data.monitoredStores) {
      try {
        const cleanDomain = store.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        const targetUrl = `https://${cleanDomain}/products.json?limit=10`;
        
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) continue;

        const json = await response.json();
        const products = json.products || [];
        let brokenCount = 0;
        const brokenNames = [];

        for (const prod of products) {
          const variants = prod.variants || [];
          const hasBrokenStock = variants.some((v) => {
            const name = (v.title || '').toUpperCase();
            const isKeySize = name.includes('M') || name.includes('G');
            return isKeySize && v.available === false;
          });

          if (hasBrokenStock) {
            brokenCount++;
            brokenNames.push(prod.title);
          }
        }

        if (brokenCount > 0) {
          // Trigger browser notification
          if (chrome.notifications) {
            chrome.notifications.create(`rupture-${cleanDomain}-${Date.now()}`, {
              type: 'basic',
              iconUrl: 'icons/icon128.png',
              title: `🚨 Alerta AdShield: ${cleanDomain}`,
              message: `Detectamos ${brokenCount} produto(s) com grade rompida (M/G esgotados). Tráfego pago em risco!`,
              priority: 2
            });
          }

          // Update store alert status
          store.lastAlertAt = new Date().toISOString();
          store.activeAlerts = brokenCount;
        } else {
          store.activeAlerts = 0;
        }

        store.lastCheckedAt = new Date().toISOString();
      } catch (err) {
        console.warn(`[AdShield Sentinel] Audit check failed for ${store.domain}:`, err.message);
      }
    }

    // Save updated telemetry
    chrome.storage.local.set({ monitoredStores: data.monitoredStores });
  });
}

// Listen to messages from content.js or popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'UPDATE_BADGE') {
    if (sender.tab && sender.tab.id) {
      const tabId = sender.tab.id;
      if (message.hasRupture) {
        chrome.action.setBadgeText({ tabId, text: '!' });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#ef4444' });
      } else {
        chrome.action.setBadgeText({ tabId, text: '✓' });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' });
      }
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'GET_SENTINEL_STATUS') {
    chrome.storage.local.get(['monitoredStores', 'sentinelEnabled'], (data) => {
      sendResponse({
        enabled: data.sentinelEnabled !== false,
        stores: data.monitoredStores || []
      });
    });
    return true;
  }

  if (message.action === 'REGISTER_STORE_247') {
    const { domain, whatsapp } = message.payload || {};
    if (!domain) {
      sendResponse({ success: false, error: 'Domínio inválido' });
      return true;
    }

    chrome.storage.local.get(['monitoredStores'], (data) => {
      const stores = data.monitoredStores || [];
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const existingIdx = stores.findIndex((s) => s.domain === cleanDomain);

      const storeRecord = {
        domain: cleanDomain,
        whatsapp: whatsapp || '',
        registeredAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
        activeAlerts: 0,
        status: 'active'
      };

      if (existingIdx >= 0) {
        stores[existingIdx] = { ...stores[existingIdx], ...storeRecord };
      } else {
        stores.push(storeRecord);
      }

      chrome.storage.local.set({ monitoredStores: stores }, () => {
        sendResponse({ success: true, store: storeRecord, total: stores.length });
      });
    });
    return true;
  }
});
