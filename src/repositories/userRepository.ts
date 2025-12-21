import { eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { users } from "~/drizzle/schema/auth";

export async function findById(userId: string) {
    return db.select({
        userId: users.id,
        name: users.displayName,
        bio: users.bio,
        image: users.image,
        banner: users.banner,
        username: users.username,
        displayUsername: users.displayName,
        dob: users.dob,
        location: users.location
    })
    .from(users)
    .where(eq(users.id, userId))
}