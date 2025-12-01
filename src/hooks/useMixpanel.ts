import { useEffect, useCallback } from "react";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel once
const MIXPANEL_TOKEN = "c1fb7e2bf5ee8afcde3812c7cdc7482d";
let isInitialized = false;

export const initializeMixpanel = () => {
  if (!isInitialized) {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
      debug: import.meta.env.DEV, // Enable debug mode in development
      track_pageview: true,
      persistence: "localStorage",
    });
    isInitialized = true;
    console.log("Mixpanel initialized");
  }
};

interface MixpanelUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  campusId?: string;
  schoolId?: string;
}

type MixpanelProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export const useMixpanel = () => {
  useEffect(() => {
    // Ensure Mixpanel is initialized when hook is used
    initializeMixpanel();
  }, []);

  /**
   * Track a custom event
   * @param eventName - The name of the event to track
   * @param properties - Optional properties to attach to the event
   */
  const trackEvent = useCallback(
    (eventName: string, properties?: MixpanelProperties) => {
      try {
        mixpanel.track(eventName, {
          ...properties,
          timestamp: new Date().toISOString(),
        });

        if (import.meta.env.DEV) {
          console.log("✅ [Mixpanel Event]:", eventName, properties);
        }
      } catch (error) {
        console.error("❌ [Mixpanel Error]:", error);
      }
    },
    []
  );

  /**
   * Identify a user
   * @param user - User data to identify
   */
  const identifyUser = useCallback((user: MixpanelUser) => {
    try {
      mixpanel.identify(user.id);

      // Set user properties
      mixpanel.people.set({
        $email: user.email,
        $first_name: user.firstName,
        $last_name: user.lastName,
        role: user.role,
        campus_id: user.campusId,
        school_id: user.schoolId,
      });
    } catch (error) {
      console.error("Error identifying user:", error);
    }
  }, []);

  /**
   * Reset the Mixpanel user (useful for logout)
   */
  const resetUser = useCallback(() => {
    try {
      mixpanel.reset();
    } catch (error) {
      console.error("Error resetting user:", error);
    }
  }, []);

  /**
   * Track a page view
   * @param pageName - The name of the page
   * @param properties - Optional properties to attach to the page view
   */
  const trackPageView = useCallback(
    (pageName: string, properties?: MixpanelProperties) => {
      try {
        mixpanel.track_pageview({
          page: pageName,
          ...properties,
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    },
    []
  );

  /**
   * Set user properties
   * @param properties - Properties to set on the user
   */
  const setUserProperties = useCallback((properties: MixpanelProperties) => {
    try {
      mixpanel.people.set(properties);
    } catch (error) {
      console.error("Error setting user properties:", error);
    }
  }, []);

  /**
   * Set user properties only once (won't override existing values)
   * @param properties - Properties to set once on the user
   */
  const setUserPropertiesOnce = useCallback(
    (properties: MixpanelProperties) => {
      try {
        mixpanel.people.set_once(properties);
      } catch (error) {
        console.error("Error setting user properties once:", error);
      }
    },
    []
  );

  /**
   * Increment a numeric user property
   * @param property - The property to increment
   * @param value - The value to increment by (default: 1)
   */
  const incrementUserProperty = useCallback(
    (property: string, value: number = 1) => {
      try {
        mixpanel.people.increment(property, value);
      } catch (error) {
        console.error("Error incrementing user property:", error);
      }
    },
    []
  );

  /**
   * Register super properties that will be sent with every event
   * @param properties - Properties to register
   */
  const registerSuperProperties = useCallback(
    (properties: MixpanelProperties) => {
      try {
        mixpanel.register(properties);
      } catch (error) {
        console.error("Error registering super properties:", error);
      }
    },
    []
  );

  /**
   * Unregister a super property
   * @param property - Property to unregister
   */
  const unregisterSuperProperty = useCallback((property: string) => {
    try {
      mixpanel.unregister(property);
    } catch (error) {
      console.error("Error unregistering super property:", error);
    }
  }, []);

  /**
   * Time an event (start tracking time until timeEvent is called)
   * @param eventName - The name of the event to time
   */
  const startTimingEvent = useCallback((eventName: string) => {
    try {
      mixpanel.time_event(eventName);
    } catch (error) {
      console.error("Error starting event timer:", error);
    }
  }, []);

  return {
    trackEvent,
    identifyUser,
    resetUser,
    trackPageView,
    setUserProperties,
    setUserPropertiesOnce,
    incrementUserProperty,
    registerSuperProperties,
    unregisterSuperProperty,
    startTimingEvent,
  };
};
