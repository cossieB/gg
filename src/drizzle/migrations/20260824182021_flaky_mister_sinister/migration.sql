CREATE TYPE "reaction_type" AS ENUM('like', 'dislike');--> statement-breakpoint
CREATE TYPE "role_type" AS ENUM('player character', 'major character', 'minor character');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" varchar,
	"user_agent" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"display_name" varchar(15) NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text DEFAULT 'users/default_avatar.png' NOT NULL,
	"banner" text DEFAULT 'users/default_banner.jpg' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"username" varchar(15) NOT NULL UNIQUE,
	"display_username" varchar(15) NOT NULL UNIQUE,
	"role" varchar(10) DEFAULT 'user' NOT NULL,
	"bio" varchar(255) DEFAULT '' NOT NULL,
	"dob" date,
	"location" varchar(100),
	"links" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "actors" (
	"actor_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "actors_actor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"photo" text,
	"bio" text DEFAULT '' NOT NULL,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_reactions" (
	"user_id" uuid,
	"comment_id" integer,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"reaction" "reaction_type" NOT NULL,
	CONSTRAINT "comment_reactions_pkey" PRIMARY KEY("comment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"comment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"text" varchar(255) NOT NULL,
	"reply_to" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_on" timestamp with time zone NOT NULL,
	CONSTRAINT "comment_min_length" CHECK (LENGTH("text") > 0)
);
--> statement-breakpoint
CREATE TABLE "developers" (
	"developer_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "developers_developer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"logo" text NOT NULL,
	"location" varchar,
	"summary" text DEFAULT '' NOT NULL,
	"country" varchar,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follower_followee" (
	"follower_id" uuid,
	"followee_id" uuid,
	"date_followed" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follower_followee_pkey" PRIMARY KEY("follower_id","followee_id")
);
--> statement-breakpoint
CREATE TABLE "game_actors" (
	"appearance_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_actors_appearance_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"actor_id" integer NOT NULL,
	"character" varchar NOT NULL,
	"role_type" "role_type" DEFAULT 'major character'::"role_type" NOT NULL,
	CONSTRAINT "game_actors_game_id_actor_id_unique" UNIQUE("game_id","actor_id")
);
--> statement-breakpoint
CREATE TABLE "game_genres" (
	"game_id" integer,
	"genre" varchar,
	CONSTRAINT "game_genres_pkey" PRIMARY KEY("game_id","genre")
);
--> statement-breakpoint
CREATE TABLE "game_platforms" (
	"game_id" integer,
	"platform_id" integer,
	CONSTRAINT "game_platforms_pkey" PRIMARY KEY("game_id","platform_id")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"game_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "games_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"developer_id" integer NOT NULL,
	"publisher_id" integer NOT NULL,
	"release_date" date NOT NULL,
	"cover" text NOT NULL,
	"banner" text NOT NULL,
	"trailer" text,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL,
	"search_vector" tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, (COALESCE(title, ''::character varying))::text), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(summary, ''::text)), 'B'::"char"))) STORED
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"name" varchar PRIMARY KEY,
	"description" text DEFAULT '' NOT NULL,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"key" text PRIMARY KEY,
	"content_type" varchar NOT NULL,
	"post_id" integer,
	"game_id" integer,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"platform_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "platforms_platform_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"logo" text NOT NULL,
	"release_date" date NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_reactions" (
	"user_id" uuid,
	"post_id" integer,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"reaction" "reaction_type" NOT NULL,
	CONSTRAINT "post_reactions_pkey" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"tag_name" varchar(25),
	"post_id" integer,
	CONSTRAINT "post_tags_pkey" PRIMARY KEY("tag_name","post_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"post_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"title" varchar(20) NOT NULL,
	"game_id" integer,
	"text" varchar(1000) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_on" timestamp with time zone NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"link" text,
	"search_vector" tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, (COALESCE(title, ''::character varying))::text), 'A'::"char") || setweight(to_tsvector('english'::regconfig, (COALESCE(text, ''::character varying))::text), 'B'::"char"))) STORED
);
--> statement-breakpoint
CREATE TABLE "publishers" (
	"publisher_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "publishers_publisher_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"logo" text NOT NULL,
	"headquarters" varchar,
	"summary" text DEFAULT '' NOT NULL,
	"country" varchar,
	"date_added" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");--> statement-breakpoint
CREATE INDEX "comments_post_id_index" ON "comments" ("post_id");--> statement-breakpoint
CREATE INDEX "games_search_vector_index" ON "games" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "games_developer_id_index" ON "games" ("developer_id");--> statement-breakpoint
CREATE INDEX "games_publisher_id_index" ON "games" ("publisher_id");--> statement-breakpoint
CREATE INDEX "media_post_id_game_id_index" ON "media" ("post_id","game_id");--> statement-breakpoint
CREATE INDEX "posts_search_vector_index" ON "posts" USING gin ("search_vector");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_reply_to_comments_comment_id_fkey" FOREIGN KEY ("reply_to") REFERENCES "comments"("comment_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "follower_followee" ADD CONSTRAINT "follower_followee_follower_id_users_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "follower_followee" ADD CONSTRAINT "follower_followee_followee_id_users_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "game_actors" ADD CONSTRAINT "game_actors_game_id_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_actors" ADD CONSTRAINT "game_actors_actor_id_actors_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("actor_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_game_id_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_genre_genres_name_fkey" FOREIGN KEY ("genre") REFERENCES "genres"("name") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_platforms_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("platform_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_developer_id_developers_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("developer_id");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_publisher_id_publishers_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("publisher_id");--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_post_id_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_game_id_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_game_id_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE SET NULL;