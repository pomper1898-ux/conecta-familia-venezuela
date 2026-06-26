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

const externalPublicCases = [
  {
    id: "external-bd-luis-angel-jayaro",
    status: "active_search",
    public_nombre: "Luis Angel Jayaro",
    public_edad_aproximada: "7",
    public_ciudad_sector: "Zona por confirmar",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. La información disponible indica que se busca confirmar ubicación y estado de la persona.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p3e93b44d6d79.jpg",
    source_url: "https://buscardesaparecidos.com/caso/luis-angel-jayaro-9asoju",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:04.000000Z",
  },
  {
    id: "external-bd-vanessa-martinez",
    status: "active_search",
    public_nombre: "Vanessa Martinez",
    public_edad_aproximada: "15",
    public_ciudad_sector: "Edificio, piso 9",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. Se conserva solo información general y se omiten contactos personales.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/pb9451665ed80.jpg",
    source_url: "https://buscardesaparecidos.com/caso/vanessa-martinez-tnrfo5",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:04.000000Z",
  },
  {
    id: "external-bd-omar-villan",
    status: "active_search",
    public_nombre: "Omar Villan",
    public_edad_aproximada: "66",
    public_ciudad_sector: "Catia La Mar",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: estatura aproximada 1.60, piel morena, ojos pardos, cabello canoso, músico y profesor de cuatro.",
    source_url: "https://buscardesaparecidos.com/caso/omar-villan-ifluez",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:04.000000Z",
  },
  {
    id: "external-bd-maribel-maqueda",
    status: "active_search",
    public_nombre: "Maribel Maqueda",
    public_edad_aproximada: "19",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. Se muestra información mínima para facilitar consulta comunitaria segura.",
    source_url: "https://buscardesaparecidos.com/caso/maribel-maqueda-gululg",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:04.000000Z",
  },
  {
    id: "external-bd-camila-salazar",
    status: "found",
    public_nombre: "Camila Andrea Salazar Albarran",
    public_edad_aproximada: "24",
    public_ciudad_sector: "Residencias El Palmar Caribe, Camuri Chico",
    public_resumen: "Caso marcado como encontrado en la fuente pública consultada. Mantener verificación antes de compartir nuevos datos.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p725d5ebc0cad.jpg",
    source_url: "https://buscardesaparecidos.com/caso/camila-andrea-salazar-albarran-budoy1",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-pablo-armas",
    status: "found",
    public_nombre: "Pablo Armas Borges",
    public_edad_aproximada: "25",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso marcado como encontrado en la fuente pública consultada. No se publican contactos personales en esta página.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p3daadbc9f2a9.jpg",
    source_url: "https://buscardesaparecidos.com/caso/pablo-armas-borges-7zo1ni",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-greider-martinez",
    status: "active_search",
    public_nombre: "Greider Martinez",
    public_edad_aproximada: "15",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Persona reportada en búsqueda. Se conserva información general publicada y se omiten teléfonos o datos de reportantes.",
    source_url: "https://buscardesaparecidos.com/caso/greider-martinez-3p0fbd",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-amaia-landaeta",
    status: "active_search",
    public_nombre: "Amaia Landaeta",
    public_edad_aproximada: "6",
    public_ciudad_sector: "Punta de Mulatos",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. Por tratarse de una menor, se muestra solo información mínima y fuente externa.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p9e5db6270f5f.jpg",
    source_url: "https://buscardesaparecidos.com/caso/amaia-landaeta-ihlxex",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-alberto-carrasquero",
    status: "active_search",
    public_nombre: "Alberto Gerardo Carrasquero Quiroz",
    public_edad_aproximada: "55",
    public_ciudad_sector: "Bolipuerto, La Guaira",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: estatura aproximada 1.75, piel blanca.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p831c33b26a48.jpg",
    source_url: "https://buscardesaparecidos.com/caso/alberto-gerardo-carrasquero-quiroz-xd7z58",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-barbara-villegas",
    status: "active_search",
    public_nombre: "Barbara Villegas",
    public_edad_aproximada: "20",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: delgada, estatura aproximada 1.70, cabello negro, collares y pulseras artesanales.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p30aa4eb3275f.jpg",
    source_url: "https://buscardesaparecidos.com/caso/barbara-villegas-kp5yqo",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-alejandra-ciano",
    status: "active_search",
    public_nombre: "Alejandra Ciano",
    public_edad_aproximada: "21",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. Se conserva solo información general y se omiten contactos personales.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p32bf66bfcb35.jpg",
    source_url: "https://buscardesaparecidos.com/caso/alejandra-ciano-pi2f0y",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-wladimir-gil",
    status: "active_search",
    public_nombre: "Wladimir Gil",
    public_edad_aproximada: "48",
    public_ciudad_sector: "Barrio Las Colinas, La Guaira",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: estatura aproximada 1.75, piel morena, contextura acuerpada, cabello negro y cejas gruesas.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/pa5f2b782cdc3.jpg",
    source_url: "https://buscardesaparecidos.com/caso/wladimir-gil-2ag7ka",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-jose-gregorio-urbano",
    status: "active_search",
    public_nombre: "José Gregorio Urbano Moreno",
    public_edad_aproximada: "",
    public_ciudad_sector: "Urbanismo Hugo Chávez, Catia La Mar",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. Se muestra información general de ubicación y se omiten datos de contacto.",
    photo_url: "https://reconexion-api-images-147455119818.s3.us-east-1.amazonaws.com/images/p0d12b91acd24.jpg",
    source_url: "https://buscardesaparecidos.com/caso/jose-gregorio-urbano-moreno-g86dn1",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:03.000000Z",
  },
  {
    id: "external-bd-elias-dayoub",
    status: "active_search",
    public_nombre: "Elías Dayoub Jamás",
    public_edad_aproximada: "65",
    public_ciudad_sector: "Caribe, La Guaira",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: estatura media, usa lentes, calvo y de contextura media.",
    source_url: "https://buscardesaparecidos.com/caso/elias-dayoub-jamas-8p0ol8",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:34:39.000000Z",
  },
  {
    id: "external-bd-norjim-rodriguez",
    status: "active_search",
    public_nombre: "Norjim Rodríguez López",
    public_edad_aproximada: "",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una plataforma pública de búsqueda. La información indica falta de comunicación desde el evento; se omiten datos personales de reportantes.",
    photo_url: "https://venezuelatebusca.com/media/photos/64577909-3aaa-4f25-b9de-b5a83b4754ac.webp",
    source_url: "https://buscardesaparecidos.com/caso/norjim-rodriguez-lopez-6pcxcu",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:34:39.000000Z",
  },
  {
    id: "external-bd-lonyino-vasquez",
    status: "found",
    public_nombre: "Lonyino Vásquez",
    public_edad_aproximada: "40",
    public_ciudad_sector: "Ruta hacia La Guaira",
    public_resumen: "Caso publicado en una plataforma pública y descrito como aparecido. Verifica siempre la fuente antes de compartir nuevos datos.",
    source_url: "https://buscardesaparecidos.com/caso/lonyino-vasquez-fm4grx",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T04:35:04.000000Z",
  },
  {
    id: "external-bd-rafael-mata-wettel",
    status: "active_search",
    public_nombre: "Rafael Ramon Mata Wettel",
    public_edad_aproximada: "80",
    public_ciudad_sector: "Playa Grande, La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra zona general y se omiten datos de contacto.",
    photo_url: "https://venezuelatebusca.com/media/photos/593fc400-e907-4e5e-9387-976c92e158b2.webp",
    source_url: "https://buscardesaparecidos.com/caso/rafael-ramon-mata-wettel-hqzieo",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-giannis-doheny",
    status: "active_search",
    public_nombre: "Giannis Doheny Doon Palencia",
    public_edad_aproximada: "",
    public_ciudad_sector: "Caracas",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Información general disponible: posible referencia hospitalaria en Caracas.",
    source_url: "https://buscardesaparecidos.com/caso/giannis-doheny-doon-palencia-h28h2i",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-oswaldo-armas",
    status: "active_search",
    public_nombre: "Oswaldo Jose Armas",
    public_edad_aproximada: "33",
    public_ciudad_sector: "Caraballeda, La Guaira",
    public_resumen: "Persona reportada en búsqueda. Descripción pública disponible: piel morena, estatura aproximada 1.75 y sin comunicación reciente.",
    photo_url: "https://venezuelatebusca.com/media/photos/2e5c5fa2-a023-473a-b35c-9982ddb5a532.webp",
    source_url: "https://buscardesaparecidos.com/caso/oswaldo-jose-armas-v1gzmx",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-maita-alzuro",
    status: "active_search",
    public_nombre: "Angélica Nazareth, Luis Manuel y Luis Eduardo Maita Alzuro",
    public_edad_aproximada: "",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Registro grupal publicado en una fuente pública de búsqueda. Se omiten contactos personales y detalles sensibles.",
    source_url: "https://buscardesaparecidos.com/caso/angelica-nazareth-luis-manuel-luis-eduardo-maita-alzuro-hmrayi",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-edgar-prato",
    status: "active_search",
    public_nombre: "Edgar Jesus Prato Morales",
    public_edad_aproximada: "77",
    public_ciudad_sector: "Catia La Mar",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra información general para consulta comunitaria segura.",
    photo_url: "https://venezuelatebusca.com/media/photos/3d863a22-3758-4ad8-96b7-5bf5b02adf95.webp",
    source_url: "https://buscardesaparecidos.com/caso/edgar-jesus-prato-morales-mxmexv",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-silvia-rada",
    status: "active_search",
    public_nombre: "Silvia Aparecedo Rada",
    public_edad_aproximada: "",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se conserva solo información mínima y segura.",
    source_url: "https://buscardesaparecidos.com/caso/silvia-aparecedo-rada-hlhfnq",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-pedro-iriarte",
    status: "active_search",
    public_nombre: "Pedro Gonzalo Iriarte Menente",
    public_edad_aproximada: "55",
    public_ciudad_sector: "Zona por confirmar",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. La ubicación específica no aparece indicada en la fuente consultada.",
    source_url: "https://buscardesaparecidos.com/caso/pedro-gonzalo-iriarte-menente-i2ayoa",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-gabriel-acevedo",
    status: "active_search",
    public_nombre: "Gabriel Alejandro Acevedo Silva",
    public_edad_aproximada: "27",
    public_ciudad_sector: "Catia La Mar, La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra información general y no se publican contactos personales.",
    photo_url: "https://venezuelatebusca.com/media/photos/d5dbf179-e3c5-4b05-9056-2b650b4ee603.webp",
    source_url: "https://buscardesaparecidos.com/caso/gabriel-alejandro-acevedo-silva-nfxh6f",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-raul-figueroa",
    status: "active_search",
    public_nombre: "Raul Alberto Figueroa",
    public_edad_aproximada: "",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se conserva información mínima para búsqueda segura.",
    source_url: "https://buscardesaparecidos.com/caso/raul-alberto-figueroa-oun6sg",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-leonar-melendez",
    status: "active_search",
    public_nombre: "Leonar Melendez",
    public_edad_aproximada: "75",
    public_ciudad_sector: "Playa Verde, Catia La Mar",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se generaliza la ubicación para proteger datos sensibles.",
    photo_url: "https://venezuelatebusca.com/media/photos/e1d7be60-630e-4285-861e-6d4a304a920f.webp",
    source_url: "https://buscardesaparecidos.com/caso/leonar-melendez-mrozt6",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-wilfredo-avila",
    status: "active_search",
    public_nombre: "Wilfredo Ávila",
    public_edad_aproximada: "",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra solo información general.",
    source_url: "https://buscardesaparecidos.com/caso/wilfredo-avila-alftvw",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-carlos-diaz",
    status: "active_search",
    public_nombre: "Carlos Diaz",
    public_edad_aproximada: "20",
    public_ciudad_sector: "Zona por confirmar",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. La ubicación específica no aparece indicada en la fuente consultada.",
    photo_url: "https://venezuelatebusca.com/media/photos/949afef7-aeba-450a-a460-e4348b742cca.webp",
    source_url: "https://buscardesaparecidos.com/caso/carlos-diaz-rz8tco",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-edicson-guevara",
    status: "active_search",
    public_nombre: "Edicson Guevara Ojeda",
    public_edad_aproximada: "72",
    public_ciudad_sector: "Caracas",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se omiten contactos y datos sensibles.",
    photo_url: "https://venezuelatebusca.com/media/photos/abf1fc1e-ebf2-4d96-b93b-4d3479298498.webp",
    source_url: "https://buscardesaparecidos.com/caso/edicson-guevara-ojeda-8l3lg4",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:31:02.000000Z",
  },
  {
    id: "external-bd-edwin-cabrera-mildred-fumero",
    status: "active_search",
    public_nombre: "Edwin Cabrera y Mildred Carolina Fumero",
    public_edad_aproximada: "19",
    public_ciudad_sector: "Camurí Grande",
    public_resumen: "Registro grupal publicado en una fuente pública de búsqueda. Se generaliza ubicación y no se muestran contactos personales.",
    photo_url: "https://venezuelatebusca.com/media/photos/ed042ff4-622f-4c3d-826e-b155a0e4d4db.webp",
    source_url: "https://buscardesaparecidos.com/caso/edwin-cabrera-mildred-carolina-fumero-kf8py7",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-tibisay-perez",
    status: "active_search",
    public_nombre: "Tibisay Perez",
    public_edad_aproximada: "",
    public_ciudad_sector: "Los Cocos, La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se omiten nombres de familiares y contactos personales.",
    photo_url: "https://venezuelatebusca.com/media/photos/c65a0d38-3486-41a6-88d9-680452ee2013.webp",
    source_url: "https://buscardesaparecidos.com/caso/tibisay-perez-ojmnbu",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-michelle-tovar",
    status: "active_search",
    public_nombre: "Michelle Tovar",
    public_edad_aproximada: "34",
    public_ciudad_sector: "Maracay",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra información general para consulta comunitaria.",
    photo_url: "https://venezuelatebusca.com/media/photos/31130b59-6233-4343-ad1b-22533b7455fa.webp",
    source_url: "https://buscardesaparecidos.com/caso/michelle-tovar-pssrco",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-marcos-de-sousa",
    status: "active_search",
    public_nombre: "Marcos De Sousa",
    public_edad_aproximada: "15",
    public_ciudad_sector: "Playa Grande, Catia La Mar",
    public_resumen: "Caso de menor publicado en una fuente pública de búsqueda. Se muestra solo información mínima y fuente externa.",
    photo_url: "https://venezuelatebusca.com/media/photos/b8d288f3-ef80-47b8-b212-723865640883.webp",
    source_url: "https://buscardesaparecidos.com/caso/marcos-de-sousa-znf0cr",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-diana-redondo",
    status: "active_search",
    public_nombre: "Diana Redondo",
    public_edad_aproximada: "20",
    public_ciudad_sector: "Urbanización Hugo Chávez, Catia La Mar",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se omiten datos de familiares y contactos personales.",
    photo_url: "https://venezuelatebusca.com/media/photos/0e416d2d-958b-4769-9d39-032d562bcb35.webp",
    source_url: "https://buscardesaparecidos.com/caso/diana-redondo-pcuwbn",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-dayani-sanchez",
    status: "active_search",
    public_nombre: "Dayani Sánchez",
    public_edad_aproximada: "40",
    public_ciudad_sector: "Taraguarena",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se muestra información mínima para búsqueda segura.",
    source_url: "https://buscardesaparecidos.com/caso/dayani-sanchez-8akodk",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
  {
    id: "external-bd-ginger-salcedo",
    status: "active_search",
    public_nombre: "Ginger Salcedo",
    public_edad_aproximada: "57",
    public_ciudad_sector: "La Guaira",
    public_resumen: "Caso publicado en una fuente pública de búsqueda. Se omiten contactos personales y datos sensibles.",
    photo_url: "https://venezuelatebusca.com/media/photos/d217d6ca-3e7d-4b27-a288-d9e6b1d7ac97.webp",
    source_url: "https://buscardesaparecidos.com/caso/ginger-salcedo-78ogrm",
    source_label: "Buscar Desaparecidos",
    source_type: "Fuente externa pública",
    updated_at: "2026-06-26T15:29:04.000000Z",
  },
];

const reportForm = document.querySelector("#reportForm");
const formStatus = document.querySelector("#formStatus");
const whatsappButton = document.querySelector("#whatsappButton");
const casesList = document.querySelector("#casesList");
const publicCasesList = document.querySelector("#publicCasesList");
const publicSearch = document.querySelector("#publicSearch");
const publicStats = document.querySelector("#publicStats");
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
let publicSearchTerm = "";

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
  if (!term) return cases;

  return cases.filter((item) => {
    const searchable = normalizeText([
      item.public_nombre,
      item.public_ciudad_sector,
      item.public_edad_aproximada,
      item.public_resumen,
      statusLabel(item.status),
    ].join(" "));
    return searchable.includes(term);
  });
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
  const session = await getSession();

  adminLoginForm.classList.toggle("hidden", !supabaseClient || Boolean(session));
  adminLogout.classList.toggle("hidden", !supabaseClient || !session);
  clearReports.classList.toggle("hidden", Boolean(supabaseClient));

  if (supabaseClient && !session) {
    adminStats.innerHTML = "";
    adminStatus.textContent = "Bandeja privada protegida. Entra con correo y contraseña autorizados para revisar reportes.";
    casesList.innerHTML = '<div class="empty-state">Solo personas autorizadas pueden ver esta bandeja privada.</div>';
    return;
  }

  renderAdminStats(reports);

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
    return [...localCases, ...externalPublicCases];
  }

  const { data, error } = await supabaseClient
    .from("public_cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    publicCasesList.innerHTML = '<div class="empty-state">No se pudo cargar la vista pública segura.</div>';
    return [];
  }

  return [...(data || []), ...externalPublicCases];
}

async function renderPublicCases() {
  const cases = await loadPublicCases();
  const filteredCases = filterPublicCases(cases);

  if (!cases.length) {
    publicStats.textContent = "Sin casos publicados";
    publicCasesList.innerHTML = '<div class="empty-state">Aún no hay casos aprobados para publicación.</div>';
    return;
  }

  publicStats.textContent = publicSearchTerm
    ? `${filteredCases.length} de ${cases.length} caso(s) encontrados`
    : `${cases.length} caso(s) publicados`;

  if (!filteredCases.length) {
    publicCasesList.innerHTML = '<div class="empty-state">No hay casos publicados que coincidan con la búsqueda.</div>';
    return;
  }

  publicCasesList.innerHTML = filteredCases
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
  await renderPublicCases();
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
