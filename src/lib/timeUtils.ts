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

export function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

export function getMinutesUntil(timeStr?: string): number {
  if (!timeStr) return Infinity;
  const now = new Date();
  const [h, m] = timeStr.split(":").map(Number);
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
  const commuteMin = getCommuteMinutes(commuteDuration);
  const bufferMin = getBufferMinutes(arrivalBuffer);
  const totalMin = commuteMin + bufferMin;

  const [h, m] = classStartTime.split(":").map(Number);
  const departure = new Date();
  departure.setHours(h, m, 0, 0);
  departure.setMinutes(departure.getMinutes() - totalMin);

  const dh = departure.getHours().toString().padStart(2, "0");
  const dm = departure.getMinutes().toString().padStart(2, "0");
  return `${dh}:${dm}`;
}