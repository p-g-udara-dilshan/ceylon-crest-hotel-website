# Ceylon Crest — Boutique Hotel Website

A responsive, editorial-style boutique hotel website concept created with **HTML5, CSS3, and vanilla JavaScript**. The experience combines a coastal visual identity, a dedicated rooms page, interactive galleries, a **client-side stay-enquiry planner**, and an **on-page, rule-based guest information assistant**.

> **Portfolio demonstration:** Ceylon Crest is a fictional hotel concept, not an operating property. Images and hotel details are illustrative. The site does **not** check live availability, process payments, send enquiries to a hotel, or confirm reservations.

## 🔗 Project links

- **Live website:** `ADD_YOUR_LIVE_WEBSITE_URL_HERE` — replace this after deployment.
- **GitHub repository:** https://github.com/p-g-udara-dilshan/ceylon-crest-hotel-website *(proposed repository URL; available after you create/publish it)*
- **Developer GitHub:** https://github.com/p-g-udara-dilshan

## 📸 Screenshots

### Homepage overview

![Ceylon Crest homepage, room cards, experiences and gallery](assets/screenshots/homepage-full.png)

### Guest information assistant

![Rule-based guest-information chat interface](assets/screenshots/guest-information-chat.png)

## ✨ Main features

- **Responsive coastal design:** editorial typography, tropical imagery, warm neutrals and deep-green accents.
- **Two-page website:** homepage (`index.html`) and detailed accommodation page (`rooms.html`).
- **Room catalogue:** Garden Room, Ocean Room and Family Suite, each with sample rates, guest capacities and details.
- **Room details dialogs:** open room descriptions and move into the enquiry planner.
- **Stay-enquiry planner:** choose check-in/check-out dates, guests and room type; validate dates and capacity; calculate an **illustrative** room subtotal by number of nights.
- **Copyable enquiry summary:** create text that a visitor may manually share with a hotel; **no message is automatically sent**.
- **Guest-information assistant:** keyword/rule-based local FAQ responses about rooms, booking enquiries, food, location and facilities, with quick-topic buttons; **not an AI chatbot or live support**.
- **Interactive gallery:** photos open in a lightbox.
- **Mobile navigation:** responsive menu and stay-enquiry call-to-action.
- **Accessibility-minded touches:** semantic sections, labelled controls, keyboard-operable dialogs and reduced-motion handling in supported browsers.

## 🧰 Tech stack

| Layer | Technologies |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3, custom responsive styles, CSS variables |
| Interaction | Vanilla JavaScript (DOM APIs, native `<dialog>`, browser Clipboard API) |
| Visual assets | Local WebP images, SVG favicon, Google Fonts |
| Hosting | Static site compatible with GitHub Pages and similar static hosts |

No React, Node.js build process, database or external booking API is needed to run this demo.

## 📁 Project structure

```text
ceylon-crest-hotel-website/
├── index.html
├── rooms.html
├── README.md
├── VERCEL-HOSTING.md
├── .gitignore
└── assets/
    ├── css/
    │   ├── style.css
    │   └── editorial.css
    ├── js/
    │   └── app.js
    ├── images/
    │   └── *.webp
    ├── screenshots/
    │   ├── homepage-full.png
    │   └── guest-information-chat.png
    └── favicon.svg
```

## 🚀 Run locally

1. Clone/download this repository.
2. Open the folder in **VS Code**.
3. Open `index.html` using **Live Server**, or open it directly in a modern browser.
4. Explore the homepage and `rooms.html`; try the room dialogs, gallery, FAQ assistant and booking-enquiry summary.

Optional local server (requires Python):

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## 🌐 Deploy with GitHub Pages

1. Push the website files to a public GitHub repository, keeping `index.html` at the repository root.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/ (root)**, then **Save**.
5. When GitHub provides your deployed URL, test both the homepage and `/rooms.html` and update the **Live website** field above.

If the repository is named `ceylon-crest-hotel-website` under `p-g-udara-dilshan`, its *expected* (not yet verified) GitHub Pages address is:

`https://p-g-udara-dilshan.github.io/ceylon-crest-hotel-website/`

You can also follow `VERCEL-HOSTING.md` for an alternative static-hosting workflow. Follow the hosting provider's applicable plan/usage terms.

## ⚙️ Customization

- Replace all fictional hotel information and illustrative photographs with approved property information and licensed assets.
- Update the room rates, guest capacities and descriptions in `assets/js/app.js` (`hotelRooms`), plus matching static text in the HTML.
- Update the visual palette and typography in `assets/css/editorial.css`.
- For actual reservations, integrate a secure booking service and availability system, verified contact details and appropriate privacy protections.

## ⚠️ Demo limitations

- **Not a real hotel or booking engine.** Rates and amenities are sample information only.
- **No live availability, confirmed reservations, payments, saved guest records or enquiry submission.** The planner prepares an indicative summary and supports copying it.
- **Not an AI-powered chatbot.** The assistant runs predefined keyword/rule-based responses within the browser; it does not reach hotel staff or an AI service.
- Room booking totals are estimates based on the sample per-night values defined in JavaScript.
- The images are illustrative/generated portfolio assets, not documentation of a real hotel.

## 👨‍💻 Project context

Frontend portfolio project — **Udara Dilshan**  
GitHub: https://github.com/p-g-udara-dilshan  
Portfolio: https://udara-dilshan-portfolio.pages.dev/
