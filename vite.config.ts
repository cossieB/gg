import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteSolid from 'vite-plugin-solid'
import {nitro} from "nitro/vite"

export default defineConfig({
  server: {
    port: 1337,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    nitro(),
    tanstackStart(),
    viteSolid({ ssr: true }),
  ],
  build: {
    rollupOptions: {
      external: ['jsdom'],
    }
  }
})
