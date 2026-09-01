import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { notifications } from "~/drizzle/schema";
import { sql, gt } from "drizzle-orm";

export async function addNotification(notification: InferInsertModel<typeof notifications>) {
    const [insert] = await db.insert(notifications).values(notification).returning();
    return insert
}

export function getNotifications(filter: { userId: string }) {
    return db.query.notifications.findMany({
        where: {
            recipientId: filter.userId
        },
        orderBy: {
            notificationId: "desc"
        }
    })
}

export async function truncateUserNotifications() {
    const rankedSq = db
        .$with("ranked_notifications")
        .as(
            db.select({
                notificationId: notifications.notificationId,
                rowNum: sql<number>`ROW_NUMBER() OVER (
                    PARTITION BY ${notifications.recipientId} 
                    ORDER BY ${notifications.createdAt} DESC, ${notifications.notificationId} DESC
                )`.as("row_num"),
            })
                .from(notifications)
        );

    await db
        .with(rankedSq)
        .delete(notifications)
        .where(
            sql`${notifications.notificationId} IN (
                SELECT ${rankedSq.notificationId} 
                FROM ${rankedSq} 
                WHERE ${rankedSq.rowNum} > 20)
            `);
}