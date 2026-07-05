export function getNotificationStatus() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.requestPermission();
}

export async function showTimerFinishedNotification(intent: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return false;

  const title = "Tijd is voorbij";
  const options: NotificationOptions = {
    body: `${intent} is klaar. Check kort of je verder wilt.`,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: "intentie-timer-finished",
    requireInteraction: true
  };

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
    return true;
  }

  new Notification(title, options);
  return true;
}
