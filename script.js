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
      generateQRCode();
    });
