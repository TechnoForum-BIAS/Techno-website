const bwipjs = require('bwip-js');

/**
 * Generate a Barcode or QR Code as a Base64 PNG string
 * @param {string} text - The serial number or text to encode (e.g., 'BIAS-EXT-004')
 * @param {string} type - 'code128' or 'qrcode'
 * @returns {Promise<string>} Base64 data URL
 */
const generateBarcode = async (text, type = 'code128') => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: type,            // Barcode type ('code128', 'qrcode')
      text: text,            // Text to encode
      scale: 3,              // 3x scaling factor
      height: type === 'qrcode' ? 20 : 10, // Bar height, in millimeters
      includetext: true,     // Show human-readable text
      textxalign: 'center',  // Always good to align center
    }, (err, png) => {
      if (err) {
        reject(err);
      } else {
        const base64 = `data:image/png;base64,${png.toString('base64')}`;
        resolve(base64);
      }
    });
  });
};

module.exports = { generateBarcode };
