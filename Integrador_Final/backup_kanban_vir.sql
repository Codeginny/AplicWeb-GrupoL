--
-- PostgreSQL database dump
--

\restrict sRX0Fnr1FyaIwbdhOmE39DHkV09TlzkoF2ld0yVwgN7vbRrIlieObl4JJF6ftdZ

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: clientes_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clientes_estado_enum AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.clientes_estado_enum OWNER TO postgres;

--
-- Name: proyectos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proyectos_estado_enum AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.proyectos_estado_enum OWNER TO postgres;

--
-- Name: tareas_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tareas_estado_enum AS ENUM (
    'PENDIENTE',
    'EN_PROGRESO',
    'FINALIZADA',
    'BAJA'
);


ALTER TYPE public.tareas_estado_enum OWNER TO postgres;

--
-- Name: usuarios_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_estado_enum AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.usuarios_estado_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    estado public.clientes_estado_enum NOT NULL
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: columnas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.columnas (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    id_proyecto integer NOT NULL
);


ALTER TABLE public.columnas OWNER TO postgres;

--
-- Name: columnas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.columnas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.columnas_id_seq OWNER TO postgres;

--
-- Name: columnas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.columnas_id_seq OWNED BY public.columnas.id;


--
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    estado public.proyectos_estado_enum NOT NULL,
    id_cliente integer
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proyectos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyectos_id_seq OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proyectos_id_seq OWNED BY public.proyectos.id;


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    descripcion character varying NOT NULL,
    estado public.tareas_estado_enum,
    id_proyecto integer NOT NULL,
    id_columna integer,
    prioridad character varying,
    responsable character varying,
    fecha_entrega date
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    clave character varying NOT NULL,
    estado public.usuarios_estado_enum NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: columnas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columnas ALTER COLUMN id SET DEFAULT nextval('public.columnas_id_seq'::regclass);


--
-- Name: proyectos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos ALTER COLUMN id SET DEFAULT nextval('public.proyectos_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nombre, estado) FROM stdin;
1	Luis Leandro Rodriguez	ACTIVO
2	Maria Zurita	ACTIVO
\.


--
-- Data for Name: columnas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.columnas (id, nombre, orden, id_proyecto) FROM stdin;
1	Pendiente	1	1
2	En proceso	2	1
3	Terminado	3	1
4	Pendiente	1	2
5	En proceso	2	2
6	Terminado	3	2
7	Pendiente	1	3
8	En proceso	2	3
9	Terminado	3	3
\.


--
-- Data for Name: proyectos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectos (id, nombre, estado, id_cliente) FROM stdin;
2	Analisis de datos	ACTIVO	1
3	Administración y Finanzas	FINALIZADO	\N
1	Marketing 2.0	BAJA	2
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tareas (id, descripcion, estado, id_proyecto, id_columna, prioridad, responsable, fecha_entrega) FROM stdin;
1	Subir fotos	FINALIZADA	1	3	\N	\N	\N
3	Llamar a clientes	EN_PROGRESO	1	2	Media	Virginia	2026-06-20
4	Responder leads	PENDIENTE	1	1	Baja	Luis	2026-06-28
5	Estudio de mercado	PENDIENTE	1	3	Alta	Leandro	2026-06-11
7	Ajuste de estrategias	PENDIENTE	1	1	\N	Laura	2026-07-02
8	Extracción de datos	PENDIENTE	2	4	Baja	David	2026-07-04
9	Análisis estadístico	PENDIENTE	2	5	Media	Sandra	2026-06-20
10	Comunicación y reportes	PENDIENTE	2	6	Alta	Jazmin	2026-06-21
6	Análisis de métricas	FINALIZADA	1	3	Media	Alejandra	2026-06-25
12	Entregar informes	FINALIZADA	2	6	Baja	Juanito	2026-06-25
11	Identificar tendencias	PENDIENTE	2	4	Alta	Alexander	2026-06-23
13	Ajuste de estrategias 2.0	EN_PROGRESO	2	5	Alta	Pepito	2026-06-28
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, clave, estado) FROM stdin;
1	usuario	$2b$10$.TVjaQHKi686lYNiIFET7.T3S3neHM.Vgw2C8G/FsXvDf34jTflHe	ACTIVO
\.


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 2, true);


--
-- Name: columnas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.columnas_id_seq', 9, true);


--
-- Name: proyectos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proyectos_id_seq', 3, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_id_seq', 13, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: columnas PK_3735f841172becf0bd48288f2b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columnas
    ADD CONSTRAINT "PK_3735f841172becf0bd48288f2b4" PRIMARY KEY (id);


--
-- Name: proyectos PK_4763a49914127cbdde2143db52a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT "PK_4763a49914127cbdde2143db52a" PRIMARY KEY (id);


--
-- Name: tareas PK_9370ac1b0569cacf8cda6815c97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT "PK_9370ac1b0569cacf8cda6815c97" PRIMARY KEY (id);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: clientes PK_d76bf3571d906e4e86470482c08; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY (id);


--
-- Name: tareas FK_03f07b2f4c917637f21d25dba3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT "FK_03f07b2f4c917637f21d25dba3f" FOREIGN KEY (id_columna) REFERENCES public.columnas(id) ON DELETE SET NULL;


--
-- Name: columnas FK_0c314a7aabc56fe833c67f6b50d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columnas
    ADD CONSTRAINT "FK_0c314a7aabc56fe833c67f6b50d" FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- Name: tareas FK_14c3d06854635977033ed82536f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT "FK_14c3d06854635977033ed82536f" FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id);


--
-- Name: proyectos FK_4a72954620c7d7746cf547f3307; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT "FK_4a72954620c7d7746cf547f3307" FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- PostgreSQL database dump complete
--

\unrestrict sRX0Fnr1FyaIwbdhOmE39DHkV09TlzkoF2ld0yVwgN7vbRrIlieObl4JJF6ftdZ

