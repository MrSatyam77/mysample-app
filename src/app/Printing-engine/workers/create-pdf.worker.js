/// <reference lib="webworker" />
importScripts('../lib/pdfkit.js');
importScripts('../lib/pdfkit.Buffer.js');
importScripts('../lib/blob-stream.js');
importScripts('../lib/svg-to-pdfkit.js');
importScripts('../fonts/arial.js');
importScripts('../fonts/courier-bold.js');
importScripts('../fonts/courier-new.js');
importScripts('../fonts/helvetica.js');
importScripts('../fonts/ocr.js');
importScripts('../fonts/ocra.js');
importScripts('../fonts/zapfDingbats.js');
importScripts('../fonts/helvetica-bold.js');
addEventListener('message', ({ data }) => {

  let registeredFont = [];
  let fontData = {}
  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    let availableFonts = [];
    let self = this;
    options.fontCallback = (family, bold, italic, fontOptions) => {
      if (registeredFont.indexOf('default-font') == -1) {
        self.registerFont('default-font', new Buffer(fontData['default-font'], 'base64'));
        registeredFont.push('default-font');
        self.font('default-font');
      }
      if (availableFonts.indexOf(family) == -1 && fontData[family] != undefined) {

        if (registeredFont.indexOf(family) == -1) {
          self.registerFont(family, new Buffer(fontData[family], 'base64'));
          registeredFont.push(family);
        }
        self.font(family);

        return family;
      } else {
        if (family === 'COURIER') {
          return 'Courier'
        } else if (family === 'Courier-Bold') {
          return family;
        } else {
          return "default-font";
        }

      }
    };
    let prepatedSvg = SVGtoPDF(self, svg, x, y, options);
    return prepatedSvg;
  };
  let pdfConfiguration = { autoFirstPage: false, bufferPages: true };
  if (data.isPasswordProtectedPDF) {
    pdfConfiguration.userPassword = data.password;
  }
  const doc = new PDFDocument(pdfConfiguration);

  const createPdf = () => {
    const keys = Object.keys(data.workerSvgHandler);
    for (let index of keys) {
      if (data.workerSvgHandler[index]) {
        for (let svgData of data.workerSvgHandler[index]) {
          registeredFont = []
          fontData = svgData.fontsData ? svgData.fontsData : [];
          fontData['default-font'] = helvetica;
          fontData['COURIERNEW'] = courierNew;
          fontData['ARIAL'] = arial;
          fontData['CourierBold'] = courierBold;
          fontData['OCR'] = ocr;
          fontData['OCRA'] = ocra;
          fontData['ZapfDingbats'] = zapfDingbats
          fontData['helveticaBold'] = helveticaBold
          try {

            const svgwidth = svgData.width ? svgData.width : 918;
            const svgheight = svgData.height ? svgData.height : 1188;
            doc.addPage({ size: [svgwidth / 1.5, svgheight / 1.5], margin: [0, 0, 0, 0] });
            doc.addSVG(svgData.svg, 0, 0, { width: svgwidth, height: svgheight });
          } catch (e) {
            console.log(e);
          }

        }
      }
    }
    const stream = doc.pipe(blobStream());
    stream.on('finish', () => {
      const blob = stream.toBlob('application/pdf');
      postMessage({ blob: blob });
    });
    doc.end();
  };

  createPdf();


});
