// Minimal jsPDF-like library for basic PDF generation
// This is a simplified version that creates a downloadable document

class SimplePDF {
    constructor(options = {}) {
        this.pages = [];
        this.currentPage = {
            content: [],
            pageNumber: 1
        };
        this.options = options;
    }

    text(text, x, y, options = {}) {
        this.currentPage.content.push({
            type: 'text',
            text: text,
            x: x,
            y: y,
            options: options
        });
    }

    setFontSize(size) {
        this.fontSize = size;
    }

    setFont(font, style) {
        this.font = font;
        this.fontStyle = style;
    }

    setTextColor(r, g, b) {
        this.textColor = `rgb(${r}, ${g}, ${b})`;
    }

    setFillColor(r, g, b) {
        this.fillColor = `rgb(${r}, ${g}, ${b})`;
    }

    rect(x, y, w, h, style) {
        this.currentPage.content.push({
            type: 'rect',
            x: x,
            y: y,
            width: w,
            height: h,
            style: style
        });
    }

    addPage() {
        this.pages.push(this.currentPage);
        this.currentPage = {
            content: [],
            pageNumber: this.pages.length + 1
        };
    }

    splitTextToSize(text, maxWidth) {
        // Simple text splitting
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length * 2 > maxWidth) {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    internal = {
        pageSize: {
            getWidth: () => 210,
            getHeight: () => 297
        }
    };

    save(filename) {
        // Add current page
        this.pages.push(this.currentPage);

        // Generate HTML representation
        const htmlContent = this.generateHTML();
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace('.pdf', '.html');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateHTML() {
        let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Book</title>
    <style>
        @page { size: A4; margin: 0; }
        @media print {
            body { margin: 0; }
            .page { page-break-after: always; }
        }
        body {
            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
        }
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 20mm;
            font-size: 10pt;
            color: #666;
        }
        h1 { font-size: 24pt; color: #2563eb; margin: 20px 0; }
        h2 { font-size: 18pt; color: #2563eb; margin: 15px 0; }
        h3 { font-size: 14pt; color: #2563eb; margin: 10px 0; }
        p { font-size: 11pt; line-height: 1.6; margin: 10px 0; }
        .arabic { direction: rtl; text-align: right; font-size: 12pt; }
        .vocab-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .vocab-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        .cover { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-align: center; padding: 80px 40px; }
        .cover h1 { color: white; font-size: 32pt; }
        .section { margin: 20px 0; }
        .example { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 5px; }
        @media print {
            body { background: white; }
            .page { margin: 0; box-shadow: none; }
        }
    </style>
</head>
<body>
`;

        this.pages.forEach((page, index) => {
            html += `<div class="page">\n`;
            html += this.renderPageContent(page);
            html += `<div class="page-number">Seite ${index + 1}</div>\n`;
            html += `</div>\n`;
        });

        html += `
<script>
    // Auto-print functionality (optional)
    // window.onload = () => window.print();
</script>
</body>
</html>`;

        return html;
    }

    renderPageContent(page) {
        // This is a simplified renderer
        // In a real implementation, we'd need to properly position elements
        return page.content.map(item => {
            if (item.type === 'text') {
                return `<p>${this.escapeHtml(item.text)}</p>\n`;
            }
            return '';
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
window.SimplePDF = SimplePDF;
