const pdfModule = require("pdf-parse");

/**
 * Robust text extractor for PDF buffers, compatible with all pdf-parse module variations.
 */
async function extractTextFromPDF(buffer) {
  // 1. pdf-parse v2 class export
  if (pdfModule && pdfModule.PDFParse) {
    try {
      const parser = new pdfModule.PDFParse({ data: buffer });
      const result = await parser.getText();
      if (typeof parser.destroy === "function") {
        await parser.destroy();
      }
      if (result && typeof result.text === "string" && result.text.trim()) {
        return result.text;
      }
    } catch (err) {
      console.warn("pdf-parse v2 method failed, trying alternative:", err.message);
    }
  }

  // 2. pdf-parse v1 function export
  if (typeof pdfModule === "function") {
    try {
      const result = await pdfModule(buffer);
      if (result && typeof result.text === "string" && result.text.trim()) {
        return result.text;
      }
    } catch (err) {
      console.warn("pdf-parse v1 method failed:", err.message);
    }
  }

  // 3. Default export if bundled
  if (pdfModule && typeof pdfModule.default === "function") {
    try {
      const result = await pdfModule.default(buffer);
      if (result && typeof result.text === "string" && result.text.trim()) {
        return result.text;
      }
    } catch (err) {
      console.warn("pdf-parse default export failed:", err.message);
    }
  }

  // 4. Raw text stream fallback for readable text inside simple PDFs
  try {
    const raw = buffer.toString("latin1");
    const matches = [];
    const regex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      matches.push(match[1]);
    }
    if (matches.length > 0) {
      return matches.join(" ");
    }
  } catch (err) {
    // ignore
  }

  throw new Error("Could not extract readable text from the uploaded PDF.");
}

module.exports = { extractTextFromPDF };
