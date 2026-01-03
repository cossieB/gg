import { and, eq, SQL } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { User } from "~/drizzle/models";
import { users } from "~/drizzle/schema/auth";

export async function findById(userId: string) {
    const user = await userQuery(eq(users.id, userId))
    return user.at(0)
}

export async function findByUsername(username: string) {
    const user = await userQuery(eq(users.username, username))
    return user.at(0)
}

export async function updateUser(userId: string, user: Partial<User>) {
    return db.update(users).set(user).where(eq(users.id, userId)).returning()
}

function userQuery(...where: SQL[]) {
    return db.select({
        userId: users.id,
        displayName: users.displayName,
        bio: users.bio,
        image: users.image,
        banner: users.banner,
        username: users.username,
        displayUsername: users.displayName,
        dob: users.dob,
        location: users.location
    })
        .from(users)
        .where(and(...where))
}