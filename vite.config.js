import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 相对路径 base，保证构建产物双击 index.html 即可打开（file:// 协议）
  base: './',
  build: { outDir: 'dist' },
})
