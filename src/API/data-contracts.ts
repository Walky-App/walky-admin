/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Chat {
  /** @format uuid */
  id?: string;
  name?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Message {
  /** @format uuid */
  id?: string;
  content?: string;
  chat?: Chat;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Idea {
  collaborator_ids?: {
    /** @format objectId */
    user_id?: string;
    status?: "pending" | "confirmed" | "rejected";
    /** @format date-time */
    joined_at?: string;
    /** @format objectId */
    _id?: string;
  }[];
  /** @default true */
  is_active?: boolean;
  description: string;
  looking_for: string;
  school_id: string;
  title: string;
  created_by: string;
}

export interface User {
  /** URL to user avatar image */
  avatar_url?: string;
  /**
   * User birthday
   * @format date-time
   */
  birthday?: string;
  /**
   * User email address
   * @format email
   */
  email: string;
  /** User first name */
  first_name?: string;
  /** User last name */
  last_name?: string;
  /** User middle name */
  middle_name?: string;
  /** User title or prefix */
  title?: string;
  /** Legacy interests (string array) */
  interests?: string[];
  /** Array of Interest ObjectIds */
  interest_ids?: string[];
  /**
   * Whether the user account is active
   * @default true
   */
  is_active?: boolean;
  /**
   * Whether the user has completed onboarding
   * @default false
   */
  is_onboarded?: boolean;
  /**
   * Whether the user is a parent
   * @default false
   */
  is_parent?: boolean;
  /**
   * Whether the user profile is complete
   * @default false
   */
  is_profile_complete?: boolean;
  /**
   * Whether the user email is verified
   * @default false
   */
  is_verified?: boolean;
  /**
   * Whether the user owns a dog
   * @default false
   */
  is_dog_owner?: boolean;
  /** Languages spoken by the user */
  languages?: {
    /** Whether this is the preferred language */
    is_preferred?: boolean;
    /** Language name */
    language?: string;
  }[];
  /** User location in GeoJSON format */
  location?: {
    /** GeoJSON type */
    type?: "Point";
    /**
     * Longitude and latitude coordinates [lng, lat]
     * @maxItems 2
     * @minItems 2
     */
    coordinates?: number[];
  };
  /** One-time password for verification */
  otp?: number;
  /**
   * User password (hashed)
   * @minLength 8
   */
  password?: string;
  /** Password confirmation */
  password_confirmed?: string;
  /**
   * Whether password reset is required
   * @default false
   */
  password_reset?: boolean;
  /**
   * Timestamp of last password change
   * @format date-time
   */
  password_changed_at?: string;
  /** Array of connected peer User IDs */
  peers?: string[];
  /** Array of pending peer requests */
  peers_pending?: string[];
  /** Array of blocked User IDs */
  peers_blocked?: string[];
  /** User phone number */
  phone_number?: string;
  /** User biography/about text */
  profile_bio?: string;
  /** Push notification device token */
  push_notification_token?: string;
  /** User relationship status */
  relationship_status?: "single" | "in_relationship" | "married" | "divorced";
  /** Primary user role */
  role:
    | "super_admin"
    | "campus_admin"
    | "editor"
    | "moderator"
    | "staff"
    | "viewer"
    | "student"
    | "faculty"
    | "parent";
  /** Array of roles with campus-specific assignments */
  roles?: {
    role?:
      | "super_admin"
      | "campus_admin"
      | "editor"
      | "moderator"
      | "staff"
      | "viewer"
      | "student"
      | "faculty"
      | "parent";
    /**
     * Campus this role applies to
     * @format objectId
     */
    campus_id?: string;
    /**
     * User who assigned this role
     * @format objectId
     */
    assigned_by?: string;
    /**
     * When this role was assigned
     * @format date-time
     */
    assigned_at?: string;
  }[];
  /**
   * School the user belongs to
   * @format objectId
   */
  school_id?: string;
  /**
   * Campus the user belongs to
   * @format objectId
   */
  campus_id?: string;
  /** Primary field of study */
  study_main?: string;
  /** Secondary field of study */
  study_secondary?: string;
  /** Expected graduation term */
  graduation_term?: "Winter" | "Spring" | "Summer" | "Fall";
  /** Expected graduation year */
  graduationYear?: string;
  /** Array of space IDs associated with the user */
  spaces?: string[];
  /**
   * Count of unread notifications
   * @default 0
   */
  unread_notifications_count?: number;
  /**
   * Last date when reshuffles were used
   * @format date-time
   */
  lastReshuffleDate?: string;
  /**
   * Total number of reshuffles used
   * @default 0
   */
  totalReshufflesUsed?: number;
  /** SAML authentication data */
  saml_data?: {
    /** SAML principal name */
    principalName?: string;
    /** User affiliation (string or array) */
    affiliation?: string | string[];
    /** Scoped affiliation (string or array) */
    scopedAffiliation?: string | string[];
    /** Organization name */
    organization?: string;
    /** Array of entitlement URNs */
    entitlements?: string[];
    /** SAML NameID */
    nameID?: string;
    /** SAML NameID format */
    nameIDFormat?: string;
    /** SAML session index */
    sessionIndex?: string;
    /**
     * Last SAML login timestamp
     * @format date-time
     */
    lastLogin?: string;
    /** University identifier */
    universityId?: string;
    /** User unique identifier from IdP */
    uid?: string;
  };
  /**
   * Whether the user is soft deleted
   * @default false
   */
  is_deleted?: boolean;
  /**
   * Timestamp of deletion
   * @format date-time
   */
  deleted_at?: string;
  /**
   * User ID who deleted this user
   * @format objectId
   */
  deleted_by?: string;
  /** Reason for deletion */
  deletion_reason?: string;
  /**
   * Whether the user is banned
   * @default false
   */
  is_banned?: boolean;
  /**
   * Date when user was banned
   * @format date-time
   */
  ban_date?: string;
  /** Reason for ban */
  ban_reason?: string;
  /** Ban duration in days (null for permanent) */
  ban_duration?: number;
  /**
   * When the ban expires
   * @format date-time
   */
  ban_expires_at?: string;
  /**
   * User ID who banned this user
   * @format objectId
   */
  banned_by?: string;
  /** History of bans and unbans */
  ban_history?: {
    /** @format date-time */
    banned_at?: string;
    /** @format objectId */
    banned_by?: string;
    reason?: string;
    duration?: number;
    /** @format date-time */
    unbanned_at?: string;
    /** @format objectId */
    unbanned_by?: string;
    unban_reason?: string;
  }[];
  /**
   * Number of times this user has been reported
   * @default 0
   */
  report_count?: number;
  /**
   * Last login timestamp (admin dashboard)
   * @format date-time
   */
  lastLogin?: string;
  /**
   * User engagement score (admin dashboard)
   * @min 0
   * @max 100
   * @default 0
   */
  engagementScore?: number;
  /** User activity statistics (admin dashboard) */
  stats?: {
    /** @default 0 */
    totalPeers?: number;
    /** @default 0 */
    walksSent?: number;
    /** @default 0 */
    walksAccepted?: number;
    /** @default 0 */
    walksIgnored?: number;
    /** @default 0 */
    eventInvitesSent?: number;
    /** @default 0 */
    eventInvitesAccepted?: number;
    /** @default 0 */
    eventInvitesIgnored?: number;
    /** @default 0 */
    eventsCreated?: number;
    /** @default 0 */
    eventsAttended?: number;
    /** @default 0 */
    spacesCreated?: number;
    /** @default 0 */
    spacesJoined?: number;
    /** @default 0 */
    ideasCreated?: number;
    /** @default 0 */
    ideasCollaborated?: number;
    /** @format date-time */
    lastActivityAt?: string;
    /** @default 0 */
    totalSessions?: number;
    /** @default 0 */
    avgSessionDuration?: number;
    /** @default 0 */
    totalProfileViews?: number;
    /** @default 0 */
    totalMessagesReceived?: number;
    /** @default 0 */
    totalMessagesReplied?: number;
    /** @default 0 */
    newFriendsThisWeek?: number;
    /** @default 0 */
    newFriendsThisMonth?: number;
    /** @default false */
    hasConnectedInFirstWeek?: boolean;
    /** @format date-time */
    firstConnectionDate?: string;
  };
  /** Unique referral code for inviting friends */
  referralCode?: string;
  /**
   * User ID who referred this user
   * @format objectId
   */
  referredBy?: string;
  /**
   * Timestamp when user was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when user was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface Event {
  /** Physical address of the event location */
  address: string;
  /**
   * User ID who created the event
   * @format objectId
   */
  created_by: string;
  /**
   * Type of the event owner (user or space)
   * @default "user"
   */
  ownerType: "user" | "space";
  /**
   * ObjectId of the owner (User or Space depending on ownerType)
   * @format objectId
   */
  ownerId: string;
  /**
   * Space ID if the event is associated with a space
   * @format objectId
   */
  spaceId?: string;
  /**
   * Date and time when the event will occur
   * @format date-time
   */
  date_and_time: string;
  /** Detailed description of the event */
  description: string;
  /**
   * Whether the event details should be expanded by default
   * @default false
   */
  expand_event?: boolean;
  /** URL of the event cover image */
  image_url: string;
  /**
   * Interest category ID that this event belongs to
   * @format objectId
   */
  interests: string;
  /** Array of user invites to the event */
  invites?: {
    /**
     * User ID who was invited
     * @format objectId
     */
    user_id?: string;
    /**
     * Status of the event invite
     * @default "pending"
     */
    status?: "accepted" | "rejected" | "pending" | "dropped";
  }[];
  /** Location description or venue name */
  location: string;
  /** Name/title of the event */
  name: string;
  /** Array of event participants with their status */
  participants?: {
    /**
     * User ID of the participant
     * @format objectId
     */
    user_id?: string;
    /** Participation status */
    status?: "confirmed" | "pending" | "notgoing";
  }[];
  /**
   * School ID that the event is associated with
   * @format objectId
   */
  school_id: string;
  /** Maximum number of participants allowed */
  slots: number;
  /** Type of event (outdoor or indoor) */
  event_type: "outdoor" | "indoor";
  /** Event visibility (private or public) */
  visibility: "private" | "public";
  /**
   * Whether the event is currently active
   * @default true
   */
  is_active?: boolean;
  /**
   * Whether this is a custom event created by user
   * @default false
   */
  isCustom?: boolean;
  /**
   * Timestamp when the event was soft deleted (null if not deleted)
   * @format date-time
   */
  deletedAt?: string;
  /** Reason why the event was deleted (user=deleted by creator, admin=deleted by admin, auto_cleanup=automatically cleaned up) */
  deleteReason?: "user" | "admin" | "auto_cleanup";
  /**
   * Timestamp when the event was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the event was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface Space {
  /**
   * Space unique identifier
   * @format objectId
   */
  _id?: string;
  /**
   * Campus ID that this space belongs to
   * @format objectId
   */
  campusId: string;
  /**
   * User ID of the space owner/creator
   * @format objectId
   */
  ownerId: string;
  /**
   * Space title/name
   * @minLength 3
   * @maxLength 100
   */
  title: string;
  /**
   * Chapter name if this space is a chapter of a larger organization
   * @maxLength 100
   */
  chapter?: string;
  /**
   * Space category ID reference
   * @format objectId
   */
  category: string;
  /** Range of member count for the space */
  memberCountRange:
    | "1-10"
    | "11-25"
    | "26-50"
    | "51-100"
    | "101-250"
    | "251-500"
    | "500+";
  /**
   * Primary focus or mission of the space
   * @maxLength 100
   */
  primaryFocus?: string;
  /**
   * Contact email for the space
   * @format email
   */
  contactEmail: string;
  /**
   * Short tagline or slogan for the space
   * @maxLength 200
   */
  tagline?: string;
  /**
   * Year when the space/organization was established
   * @min 1800
   */
  yearEstablished?: number;
  /**
   * Name of the governing body or leadership structure
   * @maxLength 100
   */
  governingBody?: string;
  /**
   * Detailed description about the space
   * @maxLength 2000
   */
  about?: string;
  /**
   * Description of how the space uses this platform
   * @maxLength 1000
   */
  howWeUseThisSpace?: string;
  /** URL to the space logo image */
  logoUrl: string;
  /** URL to the space cover/banner image */
  coverImageUrl?: string;
  /**
   * Current number of members in the space
   * @min 0
   * @default 1
   */
  membersCount?: number;
  /**
   * Number of pending membership requests
   * @min 0
   * @default 0
   */
  requestsCount?: number;
  /** Array of Event IDs associated with this space */
  eventIds?: string[];
  /** SHA256 hash of title and campusId to ensure uniqueness */
  uniquenessKey?: string;
  /**
   * Activity score for admin dashboard ranking
   * @min 0
   * @default 0
   */
  activityScore?: number;
  /**
   * Timestamp of last activity in the space (admin dashboard)
   * @format date-time
   */
  lastActivityAt?: string;
  /**
   * Timestamp when the space was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the space was last updated
   * @format date-time
   */
  updatedAt?: string;
  /**
   * Timestamp when the space was soft deleted (null if not deleted)
   * @format date-time
   */
  deletedAt?: string;
}

export interface PeerRequest {
  /**
   * Peer request unique identifier
   * @format objectId
   */
  _id?: string;
  /** User who sent the peer request (can be populated or ObjectId) */
  sender_id:
    | string
    | {
        /** @format objectId */
        _id?: string;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
      };
  /** User who received the peer request (can be populated or ObjectId) */
  receiver_id:
    | string
    | {
        /** @format objectId */
        _id?: string;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
      };
  /**
   * Current status of the peer request (expired is computed dynamically after 7 days)
   * @default "pending"
   */
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired";
  /**
   * Type of peer request: direct (user initiated) or invite (system generated)
   * @default "direct"
   */
  typeOfRequest?: "direct" | "invite";
  /**
   * Timestamp when the request was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the request was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface EventInvite {
  /** Unique identifier */
  _id?: string;
  sender_id: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  receiver_id: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  event_id: {
    _id?: string;
    name?: string;
    description?: string;
    /** @format date-time */
    date_and_time?: string;
    location?: string;
    image_url?: string;
    created_by?: string;
  };
  /** Invitation status */
  status: "pending" | "accepted" | "rejected" | "cancelled";
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface WalkInvite {
  /**
   * Walk invite unique identifier
   * @format objectId
   */
  _id?: string;
  /** User who sent the walk invitation (can be populated or ObjectId) */
  sender_id:
    | string
    | {
        /** @format objectId */
        _id?: string;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
      };
  /** User who received the walk invitation (can be populated or ObjectId) */
  receiver_id:
    | string
    | {
        /** @format objectId */
        _id?: string;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
      };
  /**
   * Current status of the walk invitation
   * @default "pending"
   */
  status: "pending" | "accepted" | "rejected" | "cancelled";
  /**
   * Campus ID where the walk invitation is for
   * @format objectId
   */
  campus_id: string;
  /**
   * Interest/activity category for the walk
   * @format objectId
   */
  interest_id: string;
  /**
   * Place ID where the walk will take place
   * @format objectId
   */
  place_id: string;
  /** Name of the place (cached for quick display) */
  place_name?: string;
  /**
   * Place coordinates [longitude, latitude] (-180 to 180, -90 to 90)
   * @maxItems 2
   * @minItems 2
   */
  place_coordinates?: number[];
  /**
   * Sender location at time of invite [longitude, latitude]
   * @maxItems 2
   * @minItems 2
   */
  sender_location?: number[];
  /**
   * Receiver location at time of invite [longitude, latitude]
   * @maxItems 2
   * @minItems 2
   */
  receiver_location?: number[];
  /** URL to image of the place */
  place_image?: string;
  /** Type or category of the walk invitation */
  invite_type?: string;
  /**
   * Timestamp when the invite was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the invite was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface Ambassador {
  /** Unique identifier */
  _id?: string;
  /** Ambassador name */
  name: string;
  /** Ambassador email (unique) */
  email: string;
  /** Phone number (optional) */
  phone?: string;
  /** Student ID (optional) */
  student_id?: string;
  /** Array of campus IDs */
  campuses_id?: string[];
  /** School ID */
  school_id?: string;
  /**
   * Active status
   * @default true
   */
  is_active?: boolean;
  /** Profile image URL (optional) */
  profile_image_url?: string;
  /** Ambassador bio (optional) */
  bio?: string;
  /** Graduation year (optional) */
  graduation_year?: number;
  /** Major field of study (optional) */
  major?: string;
  /** User who created this ambassador */
  created_by: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Campus {
  /**
   * Campus unique identifier
   * @format objectId
   */
  _id?: string;
  /** Full campus name (must be unique across all campuses) */
  campus_name: string;
  /** Abbreviated campus name */
  campus_short_name?: string;
  /**
   * School ID that this campus belongs to
   * @format objectId
   */
  school_id?: string;
  /** URL to the campus image/logo */
  image_url?: string;
  /** Array of Ambassador user IDs for this campus */
  ambassador_ids?: string[];
  /** Main campus contact phone number */
  phone_number: string;
  /** Campus street address */
  address: string;
  /** City where the campus is located */
  city: string;
  /** State/province where the campus is located */
  state: string;
  /** Postal/ZIP code for the campus */
  zip: string;
  /** Campus boundary as GeoJSON Polygon */
  coordinates?: {
    /**
     * GeoJSON type (always Polygon for campus boundaries)
     * @default "Polygon"
     */
    type?: "Polygon";
    /** GeoJSON Polygon coordinates format: [[[longitude, latitude]]] defining campus boundaries */
    coordinates?: number[][][];
  };
  /** Array of time strings representing dawn to dusk hours for the campus */
  dawn_to_dusk?: string[];
  /** IANA time zone identifier for the campus (e.g., "America/New_York") */
  time_zone: string;
  /**
   * Whether the campus is currently active and accessible to users
   * @default true
   */
  is_active?: boolean;
  /** User ID or identifier of the person who created this campus */
  created_by: string;
  /**
   * Timestamp when the campus was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the campus was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface Interest {
  /** Unique identifier */
  _id?: string;
  /** Interest name */
  name: string;
  /** Interest image URL */
  image_url: string;
  /** Interest icon URL */
  icon_url: string;
  /**
   * Active status
   * @default true
   */
  is_active?: boolean;
  /**
   * Soft delete flag
   * @default false
   */
  is_delete?: boolean;
  /** User who created this interest */
  created_by: string;
  /**
   * Interest group categories
   * @default []
   */
  groups?: string[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Report {
  /**
   * Report unique identifier
   * @format objectId
   */
  _id?: string;
  /**
   * User ID of the person who submitted the report
   * @format objectId
   */
  reported_by: string;
  /** Type of item being reported (user, event, space, idea, message, or peers) */
  report_type: "user" | "event" | "space" | "idea" | "message" | "peers";
  /**
   * ObjectId of the reported item (polymorphic reference based on report_type)
   * @format objectId
   */
  reported_item_id: string;
  /**
   * Primary reason for the report (short summary)
   * @maxLength 500
   */
  reason: string;
  /**
   * Detailed description of the issue being reported
   * @maxLength 1000
   */
  description: string;
  /**
   * Current status of the report in the review workflow
   * @default "pending"
   */
  status?: "pending" | "under_review" | "resolved" | "dismissed";
  /**
   * User ID of the admin/moderator who reviewed this report
   * @format objectId
   */
  reviewed_by?: string;
  /**
   * Internal notes from admins/moderators about the report resolution
   * @maxLength 2000
   */
  admin_notes?: string;
  /**
   * Timestamp when the report was resolved or dismissed
   * @format date-time
   */
  resolved_at?: string;
  /**
   * School ID where the report originated
   * @format objectId
   */
  school_id: string;
  /**
   * Campus ID where the report originated (optional)
   * @format objectId
   */
  campus_id?: string;
  /** Snapshot of the reported item at the time of reporting (for audit trail) */
  reported_item_snapshot?: object;
  /**
   * Timestamp when the report was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the report was last updated
   * @format date-time
   */
  updatedAt?: string;
}

export interface Error {
  /** Error message */
  message?: string;
  /** Error type or code */
  error?: string;
  /** HTTP status code */
  status?: number;
}
