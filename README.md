# Madhura Mavericks · KNPL-7 Auction War Room

Auction-day assistant for Madhura Mavericks at the KNPL-7 Mega Auction (12 Dec 2026).

**Open:** https://knplseason7.github.io/mmwr/

## What's in this repo
- `index.html` – the War Room (works offline after first load; data is kept only on your device).
- `apps-script/Code.gs` – a small read-only data service for the KNPL-7 registration Google Sheet, protected by your private access code.
- `logo.png`, `favicon.png` – Madhura Mavericks crest.

**No Skill Ratings, player stats or draft lists are stored in this repo.** They load at run time from the data service (after you enter the access code) or from files you upload on your own device.

## One-time setup
1. **Data service**: script.google.com → New project → paste `apps-script/Code.gs` →
   Project Settings → Script properties → `ACCESS_CODE` = your private code →
   Deploy → New deployment → Web app → *Execute as: Me*, *Who has access: Anyone* → copy the URL.
2. Open the War Room → **⚙️ Setup & Data** → paste the URL and code → **Connect & sync**.
3. Upload your probable draft list (.xlsx) in the same screen (kept on this device only).

## Auction day
Open **🏏 Auction Mode**: pick the player as the coaster is drawn, enter the bid with the quick buttons, follow the traffic-light advice and record every sale.
Tap **💬 Ask** for quick answers (what we still need, who can outbid us, best keepers/bowlers available…).
