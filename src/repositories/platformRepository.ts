import { db } from "~/drizzle/db";

export function findAll() {
    return db.query.platformsView.findMany()
}

export function findById(platformId: number) {
    return db.query.platformsView.findFirst({
        where: {
            platformId
        }
    })
}