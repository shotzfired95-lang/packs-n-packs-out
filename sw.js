// Packs N' Packs Out — store service worker.
// Push notifications ONLY. No fetch caching on purpose: the store page must
// always come from the network so customers never get a stale shop.
self.addEventListener("install", function () {
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("push", function (event) {
  var data = { title: "Packs N' Packs Out", body: "You have a new update." };
  try {
    if (event.data) {
      var parsed = event.data.json();
      if (parsed && typeof parsed === "object") {
        if (parsed.title) data.title = String(parsed.title);
        if (parsed.body) data.body = String(parsed.body);
      }
    }
  } catch (e) { /* keep defaults */ }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: "pnpo-customer",
      data: { url: "/" },
    })
  );
});
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (list) {
        for (var i = 0; i < list.length; i++) {
          if ("focus" in list[i]) return list[i].focus();
        }
        return self.clients.openWindow(target);
      })
  );
});
