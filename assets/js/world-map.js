/* ==========================================================================
   World Map — Footprints page
   Loaded globally, runs when #world-map exists on the page
   ========================================================================== */

(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      // Check if already loaded
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) { resolve(); return; }
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  window.initWorldMap = async function () {
    var container = document.getElementById('world-map');
    if (!container) return;

    // Clear any previous render
    var existingSvg = container.querySelector('svg');
    if (existingSvg) existingSvg.remove();

    // Load dependencies
    if (typeof d3 === 'undefined') await loadScript('https://cdn.jsdelivr.net/npm/d3@7');
    if (typeof topojson === 'undefined') await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3');

    var visitedCountries = {
      "620": { name: "Portugal", comment: "Home" },
      "724": { name: "Spain", comment: "" },
      "250": { name: "France", comment: "" },
      "380": { name: "Italy", comment: "" },
      "616": { name: "Poland", comment: "" },
      "826": { name: "United Kingdom", comment: "" },
      "578": { name: "Norway", comment: "" },
      "752": { name: "Sweden", comment: "" },
      "076": { name: "Brazil", comment: "Delivered Master Thesis." },
      "032": { name: "Argentina", comment: "Exchange semester." },
      "156": { name: "China", comment: "Summer exchange at Beijing Institute of Technology." },
      "360": { name: "Indonesia", comment: "Volunteering at Batu Kapal Conservation." },
      "068": { name: "Bolivia", comment: "High altitude, big landscapes." },
      "604": { name: "Peru", comment: "Colorful streets and music." },
      "858": { name: "Uruguay", comment: "Good meat and unexpected wind." },
      "170": { name: "Colombia", comment: "South American vibes." },
      "840": { name: "United States", comment: "Big cities, bigger distances." },
      "124": { name: "Canada", comment: "Pretty Lakes." },
      "132": { name: "Cape Verde", comment: "High-school trip." },
      "702": { name: "Singapore", comment: "Efficient, and futuristic." },
      "348": { name: "Hungary", comment: "First big trip with friends." },
      "492": { name: "Monaco", comment: "Primero lleg\u00f3 Verstappen, despu\u00e9s lleg\u00f3 Checo" }
    };

    var countEl = document.getElementById('country-count');
    if (countEl) countEl.innerText = Object.keys(visitedCountries).length;

    var tooltip = document.getElementById('map-tooltip');
    var width = 960;
    var height = 500;

    var svg = d3.select('#world-map')
      .append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    var projection = d3.geoNaturalEarth1()
      .scale(155)
      .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    svg.append('path')
      .datum(d3.geoGraticule().step([20, 20])())
      .attr('class', 'graticule')
      .attr('d', path);

    svg.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', path);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(function (world) {
        var countries = topojson.feature(world, world.objects.countries);

        svg.selectAll('.country')
          .data(countries.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', function (d) { return visitedCountries[d.id] ? 'country visited' : 'country'; })
          .on('mouseenter', function (event, d) {
            if (visitedCountries[d.id]) {
              var info = visitedCountries[d.id];
              tooltip.innerHTML = '<strong>' + info.name + '</strong>' + (info.comment ? '<p>' + info.comment + '</p>' : '');
              tooltip.style.opacity = '1';
              d3.select(this).classed('active', true).raise();
            }
          })
          .on('mousemove', function (event) {
            var rect = container.getBoundingClientRect();
            var x = event.clientX - rect.left + 15;
            var y = event.clientY - rect.top - 15;
            if (x + tooltip.offsetWidth > rect.width - 10) x = event.clientX - rect.left - tooltip.offsetWidth - 15;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
          })
          .on('mouseleave', function () {
            tooltip.style.opacity = '0';
            d3.select(this).classed('active', false);
          });

        svg.append('path')
          .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
          .attr('class', 'country-border')
          .attr('d', path);
      })
      .catch(function (err) {
        console.error("Map loading failed:", err);
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #8b949e;">' +
          '<p>Failed to load the world map data. Please check your connection or try again later.</p>' +
          '</div>';
      });
  };
})();
