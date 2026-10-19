# A-hitec consolidated website

Seven connected static pages prepared for https://a-hitec.co.uk using the supplied standalone HTML files. No build or package installation is required.

| Page | Source |
| --- | --- |
| index.html | Current repository homepage |
| agency.html | 01_ahitec_agency.html |
| ai-implementation.html | 02_ai_implementation_landing.html |
| adeniran-ilesanmi.html | 03_adeniran_portfolio.html |
| ri-kitchen-cafe.html | 04_ri_kitchen_cafe.html; labelled portfolio demo, noindex |
| ai-products.html | 05_ai_product_page.html |
| clearflow-ai.html | clearflow_ai_sales_website.html; labelled service concept |

Shared navigation and enquiry behaviour live in assets/site.css and assets/site.js. Original page content and styling are retained where practical. Original filenames and earlier homepage revision URLs redirect to the corresponding pages. Enquiry forms open a draft addressed to adeniran.ilesanmi@hitec.co.uk, matching the current homepage. The visitor must send it from their mail app. No backend delivery, payment checkout, food ordering or catering booking is implemented.

## Hosting

For an existing host, deploy the root HTML files, assets directory, og-image.png, robots.txt and sitemap.xml to the document root for a-hitec.co.uk.

For GitHub Pages, use repository Settings → Pages → Deploy from a branch → main → / (root), then set the custom domain to a-hitec.co.uk. CNAME declares the hostname but does not enable Pages or change registrar DNS. Follow the host's DNS instructions and enable HTTPS once domain verification and certificate issuance complete. Keep an existing hosting setup if it already deploys this repository.

## Verification

Structural checks cover local links and fragments, unique IDs, one H1 per content page, page-specific titles, descriptions, canonicals and shared assets. JavaScript syntax is checked separately. Live-domain availability and hosting/DNS settings must be verified independently.
