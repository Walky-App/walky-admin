import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSchool } from '../contexts/SchoolContext';
import API from '../API';

/**
 * Hook to automatically add school_id to API requests and refetch data when school changes
 * Sets up an axios interceptor that adds the selected school to request params
 * Invalidates all queries when the school selection changes to trigger refetch
 */
export const useSchoolFilter = () => {
  const { selectedSchool } = useSchool();
  const queryClient = useQueryClient();
  const schoolId = selectedSchool?._id;
  const previousSchoolIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        // Only add school_id if a school is selected
        if (schoolId) {
          // Add to params for GET requests
          if (config.method === 'get') {
            config.params = {
              ...config.params,
              school_id: schoolId,
            };
            console.log('📤 Adding school_id to GET request:', config.url, 'school_id:', schoolId);
          }
          // Add to data for POST/PUT/PATCH requests if it's a JSON payload
          else if (['post', 'put', 'patch'].includes(config.method || '')) {
            if (config.data && typeof config.data === 'object') {
              config.data = {
                ...config.data,
                school_id: schoolId,
              };
              console.log('📤 Adding school_id to', config.method?.toUpperCase(), 'request:', config.url, 'school_id:', schoolId);
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Check if school changed (not initial mount)
    const schoolChanged = previousSchoolIdRef.current !== undefined && previousSchoolIdRef.current !== schoolId;

    if (schoolChanged) {
      console.log('🔄 School changed from', previousSchoolIdRef.current, 'to', schoolId);

      // Invalidate React Query queries (for pages using React Query)
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ type: 'active' });

      // Note: Dashboard and other pages using useEffect dependencies will refetch automatically
      // when their components detect the selectedSchool change
    }

    // Update the ref for next comparison
    previousSchoolIdRef.current = schoolId;

    // Cleanup interceptor on unmount or when school ID changes
    return () => {
      API.interceptors.request.eject(requestInterceptor);
    };
  }, [schoolId, queryClient]);

  return { selectedSchool };
};
