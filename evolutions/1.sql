CREATE TABLE public.user (
    "id"         character varying NOT NULL,
    "telegramId" integer           NOT NULL UNIQUE
);

CREATE TABLE public.feed_item (
    id            character varying           NOT NULL,
    url           character varying           NOT NULL,
    hash          character varying           NOT NULL,
    author        character varying           NOT NULL,
    title         character varying           NOT NULL,
    description   character varying           NOT NULL,
    "originalUrl" character varying           NOT NULL,
    "createdAt"   timestamp without time zone NOT NULL,
    "ownerId"     character varying
);

ALTER TABLE ONLY public.user
    ADD CONSTRAINT "PK_user_id" PRIMARY KEY (id);

ALTER TABLE ONLY public.feed_item
    ADD CONSTRAINT "PK_feed_item_id" PRIMARY KEY (id);

ALTER TABLE ONLY public.feed_item
    ADD CONSTRAINT "FK_owner" FOREIGN KEY ("ownerId") REFERENCES public."user"(id);

#DOWN

DROP TABLE public.feed_item;
DROP TABLE public.user;
