/**
 * Generic API Response Types
 * These types are used when the API client doesn't have specific types generated
 */

 
export type ApiResponse<T = any> = {
    data: T;
    status?: number;
    message?: string;
};

 
export type PaginatedApiResponse<T = any> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
};

 
export type UnknownApiResponse = any;
