document.addEventListener('DOMContentLoaded', function() {
      const qrcodeElement = document.getElementById('qrcode');
      const sizeInput = document.getElementById('size');
      const bgColorInput = document.getElementById('bgColor');
      const errorLevelSelect = document.getElementById('errorLevel');
      const downloadBtn = document.getElementById('downloadBtn');
      const dataTypeSelect = document.getElementById('dataType');
      const textContent = document.getElementById('textContent');
      const urlContent = document.getElementById('urlContent');
      const vcardFirstName = document.getElementById('vcardFirstName');
      const vcardLastName = document.getElementById('vcardLastName');
      const vcardOrg = document.getElementById('vcardOrg');
      const vcardTel = document.getElementById('vcardTel');
      const vcardEmail = document.getElementById('vcardEmail');
      const vcardStreet = document.getElementById('vcardStreet');
      const vcardCity = document.getElementById('vcardCity');
      const vcardState = document.getElementById('vcardState');
      const vcardZip = document.getElementById('vcardZip');
      const vcardCountry = document.getElementById('vcardCountry');
      const vcardWebsite = document.getElementById('vcardWebsite');
      const emailAddress = document.getElementById('emailAddress');
      const emailSubject = document.getElementById('emailSubject');
      const emailBody = document.getElementById('emailBody');
      const smsNumber = document.getElementById('smsNumber');
      const smsMessage = document.getElementById('smsMessage');
      const wifiSsid = document.getElementById('wifiSsid');
      const wifiPassword = document.getElementById('wifiPassword');
      const wifiType = document.getElementById('wifiType');
      const iconUrlInput = document.getElementById('iconUrl');
      const iconUploadInput = document.getElementById('iconUpload');
      const dotsColorInput = document.getElementById('dotsColor');
      const cornersColorInput = document.getElementById('cornersColor');
      const dotsTypeSelect = document.getElementById('dotsType');
      const cornersTypeSelect = document.getElementById('cornersType');
      const copyBtn = document.getElementById('copyBtn');
      const shareBtn = document.getElementById('shareBtn');
      const calendarTitle = document.getElementById('calendarTitle');
      const calendarLocation = document.getElementById('calendarLocation');
      const calendarStart = document.getElementById('calendarStart');
      const calendarEnd = document.getElementById('calendarEnd');
      const calendarDescription = document.getElementById('calendarDescription');
      const geoLatitude = document.getElementById('geoLatitude');
      const geoLongitude = document.getElementById('geoLongitude');
      const getLocationBtn = document.getElementById('getLocationBtn');
      let uploadedIconUrl = null;

      // History Management
      const HISTORY_KEY = 'qrCodeHistory';
      const MAX_HISTORY_ITEMS = 10;
      let saveTimeout = null;
      let lastSavedData = null;
      let isRestoringFromHistory = false;

      const historyBtn = document.getElementById('historyBtn');
      const historyModal = document.getElementById('historyModal');
      const closeHistoryBtn = document.getElementById('closeHistoryBtn');
      const historyList = document.getElementById('historyList');
      const clearHistoryBtn = document.getElementById('clearHistoryBtn');

      // Type icons and labels
      const typeConfig = {
        text: { icon: '📝', label: 'Text' },
        url: { icon: '🔗', label: 'URL' },
        vcard: { icon: '👤', label: 'vCard' },
        email: { icon: '📧', label: 'Email' },
        sms: { icon: '💬', label: 'SMS' },
        wifi: { icon: '📶', label: 'WiFi' },
        calendar: { icon: '📅', label: 'Calendar' },
        geo: { icon: '📍', label: 'Location' }
      };

      function getHistory() {
        try {
          const history = localStorage.getItem(HISTORY_KEY);
          return history ? JSON.parse(history) : [];
        } catch (e) {
          console.error('Error loading history:', e);
          return [];
        }
      }

      function saveHistory(history) {
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
          console.error('Error saving history:', e);
        }
      }

      function generateThumbnail(callback) {
        const tempImg = document.createElement('img');
        tempImg.style.display = 'none';
        document.body.appendChild(tempImg);

        const dataType = dataTypeSelect.value;
        let qrCodeData = getCurrentQRData();

        if (!qrCodeData.trim()) {
          document.body.removeChild(tempImg);
          callback(null);
          return;
        }

        const replacedData = replaceMultiByteChars(qrCodeData);
        const iconUrl = iconUrlInput.value;
        const logo = uploadedIconUrl || iconUrl;

        const qrCodeOptions = {
          content: replacedData,
          width: 100,
          image: tempImg,
          download: false,
          nodeQrCodeOptions: {
            errorCorrectionLevel: errorLevelSelect.value,
            color: {
              dark: dotsColorInput.value,
              light: bgColorInput.value,
            },
          },
          dotsOptions: {
            type: dotsTypeSelect.value,
            color: dotsColorInput.value,
          },
          cornersOptions: {
            type: cornersTypeSelect.value,
            color: cornersColorInput.value,
          },
        };

        if (logo) {
          qrCodeOptions.logo = {
            src: logo,
            borderWidth: 12,
            borderRadius: 8,
            bgColor: bgColorInput.value,
          };
        }

        try {
          new QrCodeWithLogo(qrCodeOptions);
          setTimeout(() => {
            const thumbnail = tempImg.src || null;
            document.body.removeChild(tempImg);
            callback(thumbnail);
          }, 200);
        } catch (error) {
          document.body.removeChild(tempImg);
          callback(null);
        }
      }

      function getCurrentQRData() {
        const dataType = dataTypeSelect.value;
        switch (dataType) {
          case 'text': return textContent.value;
          case 'url': return urlContent.value;
          case 'vcard':
            return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName.value};${vcardFirstName.value}\nFN:${vcardFirstName.value} ${vcardLastName.value}\nORG:${vcardOrg.value}\nTEL:${vcardTel.value}\nEMAIL:${vcardEmail.value}\nADR:${vcardStreet.value};${vcardCity.value};${vcardState.value};${vcardZip.value};${vcardCountry.value}\nURL:${vcardWebsite.value}\nEND:VCARD`;
          case 'email':
            return `mailto:${emailAddress.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`;
          case 'sms': return `smsto:${smsNumber.value}:${smsMessage.value}`;
          case 'wifi': return `WIFI:S:${wifiSsid.value};T:${wifiType.value};P:${wifiPassword.value};;`;
          case 'calendar': return formatCalendarEvent();
          case 'geo':
            const lat = geoLatitude.value;
            const lng = geoLongitude.value;
            return (lat && lng) ? `geo:${lat},${lng}` : '';
          default: return '';
        }
      }

      function getPreviewText(type, data) {
        switch (type) {
          case 'text':
            return data.textContent ? data.textContent.substring(0, 30) + (data.textContent.length > 30 ? '...' : '') : 'Empty text';
          case 'url':
            try {
              const url = new URL(data.urlContent);
              return url.hostname + (url.pathname !== '/' ? url.pathname.substring(0, 15) + '...' : '');
            } catch {
              return data.urlContent ? data.urlContent.substring(0, 30) + '...' : 'Empty URL';
            }
          case 'vcard':
            const name = [data.vcardFirstName, data.vcardLastName].filter(Boolean).join(' ');
            const org = data.vcardOrg;
            return name ? (org ? `${name} - ${org}` : name) : (org || 'Empty contact');
          case 'email':
            return data.emailAddress || 'Empty email';
          case 'sms':
            return data.smsNumber || 'Empty SMS';
          case 'wifi':
            const ssid = data.wifiSsid || 'Unknown';
            const security = data.wifiType === 'nopass' ? 'Open' : data.wifiType;
            return `${ssid} (${security})`;
          case 'calendar':
            return data.calendarTitle || 'Untitled event';
          case 'geo':
            if (data.geoLatitude && data.geoLongitude) {
              return `${parseFloat(data.geoLatitude).toFixed(4)}, ${parseFloat(data.geoLongitude).toFixed(4)}`;
            }
            return 'Empty location';
          default:
            return 'QR Code';
        }
      }

      function formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'acum';
        if (minutes < 60) return `acum ${minutes} min`;
        if (hours < 24) return `acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
        if (days === 1) return 'ieri';
        if (days < 7) return `acum ${days} zile`;

        const date = new Date(timestamp);
        const monthNames = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return `${date.getDate()} ${monthNames[date.getMonth()]}`;
      }

      function getCurrentFormData() {
        return {
          // Data type
          dataType: dataTypeSelect.value,
          // Text
          textContent: textContent.value,
          // URL
          urlContent: urlContent.value,
          // vCard
          vcardFirstName: vcardFirstName.value,
          vcardLastName: vcardLastName.value,
          vcardOrg: vcardOrg.value,
          vcardTel: vcardTel.value,
          vcardEmail: vcardEmail.value,
          vcardStreet: vcardStreet.value,
          vcardCity: vcardCity.value,
          vcardState: vcardState.value,
          vcardZip: vcardZip.value,
          vcardCountry: vcardCountry.value,
          vcardWebsite: vcardWebsite.value,
          // Email
          emailAddress: emailAddress.value,
          emailSubject: emailSubject.value,
          emailBody: emailBody.value,
          // SMS
          smsNumber: smsNumber.value,
          smsMessage: smsMessage.value,
          // WiFi
          wifiSsid: wifiSsid.value,
          wifiPassword: wifiPassword.value,
          wifiType: wifiType.value,
          // Calendar
          calendarTitle: calendarTitle.value,
          calendarLocation: calendarLocation.value,
          calendarStart: calendarStart.value,
          calendarEnd: calendarEnd.value,
          calendarDescription: calendarDescription.value,
          // Geo
          geoLatitude: geoLatitude.value,
          geoLongitude: geoLongitude.value,
          // Styling
          size: sizeInput.value,
          bgColor: bgColorInput.value,
          dotsColor: dotsColorInput.value,
          cornersColor: cornersColorInput.value,
          errorLevel: errorLevelSelect.value,
          dotsType: dotsTypeSelect.value,
          cornersType: cornersTypeSelect.value,
          iconUrl: iconUrlInput.value
        };
      }

      function restoreFromHistory(historyItem) {
        const data = historyItem.data;

        // Prevent saving duplicate when restoring
        isRestoringFromHistory = true;

        // Set data type first
        dataTypeSelect.value = data.dataType;
        // Trigger the change to show correct fields
        dataTypeSelect.dispatchEvent(new Event('change'));

        // Restore all form fields
        textContent.value = data.textContent || '';
        urlContent.value = data.urlContent || '';
        vcardFirstName.value = data.vcardFirstName || '';
        vcardLastName.value = data.vcardLastName || '';
        vcardOrg.value = data.vcardOrg || '';
        vcardTel.value = data.vcardTel || '';
        vcardEmail.value = data.vcardEmail || '';
        vcardStreet.value = data.vcardStreet || '';
        vcardCity.value = data.vcardCity || '';
        vcardState.value = data.vcardState || '';
        vcardZip.value = data.vcardZip || '';
        vcardCountry.value = data.vcardCountry || '';
        vcardWebsite.value = data.vcardWebsite || '';
        emailAddress.value = data.emailAddress || '';
        emailSubject.value = data.emailSubject || '';
        emailBody.value = data.emailBody || '';
        smsNumber.value = data.smsNumber || '';
        smsMessage.value = data.smsMessage || '';
        wifiSsid.value = data.wifiSsid || '';
        wifiPassword.value = data.wifiPassword || '';
        wifiType.value = data.wifiType || 'WPA';
        calendarTitle.value = data.calendarTitle || '';
        calendarLocation.value = data.calendarLocation || '';
        calendarStart.value = data.calendarStart || '';
        calendarEnd.value = data.calendarEnd || '';
        calendarDescription.value = data.calendarDescription || '';
        geoLatitude.value = data.geoLatitude || '';
        geoLongitude.value = data.geoLongitude || '';

        // Restore styling
        sizeInput.value = data.size || '200';
        bgColorInput.value = data.bgColor || '#ffffff';
        dotsColorInput.value = data.dotsColor || '#000000';
        cornersColorInput.value = data.cornersColor || '#000000';
        errorLevelSelect.value = data.errorLevel || 'L';
        dotsTypeSelect.value = data.dotsType || 'square';
        cornersTypeSelect.value = data.cornersType || 'square';
        iconUrlInput.value = data.iconUrl || '';

        // Update color previews
        document.getElementById('bgColorPreview').style.backgroundColor = data.bgColor || '#ffffff';
        document.getElementById('dotsColorPreview').style.backgroundColor = data.dotsColor || '#000000';
        document.getElementById('cornersColorPreview').style.backgroundColor = data.cornersColor || '#000000';

        // Regenerate QR code
        generateQRCode();

        // Reset flag after a short delay to allow QR generation to complete
        setTimeout(() => {
          isRestoringFromHistory = false;
        }, 100);

        // Close modal
        closeHistoryModal();
      }

      function saveToHistory() {
        const qrData = getCurrentQRData();

        // Don't save empty QR codes
        if (!qrData.trim()) return;

        // Create data signature to check for duplicates
        const formData = getCurrentFormData();
        const dataSignature = JSON.stringify({
          type: formData.dataType,
          data: qrData
        });

        // Don't save if same as last saved
        if (dataSignature === lastSavedData) return;

        generateThumbnail((thumbnail) => {
          if (!thumbnail) return;

          const history = getHistory();
          const historyItem = {
            id: Date.now(),
            type: formData.dataType,
            data: formData,
            preview: getPreviewText(formData.dataType, formData),
            thumbnail: thumbnail,
            timestamp: Date.now()
          };

          // Add to beginning of array
          history.unshift(historyItem);

          // Keep only MAX_HISTORY_ITEMS
          if (history.length > MAX_HISTORY_ITEMS) {
            history.pop();
          }

          saveHistory(history);
          lastSavedData = dataSignature;
        });
      }

      function debouncedSave() {
        // Don't save when restoring from history
        if (isRestoringFromHistory) return;

        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(saveToHistory, 1500);
      }

      function deleteHistoryItem(id, event) {
        event.stopPropagation();
        const history = getHistory().filter(item => item.id !== id);
        saveHistory(history);
        renderHistory();
      }

      function clearAllHistory() {
        if (confirm('Ștergi tot istoricul QR codurilor?')) {
          localStorage.removeItem(HISTORY_KEY);
          lastSavedData = null;
          renderHistory();
        }
      }

      function renderHistory() {
        const history = getHistory();

        if (history.length === 0) {
          historyList.innerHTML = `
            <div class="history-empty">
              <div class="history-empty-icon">📭</div>
              <div>Nu există QR coduri în istoric</div>
            </div>
          `;
          clearHistoryBtn.disabled = true;
          return;
        }

        clearHistoryBtn.disabled = false;
        historyList.innerHTML = history.map(item => {
          const config = typeConfig[item.type] || { icon: '📄', label: 'Unknown' };
          return `
            <div class="history-item" data-id="${item.id}">
              <div class="history-item-icon">${config.icon}</div>
              <div class="history-item-content">
                <div class="history-item-type">${config.label}</div>
                <div class="history-item-preview">${escapeHtml(item.preview)}</div>
                <div class="history-item-time">${formatRelativeTime(item.timestamp)}</div>
              </div>
              <img class="history-item-thumbnail" src="${item.thumbnail}" alt="QR">
              <button class="history-item-delete" data-id="${item.id}" title="Șterge">&times;</button>
            </div>
          `;
        }).join('');

        // Add click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const historyItem = history.find(h => h.id === id);
            if (historyItem) {
              restoreFromHistory(historyItem);
            }
          });
        });

        historyList.querySelectorAll('.history-item-delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            deleteHistoryItem(parseInt(btn.dataset.id), e);
          });
        });
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      function openHistoryModal() {
        renderHistory();
        historyModal.classList.add('show');
      }

      function closeHistoryModal() {
        historyModal.classList.remove('show');
      }

      // History event listeners
      historyBtn.addEventListener('click', openHistoryModal);
      closeHistoryBtn.addEventListener('click', closeHistoryModal);
      clearHistoryBtn.addEventListener('click', clearAllHistory);

      historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
          closeHistoryModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && historyModal.classList.contains('show')) {
          closeHistoryModal();
        }
      });

      function utf8Encode(str) {
        try {
          return new TextEncoder().encode(str);
        } catch (e) {
          return unescape(encodeURIComponent(str));
        }
      }
    
      function replaceMultiByteChars(str) {
        const replacements = {
          'ă': 'a', 'î': 'i', 'ș': 's', 'ț': 't', 'â': 'a',
          'Ă': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T', 'Â': 'A',
          'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
          'Á': 'A', 'À': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A', 'Å': 'A',
          'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
          'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
          'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
          'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
          'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o',
          'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
          'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
          'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
          'ç': 'c', 'Ç': 'C', 'ñ': 'n', 'Ñ': 'N'
        };
        let replacedStr = str;
        for (const char in replacements) {
          if (replacements.hasOwnProperty(char)) {
            replacedStr = replacedStr.replace(new RegExp(char, 'g'), replacements[char]);
          }
        }
        return replacedStr;
      }

      function formatDateToICS(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
      }

      function formatCalendarEvent() {
        const title = calendarTitle.value || '';
        const location = calendarLocation.value || '';
        const start = calendarStart.value;
        const end = calendarEnd.value;
        const description = calendarDescription.value || '';

        if (!title || !start) return '';

        const startFormatted = formatDateToICS(start);
        const endFormatted = end ? formatDateToICS(end) : formatDateToICS(start);

        return `BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${location}
DTSTART:${startFormatted}
DTEND:${endFormatted}
DESCRIPTION:${description}
END:VEVENT`;
      }

      function generateHighResQRBlob(targetSize = 1024) {
        return new Promise((resolve, reject) => {
          let qrCodeData = '';
          const dataType = dataTypeSelect.value;

          switch (dataType) {
            case 'text': qrCodeData = textContent.value; break;
            case 'url': qrCodeData = urlContent.value; break;
            case 'vcard':
              qrCodeData = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName.value};${vcardFirstName.value}\nFN:${vcardFirstName.value} ${vcardLastName.value}\nORG:${vcardOrg.value}\nTEL:${vcardTel.value}\nEMAIL:${vcardEmail.value}\nADR:${vcardStreet.value};${vcardCity.value};${vcardState.value};${vcardZip.value};${vcardCountry.value}\nURL:${vcardWebsite.value}\nEND:VCARD`;
              break;
            case 'email':
              qrCodeData = `mailto:${emailAddress.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`;
              break;
            case 'sms': qrCodeData = `smsto:${smsNumber.value}:${smsMessage.value}`; break;
            case 'wifi': qrCodeData = `WIFI:S:${wifiSsid.value};T:${wifiType.value};P:${wifiPassword.value};;`; break;
            case 'calendar': qrCodeData = formatCalendarEvent(); break;
            case 'geo':
              const lat = geoLatitude.value;
              const lng = geoLongitude.value;
              if (lat && lng) qrCodeData = `geo:${lat},${lng}`;
              break;
          }

          if (!qrCodeData.trim()) {
            reject(new Error('No QR data'));
            return;
          }

          const tempImg = document.createElement('img');
          tempImg.style.display = 'none';
          document.body.appendChild(tempImg);

          const replacedData = replaceMultiByteChars(qrCodeData);
          const iconUrl = iconUrlInput.value;
          const logo = uploadedIconUrl || iconUrl;

          const qrCodeOptions = {
            content: replacedData,
            width: targetSize,
            image: tempImg,
            download: false,
            nodeQrCodeOptions: {
              errorCorrectionLevel: errorLevelSelect.value,
              color: {
                dark: dotsColorInput.value,
                light: bgColorInput.value,
              },
            },
            dotsOptions: {
              type: dotsTypeSelect.value,
              color: dotsColorInput.value,
            },
            cornersOptions: {
              type: cornersTypeSelect.value,
              color: cornersColorInput.value,
            },
          };

          if (logo) {
            qrCodeOptions.logo = {
              src: logo,
              borderWidth: targetSize * 0.12,
              borderRadius: targetSize * 0.08,
              bgColor: bgColorInput.value,
            };
          }

          try {
            new QrCodeWithLogo(qrCodeOptions);

            setTimeout(() => {
              if (tempImg.src) {
                fetch(tempImg.src)
                  .then(res => res.blob())
                  .then(blob => {
                    document.body.removeChild(tempImg);
                    resolve(blob);
                  })
                  .catch(err => {
                    document.body.removeChild(tempImg);
                    reject(err);
                  });
              } else {
                document.body.removeChild(tempImg);
                reject(new Error('Failed to generate high-res QR'));
              }
            }, 300);
          } catch (error) {
            document.body.removeChild(tempImg);
            reject(error);
          }
        });
      }

      async function copyQRCode() {
        const qrCodeImage = document.getElementById('qrcode');
        if (!qrCodeImage.src) {
          alert('Please generate a QR code first');
          return;
        }

        copyBtn.disabled = true;

        try {
          const blob = await generateHighResQRBlob(1024);
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          copyBtn.disabled = false;
        } catch (err) {
          copyBtn.disabled = false;
          alert('Copy failed. Your browser may not support clipboard image copy.');
        }
      }

      async function shareQRCode() {
        const qrCodeImage = document.getElementById('qrcode');
        if (!qrCodeImage.src) {
          alert('Please generate a QR code first');
          return;
        }

        if (!navigator.share) {
          alert('Share not supported in this browser. Try on mobile or use Copy instead.');
          return;
        }

        shareBtn.disabled = true;

        try {
          const blob = await generateHighResQRBlob(1024);
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });

          shareBtn.disabled = false;

          await navigator.share({
            title: 'QR Code',
            text: 'Check out this QR code!',
            files: [file]
          });
        } catch (err) {
          shareBtn.disabled = false;
          if (err.name !== 'AbortError') {
            try {
              await navigator.share({
                title: 'QR Code',
                text: 'QR Code generated with QR Code Generator'
              });
            } catch (textErr) {
              if (textErr.name !== 'AbortError') {
                alert('Share failed. Try using Copy instead.');
              }
            }
          }
        }
      }

      function getCurrentLocation() {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
          return;
        }

        getLocationBtn.textContent = 'Getting location...';
        getLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            geoLatitude.value = position.coords.latitude.toFixed(6);
            geoLongitude.value = position.coords.longitude.toFixed(6);
            getLocationBtn.textContent = 'Use My Location';
            getLocationBtn.disabled = false;
            generateQRCode();
          },
          (error) => {
            getLocationBtn.textContent = 'Use My Location';
            getLocationBtn.disabled = false;
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('Location permission denied. Please enable location access.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information unavailable.');
                break;
              case error.TIMEOUT:
                alert('Location request timed out.');
                break;
              default:
                alert('An error occurred getting your location.');
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    
      function generateQRCode() {
        let qrCodeData = '';
        const dataType = dataTypeSelect.value;
    
        switch (dataType) {
          case 'text':
            qrCodeData = textContent.value;
            break;
          case 'url':
            qrCodeData = urlContent.value;
            break;
          case 'vcard':
            qrCodeData = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName.value};${vcardFirstName.value}\nFN:${vcardFirstName.value} ${vcardLastName.value}\nORG:${vcardOrg.value}\nTEL:${vcardTel.value}\nEMAIL:${vcardEmail.value}\nADR:${vcardStreet.value};${vcardCity.value};${vcardState.value};${vcardZip.value};${vcardCountry.value}\nURL:${vcardWebsite.value}\nEND:VCARD`;
            break;
          case 'email':
            qrCodeData = `mailto:${emailAddress.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`;
            break;
          case 'sms':
            qrCodeData = `smsto:${smsNumber.value}:${smsMessage.value}`;
            break;
          case 'wifi':
            qrCodeData = `WIFI:S:${wifiSsid.value};T:${wifiType.value};P:${wifiPassword.value};;`;
            break;
          case 'calendar':
            qrCodeData = formatCalendarEvent();
            break;
          case 'geo':
            const lat = geoLatitude.value;
            const lng = geoLongitude.value;
            if (lat && lng) {
              qrCodeData = `geo:${lat},${lng}`;
            }
            break;
          default:
            alert('Please select a data type.');
            return;
        }
    
        if (!qrCodeData.trim()) {
          return;
        }
    
        const errorLevel = errorLevelSelect.value;
        let size = parseInt(sizeInput.value);
        let replacedData = replaceMultiByteChars(qrCodeData);
        const encodedData = utf8Encode(replacedData);
        const iconUrl = iconUrlInput.value;
        const logo = uploadedIconUrl || iconUrl;
        const dotsColor = dotsColorInput.value;
        const cornersColor = cornersColorInput.value;
        const dotsType = dotsTypeSelect.value;
        const cornersType = cornersTypeSelect.value;
    
        qrcodeElement.innerHTML = '';
        const qrCodeOptions = {
          content: replacedData,
          width: size,
          image: qrcodeElement,
          download: false,
          nodeQrCodeOptions: {
            errorCorrectionLevel: errorLevel,
            color: {
              dark: dotsColor,
              light: bgColorInput.value,
            },
          },
          dotsOptions: {
            type: dotsType,
            color: dotsColor,
          },
          cornersOptions: {
            type: cornersType,
            color: cornersColor,
          },
        };
    
        if (logo) {
          qrCodeOptions.logo = {
            src: logo,
            borderWidth: size * 0.12,
            borderRadius: size * 0.08,
            bgColor: bgColorInput.value,
          };
        }
    
        try {
          new QrCodeWithLogo(qrCodeOptions);
          downloadBtn.style.display = 'block';
          // Debounced save to history
          debouncedSave();
        } catch (error) {
           if (error.message.includes('code length overflow')) {
            alert('Error generating QR code: Data is too large. Please reduce the amount of data or use a lower error correction level.');
          } else {
            alert('Error generating QR code: ' + error.message + '. Please try again.');
            console.error('QR Code Generation Error:', error);
          }
          qrcodeElement.src = '';
          downloadBtn.style.display = 'none';
        }
      }
    
      function downloadQRCode() {
         const qrCodeImage = document.getElementById('qrcode');
        if (!qrCodeImage.src) {
          alert('Please generate a QR code first');
          return;
        }
        const link = document.createElement('a');
        link.href = qrCodeImage.src;
        link.download = 'qrcode.png';
        link.click();
      }
    
      iconUploadInput.addEventListener('change', function() {
        const file = iconUploadInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            uploadedIconUrl = e.target.result;
            generateQRCode();
          };
          reader.readAsDataURL(file);
        } else {
          uploadedIconUrl = null;
          generateQRCode();
        }
      });
    
      sizeInput.addEventListener('input', generateQRCode);
      bgColorInput.addEventListener('input', generateQRCode);
      errorLevelSelect.addEventListener('change', generateQRCode);
      dataTypeSelect.addEventListener('change', generateQRCode);
      textContent.addEventListener('input', generateQRCode);
      urlContent.addEventListener('input', generateQRCode);
      vcardFirstName.addEventListener('input', generateQRCode);
      vcardLastName.addEventListener('input', generateQRCode);
      vcardOrg.addEventListener('input', generateQRCode);
      vcardTel.addEventListener('input', generateQRCode);
      vcardEmail.addEventListener('input', generateQRCode);
      vcardStreet.addEventListener('input', generateQRCode);
      vcardCity.addEventListener('input', generateQRCode);
      vcardState.addEventListener('input', generateQRCode);
      vcardZip.addEventListener('input', generateQRCode);
      vcardCountry.addEventListener('input', generateQRCode);
      vcardWebsite.addEventListener('input', generateQRCode);
      emailAddress.addEventListener('input', generateQRCode);
      emailSubject.addEventListener('input', generateQRCode);
      emailBody.addEventListener('input', generateQRCode);
      smsNumber.addEventListener('input', generateQRCode);
      smsMessage.addEventListener('input', generateQRCode);
      wifiSsid.addEventListener('input', generateQRCode);
      wifiPassword.addEventListener('input', generateQRCode);
      wifiType.addEventListener('change', generateQRCode);
      iconUrlInput.addEventListener('input', generateQRCode);
      dotsColorInput.addEventListener('input', generateQRCode);
      cornersColorInput.addEventListener('input', generateQRCode);
      dotsTypeSelect.addEventListener('change', generateQRCode);
      cornersTypeSelect.addEventListener('change', generateQRCode);
    
      downloadBtn.addEventListener('click', downloadQRCode);
      copyBtn.addEventListener('click', copyQRCode);
      shareBtn.addEventListener('click', shareQRCode);
      getLocationBtn.addEventListener('click', getCurrentLocation);
      calendarTitle.addEventListener('input', generateQRCode);
      calendarLocation.addEventListener('input', generateQRCode);
      calendarStart.addEventListener('input', generateQRCode);
      calendarEnd.addEventListener('input', generateQRCode);
      calendarDescription.addEventListener('input', generateQRCode);
      geoLatitude.addEventListener('input', generateQRCode);
      geoLongitude.addEventListener('input', generateQRCode);

      generateQRCode();
    });
