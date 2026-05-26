(function () {
  var root = document.getElementById('countdown');
  if (!root) return;
  var target = new Date(root.dataset.target).getTime();
  var units = ['d', 'h', 'm', 's'];
  var els = {};
  units.forEach(function (u) {
    els[u] = root.querySelector('[data-u="' + u + '"]');
  });

  function tick() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (els.d) els.d.textContent = String(d).padStart(2, '0');
    if (els.h) els.h.textContent = String(h).padStart(2, '0');
    if (els.m) els.m.textContent = String(m).padStart(2, '0');
    if (els.s) els.s.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
})();
