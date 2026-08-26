# Wijnkelder

Een persoonlijke wijnvoorraad-app: bijhouden welke wijnen je hebt, waar ze liggen, wat je ervoor betaald hebt, wanneer je ze het beste kunt drinken en hoe je ze beoordeelt. Werkt op iPhone, iPad en desktop, met je eigen inlog en je data veilig in de cloud.

Gebouwd met React + Vite + Tailwind CSS, met Supabase als database/login, gehost op Netlify.

Deze handleiding is geschreven voor iemand die nog geen Supabase-, GitHub- of Netlify-account heeft. Volg de stappen op volgorde — dit duurt in totaal ongeveer 20-30 minuten.

---

## Stap 1 — Supabase account en project aanmaken

Supabase is de gratis database + login-dienst achter de app.

1. Ga naar [supabase.com](https://supabase.com) en klik op **Start your project**.
2. Maak een account (kan met GitHub of e-mail).
3. Klik op **New project**.
4. Kies een naam, bijvoorbeeld `wijnkelder`, en stel een database-wachtwoord in (bewaar dit ergens veilig, je hebt het zelden nodig).
5. Kies een regio dicht bij Nederland (bijvoorbeeld **West EU (Ireland)** of **Central EU (Frankfurt)** als die beschikbaar is).
6. Klik op **Create new project** en wacht 1-2 minuten tot het project klaar is.

## Stap 2 — De database instellen

1. Klik in het linkermenu van je Supabase-project op het **SQL Editor** icoon.
2. Klik op **New query**.
3. Open het bestand `supabase/schema.sql` uit dit project, kopieer de hele inhoud, en plak die in de SQL Editor.
4. Klik op **Run** (rechtsonder). Je zou "Success. No rows returned" moeten zien.

Dit maakt de tabel `wines` aan, beveiligt hem zodat iedereen alleen zijn eigen wijnen ziet, en maakt een opslagplek aan voor foto's van etiketten.

## Stap 3 — Je API-sleutels ophalen

1. Klik in het linkermenu op het tandwiel-icoon **Project Settings**.
2. Ga naar **API** (of **API Keys**).
3. Je hebt twee dingen nodig:
   - **Project URL** — ziet er ongeveer uit als `https://abcdefgh.supabase.co`
   - **anon public key** — een lange tekenreeks die begint met `eyJ...`
4. Bewaar deze twee waarden, je hebt ze zo nodig.

> Deze "anon public key" is bedoeld om openbaar in de app te staan — dat is veilig, omdat de database zelf (stap 2) alleen toegang geeft aan ingelogde gebruikers tot hún eigen wijnen.

## Stap 4 — Code naar GitHub zetten

GitHub is waar de broncode van de app komt te staan; Netlify bouwt en publiceert de app automatisch vanaf daar.

1. Ga naar [github.com](https://github.com) en maak een gratis account als je die nog niet hebt.
2. Klik rechtsboven op **+** en dan **New repository**.
3. Geef het een naam, bijvoorbeeld `wijnkelder`, laat "Public" of "Private" staan naar keuze, en klik **Create repository**.
4. Klik op de link **uploading an existing file** op de nieuwe (lege) repository-pagina.
5. Sleep alle bestanden en mappen van dit project (behalve `node_modules`, die bestaat nog niet) naar het uploadvak, of klik om ze te selecteren.
6. Klik onderaan op **Commit changes**.

## Stap 5 — Netlify account aanmaken en koppelen

1. Ga naar [netlify.com](https://netlify.com) en maak een gratis account aan — kies **Sign up with GitHub** zodat de koppeling meteen klaarstaat.
2. Klik op **Add new site** → **Import an existing project**.
3. Kies **Deploy with GitHub** en geef Netlify toestemming.
4. Selecteer je `wijnkelder` repository.
5. Netlify herkent automatisch dat het een Vite-project is (bouwcommando `npm run build`, publish-map `dist` — dit staat ook al vast in `netlify.toml`). Klik nog niet op deploy, eerst stap 6.

## Stap 6 — Omgevingsvariabelen instellen

Voordat je op deployen klikt, moet Netlify weten hoe hij met jouw Supabase-project moet praten.

1. Klik op **Add environment variables** (of ga later naar **Site configuration → Environment variables**).
2. Voeg twee variabelen toe:
   - `VITE_SUPABASE_URL` → je Project URL uit stap 3
   - `VITE_SUPABASE_ANON_KEY` → je anon public key uit stap 3
3. Klik op **Deploy wijnkelder** (of **Deploy site**).

Netlify bouwt nu de app — dit duurt ongeveer 1-2 minuten. Daarna krijg je een live link zoals `https://jouw-app-naam.netlify.app`.

## Stap 7 — Klaar!

Open de link, maak een account aan (e-mail + wachtwoord), en begin met het toevoegen van wijnen.

**Op je iPhone/iPad:** open de link in Safari, tik op het deel-icoon, en kies **Zet op beginscherm**. De app opent dan als een eigen app-icoon, zonder browserbalk.

Wil je later een eigen domeinnaam (bijvoorbeeld `wijnkelder.nl`)? Dat regel je in Netlify onder **Domain management**.

---

## Wat kan de app?

- Inloggen met je eigen account — jouw wijnen zijn alleen voor jou zichtbaar
- Wijnen toevoegen met naam, wijnmaker, jaargang, druif, regio, land, kleur, aantal flessen, locatie in de kelder
- Aankoopprijs, aankoopdatum, drinkvenster en een sterrenbeoordeling bijhouden
- Proefnotities en een foto van het etiket toevoegen
- Zoeken en filteren op kleur, sorteren op naam/jaargang/beoordeling
- Overzicht van totaal aantal flessen, aantal verschillende wijnen, regio's en geschatte totale waarde
- Werkt prettig op telefoon, tablet en desktop

## Zelf iets aanpassen (optioneel)

Wil je later zelf wijzigingen maken? Download de code van GitHub, en lokaal:

```bash
npm install
cp .env.example .env   # vul je Supabase-gegevens in
npm run dev
```

Elke wijziging die je naar GitHub pusht, wordt automatisch opnieuw gedeployed door Netlify.

## Problemen oplossen

- **"Nog niet gekoppeld" scherm bij het openen van de app** → De omgevingsvariabelen in Netlify staan niet goed. Controleer stap 6, en klik daarna in Netlify op **Deploys → Trigger deploy → Clear cache and deploy site**.
- **Ik kan niet inloggen na het aanmaken van een account** → Supabase kan e-mailbevestiging vereisen. Kijk in je inbox (en spam) naar een bevestigingsmail, of zet dit uit via Supabase: **Authentication → Providers → Email → Confirm email** uitschakelen (handig voor persoonlijk gebruik).
- **Foto uploaden lukt niet** → Controleer of stap 2 (het SQL-script) volledig zonder foutmelding is uitgevoerd — dat maakt ook de foto-opslag aan.
