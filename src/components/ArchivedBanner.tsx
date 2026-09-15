export default function ArchivedBanner() {
  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      Projekt archiviert. Siehe alternativ{" "}
      <a
        href="https://ruhrmobilitylabs.github.io/%C3%96PNV_Projekte/index.html"
        className="font-medium underline hover:no-underline"
      >
        ruhrmobilitylabs.github.io/ÖPNV_Projekte
      </a>
      .
    </div>
  );
}
