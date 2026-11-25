# Novem-ever Yours

A mobile-first anniversary microsite built with plain HTML and CSS. The repository is intentionally kept **Private**.

## Project status
- [x] Static page foundation (index.html)
- [x] Responsive editorial layout and photo placeholders
- [x] Asset folders and usage guide
- [x] GitHub Actions quality check (does not publish the site)
- [ ] Add the couple's approved photographs
- [ ] Add optional anniversary video/audio, if wanted
- [ ] Final visual QA on real Android and desktop browsers
- [ ] Choose a GitHub-supported publication path when eligible

## Preview locally
Download or clone the repository and open index.html in a browser. No framework, package installation, or build command is required.

## Assets
See assets/photos/README.md for the exact image slots and recommendations.

Current image paths expected by index.html:
- assets/photos/cover.jpg
- assets/photos/memory-01.jpg
- assets/photos/memory-02.jpg
- assets/photos/memory-03.jpg

The page shows a placeholder when an image is not present. The quality-check workflow reports missing photos as warnings; it does not fail the code checks because the personal photos have not been supplied yet.

Optional video guidance is in assets/videos/README.md. No video or audio player is included yet.

## Quality checks
Every push and pull request runs a lightweight Python standard-library check through GitHub Actions. It checks HTML structure basics, duplicate IDs, image alt text, and local file references. This workflow only validates; it does not deploy or publish the website.

## Privacy and publishing
This repository must remain **Private**. Do not change its visibility or enable a publication workflow without explicit approval.

Important: GitHub Pages on GitHub Free does not provide public Pages hosting from a private repository. A private repository does not make a published website private, and a public website URL can be opened and reshared by anyone who has it. Do not commit intimate or sensitive media unless you accept that publication exposure.

For now, develop and preview locally. Do not configure a public deployment from this repository under the current GitHub Free/private-repository constraint.

## Design direction
Editorial winter romance: warm ivory, muted winter blue, deep burgundy, serif-led typography, generous whitespace, restrained motion, and photography-first layouts.
