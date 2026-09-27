# design2html.de

Echter Workflow: **Upload → Vision-KI → HTML/CSS → Live Preview**.

## Start

1. Node.js 20+ installieren.
2. `npm install`
3. `.env.example` nach `.env` kopieren.
4. `OPENAI_API_KEY` in `.env` setzen.
5. `npm start`
6. `http://localhost:3000` öffnen.

Der API-Key bleibt serverseitig und wird nicht an den Browser ausgeliefert.

## Modell

Standard: `gpt-5.6-luna`. Das Modell akzeptiert Bild-Input und ist für kostensensitive Anwendungen vorgesehen. Die Nutzung der API ist allerdings nicht automatisch kostenlos; API-Nutzung wird nach den jeweils aktuellen Preisen abgerechnet.

## Sicherheit

- Upload wird auf 8 MB begrenzt.
- Akzeptiert werden PNG, JPG/JPEG und WebP.
- API-Key niemals in den Frontend-Code schreiben.
- `.env` ist in `.gitignore`.

## Produktion

Für einen öffentlichen Betrieb sollten zusätzlich Rate-Limits, Authentifizierung, Abuse-Schutz, Logging und ein Kostenlimit pro Nutzer ergänzt werden.
