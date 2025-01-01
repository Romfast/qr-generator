document.addEventListener('DOMContentLoaded', function() {
  // Verify QRCode library is loaded
  if (typeof QRCode === 'undefined') {
    alert('QRCode library failed to load. Please refresh the page.');
    return;
  }

  const qrcodeElement = document.getElementById('qrcode');
  const contentInput = document.getElementById('content');
  const sizeInput = document.getElementById('size');
  const colorInput = document.getElementById('color');
  const bgColorInput = document.getElementById('bgColor');
  const errorLevelSelect = document.getElementById('errorLevel');
  const generateBtn = document.getElementById('generateBtn');
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
  let currentQRCode = null;

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
      alert('Please enter some content for the QR code');
      return;
    }

    const errorLevel = errorLevelSelect.value;
    const correctLevel = QRCode.CorrectLevel[errorLevel];
    let size = parseInt(sizeInput.value);
    let replacedData = replaceMultiByteChars(qrCodeData);
    const encodedData = utf8Encode(replacedData);

    try {
      qrcodeElement.innerHTML = '';
      currentQRCode = new QRCode(qrcodeElement, {
        text: replacedData,
        width: size,
        height: size,
        colorDark: colorInput.value,
        colorLight: bgColorInput.value,
        correctLevel: correctLevel
      });
      downloadBtn.style.display = 'block';
    } catch (error) {
      if (error.message.includes('code length overflow')) {
        alert('Error generating QR code: Data is too large. Please reduce the amount of data or use a lower error correction level.');
      } else {
        alert('Error generating QR code: ' + error.message + '. Please try again.');
        console.error('QR Code Generation Error:', error);
      }
      qrcodeElement.innerHTML = '';
      downloadBtn.style.display = 'none';
    }
  }

  function downloadQRCode() {
    const canvas = qrcodeElement.querySelector('canvas');
    if (!canvas) {
      alert('Please generate a QR code first');
      return;
    }
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }

  generateBtn.addEventListener('click', generateQRCode);
  downloadBtn.addEventListener('click', downloadQRCode);
});
