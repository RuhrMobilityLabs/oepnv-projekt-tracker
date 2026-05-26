# ÖPNV Projekt Tracker

Der ÖPNV Projekt Tracker ist eine Next.js-Anwendung zur strukturierten Erfassung und Darstellung von ÖPNV-Projekten (z. B. Neubau oder Reaktivierung) inklusive Statushistorie und Quellen.

## Ziele

- Einheitliches Datenmodell für ÖPNV-Projekte
- Nachvollziehbare Statusentwicklung über die Zeit
- Transparente Quellenangaben pro Eintrag
- Statisch generierte Detailseiten für stabile Auslieferung

## Neues ÖPNV-Projekt beitragen

### 0. Editor (optional, visuelle Alternative)

Öffne `/editor` im Browser, um Projekte visuell zu bearbeiten oder neu anzulegen.
Das Formular zeigt alle Felder des Schemas an, validiert Eingaben (Daten, verknüpfte Projekte) und erzeugt eine gültige `.json`-Datei zum Herunterladen.
Lege die Datei anschließend in `projects/` ab oder ersetze eine bestehende Datei.

### 1. Neue Projektdatei anlegen

Lege in `projects/` eine neue JSON-Datei an, z. B.:

```text
projects/neubau-leipzig-stadtbahn.json
```

Empfehlung für Dateiname und ID:

```text
<projektart>-<stadt>-<verkehrsmittel>
```

Die `id` im JSON sollte mit dem Dateinamen (ohne `.json`) übereinstimmen.

### 2. Felder nach Schema ausfüllen

Minimalbeispiel:

```json
{
	"id": "neubau-leipzig-stadtbahn",
	"name": "Neubau Stadtbahn Leipzig Nord",
	"projectType": "neubau",
	"transportTypes": ["stadtbahn"],
	"cities": ["Leipzig"],
	"statusHistory": [
		{
			"status": "idee",
			"date": "2026-05-17",
			"note": "Projekt erstmals im Verkehrsausschuss vorgestellt"
		}
	],
	"sources": [
		{
			"title": "Stadtrat Leipzig Vorlage 2026/123",
			"url": "https://example.org/vorlage-2026-123"
		}
	],
	"stations": [
		{
			"name": "Leipzig Nord",
			"coordinates": {
				"lat": 51.3667,
				"lng": 12.3833
			},
			"status": "existing"
		}
	],
	"lastUpdated": "2026-05-17"
}
```

Pflichtfelder:

- `id` (String)
- `name` (String)
- `projectType` (Enum: `neubau`, `reaktivierung`)
- `transportTypes` (Array von Enum-Werten)
    - Liste von `eisenbahn`, `stadtbahn`, `maglev`, `bus`, `oberleitungsbus`, `seilbahn`, `faehre`
- `cities` (String-Array)
- `statusHistory` (Array von Objekten mit `status` und `date`)
    - status (Enum): `idee`, `antrag`, `geplant`, `im_bau`, `fertiggestellt`
    - date: Datum im ISO format (z.B. 2026-12-31)
    - note: Optionaler Hinweistext
    - sourceUrl: Optionaler Link zur Quelle
- `sources` (Array von Objekten mit `title` und `url`)

Optionale Felder:

- `states` (String-Array)
- `operators` (String-Array)
- `description` (String)
- `stations` (Array von Objekten mit `name`, `coordinates` und `status`)
	- `name` (String)
	- `coordinates` (`lat`, `lng` als Zahlen)
	- `status` (Enum: `existing`, `planned`)
- `coordinates` (`lat`, `lng` als Zahlen)
- `lastUpdated` (Datum als String)

### 3. Pull Request erstellen

- Commit mit neuer/aktualisierter Projektdatei
- Pull Request mit kurzer fachlicher Begründung und Quellenhinweis

## Voraussetzungen

- Node.js 20+
- npm 10+

## Projekt lokal starten

1. Abhängigkeiten installieren:

    ```bash
    npm install
    ```

2. Entwicklungsserver starten:

    ```bash
    npm run dev
    ```

3. Anwendung im Browser öffnen:

    ```text
    http://localhost:3000
    ```

## Build & Deployment

```bash
npm run build
```