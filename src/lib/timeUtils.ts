export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getTodayDay(): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}

export function getCommuteMinutes(duration?: string): number {
  if (!duration) return 45;
  if (duration.includes("Under 30")) return 25;
  if (duration.includes("30–60") || duration.includes("30-60")) return 45;
  if (duration.includes("60–90") || duration.includes("60-90")) return 75;
  return 100;
}

export function getBufferMinutes(buffer?: string): number {
  if (!buffer) return 15;
  const match = buffer.match(/(\d+)/);
  return match ? parseInt(match[1]) : 15;
}

export function parseTimeToHHMM(timeStr: string): string {
  if (!timeStr) return "";
  if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) return timeStr.trim();
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = parseInt(match[1]);
  const mins = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${mins}`;
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  const normalized = parseTimeToHHMM(timeStr);
  if (!normalized) return "";
  const [h, m] = normalized.split(":");
  const hour = parseInt(h);
  const mins = parseInt(m);
  if (isNaN(hour) || isNaN(mins)) return "";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${ampm}`;
}

export function getMinutesUntil(timeStr?: string): number {
  if (!timeStr) return Infinity;
  const normalized = parseTimeToHHMM(timeStr);
  if (!normalized) return Infinity;
  const now = new Date();
  const [h, m] = normalized.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

export function getDepartureTime(
  classStartTime: string,
  commuteDuration?: string,
  arrivalBuffer?: string
): string {
  if (!classStartTime) return "";
  const normalized = parseTimeToHHMM(classStartTime);
  if (!normalized) return "";
  const commuteMin = getCommuteMinutes(commuteDuration);
  const bufferMin = getBufferMinutes(arrivalBuffer);
  const totalMin = commuteMin + bufferMin;
  const [h, m] = normalized.split(":").map(Number);
  const departure = new Date();
  departure.setHours(h, m, 0, 0);
  departure.setMinutes(departure.getMinutes() - totalMin);
  const dh = departure.getHours().toString().padStart(2, "0");
  const dm = departure.getMinutes().toString().padStart(2, "0");
  return `${dh}:${dm}`;
}