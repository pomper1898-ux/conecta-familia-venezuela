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
    "id": "external-bd-guillermo-el-negro-arratia-uhjai6",
    "status": "active_search",
    "public_nombre": "Guillermo \"el Negro\" Arratia",
    "public_edad_aproximada": "66",
    "public_ciudad_sector": "Naiguatá",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Diastema evidente. Excoralista de la coral de la Facultad de Ciencias UCV..",
    "photo_url": "https://venezuelatebusca.com/media/photos/69deddc5-6360-4911-9c4b-6fb9ea881e1c.webp",
    "source_url": "https://buscardesaparecidos.com/caso/guillermo-el-negro-arratia-uhjai6",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:09:03.000000Z"
  },
  {
    "id": "external-bd-raquel-marquez-qhkjfy",
    "status": "active_search",
    "public_nombre": "Raquel Marquez",
    "public_edad_aproximada": "65",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Contextura delgada, mide aproximadamente 1.62. Trabaja para la inmobiliaria Atlantics en La Guaira.",
    "photo_url": "https://venezuelatebusca.com/media/photos/37add037-9709-4c6c-957a-1d33777d0cb5.webp",
    "source_url": "https://buscardesaparecidos.com/caso/raquel-marquez-qhkjfy",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:09:03.000000Z"
  },
  {
    "id": "external-bd-marbella-del-valles-campo-4qccdw",
    "status": "active_search",
    "public_nombre": "Marbella del Valles Campo",
    "public_edad_aproximada": "55",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/marbella-del-valles-campo-4qccdw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:09:03.000000Z"
  },
  {
    "id": "external-bd-ana-hilden-3tsqpt",
    "status": "found",
    "public_nombre": "Ana Hilden",
    "public_edad_aproximada": "4",
    "public_ciudad_sector": "Hospital Dr. Domingo Luciani",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: LOCALIZADA EN LISTADO DE PACIENTES INGRESADOS EN EL HOSPITAL DR DOMINGO LUCIANI. ZONA DE PEDIATRIA.",
    "source_url": "https://buscardesaparecidos.com/caso/ana-hilden-3tsqpt",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:09:03.000000Z"
  },
  {
    "id": "external-bd-magda-paola-fa3bm1",
    "status": "active_search",
    "public_nombre": "Magda Paola",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/c04a468f-7cff-442d-8c61-9b17ca257bf1.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/magda-paola-fa3bm1",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:09:03.000000Z"
  },
  {
    "id": "external-bd-yermani-barcelo-salazar-lgh0qk",
    "status": "active_search",
    "public_nombre": "Yermani Barcelo Salazar",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/73b5848a-17f2-4387-b8b4-2a8869e0d104.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yermani-barcelo-salazar-lgh0qk",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:07.000000Z"
  },
  {
    "id": "external-bd-kevin-gregorio-garcia-palma-fdwekp",
    "status": "active_search",
    "public_nombre": "Kevin Gregorio García Palma",
    "public_edad_aproximada": "24",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/kevin-gregorio-garcia-palma-fdwekp",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-antonieta-rosanni-brito-febres-hmjs5g",
    "status": "active_search",
    "public_nombre": "Antonieta Rosanni Brito Febres",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/antonieta-rosanni-brito-febres-hmjs5g",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-miranda-cataleya-albornos-sanchez-ni8alo",
    "status": "active_search",
    "public_nombre": "Miranda Cataleya Albornos Sanchez",
    "public_edad_aproximada": "6",
    "public_ciudad_sector": "Playa Grande, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Pelo rizo morena.",
    "photo_url": "https://venezuelatebusca.com/media/photos/1f514d36-ce0c-4388-beec-1fd20f72874b.webp",
    "source_url": "https://buscardesaparecidos.com/caso/miranda-cataleya-albornos-sanchez-ni8alo",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-francis-xibdln",
    "status": "active_search",
    "public_nombre": "Francis .",
    "public_edad_aproximada": "30",
    "public_ciudad_sector": "Vivía en los edificios de Estrella del mar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/francis-xibdln",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-juan-miguel-ramirez-romero-zucoxw",
    "status": "active_search",
    "public_nombre": "Juan Miguel Ramirez Romero",
    "public_edad_aproximada": "44",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/440f9932-2423-47d6-87e5-3f72144f6ecd.webp",
    "source_url": "https://buscardesaparecidos.com/caso/juan-miguel-ramirez-romero-zucoxw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-flanklin-alexander-silva-palacio-yi8mf3",
    "status": "active_search",
    "public_nombre": "Flanklin Alexander Silva Palacio",
    "public_edad_aproximada": "19",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/8d314350-4268-4d2b-b7ec-4562d69ab8e5.webp",
    "source_url": "https://buscardesaparecidos.com/caso/flanklin-alexander-silva-palacio-yi8mf3",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-daileydy-herrera-6ymhuu",
    "status": "active_search",
    "public_nombre": "Daileydy Herrera",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/3df55c62-2671-40bf-a0a9-ab36affe6e47.webp",
    "source_url": "https://buscardesaparecidos.com/caso/daileydy-herrera-6ymhuu",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:06.000000Z"
  },
  {
    "id": "external-bd-alirio-rodriguez-toledo-gwhpzc",
    "status": "active_search",
    "public_nombre": "Alirio Rodríguez Toledo",
    "public_edad_aproximada": "58",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/alirio-rodriguez-toledo-gwhpzc",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:05.000000Z"
  },
  {
    "id": "external-bd-marbelis-moreno-5puwz7",
    "status": "active_search",
    "public_nombre": "Marbelis Moreno",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Está en lista de pacientes hospitalizados de La Guaira, ubicados en el Hospital José Gregorio Hernandez de Oeste. HOY viernes 26 de junio..",
    "source_url": "https://buscardesaparecidos.com/caso/marbelis-moreno-5puwz7",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:05.000000Z"
  },
  {
    "id": "external-bd-miriam-garcia-bckkqx",
    "status": "active_search",
    "public_nombre": "Miriam García",
    "public_edad_aproximada": "47",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Se descose.",
    "source_url": "https://buscardesaparecidos.com/caso/miriam-garcia-bckkqx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:05.000000Z"
  },
  {
    "id": "external-bd-leinel-david-oropeza-salazar-bdkyts",
    "status": "active_search",
    "public_nombre": "Leinel David Oropeza Salazar",
    "public_edad_aproximada": "16",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/leinel-david-oropeza-salazar-bdkyts",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-maria-morocoima-3zrnf1",
    "status": "active_search",
    "public_nombre": "María Morocoima",
    "public_edad_aproximada": "22",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/84beb598-f699-46ff-b66c-92130869382a.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/maria-morocoima-3zrnf1",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-marisol-sojo-marcano-6zyxa9",
    "status": "active_search",
    "public_nombre": "Marisol Sojo Marcano",
    "public_edad_aproximada": "59",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Señora mayor de 59 años piel Negra no se sabe vestimenta.",
    "photo_url": "https://venezuelatebusca.com/media/photos/39df91da-21b2-471d-b265-f29620641754.png",
    "source_url": "https://buscardesaparecidos.com/caso/marisol-sojo-marcano-6zyxa9",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-maikel-morillo-wepfwj",
    "status": "active_search",
    "public_nombre": "Maikel Morillo",
    "public_edad_aproximada": "47",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/maikel-morillo-wepfwj",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-sophia-aurora-tibisay-bergudo-bergudo-perez-nifv57",
    "status": "active_search",
    "public_nombre": "Sophia Aurora Tibisay Bergudo Bergudo Pérez",
    "public_edad_aproximada": "26",
    "public_ciudad_sector": "Guaíra Lis cocos",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/7d2747d0-8c23-4202-83fa-f89314b7c93b.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/sophia-aurora-tibisay-bergudo-bergudo-perez-nifv57",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-adrian-cardona-0onrwm",
    "status": "active_search",
    "public_nombre": "Adrian Cardona",
    "public_edad_aproximada": "40",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/5855db8e-ba94-4a20-b947-e5bd0e7e2181.webp",
    "source_url": "https://buscardesaparecidos.com/caso/adrian-cardona-0onrwm",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-nelson-jesus-oropeza-salazar-019r0q",
    "status": "active_search",
    "public_nombre": "Nelson Jesus Oropeza Salazar",
    "public_edad_aproximada": "14",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/nelson-jesus-oropeza-salazar-019r0q",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-julio-marcano-6ze8e2",
    "status": "active_search",
    "public_nombre": "Julio Marcano",
    "public_edad_aproximada": "67",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/julio-marcano-6ze8e2",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-oswaldo-briceno-jzxtem",
    "status": "active_search",
    "public_nombre": "Oswaldo Briceño",
    "public_edad_aproximada": "49",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/oswaldo-briceno-jzxtem",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:07:04.000000Z"
  },
  {
    "id": "external-bd-henry-jose-barcelo-salazar-yvmsze",
    "status": "active_search",
    "public_nombre": "Henry Jose Barcelo Salazar",
    "public_edad_aproximada": "12",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/henry-jose-barcelo-salazar-yvmsze",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-alirio-rodriguez-toledo-nwcctr",
    "status": "active_search",
    "public_nombre": "Alirio Rodríguez Toledo",
    "public_edad_aproximada": "55",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/alirio-rodriguez-toledo-nwcctr",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-briceno-amikar-c0a41u",
    "status": "active_search",
    "public_nombre": "Briceño Amikar",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "hospital perez carreño",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Encontrado en lista hospitalaria de Hospital Dr. Miguel Pérez Carreño. La persona figura como ingresada. Procedencia La Guaira. NUEVO. Que Dios lo bendiga (Si el pariente lo confir.",
    "source_url": "https://buscardesaparecidos.com/caso/briceno-amikar-c0a41u",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-juan-carlos-villegas-castillo-iqjd2h",
    "status": "active_search",
    "public_nombre": "Juan Carlos Villegas Castillo",
    "public_edad_aproximada": "37",
    "public_ciudad_sector": "Aeropuerto Maiquetía",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Llegó en el vuelo 164.",
    "source_url": "https://buscardesaparecidos.com/caso/juan-carlos-villegas-castillo-iqjd2h",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-yaneisa-del-valle-gomez-acosta-9hmgre",
    "status": "active_search",
    "public_nombre": "Yaneisa del Valle Gómez Acosta",
    "public_edad_aproximada": "44",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/yaneisa-del-valle-gomez-acosta-9hmgre",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-adriana-mendoza-pkpk8h",
    "status": "active_search",
    "public_nombre": "Adriana Mendoza",
    "public_edad_aproximada": "16",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: pelinegra, con brackets y lentes.",
    "photo_url": "https://venezuelatebusca.com/media/photos/fde3044b-1038-425b-83bb-2072abcec8c1.webp",
    "source_url": "https://buscardesaparecidos.com/caso/adriana-mendoza-pkpk8h",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-adrian-jaen-xipcvw",
    "status": "active_search",
    "public_nombre": "Adrian Jaen",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Está en lista de pacientes hospitalizados de La Guaira, ubicados en el Hospital José Gregorio Hernandez de Oeste. HOY viernes 26 de junio. DIRIGIRSE AL HOSPITAL..",
    "source_url": "https://buscardesaparecidos.com/caso/adrian-jaen-xipcvw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-hernan-gil-mu1qg1",
    "status": "active_search",
    "public_nombre": "Hernan Gil",
    "public_edad_aproximada": "42",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/hernan-gil-mu1qg1",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-nelson-antorio-oropeza-atencio-mijsqi",
    "status": "active_search",
    "public_nombre": "Nelson Antorio Oropeza Atencio",
    "public_edad_aproximada": "40",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/nelson-antorio-oropeza-atencio-mijsqi",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-maryam-emilie-gil-anton-tuzoyg",
    "status": "active_search",
    "public_nombre": "Maryam Emilie Gil Anton",
    "public_edad_aproximada": "15",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/a6ac6ae5-95f0-416d-aac4-644e41d9d431.webp",
    "source_url": "https://buscardesaparecidos.com/caso/maryam-emilie-gil-anton-tuzoyg",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-scarlett-omary-leventiur-reyes-bk9gvv",
    "status": "active_search",
    "public_nombre": "Scarlett Omary Leventiur Reyes",
    "public_edad_aproximada": "36",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/f5a1aa75-0c90-4851-ae6d-e7a5291b067b.webp",
    "source_url": "https://buscardesaparecidos.com/caso/scarlett-omary-leventiur-reyes-bk9gvv",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-danna-castano-bpsczi",
    "status": "found",
    "public_nombre": "Danna Castaño",
    "public_edad_aproximada": "12",
    "public_ciudad_sector": "Hospital Dr. Domingo Luciani",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: LOCALIZADA EN LISTADO DE PACIENTES INGRESADOS EN EL HOSPITAL DR DOMINGO LUCIANI. ZONA DE PEDIATRIA.",
    "source_url": "https://buscardesaparecidos.com/caso/danna-castano-bpsczi",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-hunberto-manuel-solano-ugajss",
    "status": "active_search",
    "public_nombre": "Hunberto Manuel Solano",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/faa4962b-4a26-44d8-8967-67d4ab6a7281.webp",
    "source_url": "https://buscardesaparecidos.com/caso/hunberto-manuel-solano-ugajss",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-karelis-hernandez-w3t1eo",
    "status": "active_search",
    "public_nombre": "Karelis Hernández",
    "public_edad_aproximada": "26",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Gorda , color de piel clara, cabello negro lisado ojos marrones.",
    "photo_url": "https://venezuelatebusca.com/media/photos/dd032be4-f638-4070-b30a-d8132e59f944.webp",
    "source_url": "https://buscardesaparecidos.com/caso/karelis-hernandez-w3t1eo",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-betsy-escobar-15jhxg",
    "status": "active_search",
    "public_nombre": "Betsy Escobar",
    "public_edad_aproximada": "50",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Morena, corte Bob, gordita, sonrisa grande, tiene 5 hijos, todos desaparecidos junto con ella.",
    "photo_url": "https://venezuelatebusca.com/media/photos/ab63e3ec-bd43-4654-ac41-6154c407a710.webp",
    "source_url": "https://buscardesaparecidos.com/caso/betsy-escobar-15jhxg",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:04.000000Z"
  },
  {
    "id": "external-bd-sara-gabriela-parra-gomez-naoy8o",
    "status": "active_search",
    "public_nombre": "Sara Gabriela Parra Gómez",
    "public_edad_aproximada": "16",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/sara-gabriela-parra-gomez-naoy8o",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:03.000000Z"
  },
  {
    "id": "external-bd-eramos-moreno-dog2sb",
    "status": "active_search",
    "public_nombre": "Eramos Moreno",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Está en lista de pacientes hospitalizados de La Guaira, ubicados en el Hospital José Gregorio Hernandez de Oeste. HOY viernes 26 de junio..",
    "source_url": "https://buscardesaparecidos.com/caso/eramos-moreno-dog2sb",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:03.000000Z"
  },
  {
    "id": "external-bd-jhosnayder-jesus-marcano-marcano-montilla-xnzxrk",
    "status": "active_search",
    "public_nombre": "Jhosnayder Jesús Marcano Marcano Montilla",
    "public_edad_aproximada": "9",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/jhosnayder-jesus-marcano-marcano-montilla-xnzxrk",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:03.000000Z"
  },
  {
    "id": "external-bd-francheska-maria-portal-morocoina-90hiwl",
    "status": "active_search",
    "public_nombre": "Francheska María Portal Morocoina",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Edificio los cocos torre 27",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/eed31ddf-503a-4cc7-bb2a-3d4beff39d58.webp",
    "source_url": "https://buscardesaparecidos.com/caso/francheska-maria-portal-morocoina-90hiwl",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:03.000000Z"
  },
  {
    "id": "external-bd-yohan-sojo-vakfdz",
    "status": "active_search",
    "public_nombre": "Yohan Sojo",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Usa lentes.",
    "photo_url": "https://venezuelatebusca.com/media/photos/ac3774e7-a64a-4828-8cae-b0c0f4dba520.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yohan-sojo-vakfdz",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:05:03.000000Z"
  },
  {
    "id": "external-bd-jenny-zuluaga-bk9c4k",
    "status": "found",
    "public_nombre": "Jenny Zuluaga",
    "public_edad_aproximada": "40",
    "public_ciudad_sector": "Barquisimeto, Lara",
    "public_resumen": "Caso marcado como encontrado en la fuente pública consultada. Verifica siempre la fuente antes de compartir nuevos datos.",
    "photo_url": "https://venezuelatebusca.com/media/photos/fcb16edf-8c67-4aad-af83-8e6fdeb60501.webp",
    "source_url": "https://buscardesaparecidos.com/caso/jenny-zuluaga-bk9c4k",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:07.000000Z"
  },
  {
    "id": "external-bd-yuary-pino-5tsywf",
    "status": "active_search",
    "public_nombre": "Yuary Pino",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Actualmente tiene el cabello largo.",
    "photo_url": "https://venezuelatebusca.com/media/photos/ed301152-a054-4831-a332-bf9e0f7e4ca0.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yuary-pino-5tsywf",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-leila-ester-salazar-rodriguez-81qvwp",
    "status": "active_search",
    "public_nombre": "Leila Ester Salazar Rodriguez",
    "public_edad_aproximada": "40",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/leila-ester-salazar-rodriguez-81qvwp",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-yamilet-biscochea-abvsiu",
    "status": "active_search",
    "public_nombre": "Yamilet Biscochea",
    "public_edad_aproximada": "45",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/yamilet-biscochea-abvsiu",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-ranfi-insegura-ramon-btj9pc",
    "status": "active_search",
    "public_nombre": "Ranfi (Insegura) Ramon",
    "public_edad_aproximada": "34",
    "public_ciudad_sector": "hospital perez carreno",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Encontrado en lista hospitalaria de Hospital Dr. Miguel Pérez Carreño. La persona figura como ingresada. Procedencia La Guaira. NUEVO. Que Dios lo bendiga (Si el pariente lo confir.",
    "source_url": "https://buscardesaparecidos.com/caso/ranfi-insegura-ramon-btj9pc",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-miguel-garcia-dxnb6z",
    "status": "active_search",
    "public_nombre": "Miguel Garcia",
    "public_edad_aproximada": "26",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/32e87264-1178-4ab8-b9b0-9583709b98f6.webp",
    "source_url": "https://buscardesaparecidos.com/caso/miguel-garcia-dxnb6z",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-heliodoro-fernando-hernandez-lobo-5ffbum",
    "status": "active_search",
    "public_nombre": "Heliodoro Fernando Hernández Lobo",
    "public_edad_aproximada": "61",
    "public_ciudad_sector": "Carabobo",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Zarrapastroso.",
    "source_url": "https://buscardesaparecidos.com/caso/heliodoro-fernando-hernandez-lobo-5ffbum",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:04.000000Z"
  },
  {
    "id": "external-bd-omar-barrios-revilla-ia26fr",
    "status": "active_search",
    "public_nombre": "Omar Barrios Revilla",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: no sé sabe.",
    "photo_url": "https://venezuelatebusca.com/media/photos/fdb77481-28e1-406b-8b99-55a037f5619a.webp",
    "source_url": "https://buscardesaparecidos.com/caso/omar-barrios-revilla-ia26fr",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-yenderlin-moreno-funes-ok2pie",
    "status": "active_search",
    "public_nombre": "Yenderlin Moreno Funes",
    "public_edad_aproximada": "21",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/d1f95cb6-d85d-4221-b697-d27b9c280d12.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yenderlin-moreno-funes-ok2pie",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-francis-duboy-glc7l4",
    "status": "active_search",
    "public_nombre": "Francis Duboy",
    "public_edad_aproximada": "30",
    "public_ciudad_sector": "Vivía en los edificios de Estrella del mar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/3ffaf96f-c435-4816-b1db-05b0780c1560.webp",
    "source_url": "https://buscardesaparecidos.com/caso/francis-duboy-glc7l4",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-olivia-garcia-wcrieh",
    "status": "active_search",
    "public_nombre": "Olivia Garcia",
    "public_edad_aproximada": "6",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/c16695e5-edc6-497b-ab0c-18d24507bbaf.webp",
    "source_url": "https://buscardesaparecidos.com/caso/olivia-garcia-wcrieh",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-liliana-caraballo-qczi4w",
    "status": "active_search",
    "public_nombre": "Liliana Caraballo",
    "public_edad_aproximada": "38",
    "public_ciudad_sector": "Tanaguarena res. Humboldt",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/liliana-caraballo-qczi4w",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-diego-maluenga-solorzano-irudzh",
    "status": "active_search",
    "public_nombre": "Diego Maluenga Solorzano",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/9f345007-acec-4688-9344-5d91d4d3589a.webp",
    "source_url": "https://buscardesaparecidos.com/caso/diego-maluenga-solorzano-irudzh",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T17:00:03.000000Z"
  },
  {
    "id": "external-bd-juana-iriarte-t91vt7",
    "status": "active_search",
    "public_nombre": "Juana Iriarte",
    "public_edad_aproximada": "85",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/91fec544-81a9-4415-8813-7faa7b6a0d54.webp",
    "source_url": "https://buscardesaparecidos.com/caso/juana-iriarte-t91vt7",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:06.000000Z"
  },
  {
    "id": "external-bd-evelyn-dominguez-sierraalta-tt1ele",
    "status": "active_search",
    "public_nombre": "Evelyn Dominguez Sierraalta",
    "public_edad_aproximada": "68",
    "public_ciudad_sector": "Edificio Obelisco, Los Palos Grandes",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Piel blanca, pelo negro, ojos marrones.",
    "source_url": "https://buscardesaparecidos.com/caso/evelyn-dominguez-sierraalta-tt1ele",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:06.000000Z"
  },
  {
    "id": "external-bd-emmanuel-antonio-hernandez-poleo-ebxils",
    "status": "active_search",
    "public_nombre": "Emmanuel Antonio Hernández Poleo",
    "public_edad_aproximada": "24",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/0f563f3e-805e-4262-99e5-86eec89d499d.webp",
    "source_url": "https://buscardesaparecidos.com/caso/emmanuel-antonio-hernandez-poleo-ebxils",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:06.000000Z"
  },
  {
    "id": "external-bd-alexander-bastidas-bzikbe",
    "status": "active_search",
    "public_nombre": "Alexander Bastidas",
    "public_edad_aproximada": "19",
    "public_ciudad_sector": "Playa Grande, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Mide aproximadamente 1.70 Contextura delgada Tiene uniceja Ojos marrones.",
    "source_url": "https://buscardesaparecidos.com/caso/alexander-bastidas-bzikbe",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:06.000000Z"
  },
  {
    "id": "external-bd-victoria-landaeta-cphhj5",
    "status": "active_search",
    "public_nombre": "Victoria Landaeta",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/18e270a8-e8b9-4fc6-945b-fe113335b96d.webp",
    "source_url": "https://buscardesaparecidos.com/caso/victoria-landaeta-cphhj5",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-michelle-tovar-tens0c",
    "status": "active_search",
    "public_nombre": "Michelle Tovar",
    "public_edad_aproximada": "35",
    "public_ciudad_sector": "Maracay",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/30aa32c5-b014-4a8d-b516-3d4b49b26aa0.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/michelle-tovar-tens0c",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-emmanuel-alejandro-hernandez-tovar-sm1vry",
    "status": "active_search",
    "public_nombre": "Emmanuel Alejandro Hernández Tovar",
    "public_edad_aproximada": "18",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Mide 1.80 aprox, Moreno, delgado.",
    "source_url": "https://buscardesaparecidos.com/caso/emmanuel-alejandro-hernandez-tovar-sm1vry",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-irani-nicol-contreras-aguero-ojmc2f",
    "status": "active_search",
    "public_nombre": "Iraní Nicol Contreras Agüero",
    "public_edad_aproximada": "15",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Caribes entrada de los cocos, edificio oppe 26 torre A.",
    "photo_url": "https://venezuelatebusca.com/media/photos/0f2a0606-c126-4b1d-b6a4-88ad031c31b3.webp",
    "source_url": "https://buscardesaparecidos.com/caso/irani-nicol-contreras-aguero-ojmc2f",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-miriam-vasquez-silvera-iv07zw",
    "status": "active_search",
    "public_nombre": "Miriam Vásquez Silvera",
    "public_edad_aproximada": "65",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Jean azul camisa roja.",
    "photo_url": "https://venezuelatebusca.com/media/photos/a882954b-81a3-4367-82e5-463736c58b60.webp",
    "source_url": "https://buscardesaparecidos.com/caso/miriam-vasquez-silvera-iv07zw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-nathalia-gabriela-guevara-gomez-djew6d",
    "status": "active_search",
    "public_nombre": "Nathalia Gabriela Guevara Gómez",
    "public_edad_aproximada": "11",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/nathalia-gabriela-guevara-gomez-djew6d",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-tomas-alberto-gonzalez-irima-djy7tr",
    "status": "active_search",
    "public_nombre": "Tomás Alberto Gonzalez Irima",
    "public_edad_aproximada": "84",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/918fea0f-f4bb-4cc5-b8fc-444dc1302b7f.webp",
    "source_url": "https://buscardesaparecidos.com/caso/tomas-alberto-gonzalez-irima-djy7tr",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-mariannis-sojo-03lcg5",
    "status": "active_search",
    "public_nombre": "Mariannis Sojo",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "Naiguata",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Pantalón azul y camisa negra.",
    "source_url": "https://buscardesaparecidos.com/caso/mariannis-sojo-03lcg5",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:05.000000Z"
  },
  {
    "id": "external-bd-carlos-enrique-dominguez-yiavqe",
    "status": "active_search",
    "public_nombre": "Carlos Enrique Domínguez",
    "public_edad_aproximada": "65",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Tiene dificultad visual.",
    "photo_url": "https://venezuelatebusca.com/media/photos/7fa7e1cd-47fa-4537-bf57-91afac8f0b56.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/carlos-enrique-dominguez-yiavqe",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-juan-silva-salgado-7qsd7c",
    "status": "active_search",
    "public_nombre": "Juan Silva Salgado",
    "public_edad_aproximada": "60",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/11241851-03cb-4f6d-b3a9-667011ab5fd3.webp",
    "source_url": "https://buscardesaparecidos.com/caso/juan-silva-salgado-7qsd7c",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-brayne-alek-delgado-chavez-s47goi",
    "status": "active_search",
    "public_nombre": "Brayne Alek Delgado Chávez",
    "public_edad_aproximada": "8",
    "public_ciudad_sector": "Guayra",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/914f2cc0-7d5c-4056-8d56-a63a6f4aa83e.webp",
    "source_url": "https://buscardesaparecidos.com/caso/brayne-alek-delgado-chavez-s47goi",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-omar-cardenas-8lkvb9",
    "status": "active_search",
    "public_nombre": "Omar Cardenas",
    "public_edad_aproximada": "67",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Edificio misión vivienda playa los cocos la guaira.",
    "photo_url": "https://venezuelatebusca.com/media/photos/2d521839-ec74-4b25-b3ce-fe6e37b17baa.webp",
    "source_url": "https://buscardesaparecidos.com/caso/omar-cardenas-8lkvb9",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-luisana-munoz-lgvxi6",
    "status": "active_search",
    "public_nombre": "Luisana Muñoz",
    "public_edad_aproximada": "58",
    "public_ciudad_sector": "Caracas",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/luisana-munoz-lgvxi6",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-anarabia-sofia-lomelli-veramendi-7c0c18",
    "status": "active_search",
    "public_nombre": "Anarabia Sofía Lomelli Veramendi",
    "public_edad_aproximada": "17",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/f1348be3-c01f-4149-9f4d-12d6a74b0265.webp",
    "source_url": "https://buscardesaparecidos.com/caso/anarabia-sofia-lomelli-veramendi-7c0c18",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-carlos-jose-gomez-jxetgc",
    "status": "active_search",
    "public_nombre": "Carlos José Gómez",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Pariata",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/d878ad42-0310-4ee6-af42-8dc9fdefe858.webp",
    "source_url": "https://buscardesaparecidos.com/caso/carlos-jose-gomez-jxetgc",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:04.000000Z"
  },
  {
    "id": "external-bd-yimvert-berroteran-qo4nhc",
    "status": "active_search",
    "public_nombre": "Yimvert Berroteran",
    "public_edad_aproximada": "18",
    "public_ciudad_sector": "Los corales",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: No sé.",
    "source_url": "https://buscardesaparecidos.com/caso/yimvert-berroteran-qo4nhc",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:03.000000Z"
  },
  {
    "id": "external-bd-juan-francisco-pacheco-marrero-dcovox",
    "status": "active_search",
    "public_nombre": "Juan Francisco Pacheco Marrero",
    "public_edad_aproximada": "30",
    "public_ciudad_sector": "Tanaguarenas vargas",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/juan-francisco-pacheco-marrero-dcovox",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:03.000000Z"
  },
  {
    "id": "external-bd-maria-fernanda-mayora-ob7m1z",
    "status": "active_search",
    "public_nombre": "Maria Fernanda Mayora",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Tiene un bebe de 2 años.",
    "source_url": "https://buscardesaparecidos.com/caso/maria-fernanda-mayora-ob7m1z",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:03.000000Z"
  },
  {
    "id": "external-bd-vicky-urdaneta-kjgm2o",
    "status": "active_search",
    "public_nombre": "Vicky Urdaneta",
    "public_edad_aproximada": "21",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/54d0101b-5839-4f27-b002-dfeef713b3c3.webp",
    "source_url": "https://buscardesaparecidos.com/caso/vicky-urdaneta-kjgm2o",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:03.000000Z"
  },
  {
    "id": "external-bd-yeferson-gonzales-xgjmro",
    "status": "active_search",
    "public_nombre": "Yeferson Gonzales",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/2c098110-74a9-432d-85f6-b4e7275693a6.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yeferson-gonzales-xgjmro",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-leonardo-garcia-yvpstw",
    "status": "active_search",
    "public_nombre": "Leonardo García",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/leonardo-garcia-yvpstw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-johan-betancurt-ru7sg1",
    "status": "active_search",
    "public_nombre": "Johan Betancurt",
    "public_edad_aproximada": "49",
    "public_ciudad_sector": "Playa Grande, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/johan-betancurt-ru7sg1",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-antonio-rodriguez-i9hkxq",
    "status": "active_search",
    "public_nombre": "Antonio Rodriguez",
    "public_edad_aproximada": "60",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Reside en el 10 de Marzo pero estaba en caraballeda en el momento del terremoto.",
    "photo_url": "https://venezuelatebusca.com/media/photos/0725a7b5-978f-45ad-b963-0c0d7d404c79.webp",
    "source_url": "https://buscardesaparecidos.com/caso/antonio-rodriguez-i9hkxq",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-alfonso-espinoza-s5n8kj",
    "status": "active_search",
    "public_nombre": "Alfonso Espinoza",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/aba9b526-8c55-417e-88fa-3b7f28d93935.jpg",
    "source_url": "https://buscardesaparecidos.com/caso/alfonso-espinoza-s5n8kj",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-jose-francisco-cervantes-blanco-zntavp",
    "status": "active_search",
    "public_nombre": "Jose Francisco Cervantes Blanco",
    "public_edad_aproximada": "54",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: No se.",
    "photo_url": "https://venezuelatebusca.com/media/photos/8e9e2da3-a309-4dfb-9879-d0aed335abc5.webp",
    "source_url": "https://buscardesaparecidos.com/caso/jose-francisco-cervantes-blanco-zntavp",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-emmanuel-alejandro-hernandez-tovar-gpv25b",
    "status": "active_search",
    "public_nombre": "Emmanuel Alejandro Hernández Tovar",
    "public_edad_aproximada": "18",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/emmanuel-alejandro-hernandez-tovar-gpv25b",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-oswely-suarez-axmasv",
    "status": "active_search",
    "public_nombre": "Oswely Suarez",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/456078e7-37f0-4439-adec-a03296ecb5d5.webp",
    "source_url": "https://buscardesaparecidos.com/caso/oswely-suarez-axmasv",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-carlos-jose-zambrano-c7q0w7",
    "status": "active_search",
    "public_nombre": "Carlos José Zambrano",
    "public_edad_aproximada": "66",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/524363ad-7a34-4aca-b5dd-f425a4204dfb.webp",
    "source_url": "https://buscardesaparecidos.com/caso/carlos-jose-zambrano-c7q0w7",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:57:02.000000Z"
  },
  {
    "id": "external-bd-petra-sifonte-y-oscar-burgos-sifonte-burgos-i7bipw",
    "status": "active_search",
    "public_nombre": "Petra Sifonte y Oscar Burgos Sifonte-Burgos",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/7ad56623-b99c-4f41-a114-01f14ee525b7.webp",
    "source_url": "https://buscardesaparecidos.com/caso/petra-sifonte-y-oscar-burgos-sifonte-burgos-i7bipw",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-wilmen-arraiz-uwzygk",
    "status": "active_search",
    "public_nombre": "Wilmen Arraiz",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/83be3399-75ad-46aa-92c1-98f340d3e402.webp",
    "source_url": "https://buscardesaparecidos.com/caso/wilmen-arraiz-uwzygk",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-rafaela-maria-teran-jimenez-4jbobp",
    "status": "active_search",
    "public_nombre": "Rafaela Maria Teran Jimenez",
    "public_edad_aproximada": "60",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/51362907-085f-4f5d-b5e8-6624a5848e60.webp",
    "source_url": "https://buscardesaparecidos.com/caso/rafaela-maria-teran-jimenez-4jbobp",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-manuel-diaz-q29wvz",
    "status": "active_search",
    "public_nombre": "Manuel Diaz",
    "public_edad_aproximada": "57",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: SIN NOTICIA.",
    "source_url": "https://buscardesaparecidos.com/caso/manuel-diaz-q29wvz",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-orlando-gonzalez-nai32a",
    "status": "active_search",
    "public_nombre": "Orlando Gonzalez",
    "public_edad_aproximada": "77",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/42d62548-c80c-4dac-adb8-0fb35816d18e.webp",
    "source_url": "https://buscardesaparecidos.com/caso/orlando-gonzalez-nai32a",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-oliver-eduardo-tortolero-castillo-y89wfe",
    "status": "active_search",
    "public_nombre": "Oliver Eduardo Tortolero Castillo",
    "public_edad_aproximada": "18",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/oliver-eduardo-tortolero-castillo-y89wfe",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-yuli-parlione-kdk1ns",
    "status": "active_search",
    "public_nombre": "Yuli Parlione",
    "public_edad_aproximada": "65",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Cabello corto entre rojizo y cobrizo. Tez morena, contextura delgada..",
    "photo_url": "https://venezuelatebusca.com/media/photos/f17a8ecf-9c48-4650-ab9e-ea377bafac5e.webp",
    "source_url": "https://buscardesaparecidos.com/caso/yuli-parlione-kdk1ns",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-fraibert-nazareth-gomez-rivas-5k7hqt",
    "status": "active_search",
    "public_nombre": "Fraibert Nazareth Gomez Rivas",
    "public_edad_aproximada": "20",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/b6c73a30-b663-4694-a141-0fa276bb57e7.webp",
    "source_url": "https://buscardesaparecidos.com/caso/fraibert-nazareth-gomez-rivas-5k7hqt",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-cinthia-torre-sandoval-3rgmxv",
    "status": "active_search",
    "public_nombre": "Cinthia Torre Sandoval",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/cinthia-torre-sandoval-3rgmxv",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-viviana-caruzzo-voluntis-crrpsr",
    "status": "active_search",
    "public_nombre": "Viviana Caruzzo Voluntis",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Caracas",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/viviana-caruzzo-voluntis-crrpsr",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-luis-corona-yij2uj",
    "status": "active_search",
    "public_nombre": "Luis Corona",
    "public_edad_aproximada": "63",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: jean azul camisa negra.",
    "photo_url": "https://venezuelatebusca.com/media/photos/628fddc4-94f6-4978-9a9c-d29f06ebb795.webp",
    "source_url": "https://buscardesaparecidos.com/caso/luis-corona-yij2uj",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-aymarin-perez-yvgtki",
    "status": "active_search",
    "public_nombre": "Aymarin Perez",
    "public_edad_aproximada": "32",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/aymarin-perez-yvgtki",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-juan-alberto-rodriguez-rodriguez-c22b58",
    "status": "active_search",
    "public_nombre": "Juan Alberto Rodriguez Rodriguez",
    "public_edad_aproximada": "63",
    "public_ciudad_sector": "Moron edo falcon",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/juan-alberto-rodriguez-rodriguez-c22b58",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-carolina-delgado-5hondy",
    "status": "active_search",
    "public_nombre": "Carolina Delgado",
    "public_edad_aproximada": "64",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Se encontraba en tanaguarenas, alrededor del edificio tanamar. No sabemos nada de ella desde los sucesos del 24/06.",
    "photo_url": "https://venezuelatebusca.com/media/photos/d2b9eb3f-8478-46e6-a883-1d7c42aaa0f4.webp",
    "source_url": "https://buscardesaparecidos.com/caso/carolina-delgado-5hondy",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:03.000000Z"
  },
  {
    "id": "external-bd-carlos-jose-zambrano-hp2vya",
    "status": "active_search",
    "public_nombre": "Carlos José Zambrano",
    "public_edad_aproximada": "66",
    "public_ciudad_sector": "Zona por confirmar",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/carlos-jose-zambrano-hp2vya",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-maria-luisa-mata-rondon-t3expi",
    "status": "active_search",
    "public_nombre": "Maria Luisa Mata Rondón",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/ad728798-dd6f-445a-9dab-653f47124a8e.webp",
    "source_url": "https://buscardesaparecidos.com/caso/maria-luisa-mata-rondon-t3expi",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-alberto-fernandez-monilo-yqtjvd",
    "status": "active_search",
    "public_nombre": "Alberto Fernandez Monilo",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "Caracas",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/alberto-fernandez-monilo-yqtjvd",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-ruben-moreno-6sfqvx",
    "status": "active_search",
    "public_nombre": "Rubén Moreno",
    "public_edad_aproximada": "65",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/53bbaf77-7ac0-4865-ab9e-ecbc1fdb264e.webp",
    "source_url": "https://buscardesaparecidos.com/caso/ruben-moreno-6sfqvx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-jabricio-gutierrez-hba6gd",
    "status": "active_search",
    "public_nombre": "Jabricio Gutierrez",
    "public_edad_aproximada": "",
    "public_ciudad_sector": "hospital perez carreno",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Encontrado en lista hospitalaria de Hospital Dr. Miguel Pérez Carreño. La persona figura como ingresada. Procedencia La Guaira. NUEVO. Que Dios lo bendiga (Si el pariente lo confir.",
    "source_url": "https://buscardesaparecidos.com/caso/jabricio-gutierrez-hba6gd",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-lizmar-gonzalez-rodriguez-nv0iym",
    "status": "active_search",
    "public_nombre": "Lizmar González Rodríguez",
    "public_edad_aproximada": "19",
    "public_ciudad_sector": "Urbanización Hugo Chávez",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Sin conocimiento.",
    "source_url": "https://buscardesaparecidos.com/caso/lizmar-gonzalez-rodriguez-nv0iym",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:55:02.000000Z"
  },
  {
    "id": "external-bd-nanaj-serrano-oiwpxj",
    "status": "found",
    "public_nombre": "Nanaj Serrano",
    "public_edad_aproximada": "67",
    "public_ciudad_sector": "Caracas",
    "public_resumen": "Caso marcado como encontrado en la fuente pública consultada. Verifica siempre la fuente antes de compartir nuevos datos.",
    "source_url": "https://buscardesaparecidos.com/caso/nanaj-serrano-oiwpxj",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-ketty-arcaya-im5fyx",
    "status": "active_search",
    "public_nombre": "Ketty Arcaya",
    "public_edad_aproximada": "50",
    "public_ciudad_sector": "Caribe, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/746dd027-345f-4da6-a414-3ee23d494c66.webp",
    "source_url": "https://buscardesaparecidos.com/caso/ketty-arcaya-im5fyx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-mirla-narvaez-salazar-tjzirx",
    "status": "active_search",
    "public_nombre": "Mirla Narvaez Salazar",
    "public_edad_aproximada": "58",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Piel blanca cabello negro liso mide 1.67 contextura delgada.",
    "photo_url": "https://venezuelatebusca.com/media/photos/912d0932-56b2-43e7-9091-2194dbcc44f7.webp",
    "source_url": "https://buscardesaparecidos.com/caso/mirla-narvaez-salazar-tjzirx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-arturo-alkibelis-garcia-x8aggx",
    "status": "active_search",
    "public_nombre": "Arturo Alkibelis Garcia",
    "public_edad_aproximada": "25",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Camisa rosa.",
    "source_url": "https://buscardesaparecidos.com/caso/arturo-alkibelis-garcia-x8aggx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-michelle-tovar-c0cfmj",
    "status": "active_search",
    "public_nombre": "Michelle Tovar",
    "public_edad_aproximada": "35",
    "public_ciudad_sector": "Maracay",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/cf380979-f555-4e95-8eb4-d0cd85e53de3.webp",
    "source_url": "https://buscardesaparecidos.com/caso/michelle-tovar-c0cfmj",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-carolina-delgado-wy3cdr",
    "status": "active_search",
    "public_nombre": "Carolina Delgado",
    "public_edad_aproximada": "64",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Persona reportada en búsqueda. Descripción pública disponible: Se encontraba en tanaguarenas, alrededor del edificio tanamar.",
    "source_url": "https://buscardesaparecidos.com/caso/carolina-delgado-wy3cdr",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-migdalia-mayora-x9mxxx",
    "status": "active_search",
    "public_nombre": "Migdalia Mayora",
    "public_edad_aproximada": "46",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "source_url": "https://buscardesaparecidos.com/caso/migdalia-mayora-x9mxxx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-dionisia-ramona-dominguez-xexnvx",
    "status": "active_search",
    "public_nombre": "Dionisia Ramona Domínguez",
    "public_edad_aproximada": "83",
    "public_ciudad_sector": "Catia La Mar, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/ad039102-908c-4ea8-86e4-0832070c063c.webp",
    "source_url": "https://buscardesaparecidos.com/caso/dionisia-ramona-dominguez-xexnvx",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-adriannis-valeria-briceno-sojo-bddsbs",
    "status": "active_search",
    "public_nombre": "Adriannis Valeria Briceño Sojo",
    "public_edad_aproximada": "12",
    "public_ciudad_sector": "Caraballeda, La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/03cd69ab-c15f-4fe7-8ed7-464db7537766.webp",
    "source_url": "https://buscardesaparecidos.com/caso/adriannis-valeria-briceno-sojo-bddsbs",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  },
  {
    "id": "external-bd-raul-cruz-altuve-09jpad",
    "status": "active_search",
    "public_nombre": "Raul Cruz Altuve",
    "public_edad_aproximada": "70",
    "public_ciudad_sector": "La Guaira",
    "public_resumen": "Caso publicado en una fuente pública de búsqueda. Se muestra información general y se omiten contactos personales o datos sensibles.",
    "photo_url": "https://venezuelatebusca.com/media/photos/0da8dc61-b89f-4ece-975c-df070b00a305.webp",
    "source_url": "https://buscardesaparecidos.com/caso/raul-cruz-altuve-09jpad",
    "source_label": "Buscar Desaparecidos",
    "source_type": "Fuente externa pública",
    "updated_at": "2026-06-26T16:53:02.000000Z"
  }
];

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
const publicSearch = document.querySelector("#publicSearch");
const publicStats = document.querySelector("#publicStats");
const publicFilters = document.querySelectorAll("[data-public-status]");
const publicShowMore = document.querySelector("#publicShowMore");
const centerSearch = document.querySelector("#centerSearch");
const centerStats = document.querySelector("#centerStats");
const centersMap = document.querySelector("#centersMap");
const centersList = document.querySelector("#centersList");
const exportReports = document.querySelector("#exportReports");
const clearReports = document.querySelector("#clearReports");
const correctionRequestForm = document.querySelector("#correctionRequestForm");
const correctionStatus = document.querySelector("#correctionStatus");
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

  target.scrollIntoView({ behavior: replace ? "auto" : "smooth", block: "start" });
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
  if (!term) return supportCenters;
  return supportCenters.filter((center) =>
    normalizeText([center.name, center.city, center.type, center.description].join(" ")).includes(term)
  );
}

function renderCenters() {
  if (!centersList || !centersMap) return;
  const centers = filterCenters();
  centerStats.textContent = `${centers.length} centro(s)`;

  centersMap.innerHTML = centers
    .map((center, index) => {
      const x = Math.max(8, Math.min(92, ((center.lng + 100) / 45) * 100));
      const y = Math.max(8, Math.min(92, 100 - ((center.lat + 40) / 55) * 100));
      return `<button class="map-pin" style="left:${x}%;top:${y}%;" type="button" data-center-index="${index}" aria-label="${escapeHtml(center.name)}">${index + 1}</button>`;
    })
    .join("");

  centersList.innerHTML = centers
    .map((center, index) => `
      <article class="center-card" data-center-card="${index}">
        <span class="contact-category">${escapeHtml(center.type)}</span>
        <h3>${escapeHtml(center.name)}</h3>
        <p>${escapeHtml(center.description)}</p>
        <div class="case-meta">
          <span class="pill">${escapeHtml(center.city)}</span>
          <span class="pill">Verificar antes de compartir</span>
        </div>
        ${center.url ? `<a class="secondary-btn" href="${escapeHtml(center.url)}" target="_blank" rel="noopener">Abrir fuente</a>` : ""}
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
  return createReport({
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

  const safeCases = (data || []).map((item) => ({
    ...item,
    source_url: item.public_source_url,
    photo_url: item.public_photo_url,
    source_type: "Reporte revisado por el equipo",
  }));
  return [...safeCases, ...externalPublicCases];
}

async function renderPublicCases() {
  const cases = await loadPublicCases();
  const filteredCases = filterPublicCases(cases);
  const visibleCases = filteredCases.slice(0, publicVisibleCount);

  if (!cases.length) {
    publicStats.textContent = "Sin casos publicados";
    publicCasesList.innerHTML = '<div class="empty-state">Aún no hay casos aprobados para públicación.</div>';
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
    detail: correctionRequestForm.detail.value.trim(),
    requester_name: correctionRequestForm.requester_name.value.trim(),
    requester_contact_private: correctionRequestForm.requester_contact.value.trim(),
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
renderCenters();
routeFromCurrentUrl();
