import { db } from "~/drizzle/db";

export function findById(actorId: number) {
    return db.query.actorsView.findFirst({
        where: {
            actorId
        }
    })
}