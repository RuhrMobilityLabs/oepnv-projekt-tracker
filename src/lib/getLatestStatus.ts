import { PROJECT_STATUSES, type Project, type ProjectStatus } from "@/lib/schemas/projectSchema";

export function getLatestStatus(project: Project): ProjectStatus | "unknown" {
  if (project.statusHistory.length === 0) {
    return "unknown";
  }

  // Try to find the entry with the newest date
  let latestEntry = project.statusHistory[0];
  let latestDate = new Date(latestEntry.date);
  let canUseDates = !isNaN(latestDate.getTime());

  for (let i = 1; i < project.statusHistory.length; i++) {
    const currentEntry = project.statusHistory[i];
    const currentDate = new Date(currentEntry.date);
    const isCurrentDateValid = !isNaN(currentDate.getTime());

    if (canUseDates && isCurrentDateValid) {
      // Both dates are valid - compare dates
      if (currentDate > latestDate) {
        latestDate = currentDate;
        latestEntry = currentEntry;
      } else if (currentDate.getTime() === latestDate.getTime()) {
        // Same date - use PROJECT_STATUSES order as tiebreaker
        const currentIdx = PROJECT_STATUSES.indexOf(currentEntry.status as ProjectStatus);
        const latestIdx = PROJECT_STATUSES.indexOf(latestEntry.status as ProjectStatus);
        if (currentIdx > latestIdx) {
          latestEntry = currentEntry;
        }
      }
    } else if (isCurrentDateValid && !canUseDates) {
      // Current has valid date but previous didn't - switch to current
      latestDate = currentDate;
      latestEntry = currentEntry;
      canUseDates = true;
    } else if (!canUseDates) {
      // Can't use dates - fall back to PROJECT_STATUSES order
      const currentIdx = PROJECT_STATUSES.indexOf(currentEntry.status as ProjectStatus);
      const latestIdx = PROJECT_STATUSES.indexOf(latestEntry.status as ProjectStatus);
      if (currentIdx > latestIdx) {
        latestEntry = currentEntry;
      }
    }
  }

  return latestEntry.status as ProjectStatus;
}
