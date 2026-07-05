# Intentie

Intentie is een mobile-first PWA die je kort laat kiezen wat je wilt doen en hoe lang je ermee bezig wilt zijn. De app werkt zonder backend en bewaart alles lokaal in `localStorage`.

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

### Intentie automatisch terug openen na vaste tijd

Een PWA kan zichzelf niet automatisch openen. iOS Shortcuts kan dat wel doen met een vaste wachttijd:

1. Voeg actie **Open URL** toe met je app-url plus `?autostart=1&seconds=20`.
2. Voeg actie **Wacht** toe, bijvoorbeeld 20 seconden of 600 seconden.
3. Voeg actie **Open URL** toe met je gewone app-url.

Voor 10 minuten kun je ook `?autostart=1&minutes=10` gebruiken. De wachttijd in Shortcuts moet dan ook 10 minuten zijn.

Voorbeeld:

```text
https://jouw-app-url.nl/?autostart=1&seconds=20
```

## Data

Sessies en instellingen blijven op het apparaat in `localStorage`. In de instellingen kun je data exporteren als JSON, importeren of resetten.

## Timer en notificaties

Je kunt in de instellingen notificaties aanzetten. Wanneer de timer afloopt, probeert de app een melding te sturen. Tik op de melding om Intentie weer te openen.

Een PWA kan zichzelf niet automatisch naar voren halen na 10 minuten. iOS bepaalt ook wanneer webapps op de achtergrond gepauzeerd worden. Daarom bewaart Intentie de lopende sessie lokaal en rekent de timer met `Date.now()`: als de app opnieuw geopend wordt, staat de juiste resterende of verlopen tijd klaar.

Als je iOS Shortcuts gebruikt voor meerdere afleidende apps, blijft iOS die automation starten wanneer je zo'n app opent. Intentie kan dat niet blokkeren voordat iOS de PWA opent. Wel onthoudt de app de actieve sessie, zodat je niet opnieuw door de intentieflow hoeft.

## PWA

De app bevat:

- `manifest.webmanifest`
- `display: standalone`
- iconen van 192x192 en 512x512
- Apple web app meta-tags
- service worker met offline-cache
- relatieve paden voor Netlify/Vercel-deploys
