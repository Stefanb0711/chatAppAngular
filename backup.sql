--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id integer NOT NULL,
    name text,
    chat_partner integer,
    current_user_id integer,
    my_text_message text,
    chat_partner_message text,
    message_time timestamp without time zone
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: chats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chats_id_seq OWNER TO postgres;

--
-- Name: chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;


--
-- Name: user_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_chats (
    user_id integer NOT NULL,
    chat_id integer NOT NULL
);


ALTER TABLE public.user_chats OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text,
    email text,
    password text,
    contacts_of_user integer[],
    profile_picture text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: chats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (id, name, chat_partner, current_user_id, my_text_message, chat_partner_message, message_time) FROM stdin;
1	\N	7	5	nachrich	\N	2024-09-19 00:18:05
2	\N	8	5	eine nachrichtss	\N	2024-09-19 13:35:25
3	\N	8	5	djokdo	\N	2024-09-19 15:40:43
4	\N	7	5	dew	\N	2024-09-19 15:40:49
5	\N	8	5	mkmkm	\N	2024-09-19 16:37:34
6	\N	5	7	NAchricht von waderlust_anna	\N	2024-09-20 16:18:10
7	\N	8	5	nachricht von jane doe	\N	2024-09-20 16:47:13
8	\N	8	5	js	\N	2024-09-20 17:00:16
9	\N	8	5	dswq	\N	2024-09-20 17:01:45
10	\N	8	5	dswq	\N	2024-09-20 17:17:06
11	\N	8	5	nacjodjk	\N	2024-09-20 17:32:10
12	\N	5	7	nachricht	\N	2024-09-20 17:32:36
13	\N	8	5	noch was von jane doe	\N	2024-09-20 17:57:04
14	\N	7	5	\N	antwort von wanderlust	2024-09-20 17:58:07
15	\N	7	5	\N	Noch ne nachricvht	2024-09-20 23:44:21
16	\N	7	5	\N	und noich eine	2024-09-20 23:44:27
17	\N	7	5	\N	Pampampam	2024-09-20 23:44:33
\.


--
-- Data for Name: user_chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_chats (user_id, chat_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, contacts_of_user, profile_picture) FROM stdin;
6	coolguy_mike	mike.coolguy@example.com	password2	\N	\N
8	techguru99	techguru99@example.com	password4	\N	\N
9	sunny_vibes12	sunny.vibes12@example.com	password5	\N	\N
10	foodie_chef	foodie.chef@example.com	password6	\N	\N
11	adventure_kate	kate.adventure@example.com	password7	\N	\N
12	urban_jungle	urban.jungle@example.com	password8	\N	\N
13	coding_master	coding.master@example.com	password9	\N	\N
14	musiclover_x	musiclover.x@example.com	password10	\N	\N
15	fitness_freaky	fitness.freaky@example.com	password11	\N	\N
16	gamerboy77	gamerboy77@example.com	password12	\N	\N
17	travel_buddy	travel.buddy@example.com	password13	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
18	artistic_amy	amy.artistic@example.com	password14	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
19	nature_lover	nature.lover@example.com	password15	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
20	fashion_diva	fashion.diva@example.com	password16	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
21	coffee_addict	coffee.addict@example.com	password17	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
22	bookworm_jess	bookworm.jess@example.com	password18	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
23	photographer_john	john.photographer@example.com	password19	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
24	sportsfan_tom	sportsfan.tom@example.com	password20	\N	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
7	wanderlust_anna	anna.wanderlust@example.com	password3	{7,19,5}	\N
5	jane_doe21	jane.doe21@example.com	password1	{7,12,12,6,8,NULL}	https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg
\.


--
-- Name: chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chats_id_seq', 17, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 24, true);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: user_chats user_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_chats
    ADD CONSTRAINT user_chats_pkey PRIMARY KEY (user_id, chat_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: chats fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT fk_user FOREIGN KEY (current_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_chats user_chats_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_chats
    ADD CONSTRAINT user_chats_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: user_chats user_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_chats
    ADD CONSTRAINT user_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

