import { useEffect } from 'react';
import { useCampus } from '../contexts/CampusContext';
import API from '../API';

/**
 * Hook to automatically add campus_id to API requests
 * Sets up an axios interceptor that adds the selected campus to request params
 */
export const useCampusFilter = () => {
  const { selectedCampus } = useCampus();
  const campusId = selectedCampus?._id;

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        // Only add campus_id if a campus is selected
        if (campusId) {
          // Add to params for GET requests
          if (config.method === 'get') {
            config.params = {
              ...config.params,
              campus_id: campusId,
            };
          }
          // Add to data for POST/PUT/PATCH requests if it's a JSON payload
          else if (['post', 'put', 'patch'].includes(config.method || '')) {
            if (config.data && typeof config.data === 'object') {
              config.data = {
                ...config.data,
                campus_id: campusId,
              };
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount or when campus ID changes
    return () => {
      API.interceptors.request.eject(requestInterceptor);
    };
  }, [campusId]); // Use campusId instead of selectedCampus object

  return { selectedCampus };
};
