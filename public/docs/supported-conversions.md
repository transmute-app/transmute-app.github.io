---
title: Supported Conversions
description: A complete reference of every file format Transmute can convert, organized by category.
order: 2
---

# Supported Conversions

Transmute handles a wide range of file formats across video, audio, images, documents, tabular data, PDFs, and diagrams. This page is the definitive reference for what you can convert — and in which direction.

## Quick Reference Table

| Category        | Input Formats                                                         | Output Formats                                                        | Notes                          |
|-----------------|-----------------------------------------------------------------------|-----------------------------------------------------------------------|--------------------------------|
| **Video**       | mp4, avi, mov, mkv, webm, flv, wmv, mpg, mpeg, m4v, gif             | mp4, avi, mov, mkv, webm, flv, wmv, mpg, mpeg, m4v, gif + audio     | video → audio, not audio → video |
| **Audio**       | mp3, wav, aac, flac, ogg, wma, m4a, opus                            | mp3, wav, aac, flac, ogg, wma, m4a, opus                            | All cross-conversions          |
| **Images**      | jpeg, png, gif, bmp, tiff, webp, ico, heif/heic, svg                | jpeg, png, gif, bmp, tiff, webp, ico, heif/heic                     | SVG is input only              |
| **Documents**   | md, html, txt, docx, rst, latex, epub, odt, rtf, org, asciidoc, ipynb | md, html, txt, docx, rst, latex, epub, odt, rtf, org, asciidoc, ipynb, pdf | PDF is output only (Pandoc)    |
| **Data**        | csv, xlsx, json, parquet, yaml                                       | csv, xlsx, json, parquet, yaml                                       | All cross-conversions          |
| **PDF Extract** | pdf                                                                   | txt, md, html                                                        | Via PyMuPDF                    |
| **Diagrams**    | drawio                                                                | png, pdf, svg, jpeg                                                  | Export only                    |

---

## Video

**Supported formats:** `mp4`, `avi`, `mov`, `mkv`, `webm`, `flv`, `wmv`, `mpg`, `mpeg`, `m4v`, `gif`

Any video format above can be converted to any other video format in the list. In addition, **video → audio** extraction is fully supported (e.g. `mp4 → mp3`, `mkv → wav`), allowing you to pull the audio track out of any video file.

> **Note:** Audio → video conversion is **not** supported. You cannot create a video file from an audio-only source.

### Cross-conversion matrix (simplified)

| From \ To | Video | Audio | Image |
|-----------|:-----:|:-----:|:-----:|
| **Video** | ✅    | ✅    | —     |
| **Audio** | ❌    | ✅    | —     |

---

## Audio

**Supported formats:** `mp3`, `wav`, `aac`, `flac`, `ogg`, `wma`, `m4a`, `opus`

All audio formats can be freely converted between each other. Transmute uses FFmpeg under the hood, so codec quality and metadata are preserved wherever the target format allows it.

### Example conversions

- `flac → mp3` — lossy compression for portable players
- `wav → ogg` — open-source alternative with good compression
- `m4a → opus` — modern, efficient codec for streaming
- `wma → aac` — cross-platform compatible output

---

## Images

**Supported formats:** `jpeg`, `png`, `gif`, `bmp`, `tiff`, `webp`, `ico`, `heif`/`heic`, `svg` *(input only)*

All image formats can be converted to any other image format, with one exception: **SVG is input-only**. You can convert an SVG to PNG, JPEG, WebP, etc., but you cannot convert a raster image back to SVG.

### Highlights

- **HEIF/HEIC → JPEG/PNG** — convert Apple device photos for universal compatibility
- **PNG → WebP** — reduce file size for web delivery
- **SVG → PNG** — rasterize vector graphics at any resolution
- **GIF → WebP** — modern animated image format with better compression

---

## Documents

**Supported formats:** `md`, `html`, `txt`, `docx`, `rst`, `latex`, `epub`, `odt`, `rtf`, `org`, `asciidoc`, `ipynb`, `pdf` *(output only)*

Transmute leverages Pandoc for document conversions, giving you access to a rich set of markup and document formats. All listed formats can serve as both input and output — **except PDF, which is output-only** via Pandoc.

### Example conversions

- `md → docx` — turn Markdown notes into Word documents
- `html → epub` — package web content as an e-book
- `latex → pdf` — render LaTeX to a finished PDF
- `docx → rst` — convert Word docs to reStructuredText for Sphinx documentation
- `ipynb → html` — export Jupyter notebooks as static HTML pages
- `org → md` — migrate Org-mode files to Markdown

---

## Data / Tabular

**Supported formats:** `csv`, `xlsx`, `json`, `parquet`, `yaml`

Tabular and structured data formats can be converted between each other. This is especially useful for data engineering pipelines and quick format shifts.

### Example conversions

- `csv → json` — turn spreadsheet data into a structured API-friendly format
- `xlsx → parquet` — convert Excel files to a columnar format for analytics
- `json → yaml` — make configuration files more human-readable
- `parquet → csv` — export columnar data for use in spreadsheets

---

## PDF Extraction

**Supported conversions:** `pdf → txt`, `pdf → md`, `pdf → html`

Transmute uses PyMuPDF to extract content from PDF files and convert them into editable text-based formats. This is a one-way extraction — you can pull content *out* of a PDF, but creating a PDF from these formats falls under the [Documents](#documents) section above (via Pandoc).

### When to use each output

| Output | Best for |
|--------|----------|
| `txt`  | Plain-text extraction, search indexing, or piping into other tools |
| `md`   | Preserving basic structure (headings, lists) in a lightweight format |
| `html` | Retaining richer formatting and layout for web publishing |

---

## Diagrams

**Supported conversions:** `drawio → png`, `drawio → pdf`, `drawio → svg`, `drawio → jpeg`

Transmute can export Draw.io (`.drawio`) diagram files to common image and document formats. This is useful for embedding diagrams in documentation, presentations, or print-ready materials.


