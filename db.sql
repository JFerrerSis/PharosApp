--
-- PostgreSQL database dump
--

\restrict bKvNeSulcG0NgFUr3Kmga71QyDPKjlNqQdKbpfXIAfpkK0ZqHP0B6F24uzdNLIZ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cajas; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public."Cajas" (
    id integer NOT NULL,
    farmacia_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Cajas" OWNER TO app;

--
-- Name: Cajas_id_seq; Type: SEQUENCE; Schema: public; Owner: app
--

CREATE SEQUENCE public."Cajas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cajas_id_seq" OWNER TO app;

--
-- Name: Cajas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app
--

ALTER SEQUENCE public."Cajas_id_seq" OWNED BY public."Cajas".id;


--
-- Name: Farmacias; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public."Farmacias" (
    cod_farmacia integer NOT NULL,
    descripcion character varying(255),
    rif character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Farmacias" OWNER TO app;

--
-- Name: UsuarioFarmacia; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public."UsuarioFarmacia" (
    codusuario integer NOT NULL,
    cod_farmacia integer NOT NULL,
    fecha_asignacion timestamp with time zone,
    activo boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UsuarioFarmacia" OWNER TO app;

--
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public."Usuarios" (
    codusuario integer NOT NULL,
    nombre character varying(255),
    password_hash character varying(255),
    rol character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Usuarios" OWNER TO app;

--
-- Name: Cajas id; Type: DEFAULT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."Cajas" ALTER COLUMN id SET DEFAULT nextval('public."Cajas_id_seq"'::regclass);


--
-- Data for Name: Cajas; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public."Cajas" (id, farmacia_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Farmacias; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public."Farmacias" (cod_farmacia, descripcion, rif, "createdAt", "updatedAt") FROM stdin;
101	RUBIO	J000000011	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
201	AV10	J000000022	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
301	FUENTE	J000000033	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
501	SEDE 0501	J000000055	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
701	LIMPIA	J000000077	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
801	COROMOTO	J000000088	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
1001	NORTE	J000000100	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
1101	COCHES	J000000111	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
1201	BELLA VISTA	J000000122	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
1601	MALL DELICIAS	J000000166	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
1701	MALL SUR	J000000177	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
2501	MERCEDEZ	J000000255	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
2601	INDIO MARA	J000000266	2026-02-27 12:44:44.023731-04	2026-02-27 12:44:44.023731-04
\.


--
-- Data for Name: UsuarioFarmacia; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public."UsuarioFarmacia" (codusuario, cod_farmacia, fecha_asignacion, activo, "createdAt", "updatedAt") FROM stdin;
30010237	1701	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30010237	1101	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30643489	301	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30643489	201	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30284565	801	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30284565	1701	\N	t	2026-02-27 12:47:56.641602-04	2026-02-27 12:47:56.641602-04
30643489	1201	\N	t	2026-02-27 12:49:19.533724-04	2026-02-27 12:49:19.533724-04
30643489	2501	\N	t	2026-02-27 12:49:19.533724-04	2026-02-27 12:49:19.533724-04
30284565	1601	\N	t	2026-02-27 12:49:19.533724-04	2026-02-27 12:49:19.533724-04
\.


--
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public."Usuarios" (codusuario, nombre, password_hash, rol, "createdAt", "updatedAt") FROM stdin;
30010237	Lbracho	$2b$10$3GZX7wD...	admin	2026-02-27 12:45:51.259142-04	2026-02-27 12:45:51.259142-04
30284565	eguerrero	$2b$10$nBC33dSR...	soporte	2026-02-27 12:45:51.259142-04	2026-02-27 12:45:51.259142-04
30643489	Joferrer	$2b$10$3GZX7wD...	admin	2026-02-27 12:45:51.259142-04	2026-02-27 12:45:51.259142-04
\.


--
-- Name: Cajas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app
--

SELECT pg_catalog.setval('public."Cajas_id_seq"', 1, false);


--
-- Name: Cajas Cajas_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_pkey" PRIMARY KEY (id);


--
-- Name: Farmacias Farmacias_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."Farmacias"
    ADD CONSTRAINT "Farmacias_pkey" PRIMARY KEY (cod_farmacia);


--
-- Name: Farmacias Farmacias_rif_key; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."Farmacias"
    ADD CONSTRAINT "Farmacias_rif_key" UNIQUE (rif);


--
-- Name: UsuarioFarmacia UsuarioFarmacia_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."UsuarioFarmacia"
    ADD CONSTRAINT "UsuarioFarmacia_pkey" PRIMARY KEY (codusuario, cod_farmacia);


--
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (codusuario);


--
-- Name: UsuarioFarmacia UsuarioFarmacia_cod_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."UsuarioFarmacia"
    ADD CONSTRAINT "UsuarioFarmacia_cod_farmacia_fkey" FOREIGN KEY (cod_farmacia) REFERENCES public."Farmacias"(cod_farmacia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UsuarioFarmacia UsuarioFarmacia_codusuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public."UsuarioFarmacia"
    ADD CONSTRAINT "UsuarioFarmacia_codusuario_fkey" FOREIGN KEY (codusuario) REFERENCES public."Usuarios"(codusuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict bKvNeSulcG0NgFUr3Kmga71QyDPKjlNqQdKbpfXIAfpkK0ZqHP0B6F24uzdNLIZ

