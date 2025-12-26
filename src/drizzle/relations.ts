import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/";

export const relations = defineRelations(schema, (r) => ({
	games: {
		developer: r.one.developers({
			from: r.games.developerId,
			to: r.developers.developerId
		}),
		publisher: r.one.publishers({
			from: r.games.publisherId,
			to: r.publishers.publisherId
		}),
		platforms: r.many.platforms({
			from: r.games.gameId.through(r.gamePlatforms.gameId),
			to: r.platforms.platformId.through(r.gamePlatforms.platformId)
		}),
		genres: r.many.genres({
			from: r.games.gameId.through(r.gameGenres.gameId),
			to: r.genres.name.through(r.gameGenres.genre)
		}),
	},
	posts: {
		author: r.one.users({
			from: r.posts.userId,
			to: r.users.id
		})
	}
}))