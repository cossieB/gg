import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    dialect: "postgresql",
    driver: "pglite",
    schema: "./src/drizzle/schema/index.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: "test-data",
    }
})