import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  define: {
    __DEV__: true,
    __PROFILE__: true,
    __UMD__: true,
    __EXPERIMENTAL__: true,
    __VARIANT__: false,
  },
  resolve: {
    /*
    * Vite会先查找resolve.alias中配置的别名，如果找不到，才会查找node_modules中的包
    * 如果你在package.json中设置了name，并且你在resolve.alias中为这个包设置了别名，那么Vite将优先使用resolve.alias中的配置。
    * 这是因为在Vite的解析过程中，别名配置具有更高的优先级。
    * */
    alias: {
      '@': path.join(process.cwd(), 'src'),
      'react': path.join(process.cwd(), 'src/react/packages/react'),
      'react-dom': path.join(process.cwd(), 'src/react/packages/react-dom'),
      'react-dom-bindings': path.join(process.cwd(), 'src/react/packages/react-dom-bindings'),
      'react-reconciler': path.join(process.cwd(), 'src/react/packages/react-reconciler'),
      'shared': path.join(process.cwd(), 'src/react/packages/shared'),
      'scheduler': path.join(process.cwd(), 'src/react/packages/scheduler'),
      'react-client': path.join(process.cwd(), 'src/react/packages/react-client'),
    }
  }
})
