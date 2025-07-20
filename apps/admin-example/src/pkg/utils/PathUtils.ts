export const getAssetPath = (path: string): string => {
  return `${import.meta.env.VITE_BASE_IMAGE_URL}/${path}`;
};
