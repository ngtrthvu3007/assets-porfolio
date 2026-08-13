/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOLE_PRICE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
