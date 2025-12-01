/**
 * Common Mixpanel event types for type safety and consistency
 * Use these types in your components to ensure consistent event tracking
 */

// Common event properties
export interface BaseEventProperties {
  page?: string;
  section?: string;
  version?: string;
  timestamp?: string;
}

// Page view events
export interface PageViewProperties extends BaseEventProperties {
  referrer?: string;
  user_role?: string;
}

// Button click events
export interface ButtonClickProperties extends BaseEventProperties {
  button_name: string;
  button_type?: "primary" | "secondary" | "tertiary" | "danger";
  action_type?: string;
}

// Form events
export interface FormEventProperties extends BaseEventProperties {
  form_name: string;
  form_type?: string;
  fields_count?: number;
  validation_errors?: number;
}

// Modal events
export interface ModalEventProperties extends BaseEventProperties {
  modal_name: string;
  trigger?: "button_click" | "auto" | "link";
  interaction_completed?: boolean;
}

// Filter events
export interface FilterEventProperties extends BaseEventProperties {
  filter_type: string;
  filter_value: string;
  active_filters?: number;
}

// Search events
export interface SearchEventProperties extends BaseEventProperties {
  search_query: string;
  results_count: number;
  search_category?: string;
  search_length?: number;
}

// Table events
export interface TableEventProperties extends BaseEventProperties {
  table_name: string;
  sort_column?: string;
  sort_direction?: "asc" | "desc";
  row_id?: string;
  selection_count?: number;
}

// Export events
export interface ExportEventProperties extends BaseEventProperties {
  export_type: "csv" | "json" | "pdf" | "xlsx";
  total_rows: number;
  selected_rows?: number;
  filters_applied?: boolean;
}

// API events
export interface APIEventProperties extends BaseEventProperties {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  status_code?: number;
  error_message?: string;
  response_time?: number;
}

// User authentication events
export interface AuthEventProperties extends BaseEventProperties {
  user_role?: string;
  login_method?: "email" | "google" | "sso";
  has_campus?: boolean;
  has_school?: boolean;
}

// Feature usage events
export interface FeatureEventProperties extends BaseEventProperties {
  feature_name: string;
  feature_category?: string;
  usage_count?: number;
}

// Error events
export interface ErrorEventProperties extends BaseEventProperties {
  error_type: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
}

// Navigation events
export interface NavigationEventProperties extends BaseEventProperties {
  from_page?: string;
  to_page: string;
  navigation_type?: "click" | "redirect" | "back" | "forward";
}

// Common event names (for consistency)
export const MixpanelEvents = {
  // Page events
  PAGE_VIEWED: "Page Viewed",

  // User events
  USER_LOGGED_IN: "User Logged In",
  USER_LOGGED_OUT: "User Logged Out",
  USER_REGISTERED: "User Registered",

  // Button events
  BUTTON_CLICKED: "Button Clicked",

  // Form events
  FORM_STARTED: "Form Started",
  FORM_COMPLETED: "Form Completed",
  FORM_ABANDONED: "Form Abandoned",
  FORM_ERROR: "Form Error",

  // Modal events
  MODAL_OPENED: "Modal Opened",
  MODAL_CLOSED: "Modal Closed",

  // Filter events
  FILTER_APPLIED: "Filter Applied",
  FILTER_CLEARED: "Filter Cleared",

  // Search events
  SEARCH_PERFORMED: "Search Performed",

  // Table events
  TABLE_SORTED: "Table Sorted",
  TABLE_FILTERED: "Table Filtered",
  TABLE_ROW_SELECTED: "Table Row Selected",
  TABLE_ROW_DESELECTED: "Table Row Deselected",
  TABLE_SELECT_ALL: "Table Select All",
  TABLE_DESELECT_ALL: "Table Deselect All",
  TABLE_PAGE_CHANGED: "Table Page Changed",

  // Export events
  DATA_EXPORTED: "Data Exported",

  // API events
  API_CALL_SUCCESS: "API Call Success",
  API_CALL_FAILED: "API Call Failed",

  // Feature events
  FEATURE_USED: "Feature Used",

  // Error events
  ERROR_OCCURRED: "Error Occurred",

  // Navigation events
  NAVIGATION_CHANGED: "Navigation Changed",

  // Bulk actions
  BULK_ACTION_INITIATED: "Bulk Action Initiated",
  BULK_ACTION_COMPLETED: "Bulk Action Completed",
  BULK_ACTION_FAILED: "Bulk Action Failed",
} as const;

// Helper type for event names
export type MixpanelEventName =
  (typeof MixpanelEvents)[keyof typeof MixpanelEvents];

// Example usage:
/**
 * import { MixpanelEvents, ButtonClickProperties } from '@/types/mixpanel-events';
 * import { useMixpanel } from '@/hooks/useMixpanel';
 *
 * const { trackEvent } = useMixpanel();
 *
 * const handleClick = () => {
 *   trackEvent(MixpanelEvents.BUTTON_CLICKED, {
 *     button_name: 'Submit',
 *     button_type: 'primary',
 *     page: 'Dashboard',
 *   } as ButtonClickProperties);
 * };
 */
