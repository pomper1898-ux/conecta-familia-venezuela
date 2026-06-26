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

const reportForm = document.querySelector("#reportForm");
const formStatus = document.querySelector("#formStatus");
const whatsappButton = document.querySelector("#whatsappButton");
const casesList = document.querySelector("#casesList");
const publicCasesList = document.querySelector("#publicCasesList");
const exportReports = document.querySelector("#exportReports");
const clearReports = document.querySelector("#clearReports");
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
    adminStatus.textContent = `No se pudieron cargar casos: ${error.message}`;
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
  const session = await getSession();

  adminLoginForm.classList.toggle("hidden", !supabaseClient || Boolean(session));
  adminLogout.classList.toggle("hidden", !supabaseClient || !session);
  clearReports.classList.toggle("hidden", Boolean(supabaseClient));

  if (supabaseClient && !session) {
    adminStats.innerHTML = "";
    adminStatus.textContent = "Bandeja privada protegida. Entra con correo y contraseña autorizados para revisar reportes.";
    casesList.innerHTML = '<div class="empty-state">Supabase está configurado como modo real. Solo administradores autorizados pueden ver esta bandeja.</div>';
    return;
  }

  renderAdminStats(reports);

  if (!reports.length) {
    adminStatus.textContent = supabaseClient
      ? "Bandeja privada lista. Todo reporte nuevo entrará como pendiente de revisión y no se publicará automáticamente."
      : "Modo local sin Supabase. Úsalo solo para pruebas; la operación real guarda reportes en Supabase.";
    casesList.innerHTML = '<div class="empty-state">No hay reportes pendientes en la bandeja.</div>';
    return;
  }

  const filteredReports = filterReports(reports);
  adminStatus.textContent = supabaseClient
    ? `${filteredReports.length} de ${reports.length} reporte(s) en la bandeja privada. Publica solo después de escribir un resumen seguro.`
    : `${filteredReports.length} de ${reports.length} reporte(s) locales. Configura Supabase para operación real.`;

  if (!filteredReports.length) {
    casesList.innerHTML = '<div class="empty-state">No hay reportes que coincidan con el filtro o búsqueda.</div>';
    return;
  }

  casesList.innerHTML = filteredReports.map(renderCaseCard).join("");
}

async function loadPublicCases() {
  if (!supabaseClient) {
    return loadLocalReports()
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
      }));
  }

  const { data, error } = await supabaseClient
    .from("public_cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    publicCasesList.innerHTML = '<div class="empty-state">No se pudo cargar la vista pública segura.</div>';
    return [];
  }

  return data || [];
}

async function renderPublicCases() {
  const cases = await loadPublicCases();

  if (!cases.length) {
    publicCasesList.innerHTML = '<div class="empty-state">Aún no hay casos aprobados para publicación.</div>';
    return;
  }

  publicCasesList.innerHTML = cases
    .map((item) => `
      <article class="public-case-card status-${escapeHtml(item.status)}">
        <h3>${escapeHtml(item.public_nombre)}</h3>
        <div class="case-meta">
          <span class="pill status-pill">${escapeHtml(statusLabel(item.status))}</span>
          <span class="pill">${escapeHtml(item.public_ciudad_sector)}</span>
          <span class="pill">${escapeHtml(item.public_edad_aproximada)}</span>
        </div>
        <p class="case-date">Actualizado: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</p>
        <p>${escapeHtml(item.public_resumen)}</p>
        <a class="secondary-btn" href="#reporte" data-action-link="Tengo información">Tengo información</a>
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
    adminStatus.textContent = `No se pudo actualizar: ${error.message}`;
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
      : "Reporte guardado localmente como privado con estado pendiente de revisión.";
    updateWhatsAppLink();
    await renderReports();
    await renderPublicCases();
  } catch (error) {
    formStatus.textContent = `No se pudo guardar el reporte: ${error.message}`;
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
});

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    adminStatus.textContent = "Configura Supabase en config.js para activar la bandeja privada real.";
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
    ? `No se pudo iniciar sesión: ${error.message}`
    : "Sesión iniciada. Si este usuario está autorizado, verás la bandeja privada.";
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
  const confirmed = confirm("¿Vaciar todos los reportes guardados localmente?");
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
