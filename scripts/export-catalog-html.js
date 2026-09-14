const fs = require('fs');
const path = require('path');

// Ensure scripts dir exists
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Read data/vehicles.json
const dataPath = path.join(process.cwd(), 'data', 'vehicles.json');
if (!fs.existsSync(dataPath)) {
  console.error(`Error: ${dataPath} does not exist!`);
  process.exit(1);
}

const vehicles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
console.log(`Loaded ${vehicles.length} vehicles from ${dataPath}`);

// Generate standalone HTML
const html = `<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pakistan EV & NEV Catalog (32 Verified Models) — PakEVFinder</title>
  <meta name="description" content="Complete production catalog of all 32 electric and hybrid vehicles in Pakistan with verified battery sizes, real-world summer range, ex-factory prices, and charging standards.">
  
  <!-- Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              cyan: '#06B6D4',
              blue: '#2563EB',
              emerald: '#10B981',
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.6);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.8);
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(100, 116, 139, 1);
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-[#080C16] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">

  <!-- Top Announcement Bar -->
  <div class="bg-gradient-to-r from-blue-900/60 via-cyan-900/50 to-blue-900/60 border-b border-cyan-500/20 text-center py-2 px-4 text-xs font-semibold tracking-wide text-cyan-200">
    ⚡ Official Pakistan EV Catalog & Directory • 32 Verified Models • Real-World Summer 40°C Heat Telemetry
  </div>

  <!-- Sticky Global Header -->
  <header class="sticky top-0 z-50 bg-[#0B101D]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-3 shrink-0 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
          <div class="w-full h-full bg-[#090D1A] rounded-[10px] flex items-center justify-center">
            <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#bolt-gradient)"></polygon>
              <defs>
                <linearGradient id="bolt-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#06B6D4"/>
                  <stop offset="1" stop-color="#3B82F6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="text-lg font-black tracking-tight text-white">Pak<span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EV</span>Finder</span>
            <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">2026</span>
          </div>
          <span class="text-[10px] font-medium text-slate-400 tracking-wider">Automotive Directory</span>
        </div>
      </a>

      <!-- Instant Live Search Bar -->
      <div class="relative flex-1 max-w-lg">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          id="searchInput"
          type="text" 
          placeholder="Instant search by model, brand, distributor, or specs..." 
          class="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 focus:border-cyan-500 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
        >
        <button id="clearSearchBtn" class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">
          ✕
        </button>
      </div>

      <!-- Quick Nav CTAs -->
      <div class="hidden md:flex items-center gap-2.5">
        <a href="/charging" class="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors">
          Charging Map
        </a>
        <a href="/plan-a-route" class="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors">
          Route Planner
        </a>
        <a href="/compare" class="text-xs font-extrabold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-3.5 py-2 rounded-xl hover:bg-cyan-900/80 transition-colors shadow-xs">
          Compare Tool
        </a>
      </div>

    </div>
  </header>

  <!-- Filter Toolbar -->
  <section class="bg-[#0B101D] border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto flex flex-col gap-3">
      
      <!-- Top Row: Counter & Active Filters Summary -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-medium">Tracking</span>
          <span id="resultsCount" class="font-extrabold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 rounded-full tabular-nums">
            ${vehicles.length} Vehicles
          </span>
          <span class="text-slate-500">• Official Distributors & Verified Imports</span>
        </div>
        
        <button id="resetAllFilters" class="text-xs text-slate-400 hover:text-cyan-400 font-bold transition-colors">
          Reset All Filters
        </button>
      </div>

      <!-- Filter Buttons Rows -->
      <div class="flex flex-wrap items-center gap-2 pt-1">
        
        <!-- Powertrain Filter Group -->
        <div class="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button class="filter-btn active-filter px-3 py-1.5 rounded-lg transition-all" data-filter-type="powertrain" data-filter-value="ALL">
            All Types
          </button>
          <button class="filter-btn px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="powertrain" data-filter-value="BEV">
            Pure Electric (BEV)
          </button>
          <button class="filter-btn px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="powertrain" data-filter-value="PHEV">
            Plug-in Hybrid (PHEV)
          </button>
          <button class="filter-btn px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="powertrain" data-filter-value="REEV">
            Range Extender (REEV)
          </button>
          <button class="filter-btn px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="powertrain" data-filter-value="HEV">
            Hybrid (HEV)
          </button>
        </div>

        <!-- Body Type Filter Group -->
        <div class="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button class="filter-btn active-filter px-2.5 py-1.5 rounded-lg transition-all" data-filter-type="body" data-filter-value="ALL">
            All Bodies
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="body" data-filter-value="SUV">
            SUV
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="body" data-filter-value="Sedan">
            Sedan
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="body" data-filter-value="Hatchback">
            Hatchback
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="body" data-filter-value="Microcar">
            Microcar
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="body" data-filter-value="Pickup">
            Pickup
          </button>
        </div>

        <!-- Budget Bracket Filter Group -->
        <div class="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button class="filter-btn active-filter px-2.5 py-1.5 rounded-lg transition-all" data-filter-type="budget" data-filter-value="ALL">
            All Prices
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="budget" data-filter-value="UNDER_40L">
            &lt; PKR 40L
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="budget" data-filter-value="UNDER_1CR">
            &lt; PKR 1 Cr
          </button>
          <button class="filter-btn px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" data-filter-type="budget" data-filter-value="ABOVE_1CR">
            &gt; PKR 1 Cr
          </button>
        </div>

      </div>
    </div>
  </section>

  <!-- Main Grid Content -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Vehicle Cards Grid -->
    <div id="vehicleGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      ${vehicles.map((v) => {
        const pColor = v.powertrain === 'BEV' ? 'bg-cyan-950 text-cyan-300 border-cyan-800/60' :
                       v.powertrain === 'PHEV' ? 'bg-blue-950 text-blue-300 border-blue-800/60' :
                       v.powertrain === 'REEV' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60' :
                       'bg-amber-950 text-amber-300 border-amber-800/60';

        const statusColor = v.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            v.status === 'Upcoming' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            'bg-purple-500/10 text-purple-400 border-purple-500/30';

        const searchKeywords = `${v.name} ${v.brand} ${v.distributor} ${v.bodyType} ${v.powertrain} ${v.chargingPort}`.toLowerCase();

        return `
        <article 
          class="vehicle-card flex flex-col bg-[#0D1322] hover:bg-[#10182B] border border-slate-800/90 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group"
          data-id="${v.id}"
          data-powertrain="${v.powertrain}"
          data-body="${v.bodyType}"
          data-price="${v.pricePkr || 0}"
          data-keywords="${searchKeywords}"
        >
          <!-- Image Container (16:9) with fallback -->
          <div class="relative aspect-video w-full bg-slate-900 overflow-hidden border-b border-slate-800">
            <!-- Badges overlay -->
            <div class="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
              <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border shadow-md ${pColor}">
                ${v.powertrain}
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold border shadow-md ${statusColor}">
                ${v.status}
              </span>
            </div>

            <!-- Vehicle Photo -->
            <img 
              src="${v.imageUrl}" 
              alt="${v.name}" 
              loading="lazy"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src='data/' + this.src.split('/').pop();}else{this.style.display='none';this.nextElementSibling.classList.remove('hidden');}"
            />

            <!-- Editorial Studio Fallback Card (shown if image fails) -->
            <div class="hidden absolute inset-0 bg-gradient-to-br from-[#090D1A] via-[#0E1626] to-[#0A101D] flex flex-col items-center justify-center p-4 text-center select-none">
              <div class="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center mb-2 shadow-inner">
                <svg class="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div class="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">${v.brand}</div>
              <div class="text-xs font-black text-white max-w-[200px] truncate mt-0.5">${v.name}</div>
            </div>

            <!-- Plug Standard Badge -->
            <div class="absolute bottom-2.5 right-2.5 z-10">
              <span class="px-2 py-0.5 rounded-md text-[9px] font-black bg-black/80 backdrop-blur-md text-slate-300 border border-slate-700/80">
                🔌 ${v.chargingPort}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 flex-1 flex flex-col justify-between gap-3">
            
            <div class="space-y-1.5">
              <!-- Distributor & Body -->
              <div class="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                <span class="font-bold text-cyan-400 truncate max-w-[170px]" title="${v.distributor}">
                  ${v.distributor}
                </span>
                <span class="bg-slate-800/80 px-2 py-0.5 rounded-md font-semibold text-slate-300">
                  ${v.bodyType}
                </span>
              </div>

              <!-- Vehicle Title -->
              <h3 class="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                ${v.name}
              </h3>

              <!-- Price Tag -->
              <div class="pt-0.5">
                <div class="text-lg font-black text-white tabular-nums tracking-tight">
                  ${v.priceFormatted}
                </div>
                <span class="text-[10px] text-slate-500 font-medium">Ex-Factory Retail (Pakistan)</span>
              </div>

              <!-- Technical Spec Pill Row -->
              <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                <div class="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90">
                  <span class="text-slate-500 block">Battery</span>
                  <strong class="text-slate-200 tabular-nums">${v.batteryKwh ? v.batteryKwh + ' kWh' : 'Self-Charge'}</strong>
                </div>
                <div class="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90">
                  <span class="text-slate-500 block">Official Range</span>
                  <strong class="text-cyan-400 tabular-nums">${v.rangeKm} km</strong>
                </div>
                <div class="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90">
                  <span class="text-slate-500 block">Summer 40°C</span>
                  <strong class="text-emerald-400 tabular-nums">~${v.summerRangeKm} km</strong>
                </div>
                <div class="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90">
                  <span class="text-slate-500 block">0-100 km/h</span>
                  <strong class="text-slate-200 tabular-nums">${v.zeroToHundred ? v.zeroToHundred + 's' : (v.powerHp + ' hp')}</strong>
                </div>
              </div>

              <!-- Editorial Answer-First Summary -->
              <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-2 pt-1">
                ${v.summary}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 mt-auto">
              <a 
                href="/cars/${v.id}" 
                class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-[11px] transition-all shadow-md shadow-cyan-600/20 text-center"
              >
                <span>Full Specs</span>
                <span>&rarr;</span>
              </a>
              <a 
                href="/compare?v1=${v.id}" 
                class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors border border-slate-700/80 text-center"
              >
                Compare
              </a>
            </div>

          </div>
        </article>
        `;
      }).join('\n')}
    </div>

    <!-- Empty Results Fallback -->
    <div id="noResultsBlock" class="hidden py-16 text-center space-y-3 bg-[#0D1322] border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
      <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-xl">
        🔍
      </div>
      <h3 class="text-base font-bold text-white">No vehicles match your search or filters</h3>
      <p class="text-xs text-slate-400">Try loosening your price bracket or selecting "All Types" to view the full showroom catalog.</p>
      <button id="emptyResetBtn" class="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors">
        Clear All Filters
      </button>
    </div>

  </main>

  <!-- Global Footer -->
  <footer class="bg-[#070A12] border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2 mt-auto">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-400">PakEVFinder.com</span>
        <span>• Pakistan's Premier EV Intelligence & Route-Planning Ecosystem</span>
      </div>
      <div class="flex items-center gap-4 font-semibold text-slate-400">
        <a href="/charging" class="hover:text-white">Charging Map</a>
        <a href="/plan-a-route" class="hover:text-white">Route Planner</a>
        <a href="/car-match" class="hover:text-white">Car Match Quiz</a>
        <a href="/compare" class="hover:text-white">Compare Models</a>
      </div>
    </div>
  </footer>

  <!-- Vanilla JavaScript Client-Side Filtering & Instant Search -->
  <script>
    (function() {
      const searchInput = document.getElementById('searchInput');
      const clearSearchBtn = document.getElementById('clearSearchBtn');
      const resultsCount = document.getElementById('resultsCount');
      const vehicleGrid = document.getElementById('vehicleGrid');
      const noResultsBlock = document.getElementById('noResultsBlock');
      const resetAllFilters = document.getElementById('resetAllFilters');
      const emptyResetBtn = document.getElementById('emptyResetBtn');

      const cards = Array.from(document.querySelectorAll('.vehicle-card'));
      const totalCount = cards.length;

      // Active filter states
      let activePowertrain = 'ALL';
      let activeBody = 'ALL';
      let activeBudget = 'ALL';
      let searchQuery = '';

      function applyFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
          const pt = card.getAttribute('data-powertrain');
          const body = card.getAttribute('data-body');
          const price = parseFloat(card.getAttribute('data-price') || '0');
          const keywords = card.getAttribute('data-keywords') || '';

          // 1. Powertrain check
          const matchPt = activePowertrain === 'ALL' || pt === activePowertrain;

          // 2. Body type check
          const matchBody = activeBody === 'ALL' || body.toLowerCase().includes(activeBody.toLowerCase());

          // 3. Budget bracket check
          let matchBudget = true;
          if (activeBudget === 'UNDER_40L') {
            matchBudget = price > 0 && price <= 4000000;
          } else if (activeBudget === 'UNDER_1CR') {
            matchBudget = price > 0 && price <= 10000000;
          } else if (activeBudget === 'ABOVE_1CR') {
            matchBudget = price > 10000000;
          }

          // 4. Search query check
          let matchSearch = true;
          if (searchQuery.trim()) {
            const queryWords = searchQuery.toLowerCase().trim().split(/\\s+/);
            matchSearch = queryWords.every(word => keywords.includes(word));
          }

          if (matchPt && matchBody && matchBudget && matchSearch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Update count & empty states
        resultsCount.textContent = visibleCount + ' Vehicles';
        if (visibleCount === 0) {
          noResultsBlock.classList.remove('hidden');
          vehicleGrid.classList.add('hidden');
        } else {
          noResultsBlock.classList.add('hidden');
          vehicleGrid.classList.remove('hidden');
        }

        // Show/hide clear search button
        if (searchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }

      // Filter button handlers
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const type = this.getAttribute('data-filter-type');
          const val = this.getAttribute('data-filter-value');

          // Highlight button in this group
          document.querySelectorAll(\`.filter-btn[data-filter-type="\${type}"]\`).forEach(b => {
            b.classList.remove('active-filter', 'bg-cyan-600', 'text-white');
            b.classList.add('text-slate-400');
          });

          this.classList.add('active-filter', 'bg-cyan-600', 'text-white');
          this.classList.remove('text-slate-400');

          if (type === 'powertrain') activePowertrain = val;
          if (type === 'body') activeBody = val;
          if (type === 'budget') activeBudget = val;

          applyFilters();
        });
      });

      // Search input handler
      searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        applyFilters();
      });

      clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        applyFilters();
        searchInput.focus();
      });

      function resetFilters() {
        searchInput.value = '';
        searchQuery = '';
        activePowertrain = 'ALL';
        activeBody = 'ALL';
        activeBudget = 'ALL';

        document.querySelectorAll('.filter-btn').forEach(btn => {
          const val = btn.getAttribute('data-filter-value');
          if (val === 'ALL') {
            btn.classList.add('active-filter', 'bg-cyan-600', 'text-white');
            btn.classList.remove('text-slate-400');
          } else {
            btn.classList.remove('active-filter', 'bg-cyan-600', 'text-white');
            btn.classList.add('text-slate-400');
          }
        });

        applyFilters();
      }

      resetAllFilters.addEventListener('click', resetFilters);
      emptyResetBtn.addEventListener('click', resetFilters);

      // Initialize default active classes
      document.querySelectorAll('.filter-btn[data-filter-value="ALL"]').forEach(b => {
        b.classList.add('bg-cyan-600', 'text-white');
        b.classList.remove('text-slate-400');
      });

    })();
  </script>
</body>
</html>
`;

// Save to public/catalog-export.html
const publicOut = path.join(process.cwd(), 'public', 'catalog-export.html');
fs.writeFileSync(publicOut, html, 'utf8');
console.log(`Successfully compiled standalone catalog showcase: ${publicOut}`);
