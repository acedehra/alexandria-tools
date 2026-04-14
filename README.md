# Alexandria Tools

Website: [www.alexandriatools.com](https://www.alexandriatools.com)

A modern collection of developer and utility tools that runs entirely in your browser. No backend. No database. Just fast, lightweight tools.

![Docker Image Size](https://img.shields.io/badge/docker%20image-25%20MB-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Framework](https://img.shields.io/badge/SvelteKit-orange)

## Features

Alexandria Tools provides a comprehensive suite of utilities across multiple categories:

### String Tools

- **Text Case Converter** - Convert between uppercase, lowercase, title case, sentence case, and more
- **Text Counter** - Count characters, words, lines, and paragraphs instantly
- **URL Encoder/Decoder** - Encode and decode URLs safely for web applications
- **Base64 Encoder/Decoder** - Encode and decode text to/from Base64 format
- **Text Diff Checker** - Compare two texts and highlight differences
- **Lorem Ipsum Generator** - Generate placeholder text for designs and mockups
- **Find and Replace** - Find and replace text patterns with regex support
- **Text Sorter** - Sort text lines alphabetically, numerically, or by length

### Developer Tools

- **JSON Formatter** - Validate, prettify, or minify JSON with clear error messages
- **JWT Decoder** - Decode JWT header and payload to JSON (signature not verified)
- **UUID Generator** - Generate random UUID v4 identifiers

### Date & Time

- **Unix Timestamp Converter** - Convert epoch seconds/milliseconds to dates and back

### Encoding & Data

- **HTML Entity Encoder/Decoder** - Escape or unescape HTML entities for safe markup

### Colors & Accessibility

- **Color Contrast Checker** - Compute WCAG contrast ratio between two colors

### QR & Barcodes

- **QR Code Generator** - Turn any text or link into a QR code image

### Calculators & Converters

- **Unit Converter** - Convert temperature, length, and mass with common units

### Writing & SEO

- **Slug Generator** - Turn headings or phrases into URL-safe slugs

### Security & Privacy

- **Password Generator** - Create strong random passwords with customizable options

## Docker Deployment

Alexandria Tools is optimized for Docker with an incredibly small **25 MB** image size.

### Using Docker

Pull and run with a single command:

```bash
docker run -d -p 8080:80 acedehra/alexandria-tools:latest
```

Then visit `http://localhost:8080` in your browser.

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  alexandria-tools:
    image: acedehra/alexandria-tools:latest
    container_name: alexandria-tools
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Why Alexandria Tools?

- **Privacy-First**: All processing happens in your browser. No data is sent to any server.
- **Lightweight**: Only 25 MB Docker image. Minimal footprint.
- **Fast**: No backend or database means instant responses.
- **Modern**: Built with SvelteKit and Tailwind CSS for a responsive, accessible UI.
- **Open Source**: Free to use, modify, and distribute.

## Development

### Prerequisites

- Node.js (v18 or higher) or Bun
- npm, yarn, or bun

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:5173` for the development server.

### Build

```bash
bun run build
```

The optimized static files will be in the `build/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with:

- [SvelteKit](https://kit.svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [QRCode](https://www.npmjs.com/package/qrcode)
