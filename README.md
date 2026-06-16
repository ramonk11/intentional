# Intentie

Intentie is een mobile-first PWA die je kort laat kiezen wat je wilt doen, waarom je je apparaat pakt en hoe lang je ermee bezig wilt zijn. De app werkt zonder backend en bewaart alles lokaal in `localStorage`.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open daarna de lokale URL die Vite toont.

## Builden

```bash
npm run build
```

De productieversie komt in `dist/`.

## Deployen

### Netlify

1. Koppel deze repository aan Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

1. Importeer deze repository in Vercel.
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## Installeren op iPhone

1. Deploy de app en open de URL in Safari.
2. Tik op de deelknop.
3. Kies **Zet op beginscherm**.
4. Open Intentie daarna vanaf je beginscherm.

## Installeren op MacBook

1. Open de gedeployde app in Safari of Chrome.
2. Kies **Voeg toe aan Dock** of **Installeer Intentie**.
3. Open Intentie daarna als losse app.

## iOS Shortcuts automation instellen

1. Open **Opdrachten**.
2. Ga naar **Automatisering**.
3. Kies **App**.
4. Selecteer de afleidende apps.
5. Kies **Wordt geopend**.
6. Voeg actie **Open URL** toe.
7. Plak je Intentie app-url.
8. Zet vragen voor uitvoeren uit als iOS dat aanbiedt.

## Data

Sessies en instellingen blijven op het apparaat in `localStorage`. In de instellingen kun je data exporteren als JSON, importeren of resetten.

## PWA

De app bevat:

- `manifest.webmanifest`
- `display: standalone`
- iconen van 192x192 en 512x512
- Apple web app meta-tags
- service worker met offline-cache
- relatieve paden voor Netlify/Vercel-deploys
