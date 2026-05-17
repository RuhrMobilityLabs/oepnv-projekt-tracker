const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const localDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatLocalDate(value: string | undefined | null) {
  if (!value) {
    return "-";
  }

  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
      return value;
    }

    return localDateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return localDateFormatter.format(parsed);
}