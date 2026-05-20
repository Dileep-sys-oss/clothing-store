# EMBO Static Fashion Platform

A static clothing site with catalog filters, cart, wishlist, and WhatsApp ordering. Built to host on GitHub Pages with no backend.

## What is included

- Advanced UI with bold editorial styling
- Catalog filters and product detail pages
- Cart and wishlist stored locally in the browser
- WhatsApp order links
- Product catalog powered by JSON data

## Important limitations

- This is a static site. Product changes must be made by editing JSON files.

## Configure WhatsApp number

Edit `whatsappNumber` in [docs/js/config.js](docs/js/config.js). Use digits only (no +).

## Update products

1. Edit [docs/data/products.json](docs/data/products.json).
2. Save and push to GitHub Pages.

## GitHub Pages launch (recommended)

This repo uses [docs](docs) as the only source for GitHub Pages.

1. Push this repo to GitHub.
2. In GitHub, go to Settings -> Pages.
3. Set Source to Deploy from a branch.
4. Select branch main and folder /docs.
5. Save. GitHub will provide your public URL.

## Deploy updates after edits

Edit files directly inside [docs](docs) and then push your changes.
