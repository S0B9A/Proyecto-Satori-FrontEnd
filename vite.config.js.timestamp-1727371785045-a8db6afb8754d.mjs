// vite.config.js
import { defineConfig } from "file:///E:/Universidad/Cuatri%203%20(Segundo%20A%C3%B1o)/Programaci%C3%B3n%20en%20Ambiente%20Web%20I/Week%203/appPruebasFrontEnd/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Universidad/Cuatri%203%20(Segundo%20A%C3%B1o)/Programaci%C3%B3n%20en%20Ambiente%20Web%20I/Week%203/appPruebasFrontEnd/node_modules/@vitejs/plugin-react-swc/index.mjs";
import jsconfigPaths from "file:///E:/Universidad/Cuatri%203%20(Segundo%20A%C3%B1o)/Programaci%C3%B3n%20en%20Ambiente%20Web%20I/Week%203/appPruebasFrontEnd/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), jsconfigPaths()],
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
      "@mui/material/Tooltip"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxVbml2ZXJzaWRhZFxcXFxDdWF0cmkgMyAoU2VndW5kbyBBXHUwMEYxbylcXFxcUHJvZ3JhbWFjaVx1MDBGM24gZW4gQW1iaWVudGUgV2ViIElcXFxcV2VlayAzXFxcXGFwcFBydWViYXNGcm9udEVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcVW5pdmVyc2lkYWRcXFxcQ3VhdHJpIDMgKFNlZ3VuZG8gQVx1MDBGMW8pXFxcXFByb2dyYW1hY2lcdTAwRjNuIGVuIEFtYmllbnRlIFdlYiBJXFxcXFdlZWsgM1xcXFxhcHBQcnVlYmFzRnJvbnRFbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1VuaXZlcnNpZGFkL0N1YXRyaSUyMDMlMjAoU2VndW5kbyUyMEElQzMlQjFvKS9Qcm9ncmFtYWNpJUMzJUIzbiUyMGVuJTIwQW1iaWVudGUlMjBXZWIlMjBJL1dlZWslMjAzL2FwcFBydWViYXNGcm9udEVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtanNjb25maWctcGF0aHNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBqc2NvbmZpZ1BhdGhzKCldLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAnQGVtb3Rpb24vcmVhY3QnLCBcbiAgICAgICdAZW1vdGlvbi9zdHlsZWQnLCBcbiAgICAgICdAbXVpL21hdGVyaWFsL1Rvb2x0aXAnXG4gICAgXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtmLFNBQVMsb0JBQW9CO0FBQy9nQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFHMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNsQyxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
