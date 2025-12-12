import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	actors: {
		games: r.many.games({
			from: r.actors.actorId.through(r.gameActors.actorId),
			to: r.games.gameId.through(r.gameActors.gameId)
		}),
	},
	games: {
		actors: r.many.actors(),
		platforms: r.many.platforms({
			from: r.games.gameId.through(r.gamePlatforms.gameId),
			to: r.platforms.platformId.through(r.gamePlatforms.platformId)
		}),
		tags: r.many.tags({
			from: r.games.gameId.through(r.gameTags.gameId),
			to: r.tags.name.through(r.gameTags.tagName)
		}),
	},
	platforms: {
		games: r.many.games(),
	},
	tags: {
		games: r.many.games(),
	},
	developers: {
		publishers: r.many.publishers({
			from: r.developers.developerId.through(r.games.developerId),
			to: r.publishers.publisherId.through(r.games.publisherId)
		}),
	},
	publishers: {
		developers: r.many.developers(),
	},
}))