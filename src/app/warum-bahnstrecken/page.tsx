import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Info,
  Leaf,
  Link2,
  MapPinned,
  Rocket,
  ShieldAlert,
  Undo2,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warum Bahnstrecken gebaut und reaktiviert werden sollten | ÖPNV Projekt Tracker",
  description:
    "Warum neue Bahnstrecken gebaut und ehemalige Strecken reaktiviert werden sollten: Eine Einordnung zu Klima, Mobilität, Kosten und regionaler Entwicklung.",
};

export default function WhyRailLinesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary gap-2">
          <Undo2 />
          Zurück
        </Link>
      </div>
      <section className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-[0_24px_80px_-36px_rgba(15,23,42,0.25)]">
        <div className="border-b border-border px-5 py-5 sm:px-8 sm:py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Hintergrund
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Warum neue Bahnstrecken gebaut und alte Strecken reaktiviert werden sollten
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-base">
            Moderne Bahnstrecken sind weit mehr als Verkehrswege. Sie verbinden Menschen, stärken Regionen, schaffen wirtschaftliche Chancen und leisten einen wichtigen Beitrag zum Umwelt- und Klimaschutz.
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Info className="h-4 w-4 text-primary" />
              <span>Einleitung</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Viele stillgelegte Strecken besitzen noch heute ein enormes Potenzial, während neue Bahnverbindungen dabei helfen können, wachsende Städte und Regionen nachhaltig zu entlasten.
              </p>
              <p>
                Die Reaktivierung bestehender Strecken sowie der Neubau moderner Bahnverbindungen sind daher zentrale Investitionen in die Zukunft.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Leaf className="h-4 w-4 text-primary" />
              <span>Umwelt- und Klimaschutz</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Der Verkehrssektor gehört zu den größten Verursachern von CO₂-Emissionen. Besonders der Straßenverkehr belastet Klima, Umwelt und Lebensqualität erheblich. Die Bahn hingegen zählt zu den umweltfreundlichsten Verkehrsmitteln überhaupt.
              </p>
              <p>
                Züge können große Mengen an Menschen und Gütern effizient transportieren - mit deutlich geringerem Energieverbrauch pro Person oder Tonne als Auto oder Lkw. Vor allem elektrisch betriebene Bahnstrecken ermöglichen einen nahezu emissionsfreien Verkehr, wenn der benötigte Strom aus erneuerbaren Energien stammt.
              </p>
              <p>Darüber hinaus tragen Bahnstrecken dazu bei:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>den Straßenverkehr zu reduzieren,</li>
                <li>Staus zu vermeiden,</li>
                <li>den Flächenverbrauch zu verringern,</li>
                <li>die Luftqualität zu verbessern,</li>
                <li>sowie den Lärm in Innenstädten und Wohngebieten zu senken.</li>
              </ul>
              <p>
                Moderne Schienenfahrzeuge sind heute deutlich leiser als viele Menschen vermuten. Besonders elektrische Züge verursachen erheblich weniger Lärm als dichter Autoverkehr oder schwere Lastwagenkolonnen. Zusätzlich kommen moderne Lärmschutzmaßnahmen wie Schallschutzwände, lärmarme Gleise oder optimierte Fahrpläne zum Einsatz.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Unabhängiger von Öl und fossilen Energieträgern</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Ein starker ÖPNV und SPNV machen Mobilität unabhängiger von fossilen Energieträgern wie Öl. Während Autos, Busse mit Verbrennungsmotor und viele Güterverkehre direkt auf Diesel oder Benzin angewiesen sind, kann die Bahn mit Strom betrieben werden.
              </p>
              <p>
                Das ist ein wichtiger Vorteil für Versorgungssicherheit, Preisstabilität und strategische Unabhängigkeit. Wer auf Schiene setzt, macht sich weniger anfällig für schwankende Ölpreise, geopolitische Krisen und importabhängige Energieträger.
              </p>
              <p>
                ÖPNV und SPNV sind damit eine souveräne Art zu reisen: planbar, resilient und deutlich weniger abhängig von fossilen Ressourcen.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CircleDollarSign className="h-4 w-4 text-primary" />
              <span>Geringere Kosten für Gesellschaft und Infrastruktur</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Häufig wird beim Bau neuer Bahnstrecken zunächst auf die hohen Investitionskosten verwiesen. Dabei wird jedoch oft übersehen, dass auch der Straßenverkehr enorme Kosten verursacht - viele davon indirekt und langfristig.
              </p>
              <p>Zu diesen sogenannten externen Kosten gehören unter anderem:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>Umwelt- und Klimaschäden,</li>
                <li>Gesundheitsbelastungen durch Abgase und Lärm,</li>
                <li>hohe Unfallkosten,</li>
                <li>Straßenschäden durch Schwerverkehr,</li>
                <li>sowie Zeitverluste durch Staus.</li>
              </ul>
              <p>
                Die Bahn verursacht im Vergleich deutlich geringere externe Kosten. Besonders in dicht besiedelten Regionen und Metropolräumen ist der Schienenverkehr deshalb langfristig oft die wirtschaftlichere Lösung.
              </p>
              <p>
                Eine gut ausgebaute Bahn kann zudem den Bedarf an teuren Straßenausbauten reduzieren. Gleichzeitig profitieren Pendlerinnen und Pendler von zuverlässigen und oft günstigeren Mobilitätsangeboten.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Soziale Gerechtigkeit und bessere Mobilität für alle</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Mobilität entscheidet darüber, wie Menschen am gesellschaftlichen Leben teilnehmen können. Nicht jeder besitzt ein Auto oder kann jederzeit darauf zurückgreifen. Besonders Jugendliche, ältere Menschen, Menschen mit Behinderungen oder Personen mit geringem Einkommen sind auf einen funktionierenden öffentlichen Verkehr angewiesen.
              </p>
              <p>Reaktivierte Bahnstrecken schaffen neue Möglichkeiten:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>bessere Erreichbarkeit von Arbeitsplätzen,</li>
                <li>einfachere Wege zu Schulen und Universitäten,</li>
                <li>Zugang zu medizinischer Versorgung,</li>
                <li>sowie mehr Unabhängigkeit im Alltag.</li>
              </ul>
              <p>
                Gerade im ländlichen Raum kann eine Bahnstrecke verhindern, dass Orte vom öffentlichen Leben abgehängt werden. Sie stärkt die Verbindung zwischen Städten und Gemeinden und sorgt dafür, dass Mobilität nicht vom Einkommen oder vom Besitz eines Autos abhängt.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              <span>Neue Arbeitsplätze und wirtschaftliche Impulse</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Bahnprojekte schaffen Arbeitsplätze - nicht nur kurzfristig während der Bauphase, sondern dauerhaft über viele Jahrzehnte hinweg.
              </p>
              <p>Dazu gehören unter anderem:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>Planung und Bau der Infrastruktur,</li>
                <li>Wartung und Modernisierung,</li>
                <li>Betrieb der Strecken,</li>
                <li>Fahrzeugtechnik,</li>
                <li>Signal- und Sicherheitstechnik,</li>
                <li>sowie Arbeitsplätze bei Verkehrsunternehmen und Zulieferern.</li>
              </ul>
              <p>
                Darüber hinaus profitieren viele weitere Branchen indirekt von besseren Verkehrsverbindungen. Unternehmen siedeln sich bevorzugt dort an, wo eine gute Infrastruktur vorhanden ist. Dadurch entstehen neue wirtschaftliche Chancen für ganze Regionen.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPinned className="h-4 w-4 text-primary" />
              <span>Mehr Attraktivität für Städte und Regionen</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Eine gute Bahnanbindung erhöht die Attraktivität einer Region erheblich. Städte und Gemeinden mit leistungsfähigem Schienenverkehr gelten oft als moderner, lebenswerter und wirtschaftlich stärker.
              </p>
              <p>Reaktivierte Strecken können:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>Innenstädte beleben,</li>
                <li>den Tourismus fördern,</li>
                <li>Immobilienstandorte attraktiver machen,</li>
                <li>sowie neue Investitionen anziehen.</li>
              </ul>
              <p>
                Besonders Regionen, die bisher schlecht angebunden sind, erhalten durch eine Bahnstrecke neue Entwicklungsmöglichkeiten. Gleichzeitig verbessert sich die Lebensqualität für die Menschen vor Ort.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span>Sorgen und Bedenken ernst nehmen</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Bei Bahnprojekten entstehen häufig Sorgen und Diskussionen. Das ist verständlich, denn neue Infrastruktur verändert das Umfeld vieler Menschen. Typische Bedenken betreffen zum Beispiel:</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>zusätzlichen Lärm,</li>
                <li>Veränderungen des Landschaftsbildes,</li>
                <li>steigendes Verkehrsaufkommen,</li>
                <li>oder mögliche Eingriffe in Natur und Umwelt.</li>
              </ul>
              <p>
                Viele dieser Sorgen beruhen jedoch auf veralteten Vorstellungen oder Missverständnissen. Moderne Bahnstrecken unterscheiden sich deutlich von früheren Anlagen. Neue Technologien, strengere Umweltauflagen und umfangreiche Schutzmaßnahmen sorgen dafür, dass Auswirkungen auf Anwohnerinnen und Anwohner möglichst gering bleiben.
              </p>
              <p>
                Wichtig ist außerdem: Ohne den Ausbau der Bahn würden viele Probleme des Straßenverkehrs weiter zunehmen. Mehr Autos bedeuten langfristig oft mehr Lärm, mehr Staus, höhere Emissionen und einen größeren Flächenverbrauch.
              </p>
              <p>
                Die Bahn ist daher nicht das Problem - sondern ein wichtiger Teil der Lösung.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Investitionen in die Zukunft</span>
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <p>
                Die Reaktivierung stillgelegter Bahnstrecken und der Neubau moderner Schienenverbindungen sind langfristige Investitionen in eine nachhaltige, gerechte und wirtschaftlich starke Zukunft.
              </p>
              <p>Sie helfen dabei,</p>
              <ul className="grid gap-2 pl-5 text-sm leading-6 text-foreground/90 list-disc sm:text-base sm:leading-7">
                <li>Klima- und Umweltziele zu erreichen,</li>
                <li>Regionen besser zu verbinden,</li>
                <li>Mobilität für alle Menschen zu ermöglichen,</li>
                <li>sowie Städte und Gemeinden lebenswerter zu machen.</li>
              </ul>
              <p>
                Eine moderne Verkehrspolitik braucht deshalb eine starke Schiene - heute mehr denn je.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Link2 className="h-4 w-4 text-primary" />
              <span>Quellen (externe Seiten)</span>
            </h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              <li><a className="text-primary transition hover:underline" href="https://awo.org/artikel/fuer-soziale-gerechtigkeit-in-der-verkehrswende/" target="_blank" rel="noreferrer">Für soziale Gerechtigkeit in der Verkehrswende, AWO, 2024</a></li>
              <li><a className="text-primary transition hover:underline" href="https://link.springer.com/article/10.1007/s10273-022-3170-z" target="_blank" rel="noreferrer">Mobilität auf dem Klimaprüfstand: Bahnverkehr, A. Eisenkopf, 2022</a></li>
              <li><a className="text-primary transition hover:underline" href="https://www.umweltbundesamt.de/themen/verkehrswende-busverkehr-verdoppeln-bahnverkehr" target="_blank" rel="noreferrer">Verkehrswende: Busverkehr verdoppeln, Bahnverkehr steigern, UBA, 2025</a></li>
              <li><a className="text-primary transition hover:underline" href="https://www.allianz-pro-schiene.de/themen/verkehrssicherheit/" target="_blank" rel="noreferrer">Verkehrssicherheit im Vergleich: Bahn ist sicherstes Verkehrsmittel, Allianz pro Schiene</a></li>
              <li><a className="text-primary transition hover:underline" href="https://orlis.difu.de/items/b52796a5-5440-4b97-8029-c653689f2cea" target="_blank" rel="noreferrer">Externe Kosten des Verkehrs. Mehr Kostenwahrheit stärkt Bahnen und Busse., G. Ellwanger et. D. Flege, 2007</a></li>
              <li><a className="text-primary transition hover:underline" href="https://zukunftsnetz-mobilitaet.nrw.de/aktuelles/news/studie-kostenvergleich" target="_blank" rel="noreferrer">ÖPNV vs. MIV: Autokosten werden unterschätzt, 2024</a></li>
              <li><a className="text-primary transition hover:underline" href="https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten" target="_blank" rel="noreferrer">Emissionsdaten, UBA, 2026</a></li>
              <li><a className="text-primary transition hover:underline" href="https://www.vcd.org/artikel/oepnv-in-die-zukunft-investieren" target="_blank" rel="noreferrer">ÖPNV: In die Zukunft investieren, VCD, 2025</a></li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}