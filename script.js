const STORAGE_KEY = "conecta_familia_reports";
const HOSPITAL_STORAGE_KEY = "conecta_familia_hospital_admissions";
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
  pending_review: "Pendiente de revisi?n",
  urgent: "Urgente",
  active_search: "B?squeda activa",
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
    scope: "Directorio amplio con reportes p?blicos de personas buscadas y localizadas",
    url: "https://buscardesaparecidos.com/buscar",
    action: "Buscar en la fuente original",
    note: "Fuente externa prioritaria. Usa la b?squeda original y reporta aqu? cualquier pista ?til para revisi?n humana.",
    featured: true,
  },
  {
    name: "Venezuela Te Busca",
    type: "Plataforma ciudadana",
    confidence: "Pendiente de permiso",
    scope: "Fuente externa con reportes p?blicos de personas buscadas y localizadas",
    url: "https://venezuelatebusca.com/",
    action: "Buscar en la fuente original",
    note: "Se enlaza como fuente externa; cualquier dato que llegue a Conecta Familia Venezuela debe pasar por revisi?n humana.",
  },
  {
    name: "CICR - Restablecimiento de contacto familiar",
    type: "Organismo humanitario",
    confidence: "Oficial",
    scope: "B?squeda y reconexi?n familiar internacional",
    url: "https://www.icrc.org/en/what-we-do/reconnecting-families",
    action: "Abrir canal humanitario",
    note: "Fuente recomendada para familias separadas por desastres, violencia, migraci?n o emergencias.",
  },
  {
    name: "R4V - Plataforma Regional Venezuela",
    type: "Coordinaci?n humanitaria",
    confidence: "Alta",
    scope: "Informaci?n regional sobre personas refugiadas y migrantes de Venezuela",
    url: "https://www.r4v.info/",
    action: "Abrir plataforma",
    note: "?til para ubicar reportes, organizaciones y servicios, sin copiar datos personales.",
  },
  {
    name: "ACNUR Help",
    type: "Canal oficial de orientaci?n",
    confidence: "Oficial",
    scope: "Ayuda para personas refugiadas, migrantes y solicitantes de asilo",
    url: "https://help.unhcr.org/",
    action: "Abrir ACNUR Help",
    note: "Usar para orientaci?n territorial y rutas de ayuda en pa?ses de di?spora.",
  },
  {
    name: "ReliefWeb Venezuela",
    type: "Repositorio humanitario",
    confidence: "Alta",
    scope: "Reportes, mapas y actualizaciones humanitarias sobre Venezuela",
    url: "https://reliefweb.int/country/ven",
    action: "Abrir ReliefWeb",
    note: "Fuente ?til para contexto humanitario y documentos, no para datos personales de reportantes.",
  },
];

const externalPublicCases = [];

const supportCenters = [
  {
    name: "911 / VEN-911",
    city: "Venezuela",
    type: "Emergencia inmediata",
    description: "L?nea inicial para personas atrapadas, heridas o en peligro inmediato.",
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
    type: "Ni?ez y protecci?n",
    description: "Canal institucional para informaci?n humanitaria y protecci?n de ni?ez.",
    lat: 10.4806,
    lng: -66.9036,
    url: "https://www.unicef.org/venezuela/",
  },
  {
    name: "Santa Tinta / Tattoo Keibyn Pab?n",
    city: "Medell?n",
    type: "Punto solidario comunitario",
    description: "Recepci?n comunitaria de mercado, alimentos no perecederos y ayuda humanitaria.",
    lat: 6.2068,
    lng: -75.5660,
    url: "https://www.google.com/maps/place/TATTOO+KEIBYN+PAB%C3%93N+(poblado)/@6.2067756,-75.5659681,17z/",
    image: "/assets/santa-tinta-punto-solidario.jpg",
  },
  {
    name: "Cruz Roja Colombiana",
    city: "Colombia",
    type: "Di?spora y ayuda humanitaria",
    description: "Canales institucionales para orientaci?n, emergencias y donaciones.",
    lat: 4.7110,
    lng: -74.0721,
    url: "https://www.cruzrojacolombiana.org/",
  },
  {
    name: "Cruz Roja Bogot?",
    city: "Bogot?",
    type: "Migraci?n y asuntos humanitarios",
    description: "Seccional con servicios humanitarios y orientaci?n territorial.",
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
    city: "M?xico",
    type: "Socorros y migraci?n",
    description: "Canales institucionales de delegaciones, socorros y programas de migraci?n.",
    lat: 19.4326,
    lng: -99.1332,
    url: "https://www.cruzrojamexicana.org.mx/",
  },
];

const ROUTES = {
  "/": "inicio",
  "/personas": "personas",
  "/hospitales": "hospitales",
  "/centros": "centros",
  "/admin": "admin",
  "/admin/importar-hospitales": "admin-importar-hospitales",
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
const hospitalSearch = document.querySelector("#hospitalSearch");
const hospitalFilter = document.querySelector("#hospitalFilter");
const hospitalStatusFilter = document.querySelector("#hospitalStatusFilter");
const hospitalStats = document.querySelector("#hospitalStats");
const hospitalList = document.querySelector("#hospitalList");
const hospitalSourceUrl = document.querySelector("#hospitalSourceUrl");
const hospitalFileInput = document.querySelector("#hospitalFileInput");
const hospitalCsvText = document.querySelector("#hospitalCsvText");
const hospitalLoadDrive = document.querySelector("#hospitalLoadDrive");
const hospitalPreviewButton = document.querySelector("#hospitalPreviewButton");
const hospitalImportButton = document.querySelector("#hospitalImportButton");
const hospitalApproveSafeButton = document.querySelector("#hospitalApproveSafeButton");
const hospitalImportStatus = document.querySelector("#hospitalImportStatus");
const hospitalImportPreview = document.querySelector("#hospitalImportPreview");
const hospitalAdminList = document.querySelector("#hospitalAdminList");
const adminHospitalFilter = document.querySelector("#adminHospitalFilter");
const adminHospitalStatusFilter = document.querySelector("#adminHospitalStatusFilter");
const hospitalMapSelects = {
  nombre_persona: document.querySelector("#mapNombre"),
  hospital: document.querySelector("#mapHospital"),
  ciudad_estado: document.querySelector("#mapCiudad"),
  edad_aproximada: document.querySelector("#mapEdad"),
  fecha_ingreso: document.querySelector("#mapFechaIngreso"),
  fecha_publicacion: document.querySelector("#mapFechaPublicacion"),
  estado_publico: document.querySelector("#mapEstadoPublico"),
  notas_publicas: document.querySelector("#mapNotasPublicas"),
};

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
let hospitalSearchTerm = "";
let hospitalFilterValue = "all";
let hospitalStatusFilterValue = "all";
let adminHospitalFilterValue = "all";
let adminHospitalStatusFilterValue = "all";
let hospitalPreviewRows = [];

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
    `?ltimo contacto o lugar visto: ${data.ultimo_contacto_o_lugar_visto || ""}`,
    `Edad aproximada: ${data.edad_aproximada || ""}`,
    `Estado general: ${data.estado_general || ""}`,
    `Descripci?n: ${data.descripcion || ""}`,
    `Reportante: ${data.nombre_reportante || ""}`,
    `Relaci?n: ${data.relacion_con_persona || ""}`,
    "Confirmo que esta informaci?n se env?a de buena fe. No reemplaza a autoridades ni organismos de rescate.",
  ].join("\n");
}

function updateWhatsAppLink() {
  const data = getFormData();
  const message = encodeURIComponent(createWhatsAppMessage(data));
  const number = sanitizePhone(config.whatsappNumber || data.whatsapp_reportante);

  if (config.whatsappGroupLink) {
    whatsappButton.href = config.whatsappGroupLink;
    whatsappButton.textContent = "Abrir grupo de WhatsApp";
    whatsappButton.title = "El reporte se guarda primero; el grupo sirve para coordinaci?n.";
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

function normalizeRoutePath(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function navigateToRoute(path, replace = false) {
  const requestedPath = normalizeRoutePath(path);
  const normalizedPath = ROUTES[requestedPath] ? requestedPath : "/";
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
  const requestedPath = normalizeRoutePath(path);
  const normalizedPath = ROUTES[requestedPath] ? requestedPath : "/";
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
  const path = normalizeRoutePath(window.location.pathname);
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
  centerStats.textContent = `${centers.length} centro(s) ? ${countries} pa?s(es) ? ${mappedCount} con punto en mapa`;
  renderCentersMap(centers);

  const grouped = centers.reduce((groups, center) => {
    const country = center.country || "Sin pa?s";
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
    punto_medico: "Punto m?dico",
    alimento: "Alimento",
    agua: "Agua",
    medicamentos: "Medicamentos",
    ong: "ONG",
    iglesia: "Iglesia",
    informacion: "Informaci?n",
  };
  return labels[type] || type || "Informaci?n";
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
  const location = [center.city, center.state].filter(Boolean).join(" ? ") || center.country;
  const mapLabel = center.mapApproximate ? "Mapa aproximado por ciudad" : "Punto verificado en mapa";
  return `
    <article class="center-card ${center.status === "pendiente" ? "is-pending" : ""}">
      ${center.image ? `<img class="center-card-image" src="${escapeHtml(center.image)}" alt="${escapeHtml(center.name)} - punto solidario comunitario" loading="lazy">` : ""}
      <div>
        <span class="contact-category">${escapeHtml(typeLabel(center.type))}</span>
        <h4>${escapeHtml(center.name)}</h4>
        <p>${escapeHtml(center.description || center.offer || "Punto de apoyo registrado para verificaci?n comunitaria.")}</p>
      </div>
      <div class="case-meta">
        <span class="pill">${escapeHtml(location)}</span>
        <span class="pill">${escapeHtml(center.status === "verificado" ? "Verificado" : "Pendiente de verificaci?n")}</span>
        <span class="pill">${escapeHtml(center.confidence || "por confirmar")}</span>
        ${hasCoordinates(center) ? `<span class="pill">${escapeHtml(mapLabel)}</span>` : ""}
      </div>
      <dl class="center-details">
        ${center.address ? `<div><dt>Direcci?n general</dt><dd>${escapeHtml(center.address)}</dd></div>` : ""}
        ${center.reference ? `<div><dt>Referencia</dt><dd>${escapeHtml(center.reference)}</dd></div>` : ""}
        ${center.schedule ? `<div><dt>Horario</dt><dd>${escapeHtml(center.schedule)}</dd></div>` : ""}
        ${center.receives ? `<div><dt>Recibe</dt><dd>${escapeHtml(center.receives)}</dd></div>` : ""}
        ${center.offer ? `<div><dt>Ofrece</dt><dd>${escapeHtml(center.offer)}</dd></div>` : ""}
        ${center.phone ? `<div><dt>Tel?fono institucional</dt><dd>${escapeHtml(center.phone)}</dd></div>` : ""}
        ${center.sourceName ? `<div><dt>Fuente</dt><dd>${escapeHtml(center.sourceName)} ? ${escapeHtml(center.verifiedAt || "sin fecha")}</dd></div>` : ""}
      </dl>
      <p class="source-note">${escapeHtml(center.notes || "Verifica siempre en la fuente original antes de movilizar ayuda.")}</p>
      <div class="public-card-actions">
        ${center.sourceUrl ? `<a class="secondary-btn" href="${escapeHtml(center.sourceUrl)}" target="_blank" rel="noopener">Abrir fuente</a>` : ""}
        <a class="secondary-btn" href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener">C?mo llegar</a>
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
            title="${escapeHtml(center.name)} ? ${escapeHtml(center.mapApproximate ? "referencia aproximada" : "punto exacto")}"
          >${index + 1}</a>
        `;
      })
      .join("")}
  `;

  const withoutMap = centers.length - mappedCenters.length;
  if (centerMapNote) {
    centerMapNote.textContent = withoutMap
      ? `${withoutMap} registro(s) no tienen referencia geogr?fica suficiente y aparecen solo en el listado.`
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
    country: row.pais || "Sin pa?s",
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
    country: center.city === "Medell?n" ? "Colombia" : center.city,
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

  centerCountryFilter.innerHTML = `<option value="all">Todos los pa?ses</option>${orderedCountries
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
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo informaci?n">Reportar informaci?n aqu?</a>
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
  const delimiter = text.includes("\t") && !text.includes(",") ? "\t" : ",";

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
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

function loadScriptOnce(src, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window[globalName]));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window[globalName]);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function readHospitalImportFile(file) {
  if (/\.xlsx$/i.test(file.name)) {
    hospitalImportStatus.textContent = "Leyendo Excel. Esto puede tardar unos segundos.";
    const XLSX = await loadScriptOnce("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js", "XLSX");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_csv(firstSheet);
  }
  return file.text();
}

function csvRowToReport(row) {
  const report = createReport({
    tipo_reporte: row.tipo_reporte || "Busco a un familiar",
    nombre_persona: row.nombre_persona || row.nombre || row.persona || "Nombre por revisar",
    ciudad_sector: row.ciudad_sector || row.ciudad || row.sector || "Zona por confirmar",
    ultimo_contacto_o_lugar_visto: row.ultimo_contacto_o_lugar_visto || row.ultimo_lugar || row.lugar_visto || "Por confirmar",
    edad_aproximada: row.edad_aproximada || row.edad || "Por confirmar",
    descripcion: row.descripcion || row.resumen || "Importado desde CSV para revisi?n manual.",
    estado_general: row.estado_general || "Informaci?n por confirmar",
    nombre_reportante: row.nombre_reportante || "Importaci?n CSV",
    whatsapp_reportante: row.whatsapp_reportante || "",
    relacion_con_persona: row.relacion_con_persona || "Fuente p?blica/importaci?n manual",
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

function loadLocalHospitals() {
  try {
    return JSON.parse(localStorage.getItem(HOSPITAL_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalHospitals(records) {
  localStorage.setItem(HOSPITAL_STORAGE_KEY, JSON.stringify(records));
}

function hasSensitiveHospitalData(row) {
  const text = Object.entries(row).map(([key, value]) => `${key} ${value}`).join(" ");
  return /tel[e?]fono|phone|whatsapp|cedula|c[e?]dula|documento|diagn[o?]stico|historia|contacto|reportante|email|correo|@|\+?\d[\d\s().-]{6,}\d/i.test(text);
}

function hospitalDuplicateKey(record) {
  return normalizeText([record.nombre_persona, record.hospital, record.ciudad_estado, record.fecha_ingreso || record.fecha_publicacion].join("|"));
}

function currentHospitalMapping(headers = []) {
  const mapping = {};
  Object.entries(hospitalMapSelects).forEach(([field, select]) => {
    if (select && select.value) mapping[field] = select.value;
  });
  if (!Object.keys(mapping).length) {
    const headerSet = new Set(headers);
    ["nombre_persona", "hospital", "ciudad_estado", "edad_aproximada", "fecha_ingreso", "fecha_publicacion", "estado_publico", "notas_publicas"].forEach((field) => {
      if (headerSet.has(field)) mapping[field] = field;
    });
  }
  return mapping;
}

function fillHospitalMapping(headers) {
  Object.entries(hospitalMapSelects).forEach(([field, select]) => {
    if (!select) return;
    const guesses = {
      nombre_persona: ["nombre_persona", "nombre", "persona", "paciente"],
      hospital: ["hospital", "centro", "centro_salud"],
      ciudad_estado: ["ciudad_estado", "ciudad", "estado", "ubicacion"],
      edad_aproximada: ["edad_aproximada", "edad"],
      fecha_ingreso: ["fecha_ingreso", "ingreso"],
      fecha_publicacion: ["fecha_publicacion", "fecha", "publicacion"],
      estado_publico: ["estado_publico", "estado"],
      notas_publicas: ["notas_publicas", "nota", "observacion", "descripcion"],
    }[field];
    const best = headers.find((header) => guesses.includes(header)) || "";
    select.innerHTML = `<option value="">Sin mapear</option>${headers.map((header) => `<option value="${escapeHtml(header)}"${header === best ? " selected" : ""}>${escapeHtml(header)}</option>`).join("")}`;
  });
}

function normalizeHospitalRows(rows, approveSafe = false) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const mapping = currentHospitalMapping(headers);
  const existingKeys = new Set(loadLocalHospitals().map(hospitalDuplicateKey));
  const batchId = `hospital-${Date.now()}`;
  const seen = new Set();

  return rows.map((row, index) => {
    const get = (field) => row[mapping[field]] || "";
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      import_batch_id: batchId,
      source_url: hospitalSourceUrl?.value.trim() || row.source_url || row.fuente_url || "",
      source_name: row.source_name || row.fuente_nombre || "Fuente hospitalaria p?blica",
      nombre_persona: get("nombre_persona").trim(),
      edad_aproximada: get("edad_aproximada").trim(),
      hospital: get("hospital").trim(),
      ciudad_estado: get("ciudad_estado").trim(),
      fecha_ingreso: get("fecha_ingreso").trim(),
      fecha_publicacion: get("fecha_publicacion").trim(),
      estado_publico: get("estado_publico").trim() || "hospitalizado",
      notas_publicas: get("notas_publicas").trim(),
      estado_revision: approveSafe ? "approved" : "pending_review",
      public_approved: Boolean(approveSafe),
      possible_duplicate: false,
      confirmado_por_familiar: false,
      trasladado: false,
      dado_de_alta_reportado: false,
      retirado_por_solicitud: false,
      sensitive_detected: hasSensitiveHospitalData(row),
      incomplete: false,
      raw_row: row,
    };
    record.incomplete = !record.nombre_persona || !record.hospital;
    const key = hospitalDuplicateKey(record);
    record.possible_duplicate = Boolean(key && (seen.has(key) || existingKeys.has(key)));
    seen.add(key);
    if (record.sensitive_detected || record.incomplete || record.possible_duplicate) {
      record.public_approved = false;
      record.estado_revision = record.possible_duplicate ? "possible_duplicate" : "pending_review";
    }
    return record;
  });
}

async function loadHospitalAdmissions(includePrivate = false) {
  if (!supabaseClient) {
    const records = loadLocalHospitals();
    return includePrivate ? records : records.filter((record) => record.public_approved && !record.retirado_por_solicitud);
  }
  const table = includePrivate ? "hospital_admissions" : "public_hospital_admissions";
  const { data, error } = await supabaseClient.from(table).select("*").order("updated_at", { ascending: false });
  if (error) {
    const records = loadLocalHospitals();
    return includePrivate ? records : records.filter((record) => record.public_approved && !record.retirado_por_solicitud);
  }
  return data || [];
}

function populateHospitalFilters(records) {
  const hospitals = [...new Set(records.map((record) => record.hospital).filter(Boolean))].sort();
  const options = `<option value="all">Todos los hospitales</option>${hospitals.map((hospital) => `<option value="${escapeHtml(hospital)}">${escapeHtml(hospital)}</option>`).join("")}`;
  if (hospitalFilter) hospitalFilter.innerHTML = options;
  if (adminHospitalFilter) adminHospitalFilter.innerHTML = options.replace("Todos los hospitales", "Todos");
}

function filterHospitalRecords(records, isAdmin = false) {
  const term = normalizeText(hospitalSearchTerm);
  const hospitalValue = isAdmin ? adminHospitalFilterValue : hospitalFilterValue;
  const statusValue = isAdmin ? adminHospitalStatusFilterValue : hospitalStatusFilterValue;
  return records.filter((record) => {
    const hospitalMatches = hospitalValue === "all" || record.hospital === hospitalValue;
    const statusMatches = statusValue === "all"
      || record.estado_publico === statusValue
      || (statusValue === "confirmado_por_familiar" && record.confirmado_por_familiar)
      || (statusValue === "trasladado" && record.trasladado)
      || (statusValue === "dado_de_alta_reportado" && record.dado_de_alta_reportado)
      || (statusValue === "approved" && record.public_approved)
      || (statusValue === "possible_duplicate" && record.possible_duplicate)
      || (statusValue === "retirado_por_solicitud" && record.retirado_por_solicitud)
      || record.estado_revision === statusValue;
    const searchable = normalizeText([record.nombre_persona, record.hospital, record.ciudad_estado, record.notas_publicas].join(" "));
    return hospitalMatches && statusMatches && (!term || searchable.includes(term));
  });
}

async function renderHospitalAdmissions() {
  if (!hospitalList || !hospitalStats) return;
  const records = await loadHospitalAdmissions(false);
  populateHospitalFilters(records);
  const filtered = filterHospitalRecords(records);
  hospitalStats.textContent = `${filtered.length} de ${records.length} registro(s)`;
  if (!filtered.length) {
    hospitalList.innerHTML = '<div class="empty-state">A?n no hay registros hospitalarios aprobados o no coinciden con la b?squeda.</div>';
    return;
  }
  const grouped = filtered.reduce((groups, record) => {
    const hospital = record.hospital || "Hospital por confirmar";
    groups[hospital] = groups[hospital] || [];
    groups[hospital].push(record);
    return groups;
  }, {});
  hospitalList.innerHTML = Object.entries(grouped).map(([hospital, items]) => `
    <section class="hospital-group">
      <div class="center-country-heading"><h3>${escapeHtml(hospital)}</h3><span>${items.length} registro(s)</span></div>
      ${items.map(renderHospitalCard).join("")}
    </section>
  `).join("");
}

function renderHospitalCard(record) {
  return `
    <article class="public-case-card hospital-card">
      <div class="public-case-top">
        <div class="public-avatar" aria-hidden="true">${escapeHtml(String(record.nombre_persona || "?").charAt(0))}</div>
        <div>
          <h3>${escapeHtml(record.nombre_persona)}</h3>
          <p class="case-date">Actualizado: ${escapeHtml(formatDate(record.updated_at || record.created_at))}</p>
        </div>
      </div>
      <div class="case-meta">
        <span class="pill status-pill">${escapeHtml(record.estado_publico || "Hospitalizado")}</span>
        ${record.edad_aproximada ? `<span class="pill">${escapeHtml(record.edad_aproximada)} a?os aprox.</span>` : ""}
        ${record.ciudad_estado ? `<span class="pill">${escapeHtml(record.ciudad_estado)}</span>` : ""}
        ${record.confirmado_por_familiar ? '<span class="pill">Confirmado por familiar</span>' : ""}
        ${record.trasladado ? '<span class="pill">Trasladado</span>' : ""}
        ${record.dado_de_alta_reportado ? '<span class="pill">Dado de alta reportado</span>' : ""}
      </div>
      ${record.notas_publicas ? `<p>${escapeHtml(record.notas_publicas)}</p>` : ""}
      <div class="public-card-actions">
        <a class="secondary-btn" href="#reporte" data-action-link="Tengo informaci?n">Tengo informaci?n</a>
        <a class="secondary-btn" href="#correcciones">Correcci?n/retiro</a>
        ${record.source_url ? `<a class="secondary-btn source-link" href="${escapeHtml(record.source_url)}" target="_blank" rel="noopener">Ver fuente original</a>` : ""}
      </div>
    </article>
  `;
}

function renderCsvPreview(rows) {
  csvPreviewRows = rows;
  csvImportButton.classList.toggle("hidden", rows.length === 0);
  csvImportStatus.textContent = rows.length
    ? `${rows.length} fila(s) listas para importar como pending_review.`
    : "No se encontraron filas v?lidas.";

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

function renderHospitalPreview(records) {
  hospitalPreviewRows = records;
  if (!hospitalImportPreview || !hospitalImportStatus) return;
  const counts = {
    total: records.length,
    sensitive: records.filter((record) => record.sensitive_detected).length,
    incomplete: records.filter((record) => record.incomplete).length,
    duplicate: records.filter((record) => record.possible_duplicate).length,
    safe: records.filter((record) => !record.sensitive_detected && !record.incomplete && !record.possible_duplicate).length,
  };
  hospitalImportButton.classList.toggle("hidden", !records.length);
  hospitalApproveSafeButton.classList.toggle("hidden", !counts.safe);
  hospitalImportStatus.textContent = `${counts.total} fila(s). ${counts.safe} segura(s), ${counts.sensitive} con sensibles, ${counts.incomplete} incompleta(s), ${counts.duplicate} posible(s) duplicado(s).`;
  hospitalImportPreview.innerHTML = records.length ? `
    <table>
      <thead><tr><th>Persona</th><th>Hospital</th><th>Estado</th><th>Alertas</th></tr></thead>
      <tbody>
        ${records.slice(0, 30).map((record) => `
          <tr>
            <td>${escapeHtml(record.nombre_persona || "Sin nombre")}</td>
            <td>${escapeHtml(record.hospital || "Sin hospital")}</td>
            <td>${escapeHtml(record.public_approved ? "aprobado" : record.estado_revision)}</td>
            <td>${[
              record.sensitive_detected ? "sensible" : "",
              record.incomplete ? "incompleta" : "",
              record.possible_duplicate ? "posible duplicado" : "",
            ].filter(Boolean).join(", ") || "segura"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";
}

async function saveHospitalRecords(records) {
  if (supabaseClient) {
    const payload = records.map(({ sensitive_detected, incomplete, ...record }) => record);
    const { error } = await supabaseClient.from("hospital_admissions").insert(payload);
    if (!error) return;
    hospitalImportStatus.textContent = "No se pudo guardar en la base. Se guard? una copia temporal en este equipo.";
  }
  const existing = loadLocalHospitals();
  saveLocalHospitals([...records, ...existing]);
}

async function updateHospitalRecord(id, patch) {
  if (supabaseClient) {
    const { error } = await supabaseClient.from("hospital_admissions").update(patch).eq("id", id);
    if (!error) {
      await renderHospitalAdmin();
      await renderHospitalAdmissions();
      return;
    }
  }
  const records = loadLocalHospitals().map((record) => record.id === id ? { ...record, ...patch, updated_at: new Date().toISOString() } : record);
  saveLocalHospitals(records);
  await renderHospitalAdmin();
  await renderHospitalAdmissions();
}

async function rollbackHospitalBatch(batchId) {
  if (!batchId) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from("hospital_admissions").delete().eq("import_batch_id", batchId);
    if (!error) {
      await renderHospitalAdmin();
      await renderHospitalAdmissions();
      return;
    }
  }
  saveLocalHospitals(loadLocalHospitals().filter((record) => record.import_batch_id !== batchId));
  await renderHospitalAdmin();
  await renderHospitalAdmissions();
}

async function renderHospitalAdmin() {
  if (!hospitalAdminList) return;
  const records = await loadHospitalAdmissions(true);
  populateHospitalFilters(records);
  const filtered = filterHospitalRecords(records, true);
  if (!filtered.length) {
    hospitalAdminList.innerHTML = '<div class="empty-state">No hay registros hospitalarios importados.</div>';
    return;
  }
  hospitalAdminList.innerHTML = filtered.map((record) => `
    <article class="case-card ${record.possible_duplicate ? "status-possible_match" : ""}">
      <div>
        <div class="case-header">
          <h3>${escapeHtml(record.nombre_persona || "Sin nombre")}</h3>
          <span class="pill status-pill">${escapeHtml(record.public_approved ? "Publicado" : record.estado_revision)}</span>
        </div>
        <dl>
          <dt>Hospital</dt><dd>${escapeHtml(record.hospital || "Sin hospital")}</dd>
          <dt>Ciudad/estado</dt><dd>${escapeHtml(record.ciudad_estado || "Sin dato")}</dd>
          <dt>Import batch</dt><dd>${escapeHtml(record.import_batch_id || "Sin lote")}</dd>
          <dt>Fuente</dt><dd>${record.source_url ? `<a href="${escapeHtml(record.source_url)}" target="_blank" rel="noopener">Ver fuente original</a>` : "Sin URL"}</dd>
          <dt>Alertas</dt><dd>${[
            record.sensitive_detected ? "sensible detectado" : "",
            record.incomplete ? "fila incompleta" : "",
            record.possible_duplicate ? "posible duplicado" : "",
          ].filter(Boolean).join(", ") || "sin alertas"}</dd>
        </dl>
        <label class="wide">Notas p?blicas
          <textarea class="hospital-public-notes" data-id="${escapeHtml(record.id)}" rows="2">${escapeHtml(record.notas_publicas || "")}</textarea>
        </label>
      </div>
      <div class="case-controls">
        <button class="secondary-btn hospital-approve" data-id="${escapeHtml(record.id)}" type="button">Aprobar publicaci?n</button>
        <button class="secondary-btn hospital-duplicate" data-id="${escapeHtml(record.id)}" type="button">Marcar duplicado</button>
        <button class="secondary-btn hospital-family" data-id="${escapeHtml(record.id)}" type="button">Confirmado por familiar</button>
        <button class="secondary-btn hospital-transferred" data-id="${escapeHtml(record.id)}" type="button">Trasladado</button>
        <button class="secondary-btn hospital-discharged" data-id="${escapeHtml(record.id)}" type="button">Dado de alta reportado</button>
        <button class="danger-btn hospital-withdraw" data-id="${escapeHtml(record.id)}" type="button">Retirar por solicitud</button>
        <button class="danger-btn hospital-rollback" data-batch="${escapeHtml(record.import_batch_id || "")}" type="button">Rollback lote</button>
      </div>
    </article>
  `).join("");
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
    correctionRequestsList.innerHTML = '<div class="empty-state">No hay solicitudes de correcci?n o retiro pendientes.</div>';
    return;
  }

  correctionRequestsList.innerHTML = `
    <div class="section-heading compact-heading">
      <p class="eyebrow">Correcciones y retiro</p>
      <h3>Solicitudes pendientes de revisi?n</h3>
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
            <dt>Descripci?n</dt>
            <dd>${escapeHtml(request.detail)}</dd>
            ${request.source_url ? `<dt>Fuente</dt><dd><a href="${escapeHtml(request.source_url)}" target="_blank" rel="noopener">Abrir fuente</a></dd>` : ""}
            <dt>Solicitante</dt>
            <dd>${escapeHtml(request.requester_name)} (${escapeHtml(request.relationship || "Relaci?n no indicada")})</dd>
            <dt>WhatsApp</dt>
            <dd>[privado - no publicar]</dd>
          </dl>
        </div>
        <div class="case-controls">
          <label>
            Estado de revisi?n
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
    retirar_informacion: "Retirar informaci?n",
    informacion_falsa: "Informaci?n falsa",
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
    adminStatus.textContent = "Bandeja privada protegida. Entra con correo y contrase?a autorizados para revisar reportes.";
    if (correctionRequestsList) correctionRequestsList.innerHTML = "";
    casesList.innerHTML = '<div class="empty-state">Solo personas autorizadas pueden ver esta bandeja privada.</div>';
    return;
  }

  renderAdminStats(reports);
  renderCorrectionRequests(correctionRequests);

  if (!reports.length) {
    adminStatus.textContent = supabaseClient
      ? "Bandeja privada lista. Todo reporte nuevo entrar? como pendiente de revisi?n y no se publicar? autom?ticamente."
      : "Bandeja de respaldo disponible en este equipo. ?sala solo para revisi?n temporal.";
    casesList.innerHTML = '<div class="empty-state">No hay reportes pendientes en la bandeja.</div>';
    return;
  }

  const filteredReports = filterReports(reports);
  adminStatus.textContent = supabaseClient
    ? `${filteredReports.length} de ${reports.length} reporte(s) en la bandeja privada. Publica solo despu?s de escribir un resumen seguro.`
    : `${filteredReports.length} de ${reports.length} reporte(s) en revisi?n temporal desde este equipo.`;

  if (!filteredReports.length) {
    casesList.innerHTML = '<div class="empty-state">No hay reportes que coincidan con el filtro o b?squeda.</div>';
    return;
  }

  casesList.innerHTML = filteredReports.map(renderCaseCard).join("");
}

async function loadPublicCases() {
  const externalCases = await loadAuthorizedExternalCases();

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
    return [...externalCases, ...localCases];
  }

  const { data, error } = await supabaseClient
    .from("public_cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    publicCasesList.innerHTML = '<div class="empty-state">No se pudo cargar la vista p?blica segura.</div>';
    return [];
  }

  const safeCases = (data || []).map((item) => ({
    ...item,
    source_url: item.public_source_url,
    photo_url: item.public_photo_url,
    source_type: "Reporte revisado por el equipo",
  }));
  return [...externalCases, ...safeCases];
}

async function loadAuthorizedExternalCases() {
  try {
    const response = await fetch("/data/external/authorized-missing-cases.json", { cache: "no-store" });
    if (!response.ok) return externalPublicCases;
    const payload = await response.json();
    return (payload.cases || []).map((item) => ({
      ...item,
      created_at: item.updated_at,
      source_type: item.source_type || "Fuente autorizada",
    }));
  } catch (error) {
    console.warn(error);
    return externalPublicCases;
  }
}

async function renderPublicCases() {
  const cases = await loadPublicCases();
  const filteredCases = filterPublicCases(cases);
  const visibleCases = filteredCases.slice(0, publicVisibleCount);

  if (!cases.length) {
    publicStats.textContent = "Sin casos publicados";
    publicCasesList.innerHTML = `
      <div class="empty-state">
        A?n no hay casos aprobados dentro de Conecta Familia Venezuela.
        Usa la fuente externa prioritaria para buscar reportes ya publicados y vuelve aqu? si tienes informaci?n.
        <div class="public-card-actions">
          <a class="secondary-btn" href="https://buscardesaparecidos.com/buscar" target="_blank" rel="noopener">Buscar reportes externos</a>
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo informaci?n">Reportar informaci?n aqu?</a>
        </div>
      </div>
    `;
    publicShowMore.classList.add("hidden");
    return;
  }

  publicStats.textContent = `${filteredCases.length} de ${cases.length} caso(s)`;

  if (!filteredCases.length) {
    publicCasesList.innerHTML = '<div class="empty-state">No hay casos publicados que coincidan con la b?squeda.</div>';
    publicShowMore.classList.add("hidden");
    return;
  }

  publicShowMore.classList.toggle("hidden", visibleCases.length >= filteredCases.length);
  publicShowMore.textContent = `Ver m?s casos (${visibleCases.length}/${filteredCases.length})`;

  publicCasesList.innerHTML = visibleCases
    .map((item) => `
      <article class="public-case-card status-${escapeHtml(item.status)}">
        <div class="public-case-top">
          ${item.photo_url
            ? `<img class="public-photo" src="${escapeHtml(item.photo_url)}" alt="Foto p?blica de referencia de ${escapeHtml(item.public_nombre)}" loading="lazy" referrerpolicy="no-referrer" />`
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
          ${item.public_edad_aproximada ? `<span class="pill">${escapeHtml(item.public_edad_aproximada)} a?os aprox.</span>` : ""}
        </div>
        <p>${escapeHtml(item.public_resumen)}</p>
        <div class="public-card-actions">
          <a class="secondary-btn" href="#reporte" data-action-link="Tengo informaci?n">Tengo informaci?n</a>
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
        <p class="case-date">Creado: ${escapeHtml(formatDate(report.created_at))}${report.updated_at ? ` ? Actualizado: ${escapeHtml(formatDate(report.updated_at))}` : ""}</p>
        <dl>
          <dt>Ciudad/sector</dt>
          <dd>${escapeHtml(report.ciudad_sector)}</dd>
          <dt>?ltimo contacto</dt>
          <dd>${escapeHtml(report.ultimo_contacto_o_lugar_visto)}</dd>
          <dt>Edad aproximada</dt>
          <dd>${escapeHtml(report.edad_aproximada)}</dd>
          <dt>Estado general</dt>
          <dd>${escapeHtml(report.estado_general)}</dd>
          <dt>Descripci?n</dt>
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
          Resumen p?blico seguro
          <textarea class="public-summary" data-id="${escapeHtml(report.id)}" rows="4" placeholder="Obligatorio antes de publicar. No incluyas tel?fonos, c?dulas, direcciones exactas ni datos m?dicos.">${escapeHtml(report.public_resumen || "")}</textarea>
        </label>
        <button class="secondary-btn publish-case" type="button" data-id="${escapeHtml(report.id)}">Publicar versi?n segura</button>
        <button class="secondary-btn unpublish-case" type="button" data-id="${escapeHtml(report.id)}">Ocultar p?blico</button>
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
    adminStatus.textContent = "No se pudo guardar el cambio. Revisa la conexi?n e intenta de nuevo.";
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
    `?ltimo contacto o lugar visto: ${report.ultimo_contacto_o_lugar_visto}`,
    `Edad aproximada: ${report.edad_aproximada}`,
    `Estado general: ${report.estado_general}`,
    `Descripci?n: ${report.descripcion}`,
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
      ? "Reporte enviado de forma privada con estado pendiente de revisi?n."
      : "Reporte guardado como borrador privado en este equipo.";
    updateWhatsAppLink();
    await renderReports();
    await renderPublicCases();
  } catch (error) {
    formStatus.textContent = "No se pudo guardar el reporte. Revisa la conexi?n e intenta de nuevo.";
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

if (hospitalSearch) {
  hospitalSearch.addEventListener("input", async (event) => {
    hospitalSearchTerm = event.target.value;
    await renderHospitalAdmissions();
  });
}

if (hospitalFilter) {
  hospitalFilter.addEventListener("change", async (event) => {
    hospitalFilterValue = event.target.value;
    await renderHospitalAdmissions();
  });
}

if (hospitalStatusFilter) {
  hospitalStatusFilter.addEventListener("change", async (event) => {
    hospitalStatusFilterValue = event.target.value;
    await renderHospitalAdmissions();
  });
}

if (adminHospitalFilter) {
  adminHospitalFilter.addEventListener("change", async (event) => {
    adminHospitalFilterValue = event.target.value;
    await renderHospitalAdmin();
  });
}

if (adminHospitalStatusFilter) {
  adminHospitalStatusFilter.addEventListener("change", async (event) => {
    adminHospitalStatusFilterValue = event.target.value;
    await renderHospitalAdmin();
  });
}

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
      adminStatus.textContent = "Escribe un resumen p?blico seguro antes de publicar.";
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
        ? `Posible duplicado o coincidencia con: ${duplicateOf}. Pendiente de revisi?n.`
        : "Posible duplicado o coincidencia. Pendiente de revisi?n.",
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
      ? "No se pudo actualizar la solicitud de correcci?n."
      : "Solicitud de correcci?n actualizada.";
    await renderReports();
  });
}

csvFileInput.addEventListener("change", async () => {
  const file = csvFileInput.files && csvFileInput.files[0];
  if (!file) return;
  csvTextInput.value = await file.text();
  csvImportStatus.textContent = "Archivo cargado. Revisa la previsualizaci?n antes de importar.";
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

if (hospitalFileInput) {
  hospitalFileInput.addEventListener("change", async () => {
    const file = hospitalFileInput.files && hospitalFileInput.files[0];
    if (!file) return;
    try {
      hospitalCsvText.value = await readHospitalImportFile(file);
      const parsed = parseCsv(hospitalCsvText.value);
      fillHospitalMapping(parsed.length ? Object.keys(parsed[0]) : []);
      hospitalImportStatus.textContent = "Archivo cargado. Revisa el mapeo y previsualiza.";
    } catch {
      hospitalImportStatus.textContent = "No se pudo leer el archivo. Si es Excel, prueba guardarlo como CSV y vuelve a subirlo.";
    }
  });
}

if (hospitalLoadDrive) {
  hospitalLoadDrive.addEventListener("click", async () => {
    if (!hospitalSourceUrl.value.trim()) {
      hospitalImportStatus.textContent = "Pega primero una URL pública de Drive o fuente.";
      return;
    }
    try {
      const response = await fetch(hospitalSourceUrl.value.trim());
      const text = await response.text();
      hospitalCsvText.value = text;
      const parsed = parseCsv(text);
      fillHospitalMapping(parsed.length ? Object.keys(parsed[0]) : []);
      hospitalImportStatus.textContent = parsed.length
        ? "URL leída. Revisa el mapeo y previsualiza."
        : "La URL cargó, pero no parece CSV directo. Descarga el archivo desde Drive y súbelo como CSV.";
    } catch {
      hospitalImportStatus.textContent = "No se pudo leer la URL desde el navegador. Descarga el archivo y súbelo como CSV.";
    }
  });
}
if (hospitalPreviewButton) {
  hospitalPreviewButton.addEventListener("click", () => {
    const parsed = parseCsv(hospitalCsvText.value);
    fillHospitalMapping(parsed.length ? Object.keys(parsed[0]) : []);
    renderHospitalPreview(normalizeHospitalRows(parsed, false));
  });
}

if (hospitalImportButton) {
  hospitalImportButton.addEventListener("click", async () => {
    if (!hospitalPreviewRows.length) return;
    await saveHospitalRecords(hospitalPreviewRows);
    hospitalImportStatus.textContent = `${hospitalPreviewRows.length} registro(s) guardados como pendientes.`;
    hospitalPreviewRows = [];
    hospitalImportPreview.innerHTML = "";
    hospitalImportButton.classList.add("hidden");
    hospitalApproveSafeButton.classList.add("hidden");
    await renderHospitalAdmin();
    await renderHospitalAdmissions();
  });
}

if (hospitalApproveSafeButton) {
  hospitalApproveSafeButton.addEventListener("click", async () => {
    const safeRows = hospitalPreviewRows
      .filter((record) => !record.sensitive_detected && !record.incomplete && !record.possible_duplicate)
      .map((record) => ({ ...record, public_approved: true, estado_revision: "approved" }));
    if (!safeRows.length) return;
    await saveHospitalRecords(safeRows);
    hospitalImportStatus.textContent = `${safeRows.length} registro(s) seguros aprobados en lote. Filas sensibles, incompletas o duplicadas quedaron fuera.`;
    hospitalPreviewRows = [];
    hospitalImportPreview.innerHTML = "";
    hospitalImportButton.classList.add("hidden");
    hospitalApproveSafeButton.classList.add("hidden");
    await renderHospitalAdmin();
    await renderHospitalAdmissions();
  });
}

if (hospitalAdminList) {
  hospitalAdminList.addEventListener("change", async (event) => {
    if (!event.target.matches(".hospital-public-notes")) return;
    await updateHospitalRecord(event.target.dataset.id, { notas_publicas: event.target.value.trim() });
  });

  hospitalAdminList.addEventListener("click", async (event) => {
    const id = event.target.dataset.id;
    const batch = event.target.dataset.batch;
    if (event.target.matches(".hospital-approve")) await updateHospitalRecord(id, { public_approved: true, estado_revision: "approved" });
    if (event.target.matches(".hospital-duplicate")) await updateHospitalRecord(id, { possible_duplicate: true, estado_revision: "possible_duplicate", public_approved: false });
    if (event.target.matches(".hospital-family")) await updateHospitalRecord(id, { confirmado_por_familiar: true, estado_publico: "confirmado_por_familiar" });
    if (event.target.matches(".hospital-transferred")) await updateHospitalRecord(id, { trasladado: true, estado_publico: "trasladado" });
    if (event.target.matches(".hospital-discharged")) await updateHospitalRecord(id, { dado_de_alta_reportado: true, estado_publico: "dado_de_alta_reportado" });
    if (event.target.matches(".hospital-withdraw")) await updateHospitalRecord(id, { retirado_por_solicitud: true, public_approved: false, estado_revision: "retirado_por_solicitud" });
    if (event.target.matches(".hospital-rollback") && confirm("¿Eliminar todos los registros de este lote?")) await rollbackHospitalBatch(batch);
  });
}

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
  correctionStatus.textContent = "Solicitud enviada para revisi?n del equipo.";
  correctionRequestForm.reset();
});

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    adminStatus.textContent = "La bandeja privada no est? disponible en este momento. Intenta de nuevo m?s tarde.";
    return;
  }

  const email = adminEmail.value.trim();
  const password = adminPassword.value;
  if (!email || !password) {
    adminStatus.textContent = "Escribe el correo y la contrase?a del panel admin.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  adminStatus.textContent = error
    ? "No se pudo iniciar sesi?n. Revisa el correo, la contrase?a o solicita autorizaci?n al equipo."
    : "Sesi?n iniciada. Si este usuario est? autorizado, ver? la bandeja privada.";
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
  const confirmed = confirm("?Vaciar los borradores guardados en este equipo?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  await renderReports();
  await renderPublicCases();
});

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(() => {
    renderReports();
    renderPublicCases();
    renderHospitalAdmin();
    renderHospitalAdmissions();
  });
}

updateWhatsAppLink();
renderReports();
renderPublicCases();
renderHospitalAdmissions();
renderHospitalAdmin();
renderPublicSources();
loadAidCenters();
routeFromCurrentUrl();


