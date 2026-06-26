const STORAGE_KEY = "conecta_familia_reports";
const config = window.CONFAM_CONFIG || {};
const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
const supabaseClient = hasSupabaseConfig
  ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

const statusOptions = [
  "pending_review",
  "urgent",
  "active_search",
  "possible_match",
  "found",
  "escalated_to_authority",
  "false_report",
];

const statusLabels = {
  pending_review: "Pendiente de revisión",
  urgent: "Urgente",
  active_search: "Búsqueda activa",
  possible_match: "Posible coincidencia",
  found: "Encontrado",
  escalated_to_authority: "Escalado a autoridad",
  false_report: "Reporte falso",
};

const countryOrder = ["Venezuela", "Colombia", "Peru", "Brasil", "Ecuador", "Mexico", "Argentina"];

const cityMapReferences = {
  "venezuela|distrito capital|caracas": [10.4806, -66.9036],
  "venezuela|tachira|san cristobal": [7.7669, -72.2250],
  "venezuela|tachira|san antonio del tachira": [7.8145, -72.4431],
  "venezuela|zulia|maracaibo": [10.6427, -71.6125],
  "venezuela|apure|guasdualito": [7.2424, -70.7324],
  "venezuela|amazonas|puerto ayacucho": [5.6639, -67.6236],
  "colombia|antioquia|medellin": [6.2067756, -75.5659681],
  "colombia|arauca|arauca": [7.0847, -70.7591],
  "colombia|norte de santander|cucuta": [7.8939, -72.5078],
  "peru|tumbes|tumbes": [-3.5669, -80.4515],
  "peru|lima|san juan de lurigancho": [-11.9828, -76.9983],
  "brasil|roraima|boa vista": [2.8235, -60.6758],
  "brasil|roraima|pacaraima": [4.4799, -61.1477],
};

const externalSourceDirectories = [
  {
    name: "Buscar Desaparecidos",
    type: "Plataforma ciudadana",
    confidence: "Pendiente de permiso",
    scope: "Directorio amplio con reportes públicos de personas buscadas y localizadas",
    url: "https://buscardesaparecidos.com/buscar",
    action: "Buscar en la fuente original",
    note: "Fuente externa prioritaria. Usa la búsqueda original y reporta aquí cualquier pista útil para revisión humana.",
    featured: true,
  },
  {
    name: "Venezuela Te Busca",
    type: "Plataforma ciudadana",
    confidence: "Pendiente de permiso",
    scope: "Fuente externa con reportes públicos de personas buscadas y localizadas",
    url: "https://venezuelatebusca.com/",
    action: "Buscar en la fuente original",
    note: "Se enlaza como fuente externa; cualquier dato que llegue a Conecta Familia Venezuela debe pasar por revisión humana.",
  },
  {
    name: "CICR - Restablecimiento de contacto familiar",
    type: "Organismo humanitario",
    confidence: "Oficial",
    scope: "Búsqueda y reconexión familiar internacional",
    url: "https://www.icrc.org/en/what-we-do/reconnecting-families",
    action: "Abrir canal humanitario",
    note: "Fuente recomendada para familias separadas por desastres, violencia, migración o emergencias.",
  },
  {
    name: "R4V - Plataforma Regional Venezuela",
    type: "Coordinación humanitaria",
    confidence: "Alta",
    scope: "Información regional sobre personas refugiadas y migrantes de Venezuela",
    url: "https://www.r4v.info/",
    action: "Abrir plataforma",
    note: "Útil para ubicar reportes, organizaciones y servicios, sin copiar datos personales.",
  },
  {
    name: "ACNUR Help",
    type: "Canal oficial de orientación",
    confidence: "Oficial",
    scope: "Ayuda para personas refugiadas, migrantes y solicitantes de asilo",
    url: "https://help.unhcr.org/",
    action: "Abrir ACNUR Help",
    note: "Usar para orientación territorial y rutas de ayuda en países de diáspora.",
  },
  {
    name: "ReliefWeb Venezuela",
    type: "Repositorio humanitario",
    confidence: "Alta",
    scope: "Reportes, mapas y actualizaciones humanitarias sobre Venezuela",
    url: "https://reliefweb.int/country/ven",
    action: "Abrir ReliefWeb",
    note: "Fuente útil para contexto humanitario y documentos, no para datos personales de reportantes.",
  },
];

const externalPublicCases = [];

const supportCenters = [
  {
    name: "911 / VEN-911",
    city: "Venezuela",
    type: "Emergencia inmediata",
    description: "Línea inicial para personas atrapadas, heridas o en peligro inmediato.",
    lat: 10.4806,
    lng: -66.9036,
    url: "",
  },
  {
    name: "Cruz Roja Venezolana",
    city: "Caracas",
    type: "Ayuda humanitaria",
    description: "Sociedad nacional de Cruz Roja publicada en directorio IFRC.",
    lat: 10.5061,
    lng: -66.9146,
    url: "https://www.ifrc.org/national-societies-directory/venezuelan-red-cross",
  },
  {
    name: "UNICEF Venezuela",
    city: "Venezuela",
    type: "Niñez y protección",
    description: "Canal institucional para información humanitaria y protección de niñez.",
    lat: 10.4806,
    lng: -66.9036,
    url: "https://www.unicef.org/venezuela/",
  },
  {
    name: "Santa Tinta / Tattoo Keibyn Pabón",
    city: "Medellín",
    type: "Punto solidario comunitario",
    description: "Recepción comunitaria de mercado, alimentos no perecederos y ayuda humanitaria.",
    lat: 6.2068,
    lng: -75.5660,
    url: "https://www.google.com/maps/place/TATTOO+KEIBYN+PAB%C3%93N+(poblado)/@6.2067756,-75.5659681,17z/",
    image: "/assets/santa-tinta-punto-solidario.jpg",
  },
  {
    name: "Cruz Roja Colombiana",
    city: "Colombia",
    type: "Diáspora y ayuda humanitaria",
    description: "Canales institucionales para orientación, emergencias y donaciones.",
    lat: 4.7110,
    lng: -74.0721,
    url: "https://www.cruzrojacolombiana.org/",
  },
  {
    name: "Cruz Roja Bogotá",
    city: "Bogotá",
    type: "Migración y asuntos humanitarios",
    description: "Seccional con servicios humanitarios y orientación territorial.",
    lat: 4.7110,
    lng: -74.0721,
    url: "https://www.cruzrojabogota.org.co/",
  },
  {
    name: "Cruz Roja Argentina",
    city: "Argentina",
    type: "Restablecimiento de contacto familiar",
    description: "Canal institucional para reencuentro familiar y movilidad humana.",
    lat: -34.6037,
    lng: -58.3816,
    url: "https://www.cruzroja.org.ar/",
  },
  {
    name: "Cruz Roja Mexicana",
    city: "México",
    type: "Socorros y migración",
    description: "Canales institucionales de delegaciones, socorros y programas de migración.",
    lat: 19.4326,
    lng: -99.1332,
    url: "https://www.cruzrojamexicana.org.mx/",
  },
];

const ROUTES = {
  "/": "inicio",
  "/personas": "personas",
  "/centros": "centros",
  "/admin": "admin",
};

const reportForm = document.querySelector("#reportForm");
const formStatus = document.querySelector("#formStatus");
const whatsappButton = document.querySelector("#whatsappButton");
const casesList = document.querySelector("#casesList");
const publicCasesList = document.querySelector("#publicCasesList");
const publicSourcesList = document.querySelector("#publicSourcesList");
const publicSearch = document.querySelector("#publicSearch");
const publicStats = document.querySelector("#publicStats");
const publicFilters = document.querySelectorAll("[data-public-status]");
const publicShowMore = document.querySelector("#publicShowMore");
const centerSearch = document.querySelector("#centerSearch");
const centerCountryFilter = document.querySelector("#centerCountryFilter");
const centerTypeFilter = document.querySelector("#centerTypeFilter");
const centerStatusFilter = document.querySelector("#centerStatusFilter");
const centerStats = document.querySelector("#centerStats");
const centerMapNote = document.querySelector("#centerMapNote");
const centersMap = document.querySelector("#centersMap");
const centersList = document.querySelector("#centersList");
const exportReports = document.querySelector("#exportReports");
const clearReports = document.querySelector("#clearReports");
const correctionRequestForm = document.querySelector("#correctionRequestForm");
const correctionStatus = document.querySelector("#correctionStatus");
const correctionRequestsList = document.querySelector("#correctionRequestsList");
const csvFileInput = document.querySelector("#csvFileInput");
const csvTextInput = document.querySelector("#csvTextInput");
const csvPreviewButton = document.querySelector("#csvPreviewButton");
const csvImportButton = document.querySelector("#csvImportButton");
const csvImportStatus = document.querySelector("#csvImportStatus");
const csvPreview = document.querySelector("#csvPreview");
const actionButtons = document.querySelectorAll("[data-action]");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminEmail = document.querySelector("#adminEmail");
const adminPassword = document.querySelector("#adminPassword");
const adminLogout = document.querySelector("#adminLogout");
const adminStatus = document.querySelector("#adminStatus");
const adminStatusFilter = document.querySelector("#adminStatusFilter");
const adminSearch = document.querySelector("#adminSearch");
const adminStats = document.querySelector("#adminStats");

let adminFilterStatus = "all";
let adminSearchTerm = "";
let publicSearchTerm = "";
let publicFilterStatus = "all";
let publicVisibleCount = 24;
let centerSearchTerm = "";
let centerFilterCountry = "all";
let centerFilterType = "all";
let centerFilterStatus = "all";
let aidCenters = [];
let csvPreviewRows = [];

function loadLocalReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function getFormData() {
  const data = Object.fromEntries(new FormData(reportForm).entries());
  data.consentimiento_datos = Boolean(reportForm.consentimiento_datos.checked);
  data.declaracion_buena_fe = Boolean(reportForm.declaracion_buena_fe.checked);
  return data;
}

function sanitizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

function createWhatsAppMessage(data) {
  return [
    "Conecta Familia Venezuela - reporte ciudadano privado",
    `Tipo: ${data.tipo_reporte || "Busco a un familiar"}`,
    `Persona: ${data.nombre_persona || ""}`,
    `Ciudad/sector: ${data.ciudad_sector || ""}`,
    `Último contacto o lugar visto: ${data.ultimo_contacto_o_lugar_visto || ""}`,
    `Edad aproximada: ${data.edad_aproximada || ""}`,
    `Estado general: ${data.estado_general || ""}`,
    `Descripción: ${data.descripcion || ""}`,
    `Reportante: ${data.nombre_reportante || ""}`,
    `Relación: ${data.relacion_con_persona || ""}`,
    "Confirmo que esta información se envía de buena fe. No reemplaza a autoridades ni organismos de rescate.",
  ].join("\n");
}

function updateWhatsAppLink() {
  const data = getFormData();
  const message = encodeURIComponent(createWhatsAppMessage(data));
  const number = sanitizePhone(config.whatsappNumber || data.whatsapp_reportante);

  if (config.whatsappGroupLink) {
    whatsappButton.href = config.whatsappGroupLink;
    whatsappButton.textContent = "Abrir grupo de WhatsApp";
    whatsappButton.title = "El reporte se guarda primero; el grupo sirve para coordinación.";
    return;
  }

  whatsappButton.href = number
    ? `https://wa.me/${number.replace("+", "")}?text=${message}`
    : `https://wa.me/?text=${message}`;
  whatsappButton.textContent = "Enviar por WhatsApp";
  whatsappButton.title = "";
}

function createReport(data) {
  const safePhone = sanitizePhone(data.whatsapp_reportante);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_at: new Date().toISOString(),
    status: "pending_review",
    visibility: "private",
    published: false,
    sensitive_publication_blocked: true,
    tipo_reporte: data.tipo_reporte,
    nombre_persona: data.nombre_persona,
    ciudad_sector: data.ciudad_sector,
    ultimo_contacto_o_lugar_visto: data.ultimo_contacto_o_lugar_visto,
    edad_aproximada: data.edad_aproximada,
    descripcion: data.descripcion,
    estado_general: data.estado_general,
    nombre_reportante: data.nombre_reportante,
    whatsapp_reportante_private: safePhone,
    whatsapp_reportante: "[privado]",
    relacion_con_persona: data.relacion_con_persona,
    consentimiento_datos: data.consentimiento_datos,
    declaracion_buena_fe: data.declaracion_buena_fe,
  };
}

function reportForSupabase(report) {
  const { id, whatsapp_reportante, created_at, ...payload } = report;
  return payload;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(value) {
  if (!value) return "Fecha no disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status) {
  return statusLabels[status] || status || "Sin estado";
}

function filterPublicCases(cases) {
  const term = normalizeText(publicSearchTerm);
  return cases.filter((item) => {
    const statusMatches = publicFilterStatus === "all" || item.status === publicFilterStatus;
    const searchable = normalizeText([
      item.public_nombre,
      item.public_ciudad_sector,
      item.public_edad_aproximada,
      item.public_resumen,
      statusLabel(item.status),
    ].join(" "));
    return statusMatches && (!term || searchable.includes(term));
  });
}

function navigateToRoute(path, replace = false) {
  const normalizedPath = ROUTES[path] ? path : "/";
  const targetId = ROUTES[normalizedPath];
  const target = document.getElementById(targetId);
  if (!target) return;

  if (window.location.pathname !== normalizedPath) {
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", normalizedPath);
  }

  updateActiveNavigation(normalizedPath);
  target.scrollIntoView({ behavior: replace ? "auto" : "smooth", block: "start" });
}

function updateActiveNavigation(path = window.location.pathname) {
  const normalizedPath = ROUTES[path] ? path : "/";
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === normalizedPath) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function routeFromCurrentUrl() {
  const path = window.location.pathname;
  if (ROUTES[path]) {
    navigateToRoute(path, true);
    return;
  }

  const legacyHash = window.location.hash.replace("#", "");
  if (legacyHash === "casos") {
    navigateToRoute("/personas", true);
  }
}

function filterCenters() {
  const term = normalizeText(centerSearchTerm);
  return aidCenters.filter((center) => {
    const countryMatches = centerFilterCountry === "all" || center.country === centerFilterCountry;
    const typeMatches = centerFilterType === "all" || center.type === centerFilterType;
    const statusMatches = centerFilterStatus === "all" || center.status === centerFilterStatus;
    const searchable = normalizeText([
      center.name,
      center.country,
      center.state,
      center.city,
      center.type,
      center.description,
      center.offer,
      center.receives,
      center.sourceName,
    ].join(" "));
    return countryMatches && typeMatches && statusMatches && (!term || searchable.includes(term));
  });
}

function renderCenters() {
  if (!centersList || !centersMap) return;
  const centers = filterCenters();
  const mappedCount = centers.filter((center) => hasCoordinates(center)).length;
  const countries = new Set(centers.map((center) => center.country).filter(Boolean)).size;
  centerStats.textContent = `${centers.length} centro(s) · ${countries} país(es) · ${mappedCount} con punto en mapa`;
  renderCentersMap(centers);

  const grouped = centers.reduce((groups, center) => {
    const country = center.country || "Sin país";
    groups[country] = groups[country] || [];
    groups[country].push(center);
    return groups;
  }, {});

  centersList.innerHTML = Object.entries(grouped)
    .sort(([countryA], [countryB]) => countrySortValue(countryA) - countrySortValue(countryB) || countryA.localeCompare(countryB, "es"))
    .map(([country, items]) => `
      <section class="center-country-group">
        <div class="center-country-heading">
          <h3>${escapeHtml(country)}</h3>
          <span>${items.length} registro(s)</span>
        </div>
        ${items.map((center) => renderCenterCard(center)).join("")}
      </section>
    `)
    .join("");
}

function countrySortValue(country) {
  const index = countryOrder.indexOf(country);
  return index === -1 ? 999 : index;
}

function typeLabel(type) {
  const labels = {
    centro_acopio: "Centro de acopio",
    refugio: "Refugio",
    hospital: "Hospital",
    punto_medico: "Punto médico",
    alimento: "Alimento",
    agua: "Agua",
    medicamentos: "Medicamentos",
    ong: "ONG",
    iglesia: "Iglesia",
    informacion: "Información",
  };
  return labels[type] || type || "Información";
}

function hasCoordinates(center) {
  return Number.isFinite(center.mapLat) && Number.isFinite(center.mapLng);
}

function centerMapsUrl(center) {
  if (Number.isFinite(center.lat) && Number.isFinite(center.lng)) return `https://www.google.com/maps?q=${center.lat},${center.lng}`;
  const query = [center.address, center.city, center.state, center.country].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || center.name)}`;
}

function renderCenterCard(center) {
  const mapsUrl = centerMapsUrl(center);
  const location = [center.city, center.state].filter(Boolean).join(" · ") || center.country;
  const mapLabel = center.mapApproximate ? "Mapa aproximado por ciudad" : "Punto verificado en mapa";
  return `
    <article class="center-card ${center.status === "pendiente" ? "is-pending" : ""}">
      ${center.image ? `<img class="center-card-image" src="${escapeHtml(center.image)}" alt="${escapeHtml(center.name)} - punto solidario comunitario" loading="lazy">` : ""}
      <div>
        <span class="contact-category">${escapeHtml(typeLabel(center.type))}</span>
        <h4>${escapeHtml(center.name)}</h4>
        <p>${escapeHtml(center.description || center.offer || "Punto de apoyo registrado para verificación comunitaria.")}</p>
      </div>
      <div class="case-meta">
        <span class="pill">${escapeHtml(location)}</span>
        <span class="pill">${escapeHtml(center.status === "verificado" ? "Verificado" : "Pendiente de verificación")}</span>
        <span class="pill">${escapeHtml(center.confidence || "por confirmar")}</span>
        ${hasCoordinates(center) ? `<span class="pill">${escapeHtml(mapLabel)}</span>` : ""}
      </div>
      <dl class="center-details">
        ${center.address ? `<div><dt>Dirección general</dt><dd>${escapeHtml(center.address)}</dd></div>` : ""}
        ${center.reference ? `<div><dt>Referencia</dt><dd>${escapeHtml(center.reference)}</dd></div>` : ""}
        ${center.schedule ? `<div><dt>Horario</dt><dd>${escapeHtml(center.schedule)}</dd></div>` : ""}
        ${center.receives ? `<div><dt>Recibe</dt><dd>${escapeHtml(center.receives)}</dd></div>` : ""}
        ${center.offer ? `<div><dt>Ofrece</dt><dd>${escapeHtml(center.offer)}</dd></div>` : ""}
        ${center.phone ? `<div><dt>Teléfono institucional</dt><dd>${escapeHtml(center.phone)}</dd></div>` : ""}
        ${center.sourceName ? `<div><dt>Fuente</dt><dd>${escapeHtml(center.sourceName)} · ${escapeHtml(center.verifiedAt || "sin fecha")}</dd></div>` : ""}
      </dl>
      <p class="source-note">${escapeHtml(center.notes || "Verifica siempre en la fuente original antes de movilizar ayuda.")}</p>
      <div class="public-card-actions">
        ${center.sourceUrl ? `<a class="secondary-btn" href="${escapeHtml(center.sourceUrl)}" target="_blank" rel="noopener">Abrir fuente</a>` : ""}
        <a class="secondary-btn" href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener">Cómo llegar</a>
        <a class="secondary-btn" href="https://chat.whatsapp.com/LSWcidnfp6uLwzglQ47euc" target="_blank" rel="noopener">Coordinar por WhatsApp</a>
      </div>
    </article>
  `;
}

function renderCentersMap(centers) {
  const mappedCenters = centers.filter(hasCoordinates);
  centersMap.innerHTML = `
    <div class="map-legend">
      <span><i class="exact"></i>Punto exacto</span>
      <span><i class="approx"></i>Referencia por ciudad</span>
    </div>
    ${mappedCenters
      .map((center, index) => {
        const x = Math.max(5, Math.min(95, ((center.mapLng + 102) / 44) * 100));
        const y = Math.max(6, Math.min(94, 100 - ((center.mapLat + 15) / 37) * 100));
        return `
          <a
            class="map-pin ${center.mapApproximate ? "is-approx" : "is-exact"}"
            href="${escapeHtml(centerMapsUrl(center))}"
            target="_blank"
            rel="noopener"
            style="left:${x}%;top:${y}%;"
            aria-label="${escapeHtml(center.name)}"
            title="${escapeHtml(center.name)} · ${escapeHtml(center.mapApproximate ? "referencia aproximada" : "punto exacto")}"
          >${index + 1}</a>
        `;
      })
      .join("")}
  `;

  const withoutMap = centers.length - mappedCenters.length;
  if (centerMapNote) {
    centerMapNote.textContent = withoutMap
      ? `${withoutMap} registro(s) no tienen referencia geográfica suficiente y aparecen solo en el listado.`
      : "Los puntos pueden ser exactos o aproximados por ciudad; confirma siempre en la fuente original.";
  }
}

function normalizeAidCenter(row) {
  const lat = Number.parseFloat(String(row.latitud || "").replace(",", "."));
  const lng = Number.parseFloat(String(row.longitud || "").replace(",", "."));
  const exactCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const cityKey = normalizeText([row.pais, row.estado_region, row.ciudad].join("|"));
  const referenceCoordinates = exactCoordinates ? [lat, lng] : cityMapReferences[cityKey] || [];
  return {
    name: row.nombre || "Centro por revisar",
    type: row.tipo || "informacion",
    country: row.pais || "Sin país",
    state: row.estado_region || "",
    city: row.ciudad || "",
    address: row.direccion_general || "",
    reference: row.referencia || "",
    lat,
    lng,
    mapLat: referenceCoordinates[0],
    mapLng: referenceCoordinates[1],
    mapApproximate: !exactCoordinates && referenceCoordinates.length === 2,
    schedule: row.horario || "",
    phone: row.telefono_publico || "",
    receives: row.que_recibe || "",
    offer: row.que_ofrece || "",
    sourceUrl: row.fuente_url || "",
    sourceName: row.fuente_nombre || "",
    verifiedAt: row.fecha_verificacion || "",
    verifiedBy: row.verificado_por || "",
    confidence: row.nivel_confianza || "por confirmar",
    status: row.estado_verificacion || "pendiente",
    notes: row.notas || "",
    image: normalizeText(row.nombre || "").includes("santa tinta") ? "/assets/santa-tinta-punto-solidario.jpg" : "",
    description: row.que_ofrece || row.que_recibe || row.notas || "",
  };
}

function fallbackAidCenters() {
  return supportCenters.map((center) => ({
    name: center.name,
    type: "informacion",
    country: center.city === "Medellín" ? "Colombia" : center.city,
    state: "",
    city: center.city,
    address: "",
    reference: "",
    lat: center.lat,
    lng: center.lng,
    mapLat: center.lat,
    mapLng: center.lng,
    mapApproximate: false,
    schedule: "",
    phone: "",
    receives: "",
    offer: center.description,
    sourceUrl: center.url,
    sourceName: center.name,
    verifiedAt: "2026-06-26",
    verifiedBy: "Conecta Familia Venezuela",
    confidence: "alta",
    status: "pendiente",
    notes: "Registro de respaldo local; verificar fuente original antes de movilizar ayuda.",
    image: center.image || "",
    description: center.description,
  }));
}

function populateCenterFilters() {
  if (!centerCountryFilter || !centerTypeFilter) return;
  const countries = [...new Set(aidCenters.map((center) => center.country).filter(Boolean))].sort();
  const types = [...new Set(aidCenters.map((center) => center.type).filter(Boolean))].sort();

  const orderedCountries = countries.sort((a, b) => countrySortValue(a) - countrySortValue(b) || a.localeCompare(b, "es"));

  centerCountryFilter.innerHTML = `<option value="all">Todos los países</option>${orderedCountries
    .map((country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`)
    .join("")}`;

  centerTypeFilter.innerHTML = `<option value="all">Todos los tipos</option>${types
    .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(typeLabel(type))}</option>`)
    .join("")}`;
}

async function loadAidCenters() {
  try {
    const response = await fetch("/data/research/aid-centers-research.csv", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar el CSV de centros.");
    const csvText = await response.text();
    aidCenters = parseCsv(csvText).map(normalizeAidCenter);
  } catch (error) {
    console.warn(error);
    aidCenters = fallbackAidCenters();
  }

  populateCenterFilters();
  renderCenters();
}

function renderPublicSources() {
  if (!publicSourcesList) return;

  publicSourcesList.innerHTML = externalSourceDirectories
    .map((source) => `
      <article class="source-directory-card ${source.featured ? "is-featured-source" : ""}">
        <div>
          <span class="contact-category">${escapeHtml(source.type)}</span>
          <h4>${escapeHtml(source.name)}</h4>
          <p>${escapeHtml(source.scope)}</p>
        </div>
        <div class="case-meta">
          <span class="pill">${escapeHtml(source.confidence)}</span>
          <span class="pill">Fuente original</span>
        </div>
        <p class="source-note">${escapeHtml(source.note)}</p>
        <div class="public-card-actions">
          <a class="secondary-btn source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.action)}</a>
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo información">Reportar información aquí</a>
        </div>
      </article>
    `)
    .join("");
}

function parseCsv(text) {
  const rows = [];
  let cell = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => normalizeText(header).replace(/\s+/g, "_"));
  return rows.slice(1).map((values) =>
    headers.reduce((item, header, index) => {
      item[header] = values[index] || "";
      return item;
    }, {})
  );
}

function csvRowToReport(row) {
  const report = createReport({
    tipo_reporte: row.tipo_reporte || "Busco a un familiar",
    nombre_persona: row.nombre_persona || row.nombre || row.persona || "Nombre por revisar",
    ciudad_sector: row.ciudad_sector || row.ciudad || row.sector || "Zona por confirmar",
    ultimo_contacto_o_lugar_visto: row.ultimo_contacto_o_lugar_visto || row.ultimo_lugar || row.lugar_visto || "Por confirmar",
    edad_aproximada: row.edad_aproximada || row.edad || "Por confirmar",
    descripcion: row.descripcion || row.resumen || "Importado desde CSV para revisión manual.",
    estado_general: row.estado_general || "Información por confirmar",
    nombre_reportante: row.nombre_reportante || "Importación CSV",
    whatsapp_reportante: row.whatsapp_reportante || "",
    relacion_con_persona: row.relacion_con_persona || "Fuente pública/importación manual",
    consentimiento_datos: true,
    declaracion_buena_fe: true,
  });

  return {
    ...report,
    source_type: row.source_type || row.fuente || "CSV manual",
    source_url: row.source_url || row.fuente_url || "",
    photo_url: row.photo_url || row.foto_url || "",
  };
}

function renderCsvPreview(rows) {
  csvPreviewRows = rows;
  csvImportButton.classList.toggle("hidden", rows.length === 0);
  csvImportStatus.textContent = rows.length
    ? `${rows.length} fila(s) listas para importar como pending_review.`
    : "No se encontraron filas válidas.";

  if (!rows.length) {
    csvPreview.innerHTML = "";
    return;
  }

  csvPreview.innerHTML = `
    <table>
      <thead>
        <tr><th>Persona</th><th>Ciudad/sector</th><th>Edad</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${rows.slice(0, 12).map((row) => `
          <tr>
            <td>${escapeHtml(row.nombre_persona || row.nombre || row.persona || "Por revisar")}</td>
            <td>${escapeHtml(row.ciudad_sector || row.ciudad || row.sector || "Por confirmar")}</td>
            <td>${escapeHtml(row.edad_aproximada || row.edad || "Por confirmar")}</td>
            <td>pending_review</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function saveCorrectionRequest(request) {
  const payload = {
    created_at: new Date().toISOString(),
    status: "pending_review",
    ...request,
  };

  if (supabaseClient) {
    const { error } = await supabaseClient.from("correction_requests").insert(payload);
    if (!error) return;
  }

  const existing = JSON.parse(localStorage.getItem("conecta_familia_corrections") || "[]");
  existing.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...payload });
  localStorage.setItem("conecta_familia_corrections", JSON.stringify(existing));
}

async function loadCorrectionRequests() {
  if (!supabaseClient) {
    return JSON.parse(localStorage.getItem("conecta_familia_corrections") || "[]");
  }

  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabaseClient
    .from("correction_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

function renderCorrectionRequests(requests) {
  if (!correctionRequestsList) return;

  if (!requests.length) {
    correctionRequestsList.innerHTML = '<div class="empty-state">No hay solicitudes de corrección o retiro pendientes.</div>';
    return;
  }

  correctionRequestsList.innerHTML = `
    <div class="section-heading compact-heading">
      <p class="eyebrow">Correcciones y retiro</p>
      <h3>Solicitudes pendientes de revisión</h3>
    </div>
    ${requests.map((request) => `
      <article class="case-card status-${escapeHtml(request.status)}" data-correction-id="${escapeHtml(request.id)}">
        <div>
          <h3>${escapeHtml(request.case_name)}</h3>
          <div class="case-meta">
            <span class="pill status-pill">${escapeHtml(statusLabel(request.status))}</span>
            <span class="pill">${escapeHtml(correctionTypeLabel(request.request_type))}</span>
          </div>
          <p class="case-date">Creado: ${escapeHtml(formatDate(request.created_at))}</p>
          <dl>
            <dt>Descripción</dt>
            <dd>${escapeHtml(request.detail)}</dd>
            ${request.source_url ? `<dt>Fuente</dt><dd><a href="${escapeHtml(request.source_url)}" target="_blank" rel="noopener">Abrir fuente</a></dd>` : ""}
            <dt>Solicitante</dt>
            <dd>${escapeHtml(request.requester_name)} (${escapeHtml(request.relationship || "Relación no indicada")})</dd>
            <dt>WhatsApp</dt>
            <dd>[privado - no publicar]</dd>
          </dl>
        </div>
        <div class="case-controls">
          <label>
            Estado de revisión
            <select class="correction-status-select" data-id="${escapeHtml(request.id)}">
              ${statusOptions.map((status) => `<option value="${status}" ${status === request.status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
            </select>
          </label>
        </div>
      </article>
    `).join("")}
  `;
}

function correctionTypeLabel(type) {
  const labels = {
    dato_incorrecto: "Dato incorrecto",
    persona_localizada: "Persona localizada",
    duplicado: "Posible duplicado",
    retirar_informacion: "Retirar información",
    informacion_falsa: "Información falsa",
  };
  return labels[type] || type || "Solicitud";
}

async function getSession() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

async function loadReports() {
  if (!supabaseClient) return loadLocalReports();

  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    adminStatus.textContent = "No se pudieron cargar los reportes. Intenta actualizar la bandeja.";
    return [];
  }

  return data || [];
}

async function saveReport(report) {
  if (!supabaseClient) {
    const reports = loadLocalReports();
    reports.unshift(report);
    saveLocalReports(reports);
    return;
  }

  const { error } = await supabaseClient.from("reports").insert(reportForSupabase(report));
  if (error) throw error;
}

function filterReports(reports) {
  const term = normalizeText(adminSearchTerm);
  return reports.filter((report) => {
    const statusMatches = adminFilterStatus === "all" || report.status === adminFilterStatus;
    const searchable = normalizeText([
      report.nombre_persona,
      report.ciudad_sector,
      report.descripcion,
      report.nombre_reportante,
      report.relacion_con_persona,
      report.estado_general,
    ].join(" "));
    return statusMatches && (!term || searchable.includes(term));
  });
}

function renderAdminStats(reports) {
  const stats = {
    total: reports.length,
    pending: reports.filter((report) => report.status === "pending_review").length,
    urgent: reports.filter((report) => report.status === "urgent").length,
    active: reports.filter((report) => report.status === "active_search").length,
    published: reports.filter((report) => report.published).length,
  };

  adminStats.innerHTML = `
    <div><strong>${stats.total}</strong><span>Total</span></div>
    <div><strong>${stats.pending}</strong><span>Pendientes</span></div>
    <div><strong>${stats.urgent}</strong><span>Urgentes</span></div>
    <div><strong>${stats.active}</strong><span>Activos</span></div>
    <div><strong>${stats.published}</strong><span>Publicados</span></div>
  `;
}

async function renderReports() {
  const reports = await loadReports();
  const correctionRequests = await loadCorrectionRequests();
  const session = await getSession();

  adminLoginForm.classList.toggle("hidden", !supabaseClient || Boolean(session));
  adminLogout.classList.toggle("hidden", !supabaseClient || !session);
  clearReports.classList.toggle("hidden", Boolean(supabaseClient));

  if (supabaseClient && !session) {
    adminStats.innerHTML = "";
    adminStatus.textContent = "Bandeja privada protegida. Entra con correo y contraseña autorizados para revisar reportes.";
    if (correctionRequestsList) correctionRequestsList.innerHTML = "";
    casesList.innerHTML = '<div class="empty-state">Solo personas autorizadas pueden ver esta bandeja privada.</div>';
    return;
  }

  renderAdminStats(reports);
  renderCorrectionRequests(correctionRequests);

  if (!reports.length) {
    adminStatus.textContent = supabaseClient
      ? "Bandeja privada lista. Todo reporte nuevo entrará como pendiente de revisión y no se publicará automáticamente."
      : "Bandeja de respaldo disponible en este equipo. Úsala solo para revisión temporal.";
    casesList.innerHTML = '<div class="empty-state">No hay reportes pendientes en la bandeja.</div>';
    return;
  }

  const filteredReports = filterReports(reports);
  adminStatus.textContent = supabaseClient
    ? `${filteredReports.length} de ${reports.length} reporte(s) en la bandeja privada. Publica solo después de escribir un resumen seguro.`
    : `${filteredReports.length} de ${reports.length} reporte(s) en revisión temporal desde este equipo.`;

  if (!filteredReports.length) {
    casesList.innerHTML = '<div class="empty-state">No hay reportes que coincidan con el filtro o búsqueda.</div>';
    return;
  }

  casesList.innerHTML = filteredReports.map(renderCaseCard).join("");
}

async function loadPublicCases() {
  if (!supabaseClient) {
    const localCases = loadLocalReports()
      .filter((report) => report.published)
      .map((report) => ({
        id: report.id,
        created_at: report.created_at,
        updated_at: report.updated_at,
        status: report.status,
        public_nombre: report.public_nombre || report.nombre_persona,
        public_ciudad_sector: report.public_ciudad_sector || report.ciudad_sector,
        public_edad_aproximada: report.public_edad_aproximada || report.edad_aproximada,
        public_resumen: report.public_resumen,
        source_type: "Reporte revisado por el equipo",
      }));
    return localCases;
  }

  const { data, error } = await supabaseClient
    .from("public_cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    publicCasesList.innerHTML = '<div class="empty-state">No se pudo cargar la vista pública segura.</div>';
    return [];
  }

  const safeCases = (data || []).map((item) => ({
    ...item,
    source_url: item.public_source_url,
    photo_url: item.public_photo_url,
    source_type: "Reporte revisado por el equipo",
  }));
  return safeCases;
}

async function renderPublicCases() {
  const cases = await loadPublicCases();
  const filteredCases = filterPublicCases(cases);
  const visibleCases = filteredCases.slice(0, publicVisibleCount);

  if (!cases.length) {
    publicStats.textContent = "Sin casos publicados";
    publicCasesList.innerHTML = `
      <div class="empty-state">
        Aún no hay casos aprobados dentro de Conecta Familia Venezuela.
        Usa la fuente externa prioritaria para buscar reportes ya publicados y vuelve aquí si tienes información.
        <div class="public-card-actions">
          <a class="secondary-btn" href="https://buscardesaparecidos.com/buscar" target="_blank" rel="noopener">Buscar reportes externos</a>
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo información">Reportar información aquí</a>
        </div>
      </div>
    `;
    publicShowMore.classList.add("hidden");
    return;
  }

  publicStats.textContent = `${filteredCases.length} de ${cases.length} caso(s)`;

  if (!filteredCases.length) {
    publicCasesList.innerHTML = '<div class="empty-state">No hay casos publicados que coincidan con la búsqueda.</div>';
    publicShowMore.classList.add("hidden");
    return;
  }

  publicShowMore.classList.toggle("hidden", visibleCases.length >= filteredCases.length);
  publicShowMore.textContent = `Ver más casos (${visibleCases.length}/${filteredCases.length})`;

  publicCasesList.innerHTML = visibleCases
    .map((item) => `
      <article class="public-case-card status-${escapeHtml(item.status)}">
        <div class="public-case-top">
          ${item.photo_url
            ? `<img class="public-photo" src="${escapeHtml(item.photo_url)}" alt="Foto pública de referencia de ${escapeHtml(item.public_nombre)}" loading="lazy" referrerpolicy="no-referrer" />`
            : `<div class="public-avatar" aria-hidden="true">${escapeHtml(String(item.public_nombre || "?").trim().charAt(0) || "?")}</div>`}
          <div>
            <h3>${escapeHtml(item.public_nombre)}</h3>
            <p class="case-date">Actualizado: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</p>
          </div>
        </div>
        <div class="case-meta">
          <span class="pill status-pill">${escapeHtml(statusLabel(item.status))}</span>
          ${item.source_type ? `<span class="pill source-pill">${escapeHtml(item.source_type)}</span>` : ""}
          ${item.public_ciudad_sector ? `<span class="pill">${escapeHtml(item.public_ciudad_sector)}</span>` : ""}
          ${item.public_edad_aproximada ? `<span class="pill">${escapeHtml(item.public_edad_aproximada)} años aprox.</span>` : ""}
        </div>
        <p>${escapeHtml(item.public_resumen)}</p>
        <div class="public-card-actions">
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo información">Tengo información</a>
          ${item.source_url ? `<a class="secondary-btn source-link" href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener">Ver fuente original</a>` : ""}
        </div>
      </article>
    `)
    .join("");
}

function renderCaseCard(report) {
  const options = statusOptions
    .map((status) => `<option value="${status}" ${status === report.status ? "selected" : ""}>${statusLabel(status)}</option>`)
    .join("");

  return `
    <article class="case-card status-${escapeHtml(report.status)} ${report.published ? "is-published" : ""}" data-id="${escapeHtml(report.id)}">
      <div>
        <h3>${escapeHtml(report.nombre_persona)}</h3>
        <div class="case-meta">
          <span class="pill status-pill">${escapeHtml(statusLabel(report.status))}</span>
          <span class="pill">${report.published ? "Publicado" : "Privado"}</span>
          <span class="pill">${escapeHtml(report.tipo_reporte)}</span>
        </div>
        <p class="case-date">Creado: ${escapeHtml(formatDate(report.created_at))}${report.updated_at ? ` · Actualizado: ${escapeHtml(formatDate(report.updated_at))}` : ""}</p>
        <dl>
          <dt>Ciudad/sector</dt>
          <dd>${escapeHtml(report.ciudad_sector)}</dd>
          <dt>Último contacto</dt>
          <dd>${escapeHtml(report.ultimo_contacto_o_lugar_visto)}</dd>
          <dt>Edad aproximada</dt>
          <dd>${escapeHtml(report.edad_aproximada)}</dd>
          <dt>Estado general</dt>
          <dd>${escapeHtml(report.estado_general)}</dd>
          <dt>Descripción</dt>
          <dd>${escapeHtml(report.descripcion)}</dd>
          <dt>Reportante</dt>
          <dd>${escapeHtml(report.nombre_reportante)} (${escapeHtml(report.relacion_con_persona)})</dd>
          <dt>WhatsApp</dt>
          <dd>[privado - no publicar]</dd>
        </dl>
      </div>
      <div class="case-controls">
        <label>
          Estado del caso
          <select class="status-select" data-id="${escapeHtml(report.id)}">${options}</select>
        </label>
        <label>
          Resumen público seguro
          <textarea class="public-summary" data-id="${escapeHtml(report.id)}" rows="4" placeholder="Obligatorio antes de publicar. No incluyas teléfonos, cédulas, direcciones exactas ni datos médicos.">${escapeHtml(report.public_resumen || "")}</textarea>
        </label>
        <button class="secondary-btn publish-case" type="button" data-id="${escapeHtml(report.id)}">Publicar versión segura</button>
        <button class="secondary-btn unpublish-case" type="button" data-id="${escapeHtml(report.id)}">Ocultar público</button>
        <button class="secondary-btn duplicate-case" type="button" data-id="${escapeHtml(report.id)}">Marcar posible duplicado</button>
        <button class="secondary-btn copy-summary" type="button" data-id="${escapeHtml(report.id)}">Copiar resumen seguro</button>
      </div>
    </article>
  `;
}

async function updateReport(id, patch) {
  if (!supabaseClient) {
    const reports = loadLocalReports().map((report) =>
      report.id === id ? { ...report, ...patch, updated_at: new Date().toISOString() } : report
    );
    saveLocalReports(reports);
    await renderReports();
    await renderPublicCases();
    return;
  }

  const { error } = await supabaseClient.from("reports").update(patch).eq("id", id);
  if (error) {
    adminStatus.textContent = "No se pudo guardar el cambio. Revisa la conexión e intenta de nuevo.";
    return;
  }

  await renderReports();
  await renderPublicCases();
}

function findReport(id) {
  return loadLocalReports().find((item) => item.id === id);
}

async function findReportAsync(id) {
  if (!supabaseClient) return findReport(id);
  const { data, error } = await supabaseClient.from("reports").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

function safeSummary(report) {
  return [
    `Caso: ${report.nombre_persona}`,
    `Estado: ${statusLabel(report.status)}`,
    `Ciudad/sector: ${report.ciudad_sector}`,
    `Último contacto o lugar visto: ${report.ultimo_contacto_o_lugar_visto}`,
    `Edad aproximada: ${report.edad_aproximada}`,
    `Estado general: ${report.estado_general}`,
    `Descripción: ${report.descripcion}`,
    "Contacto del reportante: privado, no publicar.",
  ].join("\n");
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    reportForm.tipo_reporte.value = button.dataset.action;
    document.querySelector("#reporte").scrollIntoView({ behavior: "smooth", block: "start" });
    formStatus.textContent = `Tipo seleccionado: ${button.dataset.action}.`;
    updateWhatsAppLink();
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-action-link]");
  if (!link) return;
  reportForm.tipo_reporte.value = link.dataset.actionLink;
  document.querySelector("#reporte").scrollIntoView({ behavior: "smooth", block: "start" });
  formStatus.textContent = `Tipo seleccionado: ${link.dataset.actionLink}.`;
  updateWhatsAppLink();
});

reportForm.addEventListener("input", updateWhatsAppLink);
reportForm.addEventListener("change", updateWhatsAppLink);

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!reportForm.checkValidity()) {
    reportForm.reportValidity();
    return;
  }

  const report = createReport(getFormData());

  try {
    await saveReport(report);
    reportForm.reset();
    reportForm.tipo_reporte.value = "Busco a un familiar";
    formStatus.textContent = supabaseClient
      ? "Reporte enviado de forma privada con estado pendiente de revisión."
      : "Reporte guardado como borrador privado en este equipo.";
    updateWhatsAppLink();
    await renderReports();
    await renderPublicCases();
  } catch (error) {
    formStatus.textContent = "No se pudo guardar el reporte. Revisa la conexión e intenta de nuevo.";
  }
});

adminStatusFilter.addEventListener("change", async (event) => {
  adminFilterStatus = event.target.value;
  await renderReports();
});

adminSearch.addEventListener("input", async (event) => {
  adminSearchTerm = event.target.value;
  await renderReports();
});

publicSearch.addEventListener("input", async (event) => {
  publicSearchTerm = event.target.value;
  publicVisibleCount = 24;
  await renderPublicCases();
});

publicFilters.forEach((button) => {
  button.addEventListener("click", async () => {
    publicFilterStatus = button.dataset.publicStatus;
    publicVisibleCount = 24;
    publicFilters.forEach((item) => item.classList.toggle("is-active", item === button));
    await renderPublicCases();
  });
});

publicShowMore.addEventListener("click", async () => {
  publicVisibleCount += 24;
  await renderPublicCases();
});

document.querySelectorAll("[data-route-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToRoute(new URL(link.href).pathname);
  });
});

window.addEventListener("popstate", routeFromCurrentUrl);

centerSearch.addEventListener("input", (event) => {
  centerSearchTerm = event.target.value;
  renderCenters();
});

centerCountryFilter.addEventListener("change", (event) => {
  centerFilterCountry = event.target.value;
  renderCenters();
});

centerTypeFilter.addEventListener("change", (event) => {
  centerFilterType = event.target.value;
  renderCenters();
});

centerStatusFilter.addEventListener("change", (event) => {
  centerFilterStatus = event.target.value;
  renderCenters();
});

casesList.addEventListener("change", async (event) => {
  if (event.target.matches(".status-select")) {
    await updateReport(event.target.dataset.id, { status: event.target.value });
  }
});

casesList.addEventListener("click", async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;

  if (event.target.matches(".copy-summary")) {
    const report = await findReportAsync(id);
    if (!report) return;

    await navigator.clipboard.writeText(safeSummary(report));
    event.target.textContent = "Resumen copiado";
    setTimeout(() => {
      event.target.textContent = "Copiar resumen seguro";
    }, 1600);
  }

  if (event.target.matches(".publish-case")) {
    const card = event.target.closest(".case-card");
    const summary = card.querySelector(".public-summary").value.trim();
    const report = await findReportAsync(id);
    if (!report) return;

    if (!summary) {
      adminStatus.textContent = "Escribe un resumen público seguro antes de publicar.";
      return;
    }

    await updateReport(id, {
      published: true,
      public_nombre: report.nombre_persona,
      public_ciudad_sector: report.ciudad_sector,
      public_edad_aproximada: report.edad_aproximada,
      public_resumen: summary,
      reviewed_at: new Date().toISOString(),
    });
  }

  if (event.target.matches(".unpublish-case")) {
    await updateReport(id, { published: false });
  }

  if (event.target.matches(".duplicate-case")) {
    const duplicateOf = prompt("ID o nombre del caso relacionado, si lo conoces:");
    await updateReport(id, {
      status: "possible_match",
      public_resumen: duplicateOf
        ? `Posible duplicado o coincidencia con: ${duplicateOf}. Pendiente de revisión.`
        : "Posible duplicado o coincidencia. Pendiente de revisión.",
    });
  }
});

if (correctionRequestsList) {
  correctionRequestsList.addEventListener("change", async (event) => {
    if (!event.target.matches(".correction-status-select")) return;
    const id = event.target.dataset.id;
    const status = event.target.value;

    if (!supabaseClient) {
      const requests = JSON.parse(localStorage.getItem("conecta_familia_corrections") || "[]").map((request) =>
        request.id === id ? { ...request, status } : request
      );
      localStorage.setItem("conecta_familia_corrections", JSON.stringify(requests));
      renderCorrectionRequests(requests);
      return;
    }

    const { error } = await supabaseClient.from("correction_requests").update({ status }).eq("id", id);
    adminStatus.textContent = error
      ? "No se pudo actualizar la solicitud de corrección."
      : "Solicitud de corrección actualizada.";
    await renderReports();
  });
}

csvFileInput.addEventListener("change", async () => {
  const file = csvFileInput.files && csvFileInput.files[0];
  if (!file) return;
  csvTextInput.value = await file.text();
  csvImportStatus.textContent = "Archivo cargado. Revisa la previsualización antes de importar.";
});

csvPreviewButton.addEventListener("click", () => {
  renderCsvPreview(parseCsv(csvTextInput.value));
});

csvImportButton.addEventListener("click", async () => {
  if (!csvPreviewRows.length) return;
  let imported = 0;
  for (const row of csvPreviewRows) {
    await saveReport(csvRowToReport(row));
    imported += 1;
  }
  csvImportStatus.textContent = `${imported} reporte(s) importados como privados y pending_review.`;
  csvPreviewRows = [];
  csvPreview.innerHTML = "";
  csvImportButton.classList.add("hidden");
  csvTextInput.value = "";
  await renderReports();
});

correctionRequestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!correctionRequestForm.checkValidity()) {
    correctionRequestForm.reportValidity();
    return;
  }

  await saveCorrectionRequest({
    case_name: correctionRequestForm.case_name.value.trim(),
    request_type: correctionRequestForm.request_type.value,
    detail: correctionRequestForm.description.value.trim(),
    source_url: correctionRequestForm.source_url.value.trim(),
    requester_name: correctionRequestForm.requester_name.value.trim(),
    requester_contact_private: correctionRequestForm.requester_contact.value.trim(),
    relationship: correctionRequestForm.relationship.value.trim(),
    consent: correctionRequestForm.consent.checked,
    good_faith: correctionRequestForm.good_faith.checked,
  });
  correctionStatus.textContent = "Solicitud enviada para revisión del equipo.";
  correctionRequestForm.reset();
});

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    adminStatus.textContent = "La bandeja privada no está disponible en este momento. Intenta de nuevo más tarde.";
    return;
  }

  const email = adminEmail.value.trim();
  const password = adminPassword.value;
  if (!email || !password) {
    adminStatus.textContent = "Escribe el correo y la contraseña del panel admin.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  adminStatus.textContent = error
    ? "No se pudo iniciar sesión. Revisa el correo, la contraseña o solicita autorización al equipo."
    : "Sesión iniciada. Si este usuario está autorizado, verá la bandeja privada.";
  if (!error) {
    adminPassword.value = "";
    await renderReports();
  }
});

adminLogout.addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  await renderReports();
  await renderPublicCases();
});

exportReports.addEventListener("click", async () => {
  const reports = await loadReports();
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "conecta-familia-venezuela-reportes-privados.json";
  link.click();
  URL.revokeObjectURL(url);
});

clearReports.addEventListener("click", async () => {
  const confirmed = confirm("¿Vaciar los borradores guardados en este equipo?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  await renderReports();
  await renderPublicCases();
});

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(() => {
    renderReports();
    renderPublicCases();
  });
}

updateWhatsAppLink();
renderReports();
renderPublicCases();
renderPublicSources();
loadAidCenters();
routeFromCurrentUrl();

