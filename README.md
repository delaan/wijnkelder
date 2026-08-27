# Wijnkast

Een persoonlijke wijnkelder-app: bijhouden welke wijnen je hebt, waar ze liggen, wat je ervoor betaald hebt, wanneer je ze het beste kunt drinken en hoe je ze beoordeelt. Werkt op iPhone, iPad en desktop, met je eigen inlog en je data veilig in de cloud, en is te installeren als app (PWA) op je beginscherm.

> De app heette eerder "Wijnkelder" — de code, database en instructies hieronder zijn dezelfde, alleen de naam en het uiterlijk zijn vernieuwd naar **Wijnkast**.

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

1. Klik bovenaan je projectpagina op de knop **Connect**.
2. Kies bovenaan het tabblad **Framework**, en selecteer **Vite** in de lijst (niet Next.js of een ander framework — de variabelenamen die je dan te zien krijgt, `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`, zijn precies wat deze app nodig heeft).
3. Kopieer de twee waarden die daar staan:
   - **Project URL** — ziet er ongeveer uit als `https://abcdefgh.supabase.co`
   - **anon / publishable key** — een lange tekenreeks (begint met `sb_publ...` of `eyJ...`, beide werken)
4. Bewaar deze twee waarden, je hebt ze zo nodig.

> Deze sleutel is bedoeld om openbaar in de app te staan — dat is veilig, omdat de database zelf (stap 2) alleen toegang geeft aan ingelogde gebruikers tot hún eigen wijnen.

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
2. Voeg twee variabelen toe. Let op: het **Key**-veld bevat alleen de naam, de waarde zelf hoort in het aparte **Value**-veld eronder:
   - Key `VITE_SUPABASE_URL` → Value: je Project URL uit stap 3
   - Key `VITE_SUPABASE_ANON_KEY` → Value: je anon/publishable key uit stap 3
3. Klik op **Deploy wijnkelder** (of **Deploy site**).

Netlify bouwt nu de app — dit duurt ongeveer 1-2 minuten. Daarna krijg je een live link zoals `https://jouw-app-naam.netlify.app`.

Staat je site na het deployen op **"Private"**? Klik dan op **Make public**, anders is de link niet bereikbaar buiten je eigen Netlify-account (bijvoorbeeld niet op je iPhone).

## Stap 7 — Klaar!

Open de link, maak een account aan (e-mail + wachtwoord), en begin met het toevoegen van wijnen.

**Op je iPhone/iPad:** open de link in Safari, tik op het deel-icoon, en kies **Zet op beginscherm**. De app opent dan als een eigen app-icoon, zonder browserbalk.

Wil je later een eigen domeinnaam (bijvoorbeeld `wijnkelder.nl`)? Dat regel je in Netlify onder **Domain management**.

## Stap 8 — Jezelf hoofdbeheerder maken en anderen uitnodigen

Deze app ondersteunt meerdere gebruikers, elk met hun eigen, persoonlijke wijnkast. Als hoofdbeheerder kun je zien wie een wijnkast heeft (met aantal wijnen/flessen, niet de inhoud zelf — dat blijft privé), nieuwe mensen uitnodigen, rollen aanpassen en toegang intrekken of herstellen.

**8a. Extra database-onderdelen toevoegen**

1. Ga in Supabase naar **SQL Editor → New query**.
2. Open `supabase/migration_admin.sql` uit dit project. Vervang op de laatste regel het e-mailadres door het adres waarmee jij bent ingelogd in de app.
3. Plak het hele bestand in de SQL Editor en klik op **Run**.

Dit maakt jouw account hoofdbeheerder. Iedereen die zich later aanmeldt of wordt uitgenodigd, krijgt automatisch de rol "gebruiker" met een eigen wijnkast.

**8b. Een geheime sleutel toevoegen (alleen voor de server, nooit voor de browser)**

Het beheerpaneel (gebruikers uitnodigen, rollen wijzigen, toegang intrekken) draait via kleine serverfuncties op Netlify, die daarvoor een speciale, geheime sleutel nodig hebben — niet dezelfde als in stap 3.

1. Ga in Supabase naar **Project Settings → API Keys**.
2. Zoek de **service_role secret** (of `sb_secret_...`) sleutel. **Deel deze sleutel met niemand** — hij geeft volledige toegang tot je hele database, zonder enige beveiliging.
3. Ga in Netlify naar **Site configuration → Environment variables** en voeg twee nieuwe variabelen toe (zonder `VITE_` ervoor — dat is expres, zo komt de waarde nooit in de browser terecht):
   - Key `SUPABASE_URL` → Value: dezelfde Project URL als in stap 3
   - Key `SUPABASE_SERVICE_ROLE_KEY` → Value: de zojuist gekopieerde service_role/secret sleutel
4. Ga naar **Deploys → Trigger deploy → Clear cache and deploy site**.

**8c. Het juiste adres instellen voor uitnodigingsmails**

1. Ga in Supabase naar **Authentication → URL Configuration**.
2. Zet **Site URL** op je live Netlify-adres, bijvoorbeeld `https://wijnkast.netlify.app`.

Zonder deze stap kan de link in uitnodigingsmails naar het verkeerde adres wijzen.

**8d. Gebruikers beheren**

Log in als hoofdbeheerder en klik rechtsboven op **Beheer**. Daar kun je:

- Een nieuwe gebruiker uitnodigen per e-mail — die persoon krijgt een mail van Supabase om zelf een wachtwoord in te stellen, en krijgt automatisch zijn eigen wijnkast.
- De rol van iemand wijzigen tussen "Gebruiker" en "Beheerder".
- Iemands toegang intrekken (ze kunnen dan niet meer inloggen, maar hun wijnen blijven bewaard) of weer herstellen.

## Stap 9 — Bijwerken naar de nieuwe versie (Wijnkast v2)

Deze versie is een complete vernieuwing van het uiterlijk en veel nieuwe functies (zie "Wat is er nieuw" hieronder). Je bestaande account, wijnen en gebruikers blijven gewoon behouden — je hoeft niets opnieuw te doen wat je al had ingesteld. Volg wel onderstaande stappen, in deze volgorde.

**9a. Code opnieuw naar GitHub uploaden — dit is de belangrijkste stap**

⚠️ Dit is precies de stap die de vorige keer per ongeluk oversloeg, waardoor de nieuwe functies niet verschenen. Sla hem niet over.

1. Ga naar je repository op [github.com](https://github.com).
2. Pak het nieuwe zip-bestand uit dat je van mij hebt gekregen.
3. Sleep **alle** bestanden en mappen uit de uitgepakte map (dus ook de mappen `src`, `public`, `supabase` en `netlify` in hun geheel) naar de bestandenlijst van je repository op GitHub — je kunt gewoon los boven op de bestaande bestanden slepen, GitHub vraagt of je ze wilt vervangen.
4. Klik onderaan op **Commit changes**.
5. Netlify start automatisch een nieuwe deploy zodra GitHub de wijziging ziet (dit duurt 1-2 minuten). Je kunt de voortgang volgen op je Netlify-dashboard onder **Deploys**.

**9b. De database bijwerken**

1. Ga in Supabase naar **SQL Editor → New query**.
2. Open `supabase/migration_v2.sql` uit het nieuwe project, kopieer de hele inhoud, en plak die in de SQL Editor.
3. Klik op **Run**. Je zou "Success. No rows returned" moeten zien.

Dit voegt de nieuwe velden toe aan je wijnen (appellatie, classificatie, smaakprofiel, food pairing, serveertemperatuur, karaffeertijd, aankooplocatie, geschatte waarde, favoriet), maakt de tabellen voor de ontkurk-/ongedaan-maken-geschiedenis en je wijnkast-instellingen (naam, logo, kleur, thema) aan, en maakt een opslagplek voor een eigen logo. Niets van je bestaande wijnen gaat verloren — de nieuwe velden zijn gewoon leeg totdat je ze invult.

**9c. Omgevingsvariabelen**

Geen actie nodig — deze versie gebruikt dezelfde vier variabelen die al in Netlify staan (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Er hoeft niets bijgevoegd of gewijzigd te worden.

**9d. Controleren**

Open je app-link. Log in en je zou het nieuwe ontwerp moeten zien: een zijbalk (op iPad/desktop) of onderbalk (op telefoon) met "Mijn kelder", "Collectie", "Favorieten", "Gastmodus" en "Instellingen". Zie je het oude ontwerp nog? Doe dan in Netlify **Deploys → Trigger deploy → Clear cache and deploy site**, en ververs de pagina met een harde refresh (op iPhone/iPad: sluit het tabblad helemaal en open de link opnieuw).

### Wat is er nieuw in deze versie

- Volledig vernieuwd, rustig en overzichtelijk ontwerp met een eigen accentkleur naar keuze, en automatisch licht/donker thema (of zelf instellen) dat meegaat op al je apparaten
- "Mijn kelder"-dashboard met een overzicht van je voorraad, wat er bijna op is, en een interactieve balk die laat zien hoe je collectie is verdeeld over kleuren
- Collectie-scherm met raster- en lijstweergave, sorteren en groeperen — je voorkeur wordt onthouden
- Uitgebreider invulformulier: appellatie, classificatie, smaakprofiel, food pairing, serveertemperatuur, karaffeertijd, aankooplocatie en geschatte waarde, naast de bestaande velden
- Favorieten: markeer je favoriete wijnen met een hartje en vind ze snel terug
- "Ontkurken"-knop op elke wijn die de voorraad netjes afboekt, met een "ongedaan maken"-melding als je je vergist
- Gastmodus: een schermvullende, vereenvoudigde weergave zonder privégegevens (prijzen, aantallen, notities) om aan gasten te laten zien — bijvoorbeeld op een tablet aan tafel
- Instellingen-pagina: naam en logo van je wijnkast aanpassen, accentkleur en thema kiezen, en je hele wijnkast resetten met een zelf ingestelde beveiligingscode (deze code wordt nooit leesbaar opgeslagen, alleen versleuteld)
- Te installeren als app op je beginscherm (iPhone/iPad/desktop), met eigen icoon, en werkt na de eerste keer laden ook nog kort door zonder internet

**Bewust nog niet gebouwd (komt later):**

- **AI-herkenning van etiketten** — in het "Wijn toevoegen"-scherm staat deze optie al, maar toont voorlopig "komt binnenkort" en verwijst naar handmatig invoeren. Dit vraagt een eigen (betaalde) AI-sleutel die je nog niet had ingesteld; kunnen we later alsnog toevoegen.
- **Native deelvenster en opstartschermen (splash screens)** — de app is al installeerbaar met eigen icoon, maar het gebruiken van het systeemeigen deelvenster van je telefoon en aangepaste opstartafbeeldingen zijn bewust overgeslagen om de kern van de vernieuwing eerst goed af te maken.

## Stap 10 — Bijwerken naar de nieuwste versie (welkomstscherm, onboarding, zwevende zoekbalk, Font Awesome-iconen)

Je bestaande account, wijnen, gebruikers en instellingen blijven gewoon behouden. Volg deze stappen in deze volgorde.

**10a. Code bijwerken via GitHub Desktop**

Vanaf nu leveren we updates via GitHub Desktop in plaats van bestanden slepen op de GitHub-website — dat is betrouwbaarder, omdat verwijderde/hernoemde bestanden dan automatisch goed meegenomen worden.

1. De nieuwe bestanden staan al klaargezet in je lokale map `wijnkelder` (via `~/Documents/GitHub/wijnkelder`).
2. Open **GitHub Desktop**. Je ziet links een lijst met gewijzigde bestanden.
3. Vul linksonder een korte omschrijving in, bijvoorbeeld "Welkomstscherm, onboarding, zoekbalk en nieuwe iconen".
4. Klik op **Commit to main**.
5. Klik daarna op **Push origin** (rechtsboven).

Netlify start automatisch een nieuwe deploy zodra de wijziging op GitHub staat (1-2 minuten). Voortgang volgen kan op je Netlify-dashboard onder **Deploys**.

**10b. De database bijwerken**

1. Ga in Supabase naar **SQL Editor → New query**.
2. Open `supabase/migration_v3.sql` uit het nieuwe project, kopieer de hele inhoud, en plak die in de SQL Editor.
3. Klik op **Run**. Je zou "Success. No rows returned" moeten zien.

Dit voegt een naamveld en een vinkje "onboarding voltooid" toe aan je wijnkast-instellingen. Bestaande wijnkasten worden automatisch gemarkeerd als "al voltooid", zodat jij en eventuele andere gebruikers niet alsnog door de onboarding hoeven.

**10c. Omgevingsvariabelen**

Geen actie nodig — er zijn geen nieuwe variabelen bijgekomen.

**10d. Controleren**

Open je app-link met een harde refresh (sluit het tabblad/de app helemaal en open opnieuw). Bestaande gebruikers zien direct een kort welkomstscherm met hun naam; nieuwe gebruikers doorlopen eerst een korte onboarding (naam, naam van de wijnkast, eventueel een kleur). Onderin het scherm staat nu een vaste zoekbalk, en de iconen in de hele app zien er verfijnder uit (Font Awesome).

### Wat is er nieuw in deze versie

- **Welkomstscherm** bij het openen van de app: "Welkom, [je naam]" met de naam van je wijnkast, verdwijnt vanzelf of met een tikje
- **Onboarding voor nieuwe gebruikers**: bij de allereerste keer openen wordt eerst gevraagd naar je naam, de naam van je wijnkast en (optioneel) een accentkleur, voordat je de app zelf ziet
- **Vaste, zwevende zoekbalk** onderin het scherm, altijd op dezelfde plek, met een subtiele schaduw — en blijft ook goed zichtbaar wanneer het toetsenbord op je telefoon/tablet omhoogkomt
- **Alle iconen vervangen** door een consistente, professionele iconenset (Font Awesome), inclusief nieuwe wijn-/glazenpassende logo-opties (fles, glas, proostende glazen, hartje)
- **Beter leesbare tekst in donkere modus** (hoger contrast voor secundaire en subtiele tekst)
- **Filters in Collectie direct aantikbaar en live zichtbaar**: sorteren, groeperen en kleurfilter passen meteen toe, zonder aparte "toepassen"-knop
- **Instellingen-pagina paginabreed**, overzichtelijker in twee kolommen op grotere schermen; de "dinerweergave"-knop is verwijderd
- **Mooiere kleurenkiezer** voor je eigen accentkleur (regenboog-bolletjes-icoon) bij zowel onboarding als instellingen
- **Consistente knoppen rechtsboven** op elk scherm (toevoegen, uitloggen e.d. staan overal op dezelfde plek)

**Bewust nog niet gebouwd (komt later):**

- **AI-herkenning van etiketten** — staat al als optie in "Wijn toevoegen", toont voorlopig "komt binnenkort".

## Stap 11 — Bijwerken: uitgebreider dashboard, zoekbalk, navigatie en gastmodus

Je bestaande account, wijnen, gebruikers en instellingen blijven gewoon behouden. Er zijn deze keer geen database-wijzigingen.

**11a. Code bijwerken via GitHub Desktop**

1. De nieuwe bestanden staan al klaargezet in je lokale map `wijnkelder`.
2. Open **GitHub Desktop**, vul linksonder een korte omschrijving in (bijv. "Dashboard, navigatie en gastmodus vernieuwd").
3. Klik op **Commit to main**, en daarna op **Push origin**.

Netlify start automatisch een nieuwe deploy (1-2 minuten) — voortgang volgen kan op je Netlify-dashboard onder **Deploys**.

**11b. Database**

Geen actie nodig — deze update wijzigt alleen het uiterlijk.

**11c. Controleren**

Open je app-link met een harde refresh. Op "Mijn kelder" zie je nu "Welkom, [je naam]" met daarnaast een weerkaartje — je browser vraagt eenmalig om locatietoegang; sta dit toe om het lokale weer te zien (weiger je dit, dan blijft de rest van de app gewoon werken, alleen zonder weer). De zoekbalk staat nu wat hoger, groter, en op desktop precies in het midden tussen de zijbalk en de rechterrand. In de zijbalk staan Gastmodus en Instellingen nu onderaan, met een streepje erboven. Bovenin loopt de balk met je wijnkast-naam nu door in één geheel met de balk met de knoppen. Op je telefoon zweeft de navigatiebalk onderin nu los van de rand, met afgeronde hoeken. In donkere modus zijn geselecteerde items nu overal goed leesbaar. En de Gastmodus opent nu met een welkomsttekst en drie duidelijke, beeldende categorieën.

### Wat is er nieuw in deze versie

- **Uitgebreider "Mijn kelder"-dashboard**: een persoonlijke "Welkom, [naam]"-begroeting en een weerkaartje met de actuele temperatuur en dagverwachting op basis van je locatie
- **Zoekbalk hoger, groter en beter gecentreerd**: op desktop staat hij nu precies in het midden tussen de zijbalk en de rechterkant van het scherm
- **Gastmodus en Instellingen onderaan de zijbalk**, met een streepje erboven, gescheiden van de hoofdnavigatie
- **Eén doorlopende balk bovenin**: de naam van je wijnkast en de knoppen (thema, wijn toevoegen, account) staan nu in dezelfde balk in plaats van twee losse blokken
- **Losse, zwevende navigatiebalk op je telefoon**: afgeronde hoeken en een glazig, doorschijnend effect, in plaats van een balk die plat tegen de onderrand zit
- **Donkere modus: geselecteerde/actieve elementen nu overal goed leesbaar** (navigatie, filters, instellingen) — de accentkleur wordt in donkere modus automatisch lichter gemaakt waar hij als tekst dient, ook bij een zelfgekozen accentkleur
- **Gastmodus vernieuwd**: opent met "Welkom bij [naam wijnkast]" en een korte uitleg, en toont de keuzes overzichtelijk verdeeld in drie secties — soorten wijn, smaakprofielen en etenswaren — elk met een passend icoon in een eigen kleur

---

## Wat kan de app?

- Inloggen met je eigen account — jouw wijnen zijn alleen voor jou zichtbaar
- Wijnen toevoegen met naam, wijnmaker, jaargang, druif, regio, land, appellatie, classificatie, kleur, smaakprofiel, food pairing, aantal flessen en locatie in de kelder
- Aankoopprijs, aankoopdatum, aankooplocatie, geschatte waarde, drinkvenster, serveertemperatuur, karaffeertijd en proefnotities bijhouden, plus een foto van het etiket
- "Mijn kelder"-dashboard met voorraadoverzicht, bijna-op-lijst en een interactieve verdelingsbalk per wijnkleur
- Collectie doorzoeken en filteren, met raster- of lijstweergave en sorteren/groeperen naar keuze
- Favorieten markeren, en wijnen ontkurken met automatische voorraadafboeking (met ongedaan-maken)
- Gastmodus: een vereenvoudigde weergave zonder privégegevens, handig om aan anderen te laten zien
- Eigen wijnkast-naam, logo, accentkleur en licht/donker-thema, gesynchroniseerd op al je apparaten
- Wijnkast volledig resetten met een zelf ingestelde, veilig versleutelde beveiligingscode
- Werkt prettig op telefoon, tablet en desktop, en is te installeren als app op je beginscherm
- Meerdere gebruikers, elk met een eigen privé wijnkast; een hoofdbeheerder kan gebruikers uitnodigen, rollen aanpassen en toegang intrekken/herstellen
- Persoonlijk welkomstscherm bij het openen, en een korte onboarding bij het allereerste gebruik
- Vaste, zwevende zoekbalk onderin het scherm, ook prettig bruikbaar met het toetsenbord open

## Zelf iets aanpassen (optioneel)

Wil je later zelf wijzigingen maken? Download de code van GitHub, en lokaal:

```bash
npm install
cp .env.example .env   # vul je Supabase-gegevens in
npm run dev
```

Elke wijziging die je naar GitHub pusht (bijvoorbeeld via **GitHub Desktop**: wijzigingen bekijken → commit-bericht schrijven → **Commit to main** → **Push origin**), wordt automatisch opnieuw gedeployed door Netlify.

## Problemen oplossen

- **"Nog niet gekoppeld" scherm bij het openen van de app** → De omgevingsvariabelen in Netlify staan niet goed. Controleer stap 6, en klik daarna in Netlify op **Deploys → Trigger deploy → Clear cache and deploy site**.
- **Ik kan niet inloggen na het aanmaken van een account** → Supabase kan e-mailbevestiging vereisen. Kijk in je inbox (en spam) naar een bevestigingsmail, of zet dit uit via Supabase: **Authentication → Providers → Email → Confirm email** uitschakelen (handig voor persoonlijk gebruik).
- **Foto uploaden lukt niet** → Controleer of stap 2 (het SQL-script) volledig zonder foutmelding is uitgevoerd — dat maakt ook de foto-opslag aan.
- **"Invalid supabaseUrl" of een wit scherm** → De waarde van `VITE_SUPABASE_URL` in Netlify is geen geldige URL. Open de variabele in **Site configuration → Environment variables** en controleer dat de Value-tekst puur begint met `https://` en verder niets bevat (geen variabelenaam ervoor, geen aanhalingstekens).
- **"Invalid API key" bij inloggen/account maken** → Dezelfde controle, maar dan voor `VITE_SUPABASE_ANON_KEY`. Kopieer de sleutel opnieuw uit het Connect-paneel in Supabase (stap 3) en plak hem volledig, zonder spaties ervoor of erna.
- **Ik zie geen "Beheer"-knop** → Controleer of je stap 8a hebt uitgevoerd mét jouw eigen e-mailadres op de laatste regel, en dat je bent uitgelogd en weer ingelogd na het draaien van dat script.
- **Uitnodigen van een gebruiker geeft een foutmelding** → Controleer stap 8b: `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` moeten allebei correct in Netlify staan (zonder `VITE_` ervoor), gevolgd door een nieuwe deploy met "Clear cache and deploy site".
- **Ik zie na het bijwerken nog steeds het oude ontwerp** → Meestal is stap 9a (opnieuw naar GitHub uploaden) overgeslagen, of de browser toont een oude cache. Controleer op GitHub of de map `src/components/layout` bestaat in je repository; zo niet, upload de bestanden opnieuw. Doe daarna in Netlify **Deploys → Trigger deploy → Clear cache and deploy site**.
- **Instellingen of Gastmodus geven een foutmelding, of je logo/accentkleur wordt niet bewaard** → Controleer of je stap 9b (`migration_v2.sql`) hebt uitgevoerd; zonder die tabellen kan de app deze instellingen niet opslaan.
- **Ik ben mijn resetcode voor de wijnkast vergeten** → Er is geen "wachtwoord vergeten" voor deze code, omdat hij nergens leesbaar wordt opgeslagen (ook niet door mij). Stel in **Instellingen → Wijnkelder resetten** eerst een nieuwe code in — dat overschrijft de oude.
- **Ik krijg steeds de onboarding te zien, ook al gebruik ik de app al** → Controleer of je stap 10b (`migration_v3.sql`) hebt uitgevoerd; die zet bestaande wijnkasten automatisch op "onboarding voltooid".
- **Iconen ontbreken of tonen vierkantjes/lege plekjes** → Even een harde refresh proberen; de iconen worden geladen vanaf een externe bron (Font Awesome) en soms toont de browser eerst nog een oude cache.
