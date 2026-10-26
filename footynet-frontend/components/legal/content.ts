import type { Locale } from '@/i18n/config';

// Who runs FootyNet, shown in the Privacy Policy and Terms of Use.
// TODO before going live: fill in the real operator name and a contact email you read.
export const OPERATOR = {
  name: '[Robert Knežević]',
  email: '[knezevic3112@gmail.com]',
};

export const LAST_UPDATED: Record<Locale, string> = {
  hr: '26. listopada 2026.',
  en: '26 October 2026',
};

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalDocument {
  title: string;
  intro: string;
  sections: LegalSection[];
}

// Long-form legal text lives here rather than in messages/*.json: it is read as a whole document,
// not as UI labels. Keep both languages in sync when editing.
export const PRIVACY: Record<Locale, LegalDocument> = {
  hr: {
    title: 'Pravila privatnosti',
    intro: 'FootyNet povezuje nogometaše i klubove. Ova pravila objašnjavaju koje osobne podatke prikupljamo, zašto, s kim ih dijelimo i koja prava imate prema Općoj uredbi o zaštiti podataka (GDPR).',
    sections: [
      {
        heading: '1. Voditelj obrade',
        paragraphs: [`Voditelj obrade osobnih podataka je ${OPERATOR.name}. Za sva pitanja o privatnosti i za ostvarivanje svojih prava pišite na ${OPERATOR.email}.`],
      },
      {
        heading: '2. Koje podatke prikupljamo',
        items: [
          'Podaci računa: email adresa, lozinka (spremamo isključivo njezin kriptografski sažetak, nikad samu lozinku), vrsta računa i odabrani jezik.',
          'Profil igrača: ime, prezime, dob, mjesto i županija, jača noga, pozicije, status dostupnosti, opis, dosadašnji klubovi i profilna slika ako je dodate.',
          'Profil kluba: naziv, liga, mjesto i županija, opis, kontakt telefon i grb ako ga dodate.',
          'Aktivnost na platformi: oglasi, prijave na oglase, motivacijska pisma i poruke između igrača i klubova.',
          'Tehnički podaci: IP adresa i vrijeme zahtjeva u zapisima poslužitelja (radi sigurnosti i otklanjanja grešaka) te datum prihvaćanja ovih pravila.',
        ],
      },
      {
        heading: '3. Svrha i pravna osnova',
        items: [
          'Pružanje usluge (čl. 6. st. 1. t. b GDPR-a): vođenje računa, prikaz profila, oglasi, prijave i poruke.',
          'Legitimni interes (čl. 6. st. 1. t. f GDPR-a): zaštita platforme od zlouporabe, npr. ograničavanje broja pokušaja prijave.',
          'Email obavijesti: potvrda adrese, promjena lozinke i obavijesti o novim porukama dio su usluge. Ne šaljemo reklamne poruke.',
        ],
      },
      {
        heading: '4. Tko vidi vaše podatke',
        items: [
          'Klubovi vide profil igrača koji se prijavio na njihov oglas, uključujući sliku, pozicije i karijeru.',
          'Igrači vide profile klubova i njihove objavljene oglase.',
          'Poruke vide samo sudionici razgovora.',
          'Administrator platforme može pristupiti podacima kad je to potrebno za odobravanje klubova i sprječavanje zlouporabe.',
          'Vaše podatke ne prodajemo i ne dijelimo s oglašivačima.',
        ],
      },
      {
        heading: '5. Izvršitelji obrade',
        paragraphs: ['Za rad platforme koristimo pouzdane pružatelje usluga koji podatke obrađuju samo po našem nalogu:'],
        items: [
          'Supabase: baza podataka.',
          'Render: poslužitelj aplikacije (API).',
          'Vercel: isporuka web stranice.',
          'Brevo: slanje emailova.',
          'Mapbox: prijedlozi mjesta dok upisujete grad (primaju upisani tekst i IP adresu).',
        ],
      },
      {
        heading: '6. Koliko dugo čuvamo podatke',
        paragraphs: [
          'Podatke čuvamo dok je vaš račun aktivan. Kad deaktivirate račun, vaš profil i oglasi odmah prestaju biti vidljivi drugim korisnicima.',
          `Ako želite trajno brisanje svih podataka, pišite na ${OPERATOR.email}; zahtjev ćemo izvršiti najkasnije u roku od 30 dana. Zapisi poslužitelja brišu se automatski nakon kratkog razdoblja.`,
        ],
      },
      {
        heading: '7. Kolačići i lokalna pohrana',
        paragraphs: [
          'Koristimo samo ono što je nužno za rad stranice: kolačić s odabranim jezikom i lokalnu pohranu preglednika (localStorage) za podatke o prijavi. Ne koristimo kolačiće za praćenje, analitiku ni oglašavanje, pa za njih nije potreban pristanak.',
        ],
      },
      {
        heading: '8. Vaša prava',
        items: [
          'Pravo na pristup podacima i na kopiju podataka.',
          'Pravo na ispravak: većinu podataka možete sami urediti na svom profilu.',
          'Pravo na brisanje i na ograničenje obrade.',
          'Pravo na prenosivost podataka i pravo na prigovor.',
          'Pravo na pritužbu Agenciji za zaštitu osobnih podataka (AZOP, azop.hr).',
        ],
      },
      {
        heading: '9. Dobna granica',
        paragraphs: ['Platformu mogu koristiti osobe starije od 16 godina. Ne prikupljamo svjesno podatke mlađih osoba; ako saznamo za takav račun, uklonit ćemo ga.'],
      },
      {
        heading: '10. Sigurnost',
        paragraphs: ['Promet je šifriran (HTTPS), lozinke se spremaju kao kriptografski sažeci, a pristup podacima ograničen je prema vrsti računa. Nijedan sustav nije potpuno siguran, ali poduzimamo razumne mjere zaštite.'],
      },
      {
        heading: '11. Izmjene',
        paragraphs: ['O značajnim izmjenama ovih pravila obavijestit ćemo vas na platformi ili emailom.'],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    intro: 'FootyNet connects football players and clubs. This policy explains what personal data we collect, why, who we share it with and what rights you have under the General Data Protection Regulation (GDPR).',
    sections: [
      {
        heading: '1. Data controller',
        paragraphs: [`The controller of your personal data is ${OPERATOR.name}. For any privacy question or to exercise your rights, write to ${OPERATOR.email}.`],
      },
      {
        heading: '2. What we collect',
        items: [
          'Account data: email address, password (we store only a cryptographic hash, never the password itself), account type and chosen language.',
          'Player profile: first and last name, age, city and county, preferred foot, positions, availability, description, previous clubs and a profile photo if you add one.',
          'Club profile: name, league, city and county, description, contact phone and crest if you add one.',
          'Activity on the platform: job ads, applications, cover letters and messages between players and clubs.',
          'Technical data: IP address and request time in server logs (for security and troubleshooting) and the date you accepted these terms.',
        ],
      },
      {
        heading: '3. Purpose and legal basis',
        items: [
          'Providing the service (Art. 6(1)(b) GDPR): running your account, showing profiles, job ads, applications and messages.',
          'Legitimate interest (Art. 6(1)(f) GDPR): protecting the platform from abuse, e.g. limiting sign-in attempts.',
          'Emails: address confirmation, password reset and new-message notifications are part of the service. We do not send marketing emails.',
        ],
      },
      {
        heading: '4. Who can see your data',
        items: [
          'Clubs see the profile of a player who applied to their job ad, including photo, positions and career.',
          'Players see club profiles and their published job ads.',
          'Messages are visible only to the people in the conversation.',
          'The platform administrator can access data when needed to approve clubs and prevent abuse.',
          'We do not sell your data or share it with advertisers.',
        ],
      },
      {
        heading: '5. Processors',
        paragraphs: ['We use trusted service providers that process data only on our instructions:'],
        items: [
          'Supabase: database.',
          'Render: application server (API).',
          'Vercel: website delivery.',
          'Brevo: sending emails.',
          'Mapbox: city suggestions while you type (receives the typed text and your IP address).',
        ],
      },
      {
        heading: '6. How long we keep data',
        paragraphs: [
          'We keep your data while your account is active. When you deactivate your account, your profile and job ads immediately stop being visible to other users.',
          `If you want all your data permanently deleted, write to ${OPERATOR.email}; we will do it within 30 days at the latest. Server logs are deleted automatically after a short period.`,
        ],
      },
      {
        heading: '7. Cookies and local storage',
        paragraphs: [
          'We use only what the site needs to work: a cookie with your chosen language and the browser\'s local storage for your sign-in. We use no tracking, analytics or advertising cookies, so no consent is required for them.',
        ],
      },
      {
        heading: '8. Your rights',
        items: [
          'Right of access and to a copy of your data.',
          'Right to rectification: you can edit most of your data yourself on your profile.',
          'Right to erasure and to restriction of processing.',
          'Right to data portability and right to object.',
          'Right to lodge a complaint with the Croatian Personal Data Protection Agency (AZOP, azop.hr).',
        ],
      },
      {
        heading: '9. Minimum age',
        paragraphs: ['The platform is for people aged 16 and over. We do not knowingly collect data from younger people; if we learn of such an account, we will remove it.'],
      },
      {
        heading: '10. Security',
        paragraphs: ['Traffic is encrypted (HTTPS), passwords are stored as cryptographic hashes and access to data is restricted by account type. No system is perfectly secure, but we take reasonable measures to protect your data.'],
      },
      {
        heading: '11. Changes',
        paragraphs: ['We will let you know about significant changes to this policy on the platform or by email.'],
      },
    ],
  },
};

export const TERMS: Record<Locale, LegalDocument> = {
  hr: {
    title: 'Uvjeti korištenja',
    intro: 'Registracijom na FootyNet prihvaćate ove uvjete. Molimo vas da ih pročitate.',
    sections: [
      {
        heading: '1. O usluzi',
        paragraphs: [`FootyNet je platforma na kojoj nogometaši objavljuju profile, a klubovi oglase za igrače. Platformu vodi ${OPERATOR.name}. Usluga je besplatna.`],
      },
      {
        heading: '2. Račun',
        items: [
          'Morate imati najmanje 16 godina.',
          'Podaci koje unosite moraju biti istiniti. Klub može registrirati samo osoba ovlaštena da ga zastupa.',
          'Odgovorni ste za čuvanje svoje lozinke i za aktivnost na svom računu.',
          'Računi klubova aktiviraju se nakon što ih administrator odobri.',
        ],
      },
      {
        heading: '3. Pravila ponašanja',
        paragraphs: ['Zabranjeno je:'],
        items: [
          'lažno predstavljanje i otvaranje lažnih profila ili oglasa;',
          'uznemiravanje, vrijeđanje, prijetnje i diskriminacija;',
          'slanje neželjenih poruka (spam) i reklamiranje usluga koje nisu povezane s nogometom;',
          'objava tuđih osobnih podataka ili sadržaja koji krši tuđa prava;',
          'pokušaji neovlaštenog pristupa platformi ili ometanja njezina rada.',
        ],
      },
      {
        heading: '4. Vaš sadržaj',
        paragraphs: ['Sadržaj koji objavite (profil, slike, oglasi, poruke) ostaje vaš. Dopuštate nam da ga prikazujemo drugim korisnicima onako kako je opisano u Pravilima privatnosti, isključivo radi pružanja usluge.'],
      },
      {
        heading: '5. Odgovornost',
        paragraphs: [
          'FootyNet samo povezuje igrače i klubove i nije strana u dogovorima koje sklope. Ne jamčimo točnost profila i oglasa niti ishod prijava.',
          'Uslugu pružamo "kakva jest" i ne jamčimo neprekidan rad. Odgovaramo samo za štetu nastalu namjerno ili krajnjom nepažnjom.',
        ],
      },
      {
        heading: '6. Deaktivacija računa',
        paragraphs: ['Račun možete deaktivirati u bilo kojem trenutku na svom profilu. Račun koji krši ove uvjete možemo privremeno ili trajno ugasiti.'],
      },
      {
        heading: '7. Izmjene i mjerodavno pravo',
        paragraphs: [
          'O značajnim izmjenama uvjeta obavijestit ćemo vas unaprijed. Nastavkom korištenja nakon izmjena prihvaćate nove uvjete.',
          'Na ove uvjete primjenjuje se pravo Republike Hrvatske.',
        ],
      },
      {
        heading: '8. Kontakt',
        paragraphs: [`Pitanja i prijave zlouporabe šaljite na ${OPERATOR.email}.`],
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    intro: 'By registering on FootyNet you accept these terms. Please read them.',
    sections: [
      {
        heading: '1. The service',
        paragraphs: [`FootyNet is a platform where football players publish profiles and clubs post ads for players. It is run by ${OPERATOR.name}. The service is free.`],
      },
      {
        heading: '2. Your account',
        items: [
          'You must be at least 16 years old.',
          'The information you enter must be true. Only a person authorised to represent a club may register it.',
          'You are responsible for keeping your password safe and for activity on your account.',
          'Club accounts become active once an administrator approves them.',
        ],
      },
      {
        heading: '3. Rules of conduct',
        paragraphs: ['You must not:'],
        items: [
          'impersonate others or create fake profiles or job ads;',
          'harass, insult, threaten or discriminate against anyone;',
          'send unsolicited messages (spam) or advertise services unrelated to football;',
          'publish other people\'s personal data or content that infringes their rights;',
          'try to gain unauthorised access to the platform or disrupt it.',
        ],
      },
      {
        heading: '4. Your content',
        paragraphs: ['Content you publish (profile, photos, job ads, messages) stays yours. You allow us to show it to other users as described in the Privacy Policy, solely to provide the service.'],
      },
      {
        heading: '5. Liability',
        paragraphs: [
          'FootyNet only connects players and clubs and is not a party to any agreement they make. We do not guarantee the accuracy of profiles or job ads, or the outcome of applications.',
          'The service is provided "as is" without a guarantee of uninterrupted operation. We are liable only for damage caused intentionally or by gross negligence.',
        ],
      },
      {
        heading: '6. Deactivation',
        paragraphs: ['You can deactivate your account at any time from your profile. We may suspend or close an account that breaks these terms.'],
      },
      {
        heading: '7. Changes and governing law',
        paragraphs: [
          'We will tell you about significant changes in advance. By continuing to use the service after a change you accept the new terms.',
          'These terms are governed by the law of the Republic of Croatia.',
        ],
      },
      {
        heading: '8. Contact',
        paragraphs: [`Send questions and abuse reports to ${OPERATOR.email}.`],
      },
    ],
  },
};
