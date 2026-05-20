# EMBO Static Fashion Platform

A static clothing site with catalog filters, cart, wishlist, and WhatsApp ordering. Built to host on GitHub Pages with no backend.

## What is included

- Advanced UI with bold editorial styling
- Catalog filters and product detail pages
- Cart and wishlist stored locally in the browser
- WhatsApp order links
- Admin editor for products with JSON export

## Important limitations

- This is a static site. It cannot truly secure admin access.
- Admin edits are exported as a JSON file that you upload to the site.

## Configure WhatsApp number

Edit `whatsappNumber` in [public/js/config.js](public/js/config.js). Use digits only (no +).

## Admin key

Change `adminKey` in [public/js/config.js](public/js/config.js).

## Update products

1. Open the Admin page and unlock with the admin key.
2. Add or edit products.
3. Click Export JSON to download a new products file.
4. Replace [public/data/products.json](public/data/products.json) with the new file and push to GitHub Pages.

## GitHub Pages launch (recommended)

This repo is prepared with a [docs](docs) folder for GitHub Pages.

1. Push this repo to GitHub.
2. In GitHub, go to Settings -> Pages.
3. Set Source to Deploy from a branch.
4. Select branch main and folder /docs.
5. Save. GitHub will provide your public URL.

## Deploy updates after edits

Whenever you edit files in [public](public), re-copy them into [docs](docs) before pushing:

```powershell
New-Item -ItemType Directory -Path .\docs -Force | Out-Null
Copy-Item -Path .\public\* -Destination .\docs -Recurse -Force
```
