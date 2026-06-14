--
-- PostgreSQL database dump
--

\restrict aNFfMjY1jouayx6QcvV7mY9SZvYaLaAvBofV5o7JQltkTIjDiIMjmR0cNZTgQU8

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: estados_clientes; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_clientes AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.estados_clientes OWNER TO postgres;

--
-- Name: estados_proyectos; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_proyectos AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.estados_proyectos OWNER TO postgres;

--
-- Name: estados_tareas; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_tareas AS ENUM (
    'PENDIENTE',
    'FINALIZADA',
    'BAJA'
);


ALTER TYPE public.estados_tareas OWNER TO postgres;

--
-- Name: estados_usuarios; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_usuarios AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.estados_usuarios OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_clientes NOT NULL,
    telefono text,
    email text
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
-- Name: metas_intermedias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metas_intermedias (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    id_proyecto integer NOT NULL
);


ALTER TABLE public.metas_intermedias OWNER TO postgres;

--
-- Name: metas_intermedias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metas_intermedias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metas_intermedias_id_seq OWNER TO postgres;

--
-- Name: metas_intermedias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metas_intermedias_id_seq OWNED BY public.metas_intermedias.id;


--
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_proyectos NOT NULL,
    id_cliente integer,
    fecha_finalizacion_objetivo date
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
    descripcion text NOT NULL,
    estado public.estados_tareas NOT NULL,
    id_proyecto integer NOT NULL,
    id_meta_intermedia integer,
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
    nombre text NOT NULL,
    clave text NOT NULL,
    estado public.estados_usuarios NOT NULL
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
-- Name: metas_intermedias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias ALTER COLUMN id SET DEFAULT nextval('public.metas_intermedias_id_seq'::regclass);


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
-- Name: clientes clientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_nombre_key UNIQUE (nombre);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: columnas columnas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columnas
    ADD CONSTRAINT columnas_pkey PRIMARY KEY (id);


--
-- Name: metas_intermedias metas_intermedias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias
    ADD CONSTRAINT metas_intermedias_pkey PRIMARY KEY (id);


--
-- Name: proyectos proyectos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_nombre_key UNIQUE (nombre);


--
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_key UNIQUE (nombre);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: metas_intermedias fk_metas_intermedias_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias
    ADD CONSTRAINT fk_metas_intermedias_proyecto FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- Name: proyectos fk_proyectos_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT fk_proyectos_cliente FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- Name: tareas fk_tareas_meta_intermedia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_tareas_meta_intermedia FOREIGN KEY (id_meta_intermedia) REFERENCES public.metas_intermedias(id) ON DELETE SET NULL;


--
-- Name: tareas fk_tareas_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_tareas_proyecto FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict aNFfMjY1jouayx6QcvV7mY9SZvYaLaAvBofV5o7JQltkTIjDiIMjmR0cNZTgQU8

