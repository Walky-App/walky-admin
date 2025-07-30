export const getEnv = () => {
  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://staging.walkyapp.com/api'
  };
};
