# Novem-ever Yours

A mobile-first anniversary microsite built with plain HTML, CSS, and native video controls. The repository is intentionally kept **Private**.

## Project status
- [x] Editorial anniversary page and responsive layout
- [x] 22-photo gallery references
- [x] 12 video-player references with poster images
- [x] Source-to-destination asset manifest
- [x] GitHub Actions media-path validation (no deployment)
- [ ] Upload the prepared media bundle into the repository
- [ ] Final visual QA on Android and desktop

## Media package
The uploaded `MyWinter2.zip` was inspected and organized into a ready-to-upload bundle. The bundle contains 22 unique WebP photos, 12 unique MP4 clips, and 12 generated WebP video posters. Two exact duplicate pairs were excluded. See `assets/manifest.json` for the source filename mapping.

**Important:** the binary media bundle is prepared separately and is not yet committed to this repository. Until its `assets/` folder is uploaded, media references in `index.html` will show as missing in the validator. Download and extract the prepared bundle into the repository root, preserving the `assets/` directory structure.

## Local preview
Open `index.html` in a browser after extracting the media bundle into the project root. No framework, package installation, or build command is required.

## Quality checks
GitHub Actions parses the HTML, checks duplicate IDs, image alt text, and all local image/video/poster paths. Missing media is reported as a warning while the bundle is not yet uploaded. The workflow only validates and does not deploy or publish.

## Privacy and publication
This repository must remain **Private**. Do not change its visibility or enable public publication without explicit approval. GitHub Free does not provide public GitHub Pages hosting from a private repository. Do not place sensitive material in a public website: anyone with its URL may access and reshare it.

## Design direction
Editorial winter romance: warm ivory, winter blue, deep burgundy, serif-led typography, generous whitespace, photo-led composition, and restrained motion.
