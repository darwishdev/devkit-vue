/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_BASE_IMAGE_URL: string;
	readonly VITE_FALLBACK_IMAGE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
