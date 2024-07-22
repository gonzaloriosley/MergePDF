const { app } = require('@azure/functions');
const PDFLib = require('../../libraries/pdf-lib.min.js')

async function MergePDF(pdf) {
    const { PDFDocument } = PDFLib
    var pdfsToMerge = [];
  
    console.log(pdf);
  
    for (var j = 0; j < pdf.length; j++) {
  
      var pdf64 = pdf[j];
      var raw1 = atob(pdf64);
      var len1 = raw1.length;
      var pdfBuffer1 = new Uint8Array(new ArrayBuffer(len1));
      for (var i = 0; i < len1; i++) {
        pdfBuffer1[i] = raw1.charCodeAt(i);
      }
  
      pdfsToMerge[j] = pdfBuffer1;
    }
  
    const mergedPdf = await PDFDocument.create();
    for (const pdfBytes of pdfsToMerge) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
  
    const buf = await mergedPdf.saveAsBase64();
    return buf;
}

app.http('mergepdf', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
    
      const data = await request.json();
      
      let Finalpdf = await MergePDF(data)
      return {
        // status: 200, /* Defaults to 200 */
        jsonBody: Finalpdf
      };
    },
});