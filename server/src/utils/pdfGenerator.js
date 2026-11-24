const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

/**
 * Overlay student details onto a base certificate template
 * @param {Buffer|Uint8Array} templateBytes - PDF or Image template buffer
 * @param {Array<{field: string, text: string, x: number, y: number, fontSize: number, color?: {r, g, b}}>} placeholders
 * @param {boolean} isImage - Whether template is an image (PNG/JPEG) or PDF
 * @returns {Promise<Uint8Array>} Generated PDF bytes
 */
const generateCertificatePdf = async (templateBytes, placeholders = [], isImage = false) => {
  let pdfDoc;

  if (isImage) {
    pdfDoc = await PDFDocument.create();
    const image = await pdfDoc.embedPng(templateBytes).catch(() => pdfDoc.embedJpg(templateBytes));
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  } else {
    pdfDoc = await PDFDocument.load(templateBytes);
  }

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const item of placeholders) {
    const text = String(item.text || '');
    const size = item.fontSize || 20;
    // PDF coordinate system starts from bottom-left; convert standard web top-left coordinates if needed
    const posY = item.fromTop ? (height - item.y) : item.y;

    firstPage.drawText(text, {
      x: item.x || 50,
      y: posY || 100,
      size: size,
      font: font,
      color: item.color ? rgb(item.color.r, item.color.g, item.color.b) : rgb(0.05, 0.1, 0.25),
    });
  }

  return await pdfDoc.save();
};

module.exports = { generateCertificatePdf };
