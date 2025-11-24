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

      async function copyQRCode() {
        const qrCodeImage = document.getElementById('qrcode');
        if (!qrCodeImage.src) {
          alert('Please generate a QR code first');
          return;
        }

        try {
          const response = await fetch(qrCodeImage.src);
          const blob = await response.blob();
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);

          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.backgroundColor = '#28a745';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
          }, 2000);
        } catch (err) {
          try {
            const canvas = document.createElement('canvas');
            const img = qrCodeImage;
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(async (blob) => {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              copyBtn.textContent = 'Copied!';
              setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
            });
          } catch (fallbackErr) {
            alert('Copy failed. Your browser may not support clipboard image copy.');
          }
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

        try {
          const response = await fetch(qrCodeImage.src);
          const blob = await response.blob();
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });

          await navigator.share({
            title: 'QR Code',
            text: 'Check out this QR code!',
            files: [file]
          });
        } catch (err) {
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
