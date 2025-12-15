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
    /** Full name of the participant */
    name?: string;
    /** URL to user avatar image */
    avatar_url?: string;
    /** Participation status */
    status?: "confirmed" | "pending" | "notgoing";
  }[];
  /**
   * School ID that the event is associated with
   * @format objectId
   */
  school_id: string;
  /**
   * Campus ID that the event is associated with
   * @format objectId
   */
  campusId?: string;
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
  logoUrl?: string;
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

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Walky App API
 * @version 1.0.0
 * @baseUrl http://localhost:8080
 *
 * REST API for Walky App
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * @description Retrieves a list of alerts filtered by school, campus, and active status
     *
     * @tags Admin - Alerts
     * @name AdminAlertsList
     * @summary Get alerts list
     * @request GET:/api/admin/alerts
     * @secure
     */
    adminAlertsList: (
      query?: {
        /**
         * Maximum number of alerts to return
         * @default 10
         */
        limit?: number;
        /**
         * Filter by active (not dismissed) status
         * @default "true"
         */
        active?: "true" | "false";
        /** Comma-separated list of categories to filter */
        categories?: string;
        /** Filter by school ID (injected by middleware or user's school) */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          alerts?: object[];
          total?: number;
        },
        void
      >({
        path: `/api/admin/alerts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new alert (system-generated or manual)
     *
     * @tags Admin - Alerts
     * @name AdminAlertsCreate
     * @summary Create an alert
     * @request POST:/api/admin/alerts
     * @secure
     */
    adminAlertsCreate: (
      data: {
        title: string;
        message: string;
        severity: "info" | "warning" | "error" | "critical";
        category: string;
        actionUrl?: string;
        actionLabel?: string;
        metadata?: object;
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          alert?: object;
        },
        void
      >({
        path: `/api/admin/alerts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Marks an alert as dismissed (campus admins can only dismiss their campus alerts)
     *
     * @tags Admin - Alerts
     * @name AdminAlertsDismissPartialUpdate
     * @summary Dismiss an alert
     * @request PATCH:/api/admin/alerts/{alertId}/dismiss
     * @secure
     */
    adminAlertsDismissPartialUpdate: (
      alertId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          alert?: object;
        },
        void
      >({
        path: `/api/admin/alerts/${alertId}/dismiss`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves statistics about alerts grouped by severity and category
     *
     * @tags Admin - Alerts
     * @name AdminAlertsStatsList
     * @summary Get alert statistics
     * @request GET:/api/admin/alerts/stats
     * @secure
     */
    adminAlertsStatsList: (
      query?: {
        /** Filter by school ID (injected by middleware or user's school) */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          total?: number;
          bySeverity?: Record<string, number>;
          byCategory?: Record<string, number>;
        },
        void
      >({
        path: `/api/admin/alerts/stats`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes an alert (super admin only)
     *
     * @tags Admin - Alerts
     * @name AdminAlertsDelete
     * @summary Delete an alert
     * @request DELETE:/api/admin/alerts/{alertId}
     * @secure
     */
    adminAlertsDelete: (alertId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        void
      >({
        path: `/api/admin/alerts/${alertId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns comprehensive dashboard metrics (users, invitations, events, spaces, ideas, reports)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsSocialHealthList
     * @summary Get social health metrics
     * @request GET:/api/admin/analytics/social-health
     * @secure
     */
    adminAnalyticsSocialHealthList: (
      query?: {
        /** @default "month" */
        period?: "all" | "week" | "month" | "7d" | "30d" | "90d";
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/social-health`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns wellbeing metrics (avg peers, interaction rates, isolated students)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWellbeingList
     * @summary Get wellbeing statistics
     * @request GET:/api/admin/analytics/wellbeing
     * @secure
     */
    adminAnalyticsWellbeingList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/wellbeing`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns paginated student list with engagement stats and filtering
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsStudentsList
     * @summary Get students list
     * @request GET:/api/admin/analytics/students
     * @secure
     */
    adminAnalyticsStudentsList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 20 */
        limit?: number;
        search?: string;
        /** @default "all" */
        status?: "all" | "active" | "inactive";
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/students`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns top-performing event, space, and idea by engagement
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsActivitiesKpisList
     * @summary Get activities KPIs
     * @request GET:/api/admin/analytics/activities/kpis
     * @secure
     */
    adminAnalyticsActivitiesKpisList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/activities/kpis`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns total number of walks created or monthly data when groupBy=month
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksCountList
     * @summary Get total walks count
     * @request GET:/api/admin/analytics/walks/count
     * @secure
     */
    adminAnalyticsWalksCountList: (
      query?: {
        school_id?: string;
        /** Group results by month to get time-series data */
        groupBy?: "month";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        | {
            totalWalksCreated?: number;
          }
        | {
            monthlyData?: {
              month?: string;
              year?: number;
              count?: number;
            }[];
          },
        void
      >({
        path: `/api/admin/analytics/walks/count`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns count of currently active walks
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksActiveList
     * @summary Get active walks count
     * @request GET:/api/admin/analytics/walks/active
     * @secure
     */
    adminAnalyticsWalksActiveList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/walks/active`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns count of pending walks
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksPendingList
     * @summary Get pending walks count
     * @request GET:/api/admin/analytics/walks/pending
     * @secure
     */
    adminAnalyticsWalksPendingList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/walks/pending`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns count of completed walks
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksCompletedList
     * @summary Get completed walks count
     * @request GET:/api/admin/analytics/walks/completed
     * @secure
     */
    adminAnalyticsWalksCompletedList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/walks/completed`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns count of cancelled/closed walks
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksCancelledList
     * @summary Get cancelled walks count
     * @request GET:/api/admin/analytics/walks/cancelled
     * @secure
     */
    adminAnalyticsWalksCancelledList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/walks/cancelled`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns count of events filtered by type (total, outdoor, indoor, public, private) or time-series data when timeFrame is specified
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsEventsCountList
     * @summary Get events count by type
     * @request GET:/api/admin/analytics/events/count
     * @secure
     */
    adminAnalyticsEventsCountList: (
      query?: {
        school_id?: string;
        filter?: "total" | "outdoor" | "indoor" | "public" | "private";
        /** Get time-series data for specified timeframe */
        timeFrame?: "last6months" | "last12months" | "last30days";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        | {
            count?: number;
          }
        | {
            data?: {
              month?: string;
              totalCount?: number;
            }[];
          },
        void
      >({
        path: `/api/admin/analytics/events/count`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns count of ideas filtered by type (total, active, inactive, collaborated) or monthly data when groupBy=month
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsIdeasCountList
     * @summary Get ideas count by type
     * @request GET:/api/admin/analytics/ideas/count
     * @secure
     */
    adminAnalyticsIdeasCountList: (
      query?: {
        school_id?: string;
        type?: "total" | "active" | "inactive" | "collaborated";
        /** Group results by month to get time-series data */
        groupBy?: "month";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        | {
            totalIdeasCreated?: number;
            activeIdeasCount?: number;
            inactiveIdeasCount?: number;
            collaboratedIdeasCount?: number;
          }
        | {
            monthlyData?: {
              month?: string;
              year?: string;
              count?: number;
            }[];
          },
        void
      >({
        path: `/api/admin/analytics/ideas/count`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns monthly walks distribution for last 12 months with chart data
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsWalksDistributionList
     * @summary Get walks distribution over time
     * @request GET:/api/admin/analytics/walks/distribution
     * @secure
     */
    adminAnalyticsWalksDistributionList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/walks/distribution`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns comprehensive messaging stats (messages sent/received, reply rates, active conversations, response times)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsMessagingList
     * @summary Get messaging analytics
     * @request GET:/api/admin/analytics/messaging
     * @secure
     */
    adminAnalyticsMessagingList: (
      query?: {
        school_id?: string;
        /** @default "month" */
        period?: "week" | "month" | "all";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/messaging`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns profile engagement data (view counts, most viewed profiles, view-to-connection ratios)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsProfileViewsList
     * @summary Get profile views analytics
     * @request GET:/api/admin/analytics/profile-views
     * @secure
     */
    adminAnalyticsProfileViewsList: (
      query?: {
        school_id?: string;
        /** @default "month" */
        period?: "week" | "month" | "all";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/profile-views`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns engagement funnel metrics (event views→attendance, idea views→collaborations, space views→joins)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsEngagementList
     * @summary Get engagement analytics
     * @request GET:/api/admin/analytics/engagement
     * @secure
     */
    adminAnalyticsEngagementList: (
      query?: {
        school_id?: string;
        /** @default "month" */
        period?: "week" | "month" | "all";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/engagement`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns session metrics (average duration, DAU/WAU/MAU, session frequency)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsSessionAnalyticsList
     * @summary Get session analytics
     * @request GET:/api/admin/analytics/session-analytics
     * @secure
     */
    adminAnalyticsSessionAnalyticsList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/session-analytics`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns user lifecycle metrics (new users connection success, ghost users, churn rate, retention cohorts)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsUserLifecycleList
     * @summary Get user lifecycle analytics
     * @request GET:/api/admin/analytics/user-lifecycle
     * @secure
     */
    adminAnalyticsUserLifecycleList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/user-lifecycle`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns social network growth metrics (new connections, network growth, connection patterns)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsSocialGraphList
     * @summary Get social graph analytics
     * @request GET:/api/admin/analytics/social-graph
     * @secure
     */
    adminAnalyticsSocialGraphList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/social-graph`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns referral metrics (users who invited, acceptance rate, referral sources, viral coefficient)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsReferralsList
     * @summary Get referrals analytics
     * @request GET:/api/admin/analytics/referrals
     * @secure
     */
    adminAnalyticsReferralsList: (
      query?: {
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/referrals`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns safety metrics (location obfuscation usage, safety feature adoption, report frequency)
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsSafetyList
     * @summary Get safety analytics
     * @request GET:/api/admin/analytics/safety
     * @secure
     */
    adminAnalyticsSafetyList: (
      query?: {
        school_id?: string;
        /** @default "month" */
        period?: "week" | "month" | "all";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/safety`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns health status of analytics system including database connectivity, cache status, and aggregation job status
     *
     * @tags Admin - Analytics
     * @name AdminAnalyticsHealthList
     * @summary Analytics system health check
     * @request GET:/api/admin/analytics/health
     * @secure
     */
    adminAnalyticsHealthList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/analytics/health`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of events filtered by school (school admins see only their school, super admins can filter by school_id)
     *
     * @tags Admin - Events
     * @name AdminEventsList
     * @summary Get events list for admin
     * @request GET:/api/admin/events
     * @secure
     */
    adminEventsList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 15 */
        limit?: number;
        /** Filter by school (super admins only) */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/events`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves detailed event information with creator and attendee details (school-scoped for school admins)
     *
     * @tags Admin - Events
     * @name AdminEventsDetail
     * @summary Get event details for admin
     * @request GET:/api/admin/events/{eventId}
     * @secure
     */
    adminEventsDetail: (eventId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/events/${eventId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves the authenticated admin's profile information
     *
     * @tags Admin - Profile
     * @name AdminProfileList
     * @summary Get admin profile
     * @request GET:/api/admin/profile
     * @secure
     */
    adminProfileList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/profile`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the authenticated admin's profile information
     *
     * @tags Admin - Profile
     * @name AdminProfileUpdate
     * @summary Update admin profile
     * @request PUT:/api/admin/profile
     * @secure
     */
    adminProfileUpdate: (
      data: {
        first_name?: string;
        last_name?: string;
        /** @format email */
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/profile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Changes the authenticated admin's password
     *
     * @tags Admin - Profile
     * @name AdminProfileChangePasswordCreate
     * @summary Change password
     * @request POST:/api/admin/profile/change-password
     * @secure
     */
    adminProfileChangePasswordCreate: (
      data: {
        currentPassword: string;
        newPassword: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates the admin's notification preferences
     *
     * @tags Admin - Profile
     * @name AdminProfileNotificationsUpdate
     * @summary Update notification settings
     * @request PUT:/api/admin/profile/notifications
     * @secure
     */
    adminProfileNotificationsUpdate: (
      data: {
        emailNotifications?: boolean;
        pushNotifications?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/notifications`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Enables two-factor authentication for the admin account
     *
     * @tags Admin - Profile
     * @name AdminProfile2FaEnableCreate
     * @summary Enable 2FA
     * @request POST:/api/admin/profile/2fa/enable
     * @secure
     */
    adminProfile2FaEnableCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/2fa/enable`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Disables two-factor authentication for the admin account
     *
     * @tags Admin - Profile
     * @name AdminProfile2FaDisableCreate
     * @summary Disable 2FA
     * @request POST:/api/admin/profile/2fa/disable
     * @secure
     */
    adminProfile2FaDisableCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/2fa/disable`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Logs out the admin from all devices by invalidating all sessions
     *
     * @tags Admin - Profile
     * @name AdminProfileLogoutAllCreate
     * @summary Logout all devices
     * @request POST:/api/admin/profile/logout-all
     * @secure
     */
    adminProfileLogoutAllCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/logout-all`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Permanently deletes the admin account (requires password confirmation)
     *
     * @tags Admin - Profile
     * @name AdminProfileDeleteDelete
     * @summary Delete account
     * @request DELETE:/api/admin/profile/delete
     * @secure
     */
    adminProfileDeleteDelete: (
      data: {
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/profile/delete`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of spaces (campus admins see only their campus, super admins see all)
     *
     * @tags Admin - Spaces
     * @name AdminSpacesList
     * @summary Get spaces list for admin
     * @request GET:/api/admin/spaces
     * @secure
     */
    adminSpacesList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 15 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/spaces`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves detailed space information with owner details (campus-scoped for campus admins)
     *
     * @tags Admin - Spaces
     * @name AdminSpacesDetail
     * @summary Get space details for admin
     * @request GET:/api/admin/spaces/{spaceId}
     * @secure
     */
    adminSpacesDetail: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/spaces/${spaceId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves ALL space categories including inactive ones (admin only)
     *
     * @tags Admin - Spaces
     * @name AdminSpaceCategoriesList
     * @summary Get all space categories (admin)
     * @request GET:/api/admin/space-categories
     * @secure
     */
    adminSpaceCategoriesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/space-categories`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Creates a new space category with customizable appearance
     *
     * @tags Admin - Space Categories
     * @name AdminSpaceCategoriesCreate
     * @summary Create space category (admin)
     * @request POST:/api/admin/space-categories
     * @secure
     */
    adminSpaceCategoriesCreate: (
      data: {
        /** @maxLength 50 */
        name: string;
        /** @maxLength 500 */
        description: string;
        /**
         * JSON string with start and end colors, e.g. {"start":"#5dc9df","end":"#e2492b"}
         * @example "{"start":"#5dc9df","end":"#e2492b"}"
         */
        gradientColors: string;
        /**
         * @default "#FFFFFF"
         * @pattern ^#[0-9A-Fa-f]{6}$
         */
        textColor?: string;
        imageUrl: string;
        order?: number;
        isActive?: boolean;
        /**
         * Category icon image
         * @format binary
         */
        image?: File;
        /**
         * Default cover image file
         * @format binary
         */
        coverImageDefault?: File;
        /**
         * Default logo image file
         * @format binary
         */
        logoDefault?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/space-categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of users locked due to failed login attempts (admin only)
     *
     * @tags Admin - User Unlock
     * @name AdminLockedUsersList
     * @summary Get locked users
     * @request GET:/api/admin/locked-users
     * @secure
     */
    adminLockedUsersList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 20 */
        limit?: number;
        /** Search by email, first name, or last name */
        search?: string;
        /** Filter by school */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            email?: string;
            first_name?: string;
            last_name?: string;
            is_banned?: boolean;
            /** @format date-time */
            ban_date?: string;
            /** @format date-time */
            ban_expires_at?: string;
            ban_reason?: string;
            campus_id?: {
              _id?: string;
              campus_name?: string;
            };
            school_id?: {
              _id?: string;
              school_name?: string;
            };
            recentFailedAttempts?: {
              /** @format date-time */
              timestamp?: string;
              ip_address?: string;
              device_info?: string;
            }[];
            isExpired?: boolean;
          }[];
          pagination?: {
            total?: number;
            page?: number;
            limit?: number;
            pages?: number;
          };
        },
        void
      >({
        path: `/api/admin/locked-users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Unlocks a specific user account and optionally clears failed login attempts
     *
     * @tags Admin - User Unlock
     * @name AdminUnlockUserCreate
     * @summary Unlock user account
     * @request POST:/api/admin/unlock-user/{userId}
     * @secure
     */
    adminUnlockUserCreate: (
      userId: string,
      data: {
        /** @default "Manual unlock by admin" */
        reason?: string;
        /**
         * Clear failed login attempts from last 24 hours
         * @default true
         */
        clearAttempts?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            userId?: string;
            email?: string;
            attemptsCleared?: boolean;
          };
        },
        void
      >({
        path: `/api/admin/unlock-user/${userId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Unlocks multiple user accounts at once with audit logging
     *
     * @tags Admin - User Unlock
     * @name AdminBulkUnlockUsersCreate
     * @summary Bulk unlock users
     * @request POST:/api/admin/bulk-unlock-users
     * @secure
     */
    adminBulkUnlockUsersCreate: (
      data: {
        /** Array of user IDs to unlock */
        userIds: string[];
        /** @default "Bulk unlock by admin" */
        reason?: string;
        /** @default true */
        clearAttempts?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            userId?: string;
            email?: string;
            success?: boolean;
          }[];
        },
        void
      >({
        path: `/api/admin/bulk-unlock-users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns statistics about locked users (total, recent locks, expired locks)
     *
     * @tags Admin - User Unlock
     * @name AdminUnlockStatsList
     * @summary Get unlock statistics
     * @request GET:/api/admin/unlock-stats
     * @secure
     */
    adminUnlockStatsList: (
      query?: {
        /** Filter by school */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            totalLocked?: number;
            lockedToday?: number;
            lockedThisWeek?: number;
            expiredLocks?: number;
            recentUnlocks?: number;
            /** @format date-time */
            timestamp?: string;
          };
        },
        void
      >({
        path: `/api/admin/unlock-stats`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates lock settings for a user (max attempts, lock duration)
     *
     * @tags Admin - User Unlock
     * @name AdminLockSettingsUpdate
     * @summary Update lock settings
     * @request PUT:/api/admin/lock-settings/{userId}
     * @secure
     */
    adminLockSettingsUpdate: (
      userId: string,
      data: {
        /**
         * Maximum failed login attempts before lock
         * @default 10
         */
        maxAttempts?: number;
        /**
         * Duration in hours for account lock
         * @default 2
         */
        lockDurationHours?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            userId?: string;
            maxAttempts?: number;
            lockDurationHours?: number;
          };
        },
        void
      >({
        path: `/api/admin/lock-settings/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Users
     * @name AdminUsersList
     * @summary Get users list with pagination and filters (admin only)
     * @request GET:/api/admin/users
     * @secure
     */
    adminUsersList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 20 */
        limit?: number;
        /** Search by name or email */
        search?: string;
        school_id?: string;
        role?: string;
        /** Filter by campus ID */
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          users?: User[];
          pagination?: {
            page?: number;
            limit?: number;
            total?: number;
            pages?: number;
          };
        },
        void
      >({
        path: `/api/admin/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Users
     * @name AdminUsersSearchList
     * @summary Search users by email or name (admin only)
     * @request GET:/api/admin/users/search
     * @secure
     */
    adminUsersSearchList: (
      query: {
        /** Search query */
        q: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          users?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            avatar_url?: string;
            role?: string;
          }[];
        },
        void
      >({
        path: `/api/admin/users/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Users
     * @name AdminUsersDetail
     * @summary Get user details with roles (admin only)
     * @request GET:/api/admin/users/{userId}
     * @secure
     */
    adminUsersDetail: (userId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          user?: User;
        },
        void
      >({
        path: `/api/admin/users/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardCommunityCreationList
     * @summary Get community creation stats
     * @request GET:/api/admin/v2/dashboard/community-creation
     * @secure
     */
    adminV2DashboardCommunityCreationList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          labels?: string[];
          subLabels?: string[];
          data?: {
            events?: number;
            ideas?: number;
            spaces?: number;
          }[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/community-creation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardEngagementList
     * @summary Get engagement stats
     * @request GET:/api/admin/v2/dashboard/engagement
     * @secure
     */
    adminV2DashboardEngagementList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          labels?: string[];
          subLabels?: string[];
          userEngagement?: number[];
          sessionDuration?: number[];
          totalChats?: number[];
          donutData?: {
            label?: string;
            value?: number;
            percentage?: string;
            color?: string;
          }[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/engagement`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardRetentionList
     * @summary Get retention stats
     * @request GET:/api/admin/v2/dashboard/retention
     * @secure
     */
    adminV2DashboardRetentionList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          labels?: string[];
          subLabels?: string[];
          connectionRate?: number[];
          inactiveSignups?: number[];
          newRegistrations?: number[];
          avgAppOpens?: number[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/retention`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardStatsList
     * @summary Get dashboard summary stats
     * @request GET:/api/admin/v2/dashboard/stats
     * @secure
     */
    adminV2DashboardStatsList: (
      query?: {
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          totalUsers?: number;
          totalActiveEvents?: number;
          totalSpaces?: number;
          totalIdeas?: number;
        },
        any
      >({
        path: `/api/admin/v2/dashboard/stats`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardPopularFeaturesList
     * @summary Get popular features stats
     * @request GET:/api/admin/v2/dashboard/popular-features
     * @secure
     */
    adminV2DashboardPopularFeaturesList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
        sortBy?: "most_popular" | "least_popular";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          topInterests?: object[];
          popularWaysToConnect?: object[];
          visitedPlaces?: object[];
          topInvitationCategories?: object[];
          mostEngaged?: object[];
          commonInterests?: object[];
          topFieldsOfStudy?: object[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/popular-features`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardStudentBehaviorList
     * @summary Get student behavior stats
     * @request GET:/api/admin/v2/dashboard/student-behavior
     * @secure
     */
    adminV2DashboardStudentBehaviorList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          metricCards?: object[];
          completionMetrics?: object[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/student-behavior`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardEventsInsightsList
     * @summary Get events insights stats
     * @request GET:/api/admin/v2/dashboard/events-insights
     * @secure
     */
    adminV2DashboardEventsInsightsList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          stats?: object;
          expandReachData?: any[];
          usersVsSpacesData?: any[];
          interests?: any[];
          publicEventsList?: any[];
          privateEventsList?: any[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/events-insights`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardStudentSafetyList
     * @summary Get student safety stats
     * @request GET:/api/admin/v2/dashboard/student-safety
     * @secure
     */
    adminV2DashboardStudentSafetyList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          labels?: string[];
          subLabels?: string[];
          reportsData?: object[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/student-safety`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2DashboardUserInteractionsList
     * @summary Get user interactions stats
     * @request GET:/api/admin/v2/dashboard/user-interactions
     * @secure
     */
    adminV2DashboardUserInteractionsList: (
      query?: {
        period?: "week" | "month" | "all-time";
        schoolId?: string;
        campusId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          labels?: string[];
          subLabels?: string[];
          invitationsData?: object[];
          ideasClicksData?: number[];
          eventsClicksData?: number[];
        },
        any
      >({
        path: `/api/admin/v2/dashboard/user-interactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2EventsList
     * @summary Get events list
     * @request GET:/api/admin/v2/events
     * @secure
     */
    adminV2EventsList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        /** Filter by event status (upcoming=future, ongoing=today, finished=past) */
        status?: "all" | "upcoming" | "ongoing" | "finished";
        /**
         * IANA timezone name (e.g., America/New_York, Europe/London) for status filtering
         * @default "UTC"
         */
        timezone?: string;
        /** @format date-time */
        startDate?: string;
        /** @format date-time */
        endDate?: string;
        campusId?: string;
        schoolId?: string;
        sortBy?: "eventName" | "eventDate" | "attendeesCount" | "type";
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            eventName?: string;
            organizer?: {
              name?: string;
              avatar?: string;
            };
            studentId?: string;
            eventDate?: string;
            eventTime?: string;
            /** @format date-time */
            start_date?: string;
            /** @format date-time */
            end_date?: string;
            attendeesCount?: number;
            attendees?: object[];
            type?: string;
            location?: string;
            description?: string;
            slots?: number;
            image_url?: string;
            isFlagged?: boolean;
            flagReason?: string;
            /** Event status based on date (upcoming=future, ongoing=today, finished=past) */
            status?: "upcoming" | "ongoing" | "finished";
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/events`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2EventsDetail
     * @summary Get event details
     * @request GET:/api/admin/v2/events/{id}
     * @secure
     */
    adminV2EventsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          _id?: string;
          name?: string;
          image_url?: string;
          date_and_time?: string;
          location?: string;
          address?: string;
          visibility?: string;
          description?: string;
          slots?: number;
          spaceId?: string;
          attendeesCount?: number;
          organizer?: {
            name?: string;
            avatar?: string;
            studentId?: string;
            id?: string;
            _id?: string;
            avatar_url?: string;
          };
          participants?: {
            user_id?: string;
            name?: string;
            avatar_url?: string;
            status?: string;
          }[];
          isFlagged?: boolean;
          flagReason?: string;
        },
        any
      >({
        path: `/api/admin/v2/events/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2EventsDelete
     * @summary Delete event
     * @request DELETE:/api/admin/v2/events/{id}
     * @secure
     */
    adminV2EventsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/events/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2IdeasList
     * @summary Get ideas list
     * @request GET:/api/admin/v2/ideas
     * @secure
     */
    adminV2IdeasList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: "ideaTitle" | "collaborated" | "creationDate";
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            ideaTitle?: string;
            owner?: {
              name?: string;
              avatar?: string;
            };
            studentId?: string;
            collaborated?: number;
            creationDate?: string;
            creationTime?: string;
            isFlagged?: boolean;
            flagReason?: string;
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/ideas`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2IdeasDetail
     * @summary Get idea details
     * @request GET:/api/admin/v2/ideas/{id}
     * @secure
     */
    adminV2IdeasDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          title?: string;
          description?: string;
          createdAt?: string;
          lookingFor?: string;
          collaboratorsCount?: number;
          creator?: {
            name?: string;
            avatar?: string;
            studentId?: string;
            email?: string;
          };
          collaborators?: {
            user_id?: string;
            name?: string;
            avatar_url?: string;
            status?: string;
          }[];
          isFlagged?: boolean;
          flagReason?: string;
        },
        any
      >({
        path: `/api/admin/v2/ideas/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2IdeasDelete
     * @summary Delete idea
     * @request DELETE:/api/admin/v2/ideas/{id}
     * @secure
     */
    adminV2IdeasDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/ideas/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsList
     * @summary Get reports list
     * @request GET:/api/admin/v2/reports
     * @secure
     */
    adminV2ReportsList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
        schoolId?: string;
        campusId?: string;
        /** Filter by time period */
        period?: "all" | "week" | "month" | "year";
        sortBy?: "reportDate" | "type" | "status" | "reason";
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            description?: string;
            studentId?: string;
            reportDate?: string;
            type?: string;
            reason?: string;
            reasonTag?: string;
            status?: string;
            isFlagged?: boolean;
            reportedItemId?: string;
            reporterName?: string;
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/reports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsStatsList
     * @summary Get report stats
     * @request GET:/api/admin/v2/reports/stats
     * @secure
     */
    adminV2ReportsStatsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          total?: number;
          pending?: number;
          underEvaluation?: number;
          resolved?: number;
          dismissed?: number;
        },
        any
      >({
        path: `/api/admin/v2/reports/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsBulkUpdateUpdate
     * @summary Bulk update reports
     * @request PUT:/api/admin/v2/reports/bulk-update
     * @secure
     */
    adminV2ReportsBulkUpdateUpdate: (
      data: {
        reportIds?: string[];
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/reports/bulk-update`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsDetail
     * @summary Get report details
     * @request GET:/api/admin/v2/reports/{id}
     * @secure
     */
    adminV2ReportsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          description?: string;
          studentId?: string;
          reportDate?: string;
          type?: string;
          reason?: string;
          status?: string;
          notes?: object[];
        },
        any
      >({
        path: `/api/admin/v2/reports/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsStatusPartialUpdate
     * @summary Update report status
     * @request PATCH:/api/admin/v2/reports/{id}/status
     * @secure
     */
    adminV2ReportsStatusPartialUpdate: (
      id: string,
      data: {
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/reports/${id}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsNoteCreate
     * @summary Add note to report
     * @request POST:/api/admin/v2/reports/{id}/note
     * @secure
     */
    adminV2ReportsNoteCreate: (
      id: string,
      data: {
        note?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/reports/${id}/note`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2ReportsBanUserCreate
     * @summary Ban user from report
     * @request POST:/api/admin/v2/reports/{id}/ban-user
     * @secure
     */
    adminV2ReportsBanUserCreate: (
      id: string,
      data: {
        reason?: string;
        duration?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/reports/${id}/ban-user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SettingsProfileUpdate
     * @summary Update admin profile
     * @request PUT:/api/admin/v2/settings/profile
     * @secure
     */
    adminV2SettingsProfileUpdate: (
      data: {
        firstName?: string;
        lastName?: string;
        position?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/settings/profile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SettingsPasswordUpdate
     * @summary Update admin password
     * @request PUT:/api/admin/v2/settings/password
     * @secure
     */
    adminV2SettingsPasswordUpdate: (
      data: {
        currentPassword?: string;
        newPassword?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/settings/password`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SettingsLogoutAllCreate
     * @summary Logout all devices
     * @request POST:/api/admin/v2/settings/logout-all
     * @secure
     */
    adminV2SettingsLogoutAllCreate: (params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/settings/logout-all`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SettingsDeleteAccountCreate
     * @summary Request account deletion
     * @request POST:/api/admin/v2/settings/delete-account
     * @secure
     */
    adminV2SettingsDeleteAccountCreate: (
      data: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/settings/delete-account`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesList
     * @summary Get spaces list
     * @request GET:/api/admin/v2/spaces
     * @secure
     */
    adminV2SpacesList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sortBy?: "spaceName" | "members" | "creationDate" | "category";
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            spaceName?: string;
            owner?: {
              name?: string;
              avatar?: string;
            };
            studentId?: string;
            events?: number;
            members?: number;
            creationDate?: string;
            creationTime?: string;
            category?: string;
            isFlagged?: boolean;
            flagReason?: string;
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/spaces`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesInsightsList
     * @summary Get spaces insights
     * @request GET:/api/admin/v2/spaces/insights
     * @secure
     */
    adminV2SpacesInsightsList: (
      query?: {
        period?: "all" | "week" | "month";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          totalSpaces?: number;
          totalMembers?: number;
          popularCategories?: {
            name?: string;
            imageUrl?: string;
            emoji?: string;
            spaces?: number;
            percentage?: number;
          }[];
          topSpaces?: {
            rank?: number;
            name?: string;
            logo?: string;
            members?: number;
          }[];
        },
        any
      >({
        path: `/api/admin/v2/spaces/insights`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesDetail
     * @summary Get space details
     * @request GET:/api/admin/v2/spaces/{id}
     * @secure
     */
    adminV2SpacesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          name?: string;
          description?: string;
          logo_url?: string;
          cover_image_url?: string;
          owner?: {
            name?: string;
            avatar?: string;
            studentId?: string;
          };
          category?: {
            name?: string;
          };
          campusName?: string;
          members?: {
            user_id?: string;
            name?: string;
            avatar_url?: string;
          }[];
          events?: {
            id?: string;
            name?: string;
            date?: string;
            location?: string;
            image_url?: string;
          }[];
          createdAt?: string;
          isFlagged?: boolean;
          flagReason?: string;
          about?: string;
          chapter?: string;
          contact?: string;
          howWeUse?: string;
          memberRange?: string;
          yearEstablished?: number;
          governingBody?: string;
          primaryFocus?: string;
        },
        any
      >({
        path: `/api/admin/v2/spaces/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesDelete
     * @summary Delete space
     * @request DELETE:/api/admin/v2/spaces/{id}
     * @secure
     */
    adminV2SpacesDelete: (
      id: string,
      data?: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/spaces/${id}`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsList
     * @summary Get students list
     * @request GET:/api/admin/v2/students
     * @secure
     */
    adminV2StudentsList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: "active" | "deactivated" | "banned" | "disengaged";
        sortBy?: "name" | "email" | "memberSince" | "onlineLast" | "status";
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            userId?: string;
            name?: string;
            email?: string;
            interests?: string[];
            status?: string;
            memberSince?: string;
            onlineLast?: string;
            isFlagged?: boolean;
            avatar?: string;
            deactivatedDate?: string;
            deactivatedBy?: string;
            bannedDate?: string;
            bannedBy?: string;
            bannedByEmail?: string;
            bannedTime?: string;
            reason?: string;
            duration?: string;
            totalPeers?: number;
            peers?: number;
            bio?: string;
            studyMain?: string;
            studySecondary?: string;
            ignoredInvitations?: number;
            reported?: boolean;
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/students`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsStatsList
     * @summary Get student stats
     * @request GET:/api/admin/v2/students/stats
     * @secure
     */
    adminV2StudentsStatsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          totalStudents?: number;
          studentsWithAppAccess?: number;
          totalPermanentBans?: number;
        },
        any
      >({
        path: `/api/admin/v2/students/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsDetail
     * @summary Get student details
     * @request GET:/api/admin/v2/students/{id}
     * @secure
     */
    adminV2StudentsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          userId?: string;
          name?: string;
          email?: string;
          avatar?: string;
          interests?: string[];
          status?: string;
          memberSince?: string;
          onlineLast?: string;
          isFlagged?: boolean;
          phone?: string;
          studyMain?: string;
          studySecondary?: string;
          graduationYear?: number;
          areaOfStudy?: string;
          lastLogin?: string;
          bio?: string;
          totalPeers?: number;
          peers?: number;
          bannedAt?: string;
          bannedBy?: string;
          bannedByEmail?: string;
          bannedDate?: string;
          bannedTime?: string;
          banReason?: string;
          deletedAt?: string;
          deletedBy?: string;
          deletionReason?: string;
          banHistory?: {
            title?: string;
            duration?: string;
            expiresIn?: string;
            reason?: string;
            bannedDate?: string;
            bannedTime?: string;
            bannedBy?: string;
          }[];
          blockedByUsers?: {
            id?: string;
            name?: string;
            avatar?: string;
            date?: string;
            time?: string;
            reason?: string;
          }[];
        },
        any
      >({
        path: `/api/admin/v2/students/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsDelete
     * @summary Delete student
     * @request DELETE:/api/admin/v2/students/{id}
     * @secure
     */
    adminV2StudentsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsUnlockCreate
     * @summary Unlock student
     * @request POST:/api/admin/v2/students/{id}/unlock
     * @secure
     */
    adminV2StudentsUnlockCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}/unlock`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsUnbanCreate
     * @summary Unban student
     * @request POST:/api/admin/v2/students/{id}/unban
     * @secure
     */
    adminV2StudentsUnbanCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}/unban`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsBanHistoryList
     * @summary Get student ban history
     * @request GET:/api/admin/v2/students/{id}/ban-history
     * @secure
     */
    adminV2StudentsBanHistoryList: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          bannedAt?: string;
          reason?: string;
          bannedBy?: string;
        }[],
        any
      >({
        path: `/api/admin/v2/students/${id}/ban-history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsLockSettingsUpdate
     * @summary Update student lock settings
     * @request PUT:/api/admin/v2/students/{id}/lock-settings
     * @secure
     */
    adminV2StudentsLockSettingsUpdate: (
      id: string,
      data: {
        isLocked?: boolean;
        lockReason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}/lock-settings`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2CampusesList
     * @summary Get all campuses
     * @request GET:/api/admin/v2/campuses
     * @secure
     */
    adminV2CampusesList: (
      query?: {
        /** Filter campuses by school ID */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          id?: string;
          name?: string;
          schoolId?: string;
          address?: string;
          location?: string;
          status?: string;
          imageUrl?: string;
          boundaryData?: object;
        }[],
        any
      >({
        path: `/api/admin/v2/campuses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SchoolsList
     * @summary Get all schools
     * @request GET:/api/admin/v2/schools
     * @secure
     */
    adminV2SchoolsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          id?: string;
          name?: string;
          domain?: string;
        }[],
        any
      >({
        path: `/api/admin/v2/schools`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MeList
     * @summary Get admin profile
     * @request GET:/api/admin/v2/me
     * @secure
     */
    adminV2MeList: (params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MembersList
     * @summary Get members list
     * @request GET:/api/admin/v2/members
     * @secure
     */
    adminV2MembersList: (
      query?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          data?: {
            id?: string;
            name?: string;
            title?: string;
            email?: string;
            avatar?: string;
            role?: string;
            assignedBy?: {
              name?: string;
              email?: string;
            };
            invitationStatus?: string;
            lastActive?: string;
          }[];
          total?: number;
          page?: number;
          limit?: number;
        },
        any
      >({
        path: `/api/admin/v2/members`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MembersCreate
     * @summary Create a new member
     * @request POST:/api/admin/v2/members
     * @secure
     */
    adminV2MembersCreate: (
      data: {
        name?: string;
        email?: string;
        role?: string;
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/members`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MembersDelete
     * @summary Remove a member
     * @request DELETE:/api/admin/v2/members/{id}
     * @secure
     */
    adminV2MembersDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/members/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MembersRolePartialUpdate
     * @summary Update member role
     * @request PATCH:/api/admin/v2/members/{id}/role
     * @secure
     */
    adminV2MembersRolePartialUpdate: (
      id: string,
      data: {
        role?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/members/${id}/role`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2MembersPasswordResetCreate
     * @summary Send password reset to member
     * @request POST:/api/admin/v2/members/{id}/password-reset
     * @secure
     */
    adminV2MembersPasswordResetCreate: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/members/${id}/password-reset`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2EventsFlagCreate
     * @summary Flag an event
     * @request POST:/api/admin/v2/events/{id}/flag
     * @secure
     */
    adminV2EventsFlagCreate: (
      id: string,
      data: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/events/${id}/flag`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2EventsUnflagCreate
     * @summary Unflag an event
     * @request POST:/api/admin/v2/events/{id}/unflag
     * @secure
     */
    adminV2EventsUnflagCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/events/${id}/unflag`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2IdeasFlagCreate
     * @summary Flag an idea
     * @request POST:/api/admin/v2/ideas/{id}/flag
     * @secure
     */
    adminV2IdeasFlagCreate: (
      id: string,
      data: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/ideas/${id}/flag`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2IdeasUnflagCreate
     * @summary Unflag an idea
     * @request POST:/api/admin/v2/ideas/{id}/unflag
     * @secure
     */
    adminV2IdeasUnflagCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/ideas/${id}/unflag`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesFlagCreate
     * @summary Flag a space
     * @request POST:/api/admin/v2/spaces/{id}/flag
     * @secure
     */
    adminV2SpacesFlagCreate: (
      id: string,
      data: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/spaces/${id}/flag`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2SpacesUnflagCreate
     * @summary Unflag a space
     * @request POST:/api/admin/v2/spaces/{id}/unflag
     * @secure
     */
    adminV2SpacesUnflagCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/spaces/${id}/unflag`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsFlagCreate
     * @summary Flag student
     * @request POST:/api/admin/v2/students/{id}/flag
     * @secure
     */
    adminV2StudentsFlagCreate: (
      id: string,
      data: {
        reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}/flag`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminV2
     * @name AdminV2StudentsUnflagCreate
     * @summary Unflag student
     * @request POST:/api/admin/v2/students/{id}/unflag
     * @secure
     */
    adminV2StudentsUnflagCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/v2/students/${id}/unflag`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Analytics
     * @name AnalyticsLogCreate
     * @summary Log user activity
     * @request POST:/api/analytics/log
     * @secure
     */
    analyticsLogCreate: (
      data: {
        activityType?:
          | "idea_viewed"
          | "event_viewed"
          | "space_viewed"
          | "profile_viewed";
        entityId?: string;
        entityType?: "idea" | "event" | "space" | "user";
        details?: object;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/analytics/log`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns combined download stats from both App Store and Google Play Store
     *
     * @tags App Downloads
     * @name AppDownloadsList
     * @summary Get combined download statistics
     * @request GET:/api/app-downloads
     */
    appDownloadsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          totalDownloads?: number;
          totalActiveUsers?: number;
          appStore?: object;
          playStore?: object;
        },
        void
      >({
        path: `/api/app-downloads`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns download and usage statistics from Apple App Store Connect API
     *
     * @tags App Downloads
     * @name AppDownloadsAppstoreList
     * @summary Get App Store statistics
     * @request GET:/api/app-downloads/appstore
     */
    appDownloadsAppstoreList: (params: RequestParams = {}) =>
      this.http.request<
        {
          downloads?: number;
          activeUsers?: number;
          newUsers?: number;
          deletions?: number;
          updates?: number;
          sessions?: number;
          crashes?: number;
          impressions?: number;
          countriesData?: object[];
          apiStatus?: string;
        },
        void
      >({
        path: `/api/app-downloads/appstore`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns download and usage statistics from Google Play Store Console API
     *
     * @tags App Downloads
     * @name AppDownloadsPlaystoreList
     * @summary Get Play Store statistics
     * @request GET:/api/app-downloads/playstore
     */
    appDownloadsPlaystoreList: (params: RequestParams = {}) =>
      this.http.request<
        {
          downloads?: number;
          activeUsers?: number;
          newUsers?: number;
          deletions?: number;
          updates?: number;
          countriesData?: object[];
          apiStatus?: string;
          appInfo?: object;
        },
        void
      >({
        path: `/api/app-downloads/playstore`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint allows a new user to sign up by providing their email, phone number, password, confirmed password, and role. The email is used to identify the user and must be unique. The phone number is optional but must be a valid US mobile number if provided. The password must be at least 8 characters long and must match the confirmed password. The role specifies the user's role within the system. Upon successful signup, an OTP (One-Time Password) is sent to the user's email and phone number for verification purposes.
     *
     * @name SignupCreate
     * @summary Create a new user
     * @request POST:/api/signup
     */
    signupCreate: (
      data: {
        email?: string;
        phone_number?: string;
        password?: string;
        password_confirmed?: string;
        role?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          user?: {
            access_token?: string;
            avatar_url?: string;
            /** @format date */
            birthday?: string;
            /** @format objectId */
            campus_id?: string;
            /** @format date-time */
            createdAt?: string;
            email?: string;
            interests?: string[];
            /** @default false */
            is_active?: boolean;
            /** @default false */
            is_onboarded?: boolean;
            /** @default false */
            is_parent?: boolean;
            /** @default false */
            is_profile_public?: boolean;
            /** @default false */
            is_verified?: boolean;
            languages?: string[];
            location?: {
              type?: string;
              coordinates?: number[];
            };
            otp?: number;
            peers?: string[];
            peers_blocked?: string[];
            pets?: string[];
            phone_number?: string;
            role?: string;
            school_id?: string;
            studies?: string[];
            /** @format date-time */
            updatedAt?: string;
          };
        },
        void
      >({
        path: `/api/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verify user
     *
     * @name VerifyCreate
     * @summary Verify user
     * @request POST:/api/verify
     */
    verifyCreate: (
      data: {
        otp?: number;
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          user?: {
            access_token?: string;
            avatar_url?: string;
            /** @format date */
            birthday?: string;
            /** @format objectId */
            campus_id?: string;
            /** @format date-time */
            createdAt?: string;
            email?: string;
            interests?: string[];
            /** @default false */
            is_active?: boolean;
            /** @default false */
            is_onboarded?: boolean;
            /** @default false */
            is_parent?: boolean;
            /** @default false */
            is_profile_public?: boolean;
            /** @default false */
            is_verified?: boolean;
            languages?: string[];
            location?: {
              type?: string;
              coordinates?: number[];
            };
            otp?: number;
            peers?: string[];
            peers_blocked?: string[];
            pets?: string[];
            phone_number?: string;
            role?: string;
            /** @format objectId */
            school_id?: string;
            studies?: string[];
            /** @format date-time */
            updatedAt?: string;
          };
        },
        void
      >({
        path: `/api/verify`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resend OTP
     *
     * @name ResendOtpCreate
     * @summary Resend OTP
     * @request POST:/api/resend-otp
     * @secure
     */
    resendOtpCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/resend-otp`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Login user
     *
     * @name LoginCreate
     * @summary Login user
     * @request POST:/api/login
     */
    loginCreate: (
      data: {
        email?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          access_token?: string;
          _id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: string;
          school_id?: string;
          campus_id?: string;
          avatar_url?: string;
          refresh_token?: string;
          require_password_change?: boolean;
        },
        void
      >({
        path: `/api/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user
     *
     * @name LogoutCreate
     * @summary Logout user
     * @request POST:/api/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Forgot password
     *
     * @name ForgotPasswordCreate
     * @summary Forgot password
     * @request POST:/api/forgot-password
     * @secure
     */
    forgotPasswordCreate: (
      data: {
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Reset password
     *
     * @name ResetPasswordCreate
     * @summary Reset password
     * @request POST:/api/reset-password
     * @secure
     */
    resetPasswordCreate: (
      data: {
        email?: string;
        password?: string;
        password_confirmed?: string;
        otp?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Refresh access token using refresh token
     *
     * @name RefreshTokenCreate
     * @summary Refresh access token
     * @request POST:/api/refresh-token
     */
    refreshTokenCreate: (
      data: {
        refresh_token?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          access_token?: string;
          refresh_token?: string;
        },
        void
      >({
        path: `/api/refresh-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates the first super admin user (only works if no super admin exists and BOOTSTRAP_SECRET is set)
     *
     * @tags Bootstrap
     * @name BootstrapSuperAdminCreate
     * @summary Bootstrap first super admin
     * @request POST:/api/bootstrap/super-admin
     */
    bootstrapSuperAdminCreate: (
      data: {
        /**
         * Email of existing user to promote
         * @format email
         */
        email: string;
        /** Secret from BOOTSTRAP_SECRET env variable */
        bootstrap_secret: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/bootstrap/super-admin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns whether bootstrap mode is enabled and if a super admin exists
     *
     * @tags Bootstrap
     * @name BootstrapStatusList
     * @summary Check bootstrap status
     * @request GET:/api/bootstrap/status
     */
    bootstrapStatusList: (params: RequestParams = {}) =>
      this.http.request<
        {
          bootstrap_enabled?: boolean;
          super_admin_exists?: boolean;
          super_admin_email?: string | null;
          message?: string;
        },
        void
      >({
        path: `/api/bootstrap/status`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesList
     * @summary Get all campuses
     * @request GET:/api/campuses
     * @secure
     */
    campusesList: (
      query?: {
        /** Filter campuses by school ID */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Campus[];
          count?: number;
        },
        | {
            success?: boolean;
            message?: string;
            data?: object[];
            count?: number;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/api/campuses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesCreate
     * @summary Create a new campus
     * @request POST:/api/campuses
     * @secure
     */
    campusesCreate: (
      data: {
        campus_name: string;
        campus_short_name?: string;
        school_id?: string;
        image_url?: string;
        ambassador_ids?: string[];
        phone_number: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        coordinates?: {
          type?: "Polygon";
          coordinates?: any[];
        };
        dawn_to_dusk?: string[];
        time_zone: string;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Campus;
        },
        | {
            success?: boolean;
            message?: string;
            error?: string;
            details?: object;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/api/campuses`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesUpdate
     * @summary Update a campus
     * @request PUT:/api/campuses/{id}
     * @secure
     */
    campusesUpdate: (
      id: string,
      data: {
        campus_name?: string;
        image_url?: string;
        ambassador_ids?: string[];
        phone_number?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
        coordinates?: object;
        dawn_to_dusk?: string[];
        time_zone?: string;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Campus;
          updatedFields?: string[];
        },
        | {
            success?: boolean;
            message?: string;
            error?: string;
            allowedFields?: string[];
            details?: object;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/api/campuses/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesDetail
     * @summary Get campus by ID
     * @request GET:/api/campuses/{id}
     * @secure
     */
    campusesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        Campus,
        | {
            error?: string;
          }
        | {
            message?: string;
          }
      >({
        path: `/api/campuses/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesDelete
     * @summary Delete a campus
     * @request DELETE:/api/campuses/{id}
     * @secure
     */
    campusesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            deletedCampus?: {
              id?: string;
              campus_name?: string;
              city?: string;
              state?: string;
            };
          };
        },
        {
          success?: boolean;
          message?: string;
          error?: string;
        }
      >({
        path: `/api/campuses/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campuses
     * @name CampusesDisablePartialUpdate
     * @summary Disable a campus
     * @request PATCH:/api/campuses/{id}/disable
     * @secure
     */
    campusesDisablePartialUpdate: (id: string, params: RequestParams = {}) =>
      this.http.request<
        Campus,
        | {
            error?: string;
          }
        | {
            message?: string;
          }
      >({
        path: `/api/campuses/${id}/disable`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Metrics
     * @name AdminCampusMetricsSocialHealthList
     * @summary Get social health metrics for a campus
     * @request GET:/api/admin/campus/{campusId}/metrics/social-health
     * @secure
     */
    adminCampusMetricsSocialHealthList: (
      campusId: string,
      query?: {
        /**
         * Time period for metrics
         * @default "30d"
         */
        period?: "7d" | "30d" | "90d";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/metrics/social-health`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Metrics
     * @name AdminCampusMetricsWellbeingList
     * @summary Get wellbeing indicators for a campus
     * @request GET:/api/admin/campus/{campusId}/metrics/wellbeing
     * @secure
     */
    adminCampusMetricsWellbeingList: (
      campusId: string,
      query?: {
        /**
         * Time period for metrics
         * @default "30d"
         */
        period?: "7d" | "30d" | "90d";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/metrics/wellbeing`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Metrics
     * @name AdminCampusMetricsKpisList
     * @summary Get key performance indicators for a campus
     * @request GET:/api/admin/campus/{campusId}/metrics/kpis
     * @secure
     */
    adminCampusMetricsKpisList: (
      campusId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/metrics/kpis`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Metrics
     * @name AdminCampusMetricsActivityTimelineList
     * @summary Get activity timeline for a campus
     * @request GET:/api/admin/campus/{campusId}/metrics/activity-timeline
     * @secure
     */
    adminCampusMetricsActivityTimelineList: (
      campusId: string,
      query?: {
        /**
         * Time period for activity timeline
         * @default "30d"
         */
        period?: "7d" | "30d" | "90d";
        /**
         * Maximum number of activities to return
         * @default 100
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/metrics/activity-timeline`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Alerts
     * @name AdminCampusAlertsList
     * @summary Get alerts for a campus
     * @request GET:/api/admin/campus/{campusId}/alerts
     * @secure
     */
    adminCampusAlertsList: (
      campusId: string,
      query?: {
        /**
         * Return only unread alerts
         * @default false
         */
        unreadOnly?: boolean;
        /** Filter by severity level */
        severity?: "info" | "warning" | "critical";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/alerts`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Alerts
     * @name AdminCampusAlertsMarkReadPartialUpdate
     * @summary Mark an alert as read
     * @request PATCH:/api/admin/campus/{campusId}/alerts/{alertId}/mark-read
     * @secure
     */
    adminCampusAlertsMarkReadPartialUpdate: (
      campusId: string,
      alertId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/alerts/${alertId}/mark-read`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Campus Alerts
     * @name AdminCampusAlertsMarkAllReadPartialUpdate
     * @summary Mark all alerts as read for a campus
     * @request PATCH:/api/admin/campus/{campusId}/alerts/mark-all-read
     * @secure
     */
    adminCampusAlertsMarkAllReadPartialUpdate: (
      campusId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/campus/${campusId}/alerts/mark-all-read`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncSyncCreate
     * @summary Trigger sync for a specific campus
     * @request POST:/api/admin/campus-sync/sync/{campus_id}
     * @secure
     */
    adminCampusSyncSyncCreate: (
      campusId: string,
      data: {
        /** Force a full sync even if recent sync exists */
        forceFullSync?: boolean;
        /** Include detailed place information */
        includeDetails?: boolean;
        /** Maximum number of API calls to use */
        maxApiCalls?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            campus_id?: string;
            sync_status?: "completed" | "failed" | "partial";
            places_added?: number;
            places_updated?: number;
            places_removed?: number;
            api_calls_used?: number;
            sync_duration_ms?: number;
            total_places_processed?: number;
            errors?: string[];
          };
        },
        void
      >({
        path: `/api/admin/campus-sync/sync/${campusId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncSyncAllCreate
     * @summary Trigger sync for all active campuses
     * @request POST:/api/admin/campus-sync/sync-all
     * @secure
     */
    adminCampusSyncSyncAllCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            summary?: {
              total?: number;
              totalPlacesAdded?: number;
              totalPlacesUpdated?: number;
              totalPlacesRemoved?: number;
            };
            results?: {
              campus_id?: string;
              sync_status?: string;
              places_added?: number;
              places_updated?: number;
              places_removed?: number;
            }[];
          };
        },
        void
      >({
        path: `/api/admin/campus-sync/sync-all`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncLogsList
     * @summary Get sync logs
     * @request GET:/api/admin/campus-sync/logs
     * @secure
     */
    adminCampusSyncLogsList: (
      query?: {
        /** Filter by campus ID */
        campus_id?: string;
        /** Filter by sync status */
        sync_status?: "completed" | "failed" | "partial" | "in_progress";
        /**
         * Number of logs to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of logs to skip
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            logs?: {
              _id?: string;
              campus_id?: {
                _id?: string;
                campus_name?: string;
              };
              /** @format date-time */
              last_sync_date?: string;
              places_added?: number;
              places_updated?: number;
              places_removed?: number;
              api_calls_used?: number;
              sync_status?: string;
              sync_duration_ms?: number;
              total_places_processed?: number;
              error_message?: string;
              /** @format date-time */
              createdAt?: string;
            }[];
            pagination?: {
              total?: number;
              limit?: number;
              offset?: number;
            };
          };
        },
        void
      >({
        path: `/api/admin/campus-sync/logs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncCampusesList
     * @summary Get list of campuses with sync status
     * @request GET:/api/admin/campus-sync/campuses
     * @secure
     */
    adminCampusSyncCampusesList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            campus_name?: string;
            coordinates?: object | null;
            places_count?: number;
            last_sync?: {
              /** @format date-time */
              date?: string;
              status?: string;
              places_added?: number;
              places_updated?: number;
              places_removed?: number;
              api_calls_used?: number;
            } | null;
            has_coordinates?: boolean;
          }[];
        },
        void
      >({
        path: `/api/admin/campus-sync/campuses`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncCampusPreviewList
     * @summary Preview campus boundary and search points
     * @request GET:/api/admin/campus-sync/campus/{campus_id}/preview
     * @secure
     */
    adminCampusSyncCampusPreviewList: (
      campusId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            campus_name?: string;
            boundary?: object;
            search_points?: {
              lat?: number;
              lng?: number;
              radius?: number;
            }[];
            bounds?: {
              north?: number;
              south?: number;
              east?: number;
              west?: number;
            };
            center?: {
              lat?: number;
              lng?: number;
            };
            area_sqm?: number;
            area_acres?: number;
            search_points_count?: number;
          };
        },
        void
      >({
        path: `/api/admin/campus-sync/campus/${campusId}/preview`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Campus Sync
     * @name AdminCampusSyncSchedulerStatusList
     * @summary Get sync scheduler status
     * @request GET:/api/admin/campus-sync/scheduler/status
     * @secure
     */
    adminCampusSyncSchedulerStatusList: (params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/campus-sync/scheduler/status`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name ChatsGetOrCreateCreate
     * @summary Get or create a chat with a user
     * @request POST:/api/chats/get-or-create
     * @secure
     */
    chatsGetOrCreateCreate: (
      data: {
        /** The ID of the user to get or create a chat with */
        user_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** @example "Chat retrieved successfully" */
          message?: string;
          data?: Chat;
          /** Whether the chat was newly created or already existed */
          created?: boolean;
        },
        void
      >({
        path: `/api/chats/get-or-create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name ChatsList
     * @summary Get all chats
     * @request GET:/api/chats
     * @secure
     */
    chatsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "Chats retrieved successfully" */
          message?: string;
          data?: Chat[];
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/chats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name ChatsPartialUpdate
     * @summary Mark chat as read
     * @request PATCH:/api/chats/{chat_id}
     * @secure
     */
    chatsPartialUpdate: (chatId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "Chat marked as read" */
          message?: string;
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/chats/${chatId}`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name ChatsDetail
     * @summary Get all messages in a chat
     * @request GET:/api/chats/{chat_id}
     * @secure
     */
    chatsDetail: (chatId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "Messages retrieved successfully" */
          message?: string;
          data?: Message[];
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/chats/${chatId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves chat suggestions based on the latest phrase from the current user's messages in chat history with the specified user. If no chat history exists, returns 5 greeting suggestions.
     *
     * @tags Chat
     * @name ChatsSuggestionsDetail
     * @summary Get chat suggestions for a specific user
     * @request GET:/api/chats/suggestions/{user_id}
     * @secure
     */
    chatsSuggestionsDetail: (userId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "Suggestions retrieved successfully" */
          message?: string;
          /** @example ["Hey! How are you doing?","Hi there! Long time no see","Hello! How's your day going?","Hey! What's up?","Hi! How have you been?"] */
          suggestions?: string[];
          /**
           * The last phrase from chat history (if exists)
           * @example "Looking forward to meeting you"
           */
          lastPhrase?: string;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/chats/suggestions/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Aggregates badge counters for current user (unread messages, pending invites, peer requests)
     *
     * @tags Counters
     * @name CountersList
     * @summary Get app badge counters
     * @request GET:/api/counters
     * @secure
     */
    countersList: (params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
          data?: {
            /** Count of chats with unread last messages */
            unreadMessagesCount?: number;
            /** Count of pending walk invites */
            pendingInvitesCount?: number;
            /** Sum of unread messages and pending invites */
            badgeInboxCount?: number;
            /** Count of pending peer requests (last 7 days) */
            peerRequestsCount?: number;
          };
        },
        void
      >({
        path: `/api/counters`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new deeplink or returns existing one if it already exists for the user
     *
     * @tags Deeplinks
     * @name DeeplinksCreate
     * @summary Create a new deeplink
     * @request POST:/api/deeplinks
     * @secure
     */
    deeplinksCreate: (
      data: {
        /** Query parameters for the deeplink */
        params: string;
        /** Type of deeplink */
        type: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** The shortened deeplink URL */
          link?: string;
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/deeplinks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates an existing deeplink by adding IP and user tracking information
     *
     * @tags Deeplinks
     * @name DeeplinksUpdate
     * @summary Update a deeplink
     * @request PUT:/api/deeplinks
     */
    deeplinksUpdate: (
      data: {
        /** Query parameters for the deeplink */
        params: string;
        /** Type of deeplink */
        type: string;
        /** User ID to track */
        userId: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** The shortened deeplink URL */
          link?: string;
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/deeplinks`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the most recent deeplink accessed from the same IP address that the current user hasn't opened yet
     *
     * @tags Deeplinks
     * @name DeeplinksLastByIpList
     * @summary Get last deeplink by IP
     * @request GET:/api/deeplinks/last-by-ip
     * @secure
     */
    deeplinksLastByIpList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Current user ID */
          userId?: string;
          /** The shortened deeplink URL (empty string if no valid link found) */
          link?: string;
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/deeplinks/last-by-ip`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns newest spaces in user's campus (admins see all campuses)
     *
     * @tags Discovery
     * @name DiscoverSpacesList
     * @summary Discover spaces
     * @request GET:/api/discover/spaces
     * @secure
     */
    discoverSpacesList: (
      query?: {
        /**
         * @max 100
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/discover/spaces`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns newest events in user's school (admins see all schools)
     *
     * @tags Discovery
     * @name DiscoverEventsList
     * @summary Discover events
     * @request GET:/api/discover/events
     * @secure
     */
    discoverEventsList: (
      query?: {
        /**
         * @max 100
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/discover/events`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns newest ideas in user's school (admins see all schools)
     *
     * @tags Discovery
     * @name DiscoverIdeasList
     * @summary Discover ideas
     * @request GET:/api/discover/ideas
     * @secure
     */
    discoverIdeasList: (
      query?: {
        /**
         * @max 100
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/discover/ideas`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns random users grouped by various criteria (classOf, dogOwner, areaOfStudy, parent, peers, relationship, spokenLanguage, interests)
     *
     * @tags Discovery
     * @name DiscoverUsersList
     * @summary Discover users
     * @request GET:/api/discover/users
     * @secure
     */
    discoverUsersList: (
      query?: {
        /**
         * Max users per bucket
         * @max 100
         * @default 10
         */
        limit?: number;
        /** Specific bucket type (returns all buckets if not specified) */
        type?:
          | "walk"
          | "classOf"
          | "dogOwner"
          | "areaOfStudy"
          | "parent"
          | "peers"
          | "relationship"
          | "spokenLanguage"
          | "interests";
        /** Two-digit graduation year suffix (e.g., 25) */
        classOf?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/discover/users`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a single random user for each filter type (9 types total) with counts and activity indicators
     *
     * @tags Discovery
     * @name DiscoverSurpriseList
     * @summary Surprise Me - Get random users for all filter types with activity status
     * @request GET:/api/discover/surprise
     * @secure
     */
    discoverSurpriseList: (params: RequestParams = {}) =>
      this.http.request<
        {
          summary?: {
            /** Total number of filter types */
            total_filters?: number;
            /** Number of filters with 10+ users */
            active_filters?: number;
            /** Whether any filters are active */
            is_active?: boolean;
            /** Minimum users required for active status */
            min_users_threshold?: number;
          };
          filters?: {
            walk?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            interests?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            spokenLanguage?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            areaOfStudy?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            dogOwner?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            classOf25?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            parent?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            relationship?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
            peers?: {
              user?: object | null;
              is_active?: boolean;
              count?: number;
            };
          };
        },
        void
      >({
        path: `/api/discover/surprise`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new event
     *
     * @tags Event
     * @name EventsCreate
     * @summary Create a new event
     * @request POST:/api/events
     * @secure
     */
    eventsCreate: (
      data: {
        address?: string;
        date_and_time?: string;
        description?: string;
        /** Type of event */
        event_type?: "outdoor" | "indoor";
        expand_event?: boolean;
        /** ID of the interest associated with the event */
        interestId?: string;
        location?: string;
        name?: string;
        slots?: number;
        /** Visibility of the event */
        visibility?: "public" | "private";
        isCustom?: boolean;
        /** Optional array of participant user IDs */
        participants?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Event;
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all events by user
     *
     * @tags Event
     * @name EventsList
     * @summary Get all events by user
     * @request GET:/api/events
     * @secure
     */
    eventsList: (
      query?: {
        /** Include detailed participant information (id, avatar_url, name) instead of just user IDs */
        include_participant_details?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: (
            | Event
            | {
                _id?: string;
                name?: string;
                date_and_time?: string;
                address?: string;
                image_url?: string;
                participants?: {
                  id?: string;
                  avatar_url?: string;
                  name?: string;
                }[];
              }
          )[];
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/events`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the count of user engagements with events
     *
     * @tags Events
     * @name EventsEventEngagementCountList
     * @summary Get event engagement count
     * @request GET:/api/events/eventEngagement-count
     * @secure
     */
    eventsEventEngagementCountList: (
      query?: {
        /** Time frame to filter engagement data by. If omitted, all timeframes are returned in one response. */
        timeFrame?: "day" | "week" | "month" | "last6months" | "all";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        (
          | {
              timeFrame?: string;
              totalEventEngagement?: number;
              percentChange?: number | null;
            }
          | {
              timeFrame?: string;
              data?: {
                /** @example "May 2025" */
                month?: string;
                totalCount?: number;
              }[];
            }
          | {
              day?: {
                totalEventEngagement?: number;
                percentChange?: number | null;
              };
              week?: {
                totalEventEngagement?: number;
                percentChange?: number | null;
              };
              month?: {
                totalEventEngagement?: number;
                percentChange?: number | null;
              };
              allTime?: {
                totalEventEngagement?: number;
              };
            }
        ) & {
          count?: number;
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/events/eventEngagement-count`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the count of events based on a specific filter or get all counts by default. Valid filters: `outdoor`, `indoor`, `public`, `private`, `total`
     *
     * @tags Events
     * @name EventsEventTypeList
     * @summary Get event counts by type or visibility
     * @request GET:/api/events/EventType
     */
    eventsEventTypeList: (
      query?: {
        /** Optional. If provided, only returns the count for that filter. */
        filter?: "outdoor" | "indoor" | "public" | "private" | "total";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        | {
            filter?: string;
            count?: number;
          }
        | {
            totalEvents?: number;
            outdoor?: number;
            indoor?: number;
            public?: number;
            private?: number;
          },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/EventType`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get an event by ID. Optionally include past/inactive events.
     *
     * @tags Event
     * @name EventsDetail
     * @summary Get an event
     * @request GET:/api/events/{event_id}
     * @secure
     */
    eventsDetail: (
      eventId: string,
      query?: {
        /**
         * Include past/inactive events (default true)
         * @default true
         */
        include_past?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Event;
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/${eventId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing event
     *
     * @tags Event
     * @name EventsPartialUpdate
     * @summary Update an event
     * @request PATCH:/api/events/{event_id}
     * @secure
     */
    eventsPartialUpdate: (
      eventId: string,
      data: {
        address?: string;
        date_and_time?: string;
        description?: string;
        event_type?: "outdoor" | "indoor";
        expand_event?: boolean;
        /** ID of the interest associated with the event */
        interestId?: string;
        location?: string;
        name?: string;
        slots?: number;
        visibility?: "public" | "private";
        isCustom?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Event;
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | void
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/${eventId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Response invite to an event
     *
     * @tags Event
     * @name EventsResponsePartialUpdate
     * @summary Response invite to an event
     * @request PATCH:/api/events/response/{event_id}
     * @secure
     */
    eventsResponsePartialUpdate: (
      eventId: string,
      data: {
        address?: string;
        date_and_time?: string;
        description?: string;
        event_type?: "outdoor" | "indoor";
        expand_event?: boolean;
        /** ID of the interest associated with the event */
        interestId?: string;
        location?: string;
        name?: string;
        slots?: number;
        visibility?: "public" | "private";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Event;
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/response/${eventId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Allow a user to join an existing event
     *
     * @tags Events
     * @name EventsJoinPartialUpdate
     * @summary Join an event
     * @request PATCH:/api/events/join/{event_id}
     * @secure
     */
    eventsJoinPartialUpdate: (eventId: string, params: RequestParams = {}) =>
      this.http.request<
        Event,
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/events/join/${eventId}`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Allow a user to leave an event they previously joined
     *
     * @tags Events
     * @name EventsLeavePartialUpdate
     * @summary Leave an event
     * @request PATCH:/api/events/leave/{event_id}
     * @secure
     */
    eventsLeavePartialUpdate: (eventId: string, params: RequestParams = {}) =>
      this.http.request<
        Event,
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/events/leave/${eventId}`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Invite an event
     *
     * @tags Event
     * @name EventsInviteCreate
     * @summary Invite an event
     * @request POST:/api/events/invite/{event_id}
     * @secure
     */
    eventsInviteCreate: (eventId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
          data?: Event;
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/invite/${eventId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload a custom image for an event
     *
     * @tags Event
     * @name EventsUploadImageCreate
     * @summary Upload an image for an event
     * @request POST:/api/events/upload-image/{event_id}
     * @secure
     */
    eventsUploadImageCreate: (
      eventId: string,
      data: {
        /** @format binary */
        eventImage?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            image_url?: string;
          };
        },
        | {
            message?: string;
            /** Array of validation errors */
            errors?: string[];
          }
        | void
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/events/upload-image/${eventId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Send reminder notifications for upcoming events (admin only)
     *
     * @tags Events
     * @name EventsCronReminderCreate
     * @summary Send event reminders
     * @request POST:/api/events/cron/reminder
     * @secure
     */
    eventsCronReminderCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/events/cron/reminder`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all active events the user has created or joined (includes past events, excludes deleted events)
     *
     * @tags Events
     * @name EventsProfileDetail
     * @summary Get user's events profile
     * @request GET:/api/events/profile/{type}
     * @secure
     */
    eventsProfileDetail: (
      type: "created" | "joined",
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/events/profile/${type}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves events that were deleted by the user (deleteReason='user') or all deleted events created by the user if admin
     *
     * @tags Events
     * @name EventsDeletedList
     * @summary Get deleted events for the current user
     * @request GET:/api/events/deleted
     * @secure
     */
    eventsDeletedList: (
      query?: {
        /** @default 1 */
        page?: number;
        /**
         * @max 100
         * @default 20
         */
        limit?: number;
        /** Filter by deletion reason (optional) */
        deleteReason?: "user" | "admin" | "auto_cleanup";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/events/deleted`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event Invites
     * @name EventInvitesCreate
     * @summary Create a new event invitation
     * @request POST:/api/event-invites
     * @secure
     */
    eventInvitesCreate: (
      data: {
        receiver_id: string;
        event_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        EventInvite,
        | {
            message?: string;
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/event-invites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event Invites
     * @name EventInvitesList
     * @summary Get all event invitations for the current user
     * @request GET:/api/event-invites
     * @secure
     */
    eventInvitesList: (
      query?: {
        /** Filter by sent or received invitations */
        type?: "sent" | "received";
        /** Filter by status */
        status?: "pending" | "accepted" | "rejected" | "cancelled";
        /** Filter by event ID */
        event_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        EventInvite[],
        {
          message?: string;
        }
      >({
        path: `/api/event-invites`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event Invites
     * @name EventInvitesDetail
     * @summary Get a specific event invitation
     * @request GET:/api/event-invites/{id}
     * @secure
     */
    eventInvitesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        EventInvite,
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/event-invites/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event Invites
     * @name EventInvitesUpdate
     * @summary Update event invitation status
     * @request PUT:/api/event-invites/{id}
     * @secure
     */
    eventInvitesUpdate: (
      id: string,
      data: {
        status: "accepted" | "rejected" | "cancelled";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        EventInvite,
        | {
            message?: string;
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/event-invites/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event Invites
     * @name EventInvitesDelete
     * @summary Delete an event invitation
     * @request DELETE:/api/event-invites/{id}
     * @secure
     */
    eventInvitesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/event-invites/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the health status of the application and its dependencies
     *
     * @tags Health
     * @name HealthList
     * @summary Health check endpoint
     * @request GET:/api/health
     */
    healthList: (params: RequestParams = {}) =>
      this.http.request<
        {
          status?: "healthy" | "degraded" | "unhealthy";
          /** @format date-time */
          timestamp?: string;
          checks?: {
            database?: {
              status?: "healthy" | "degraded" | "unhealthy";
              connectionState?: number;
              isConnected?: boolean;
              isReconnecting?: boolean;
              reconnectAttempts?: number;
              circuitBreaker?: {
                state?: string;
                failures?: number;
                timeUntilRetry?: number;
              };
            };
            redis?: {
              status?: "healthy" | "degraded" | "unhealthy";
              isConnected?: boolean;
              isSubscriberConnected?: boolean;
              circuitBreaker?: object;
            };
            sockets?: {
              status?: string;
              totalConnections?: number;
              uniqueIPs?: number;
            };
          };
          capabilities?: {
            userAuth?: boolean;
            dataStorage?: boolean;
            realTimeFeatures?: boolean;
            locationTracking?: boolean;
            chatFeatures?: boolean;
          };
        },
        | {
            status?: string;
            error?: string;
            /** @format date-time */
            timestamp?: string;
          }
        | {
            status?: "unhealthy";
            /** @format date-time */
            timestamp?: string;
          }
      >({
        path: `/api/health`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates walkTypes and fixes missing userData for all room members
     *
     * @tags Helpers
     * @name HelpersFixWalkTypesCreate
     * @summary Fix walk types for all room members
     * @request POST:/api/helpers/fix-walk-types
     * @secure
     */
    helpersFixWalkTypesCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
          /** @format date-time */
          timestamp?: string;
        },
        {
          message?: string;
          error?: string;
          /** @format date-time */
          timestamp?: string;
        }
      >({
        path: `/api/helpers/fix-walk-types`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send a push notification to a specific target user
     *
     * @tags Helpers
     * @name HelpersPushDetail
     * @summary Send push notification helper
     * @request GET:/api/helpers/push/{target_id}
     * @secure
     */
    helpersPushDetail: (targetId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "Push notification sent successfully" */
          message?: string;
        },
        void
      >({
        path: `/api/helpers/push/${targetId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns various idea counts (total, active, inactive, collaborated) with optional growth and groupBy parameters
     *
     * @tags Ideas
     * @name IdeasCountList
     * @summary Get idea counts
     * @request GET:/api/ideas/count
     * @secure
     */
    ideasCountList: (
      query?: {
        school_id?: string;
        growth?: "monthly";
        groupBy?: "month";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas/count`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns all active ideas from the user's school with creator and collaborator details
     *
     * @tags Ideas
     * @name IdeasList
     * @summary Get all ideas
     * @request GET:/api/ideas
     * @secure
     */
    ideasList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Creates a new idea in the user's school and campus
     *
     * @tags Ideas
     * @name IdeasCreate
     * @summary Create idea
     * @request POST:/api/ideas
     * @secure
     */
    ideasCreate: (
      data: {
        title: string;
        description: string;
        looking_for: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns all active ideas from the user's school
     *
     * @tags Ideas
     * @name IdeasActiveList
     * @summary Get active ideas
     * @request GET:/api/ideas/active
     * @secure
     */
    ideasActiveList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/active`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns all inactive/deleted ideas from the user's school
     *
     * @tags Ideas
     * @name IdeasInactiveList
     * @summary Get inactive ideas
     * @request GET:/api/ideas/inactive
     * @secure
     */
    ideasInactiveList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/inactive`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the total count of all ideas in the user's school
     *
     * @tags Ideas
     * @name IdeasCountTotalList
     * @summary Get total ideas count
     * @request GET:/api/ideas/count/total
     * @secure
     */
    ideasCountTotalList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/count/total`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the count of active ideas in the user's school
     *
     * @tags Ideas
     * @name IdeasCountActiveList
     * @summary Get active ideas count
     * @request GET:/api/ideas/count/active
     * @secure
     */
    ideasCountActiveList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/count/active`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the count of inactive ideas in the user's school
     *
     * @tags Ideas
     * @name IdeasCountInactiveList
     * @summary Get inactive ideas count
     * @request GET:/api/ideas/count/inactive
     * @secure
     */
    ideasCountInactiveList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/count/inactive`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the count of ideas where the user is a collaborator
     *
     * @tags Ideas
     * @name IdeasCountCollaboratedList
     * @summary Get collaborated ideas count
     * @request GET:/api/ideas/count/collaborated
     * @secure
     */
    ideasCountCollaboratedList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/count/collaborated`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns monthly growth percentage comparing current month to previous month
     *
     * @tags Ideas
     * @name IdeasGrowthMonthlyList
     * @summary Get monthly growth
     * @request GET:/api/ideas/growth/monthly
     * @secure
     */
    ideasGrowthMonthlyList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/growth/monthly`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns monthly distribution of ideas across all time with zero-filled gaps
     *
     * @tags Ideas
     * @name IdeasByMonthList
     * @summary Get ideas by month
     * @request GET:/api/ideas/by-month
     * @secure
     */
    ideasByMonthList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/by-month`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns all ideas where the user is a collaborator
     *
     * @tags Ideas
     * @name IdeasCollaboratedList
     * @summary Get collaborated ideas
     * @request GET:/api/ideas/collaborated
     * @secure
     */
    ideasCollaboratedList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/collaborated`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a specific idea with full details (school-scoped)
     *
     * @tags Ideas
     * @name IdeasDetail
     * @summary Get idea by ID
     * @request GET:/api/ideas/{idea_id}
     * @secure
     */
    ideasDetail: (ideaId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/${ideaId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates an existing idea (creator only, school-scoped)
     *
     * @tags Ideas
     * @name IdeasUpdate
     * @summary Update idea
     * @request PUT:/api/ideas/{idea_id}
     * @secure
     */
    ideasUpdate: (
      ideaId: string,
      data: {
        title: string;
        description: string;
        looking_for: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas/${ideaId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Soft deletes an idea (creator only, school-scoped)
     *
     * @tags Ideas
     * @name IdeasDelete
     * @summary Delete idea
     * @request DELETE:/api/ideas/{idea_id}
     * @secure
     */
    ideasDelete: (ideaId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/ideas/${ideaId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Reports an idea for inappropriate content (uses unified reporting system)
     *
     * @tags Ideas
     * @name IdeasReportCreate
     * @summary Report idea
     * @request POST:/api/ideas/report
     * @secure
     */
    ideasReportCreate: (
      data: {
        reportType: string;
        ideaId: string;
        description: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas/report`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Adds a user as a collaborator to an idea and creates a chat room (school-scoped)
     *
     * @tags Ideas
     * @name IdeasCollaborateCreate
     * @summary Join as collaborator
     * @request POST:/api/ideas/{idea_id}/collaborate
     * @secure
     */
    ideasCollaborateCreate: (
      ideaId: string,
      data: {
        collaborate_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas/${ideaId}/collaborate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves ideas the user has created or collaborated on
     *
     * @tags Ideas
     * @name IdeasProfileDetail
     * @summary Get user's ideas profile
     * @request GET:/api/ideas/profile/{type}
     * @secure
     */
    ideasProfileDetail: (
      type: "created" | "collaborated",
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/ideas/profile/${type}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsList
     * @summary Get all interests
     * @request GET:/api/interests
     * @secure
     */
    interestsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          _id?: string;
          name?: string;
          image_url?: string;
          icon_url?: string;
          is_active?: boolean;
        }[],
        {
          message?: string;
          error?: string;
        }
      >({
        path: `/api/interests`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsCreate
     * @summary Create a new interest
     * @request POST:/api/interests
     * @secure
     */
    interestsCreate: (
      data: {
        name: string;
        image_url: string;
        icon_url: string;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Interest;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
            error?: string;
          }
      >({
        path: `/api/interests`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsDetail
     * @summary Get interest by ID
     * @request GET:/api/interests/{interest_id}
     * @secure
     */
    interestsDetail: (interestId: string, params: RequestParams = {}) =>
      this.http.request<
        Interest,
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
        | {
            message?: string;
            error?: string;
          }
      >({
        path: `/api/interests/${interestId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsUpdate
     * @summary Update an interest
     * @request PUT:/api/interests/{interest_id}
     * @secure
     */
    interestsUpdate: (
      interestId: string,
      data: {
        name?: string;
        image_url?: string;
        icon_url?: string;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: Interest;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
        | {
            message?: string;
            error?: string;
          }
      >({
        path: `/api/interests/${interestId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsDelete
     * @summary Delete an interest (soft delete)
     * @request DELETE:/api/interests/{interest_id}
     * @secure
     */
    interestsDelete: (interestId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
        | {
            message?: string;
            error?: string;
          }
      >({
        path: `/api/interests/${interestId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsGroupedList
     * @summary Get interests grouped by categories
     * @request GET:/api/interests/grouped
     * @secure
     */
    interestsGroupedList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Group name */
          name?: string;
          data?: {
            _id?: string;
            name?: string;
            image_url?: string;
            icon_url?: string;
            groups?: string[];
            is_active?: boolean;
          }[];
        }[],
        {
          message?: string;
          error?: string;
        }
      >({
        path: `/api/interests/grouped`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsGroupDetail
     * @summary Get interests by specific group
     * @request GET:/api/interests/group/{groupName}
     * @secure
     */
    interestsGroupDetail: (groupName: string, params: RequestParams = {}) =>
      this.http.request<
        {
          _id?: string;
          name?: string;
          image_url?: string;
          icon_url?: string;
          groups?: string[];
          is_active?: boolean;
        }[],
        void
      >({
        path: `/api/interests/group/${groupName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name InterestsUploadImageCreate
     * @summary Upload an image for interests
     * @request POST:/api/interests/upload-image
     * @secure
     */
    interestsUploadImageCreate: (
      data: {
        /**
         * Image file to upload (PNG only)
         * @format binary
         */
        image: File;
        /** Type of image being uploaded */
        type: "image" | "icon";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** URL of the uploaded image */
          url?: string;
        },
        void
      >({
        path: `/api/interests/upload-image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsList
     * @summary Get all interest groups
     * @request GET:/api/interest-groups
     * @secure
     */
    interestGroupsList: (params: RequestParams = {}) =>
      this.http.request<any[], void>({
        path: `/api/interest-groups`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsCreate
     * @summary Create a new interest group
     * @request POST:/api/interest-groups
     * @secure
     */
    interestGroupsCreate: (
      data: {
        name: string;
        order: number;
        interests?: {
          interestId?: string;
          order?: number;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsDetail
     * @summary Get interest group by ID
     * @request GET:/api/interest-groups/{groupId}
     * @secure
     */
    interestGroupsDetail: (groupId: string, params: RequestParams = {}) =>
      this.http.request<any, void>({
        path: `/api/interest-groups/${groupId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsUpdate
     * @summary Update an interest group
     * @request PUT:/api/interest-groups/{groupId}
     * @secure
     */
    interestGroupsUpdate: (
      groupId: string,
      data: {
        name?: string;
        order?: number;
        interests?: {
          interestId?: string;
          order?: number;
        }[];
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/${groupId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsDelete
     * @summary Delete an interest group (soft delete)
     * @request DELETE:/api/interest-groups/{groupId}
     * @secure
     */
    interestGroupsDelete: (groupId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/${groupId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsInterestsCreate
     * @summary Add an interest to a group
     * @request POST:/api/interest-groups/{groupId}/interests
     * @secure
     */
    interestGroupsInterestsCreate: (
      groupId: string,
      data: {
        interestId: string;
        order: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/${groupId}/interests`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsInterestsDelete
     * @summary Remove an interest from a group
     * @request DELETE:/api/interest-groups/{groupId}/interests/{interestId}
     * @secure
     */
    interestGroupsInterestsDelete: (
      groupId: string,
      interestId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/${groupId}/interests/${interestId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsReorderUpdate
     * @summary Reorder interest groups
     * @request PUT:/api/interest-groups/reorder
     * @secure
     */
    interestGroupsReorderUpdate: (
      data: {
        groupId?: string;
        order?: number;
      }[],
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/reorder`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interest Groups
     * @name InterestGroupsReorderInterestsUpdate
     * @summary Reorder interests within a group
     * @request PUT:/api/interest-groups/{groupId}/reorder-interests
     * @secure
     */
    interestGroupsReorderInterestsUpdate: (
      groupId: string,
      data: {
        interestId?: string;
        order?: number;
      }[],
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/interest-groups/${groupId}/reorder-interests`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves pending or accepted real-time invites between the current user and specified user
     *
     * @tags Invites
     * @name InvitesPendingDetail
     * @summary Get pending invite with specific user
     * @request GET:/api/invites/pending/{user_id}
     * @secure
     */
    invitesPendingDetail: (userId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
          /** The invite object (if found) */
          data?: object;
        },
        | {
            message?: string;
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
          }
      >({
        path: `/api/invites/pending/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all invites for the current user, optionally filtered by invite type
     *
     * @tags Invites
     * @name InvitesList
     * @summary Get all invites
     * @request GET:/api/invites
     * @secure
     */
    invitesList: (
      query?: {
        /** Type of invites to filter by */
        invite_type?: "real_time" | "event";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: object[];
        },
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
          /** Error type */
          type?: string;
        }
      >({
        path: `/api/invites`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new invite to another user. Supports real-time, peer, and event invites with optional location data.
     *
     * @tags Invites
     * @name InvitesCreate
     * @summary Send an invite to a user
     * @request POST:/api/invites
     * @secure
     */
    invitesCreate: (
      data: {
        /** The ID of the user to invite */
        invite_id: string;
        /** Type of invite to send */
        invite_type: "real_time" | "peer" | "event";
        /** Reference ID for event invites */
        reference?: string;
        /** Location data for real-time invites */
        location?: {
          place?: {
            name?: string;
            latitude?: number;
            longitude?: number;
          };
          sender?: {
            latitude?: number;
            longitude?: number;
          };
          receiver?: {
            latitude?: number;
            longitude?: number;
          };
        };
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          /** The created invite object */
          data?: object;
        },
        | {
            message?: string;
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
            /** Error type */
            type?: string;
          }
      >({
        path: `/api/invites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all invites where the current user is the receiver, with optional filtering by invite type and status
     *
     * @tags Invites
     * @name InvitesSelfList
     * @summary Get invites received by me
     * @request GET:/api/invites/self
     * @secure
     */
    invitesSelfList: (
      query?: {
        /** Filter by invite type */
        invite_type?: "peer" | "event" | "real_time";
        /** Filter by invite status */
        status?: "pending" | "accepted" | "rejected";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: object[];
        },
        | {
            message?: string;
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
          }
      >({
        path: `/api/invites/self`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific invite, including populated sender, receiver, and reference data
     *
     * @tags Invites
     * @name InvitesDetail
     * @summary Get a specific invite
     * @request GET:/api/invites/{invite_id}
     * @secure
     */
    invitesDetail: (inviteId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** Success message (note typo in implementation) */
          messgae?: string;
          /** The invite object with populated sender, receiver, and reference */
          data?: object;
        },
        | {
            message?: string;
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
          }
      >({
        path: `/api/invites/${inviteId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Allows users to accept, reject, cancel, or expire an invite. For real-time invites, accepting creates a new walk.
     *
     * @tags Invites
     * @name InvitesRespondPartialUpdate
     * @summary Respond to an invite
     * @request PATCH:/api/invites/respond
     * @secure
     */
    invitesRespondPartialUpdate: (
      data: {
        /** The ID of the invite (must match path parameter) */
        invite_id: string;
        /** The response to the invite */
        response: "accepted" | "rejected" | "cancelled" | "expired";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** Success message (note possible typo 'messgae' in some responses) */
          message?: string;
          /** Updated invite or created walk object (for accepted real-time invites) */
          data?: object;
          /** ID of the created walk (only for accepted real-time invites) */
          walkId?: string;
        },
        | {
            message?: string;
          }
        | {
            message?: string;
            /** Error details (only in development mode) */
            error?: string;
          }
      >({
        path: `/api/invites/respond`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve all languages used by users in the system
     *
     * @tags Languages
     * @name LanguagesList
     * @summary Get all users' languages
     * @request GET:/api/languages
     * @secure
     */
    languagesList: (params: RequestParams = {}) =>
      this.http.request<
        {
          languages?: {
            language?: string;
            is_preferred?: boolean;
          }[];
        },
        void
      >({
        path: `/api/languages`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the count of users for each language
     *
     * @tags Languages
     * @name LanguagesCountList
     * @summary Get language usage count
     * @request GET:/api/languages/count
     * @secure
     */
    languagesCountList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example {"English":50,"Spanish":30} */
          languageCounts?: Record<string, number>;
        },
        void
      >({
        path: `/api/languages/count`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all members currently in a location room
     *
     * @tags Location
     * @name LocationRoomMembersList
     * @summary Get room members
     * @request GET:/api/location/room/{roomId}/members
     */
    locationRoomMembersList: (roomId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/location/room/${roomId}/members`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if a specific user is currently in a location room
     *
     * @tags Location
     * @name LocationRoomUserDetail
     * @summary Check if user in room
     * @request GET:/api/location/room/{roomId}/user/{userId}
     */
    locationRoomUserDetail: (
      roomId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/location/room/${roomId}/user/${userId}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates a user's real-time location in a room
     *
     * @tags Location
     * @name LocationRoomUserCreate
     * @summary Update user location
     * @request POST:/api/location/room/{roomId}/user/{userId}
     */
    locationRoomUserCreate: (
      roomId: string,
      userId: string,
      data: {
        latitude: number;
        longitude: number;
        clientTimestamp?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/location/room/${roomId}/user/${userId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Removes a user from a location tracking room
     *
     * @tags Location
     * @name LocationRoomUserDelete
     * @summary Remove user from room
     * @request DELETE:/api/location/room/{roomId}/user/{userId}
     */
    locationRoomUserDelete: (
      roomId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/location/room/${roomId}/user/${userId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Retrieves all location rooms a user is currently in
     *
     * @tags Location
     * @name LocationUserRoomsList
     * @summary Get user's rooms
     * @request GET:/api/location/user/{userId}/rooms
     */
    locationUserRoomsList: (userId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/location/user/${userId}/rooms`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Removes a user from all location tracking rooms
     *
     * @tags Location
     * @name LocationUserRoomsDelete
     * @summary Remove user from all rooms
     * @request DELETE:/api/location/user/{userId}/rooms
     */
    locationUserRoomsDelete: (userId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/location/user/${userId}/rooms`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Updates user location during explore/walk with room member sync
     *
     * @tags Location
     * @name LocationExploreCreate
     * @summary Update explore location
     * @request POST:/api/location/explore/{roomId}/{userId}/{walkType}/{schoolId}
     */
    locationExploreCreate: (
      roomId: string,
      userId: string,
      walkType: string,
      schoolId: string,
      data: {
        latitude: number;
        longitude: number;
        clientTimestamp?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/location/explore/${roomId}/${userId}/${walkType}/${schoolId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Queues background location update for processing (authenticated)
     *
     * @tags Location
     * @name LocationBackgroundCreate
     * @summary Update background location
     * @request POST:/api/location/background
     * @secure
     */
    locationBackgroundCreate: (
      data: {
        latitude: number;
        longitude: number;
        clientTimestamp?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/location/background`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Checks if the email domain is registered for SAML SSO
     *
     * @tags Mobile SAML Authentication
     * @name SamlMobileCheckDomainCreate
     * @summary Check if email domain supports SAML authentication
     * @request POST:/api/saml/mobile/check-domain
     */
    samlMobileCheckDomainCreate: (
      data: {
        /**
         * User's email address
         * @format email
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          samlEnabled?: boolean;
          universityId?: string;
          universityName?: string;
          loginUrl?: string;
        },
        any
      >({
        path: `/api/saml/mobile/check-domain`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Starts SAML authentication flow for mobile with deep link callback
     *
     * @tags Mobile SAML Authentication
     * @name SamlMobileInitiateCreate
     * @summary Initiate mobile SAML authentication
     * @request POST:/api/saml/mobile/initiate
     */
    samlMobileInitiateCreate: (
      data: {
        /** @format email */
        email: string;
        platform?: "ios" | "android";
        /** Deep link to return to after authentication */
        returnTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          loginUrl?: string;
          sessionToken?: string;
          expiresIn?: number;
        },
        any
      >({
        path: `/api/saml/mobile/initiate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Processes SAML response and redirects to mobile app
     *
     * @tags Mobile SAML Authentication
     * @name SamlMobileCallbackList
     * @summary Handle SAML callback for mobile
     * @request GET:/api/saml/mobile/callback
     */
    samlMobileCallbackList: (
      query: {
        mobile_session: string;
        access_token?: string;
        refresh_token?: string;
        error?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<any, void>({
        path: `/api/saml/mobile/callback`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns all universities configured for SAML authentication
     *
     * @tags Mobile SAML Authentication
     * @name SamlMobileUniversitiesList
     * @summary Get list of universities with SAML support
     * @request GET:/api/saml/mobile/universities
     */
    samlMobileUniversitiesList: (params: RequestParams = {}) =>
      this.http.request<
        {
          universities?: {
            id?: string;
            name?: string;
            domains?: string[];
          }[];
        },
        any
      >({
        path: `/api/saml/mobile/universities`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peer Requests
     * @name PeerRequestsCreate
     * @summary Create a new peer request
     * @request POST:/api/peer-requests
     * @secure
     */
    peerRequestsCreate: (
      data: {
        receiver_id: string;
        /** @default "direct" */
        typeOfRequest?: "direct" | "invite";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        PeerRequest,
        | {
            message?: string;
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/peer-requests`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peer Requests
     * @name PeerRequestsList
     * @summary Get all peer requests for the current user
     * @request GET:/api/peer-requests
     * @secure
     */
    peerRequestsList: (
      query?: {
        /** Filter by sent or received requests */
        type?: "sent" | "received";
        /** Filter by status */
        status?: "pending" | "accepted" | "rejected" | "cancelled";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        PeerRequest[],
        {
          message?: string;
        }
      >({
        path: `/api/peer-requests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peer Requests
     * @name PeerRequestsDetail
     * @summary Get a specific peer request
     * @request GET:/api/peer-requests/{id}
     * @secure
     */
    peerRequestsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        PeerRequest,
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/peer-requests/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peer Requests
     * @name PeerRequestsUpdate
     * @summary Update peer request status
     * @request PUT:/api/peer-requests/{id}
     * @secure
     */
    peerRequestsUpdate: (
      id: string,
      data: {
        status: "accepted" | "rejected" | "cancelled";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        PeerRequest,
        | {
            message?: string;
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/peer-requests/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peer Requests
     * @name PeerRequestsDelete
     * @summary Delete a peer request
     * @request DELETE:/api/peer-requests/{id}
     * @secure
     */
    peerRequestsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/peer-requests/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersList
     * @summary Get peers
     * @request GET:/api/users/peers
     * @secure
     */
    usersPeersList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/users/peers`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersInviteCreate
     * @summary Invite a peer
     * @request POST:/api/users/peers/invite/{user_id}
     * @secure
     */
    usersPeersInviteCreate: (userId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/users/peers/invite/${userId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersResponseCreate
     * @summary Respond to a peer request
     * @request POST:/api/users/peers/response/{user_id}
     * @secure
     */
    usersPeersResponseCreate: (
      userId: string,
      data: {
        response: "accepted" | "rejected";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/users/peers/response/${userId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPendingPeersList
     * @summary Get pending peer requests
     * @request GET:/api/users/pending-peers
     * @secure
     */
    usersPendingPeersList: (params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
          data?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            avatar_url?: string;
            /** @format date-time */
            createdAt?: string;
          }[];
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/pending-peers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersStudentAmbassadorCreate
     * @summary Add student ambassador as peer
     * @request POST:/api/users/peers/student-ambassador
     * @secure
     */
    usersPeersStudentAmbassadorCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/peers/student-ambassador`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersRemoveCreate
     * @summary Remove a peer
     * @request POST:/api/users/peers/remove/{peer_id}
     * @secure
     */
    usersPeersRemoveCreate: (peerId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/peers/remove/${peerId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersBlockCreate
     * @summary Block a peer
     * @request POST:/api/users/peers/block/{peer_id}
     * @secure
     */
    usersPeersBlockCreate: (peerId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/peers/block/${peerId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersUnblockCreate
     * @summary Unblock a peer
     * @request POST:/api/users/peers/unblock/{peer_id}
     * @secure
     */
    usersPeersUnblockCreate: (peerId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/peers/unblock/${peerId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeersAddCreate
     * @summary Add a peer directly
     * @request POST:/api/users/peers/add
     * @secure
     */
    usersPeersAddCreate: (
      data: {
        /** MongoDB ObjectId of the peer to add */
        peerId: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
        },
        | {
            /** @example "Peer ID is required" */
            message?: string;
          }
        | {
            message?: string;
          }
      >({
        path: `/api/users/peers/add`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Peers
     * @name UsersPeerStatusList
     * @summary Get peer relationship status
     * @request GET:/api/users/peer-status
     * @secure
     */
    usersPeerStatusList: (
      query: {
        /** ID of the peer to check status */
        user: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            status?: "peer" | "pending" | "blocked" | "no_peer";
          };
        },
        {
          message?: string;
        }
      >({
        path: `/api/users/peer-status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Public - Places Hierarchy
     * @name PlacesHierarchyList
     * @summary Get complete place hierarchy (parent, place, children)
     * @request GET:/api/places/{placeId}/hierarchy
     */
    placesHierarchyList: (
      placeId: string,
      query?: {
        /**
         * Include children in response
         * @default true
         */
        include_children?: boolean;
        /**
         * Include parent and hierarchy path in response
         * @default true
         */
        include_parents?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/places/${placeId}/hierarchy`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Public - Places Hierarchy
     * @name PlacesChildrenList
     * @summary Get all children of a place
     * @request GET:/api/places/{placeId}/children
     */
    placesChildrenList: (
      placeId: string,
      query?: {
        /** Comma-separated app categories to filter by */
        categories?: string;
        /**
         * Number of children to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of children to skip
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/places/${placeId}/children`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Public - Places Hierarchy
     * @name PlacesContainersList
     * @summary Get all container places (malls, airports, etc.)
     * @request GET:/api/places/containers
     */
    placesContainersList: (
      query?: {
        /** Filter by campus ID */
        campus_id?: string;
        /** Only return containers that have children */
        has_children?: boolean;
        /**
         * Number of containers to return
         * @default 50
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/places/containers`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Public - Places Hierarchy
     * @name PlacesSearchList
     * @summary Search for places within a container
     * @request GET:/api/places/{placeId}/search
     */
    placesSearchList: (
      placeId: string,
      query?: {
        /** Comma-separated app categories to filter by */
        categories?: string;
        /** Search term for place names */
        query?: string;
        /** Minimum rating filter */
        rating_min?: number;
        /**
         * Number of places to return
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/places/${placeId}/search`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Public - Places Hierarchy
     * @name PlacesHierarchyStatsList
     * @summary Get hierarchy statistics
     * @request GET:/api/places/hierarchy/stats
     */
    placesHierarchyStatsList: (
      query?: {
        /** Filter by campus ID */
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/places/hierarchy/stats`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Upload and optimize a logo image for a specific place
     *
     * @tags Places
     * @name PlacesUploadLogoCreate
     * @summary Upload logo for a place
     * @request POST:/api/places/{place_id}/upload-logo
     * @secure
     */
    placesUploadLogoCreate: (
      placeId: string,
      data: {
        /**
         * Logo image file
         * @format binary
         */
        logo?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            originalUrl?: string;
            variants?: string[];
          };
        },
        void
      >({
        path: `/api/places/${placeId}/upload-logo`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload and optimize a cover image for a specific place
     *
     * @tags Places
     * @name PlacesUploadCoverCreate
     * @summary Upload cover image for a place
     * @request POST:/api/places/{place_id}/upload-cover
     * @secure
     */
    placesUploadCoverCreate: (
      placeId: string,
      data: {
        /**
         * Cover image file
         * @format binary
         */
        cover?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            originalUrl?: string;
            variants?: string[];
          };
        },
        void
      >({
        path: `/api/places/${placeId}/upload-cover`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove the logo image from a specific place
     *
     * @tags Places
     * @name PlacesRemoveLogoDelete
     * @summary Remove logo from a place
     * @request DELETE:/api/places/{place_id}/remove-logo
     * @secure
     */
    placesRemoveLogoDelete: (placeId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/places/${placeId}/remove-logo`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Remove the cover image from a specific place
     *
     * @tags Places
     * @name PlacesRemoveCoverDelete
     * @summary Remove cover image from a place
     * @request DELETE:/api/places/{place_id}/remove-cover
     * @secure
     */
    placesRemoveCoverDelete: (placeId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/places/${placeId}/remove-cover`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Triggers an immediate sync of Campus and School data from production to staging
     *
     * @tags Admin, Sync
     * @name AdminSyncProdToStagingTriggerCreate
     * @summary Manually trigger production to staging sync
     * @request POST:/api/admin/sync/prod-to-staging/trigger
     * @secure
     */
    adminSyncProdToStagingTriggerCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
        },
        void
      >({
        path: `/api/admin/sync/prod-to-staging/trigger`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current configuration status for production to staging sync
     *
     * @tags Admin, Sync
     * @name AdminSyncProdToStagingStatusList
     * @summary Get sync configuration status
     * @request GET:/api/admin/sync/prod-to-staging/status
     * @secure
     */
    adminSyncProdToStagingStatusList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          enabled?: boolean;
          environment?: string;
          schedule?: string;
          configured?: boolean;
        },
        any
      >({
        path: `/api/admin/sync/prod-to-staging/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all places in a campus by default. Use include_nested=false to get only top-level places with their children.
     *
     * @tags Public - Places
     * @name PlacesCampusDetail
     * @summary Get places in a specific campus
     * @request GET:/api/places/campus/{campusId}
     */
    placesCampusDetail: (
      campusId: string,
      query?: {
        /** Comma-separated app categories to filter by */
        categories?: string;
        /** Minimum rating filter */
        rating_min?: number;
        /** Filter places with photos */
        has_photos?: boolean;
        /**
         * Whether to include nested places (true) or only top-level places (false)
         * @default "true"
         */
        include_nested?: "true" | "false";
        /**
         * Number of places to return
         * @default 300
         */
        limit?: number;
        /**
         * Number of places to skip
         * @default 0
         */
        offset?: number;
        /**
         * Sort order
         * @default "name"
         */
        sort?: "name" | "rating";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            places?: {
              id?: string;
              place_id?: string;
              name?: string;
              coordinates?: {
                lat?: number;
                lng?: number;
              };
              location?: {
                type?: "Point";
                coordinates?: number[];
              };
              photos?: any[];
              appTypes?: any[];
              /** Present if place contains other places */
              is_container?: boolean;
              /** Present if place is a container with children */
              children?: object[];
              /** Present if place is a container */
              children_count?: number;
            }[];
            pagination?: {
              total?: number;
              limit?: number;
              offset?: number;
              has_more?: boolean;
            };
          };
        },
        void
      >({
        path: `/api/places/campus/${campusId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns places from all campuses associated with a school
     *
     * @tags Public - Places
     * @name PlacesSchoolSchoolIdList
     * @summary Get places from all campuses of a school
     * @request GET:/api/places/school/:schoolId
     */
    placesSchoolSchoolIdList: (
      schoolId: string,
      query?: {
        /** Comma-separated app categories to filter by */
        categories?: string;
        /** Minimum rating filter */
        rating_min?: number;
        /** Filter places with photos */
        has_photos?: boolean;
        /**
         * Number of places to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of places to skip
         * @default 0
         */
        offset?: number;
        /**
         * Sort order
         * @default "name"
         */
        sort?: "name" | "rating";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/places/school/${schoolId}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns only top-level places (not nested inside other places) within the specified radius. Container places will include their child places.
     *
     * @tags Public - Places
     * @name PlacesNearbyList
     * @summary Find nearby top-level places with their children
     * @request GET:/api/places/nearby
     */
    placesNearbyList: (
      query: {
        /** Latitude coordinate */
        lat: number;
        /** Longitude coordinate */
        lng: number;
        /**
         * Search radius in meters
         * @default 1000
         */
        radius?: number;
        /** Filter by campus ID (optional) */
        campus_id?: string;
        /** Comma-separated app categories to filter by */
        categories?: string;
        /**
         * Number of places to return
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            places?: {
              id?: string;
              place_id?: string;
              name?: string;
              coordinates?: {
                lat?: number;
                lng?: number;
              };
              location?: {
                type?: "Point";
                coordinates?: number[];
              };
              photos?: any[];
              appTypes?: any[];
              /** Distance in meters from search point */
              distance?: number;
              /** Present if place contains other places */
              is_container?: boolean;
              /** Present if place is a container with children */
              children?: object[];
              /** Present if place is a container */
              children_count?: number;
            }[];
            search_center?: {
              lat?: number;
              lng?: number;
            };
            search_radius?: number;
          };
        },
        void
      >({
        path: `/api/places/nearby`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns detailed information about a place including its hierarchy information. For container places, includes nested places.
     *
     * @tags Public - Places
     * @name PlacesDetail
     * @summary Get detailed information about a specific place
     * @request GET:/api/places/{placeId}
     */
    placesDetail: (placeId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            id?: string;
            place_id?: string;
            name?: string;
            address?: string;
            phone?: string;
            website?: string;
            coordinates?: {
              lat?: number;
              lng?: number;
            };
            location?: {
              type?: "Point";
              coordinates?: number[];
            };
            google_types?: string[];
            appTypes?: object[];
            rating?: number;
            hours?: object;
            photos?: object[];
            campus?: {
              id?: string;
              name?: string;
              city?: string;
              state?: string;
            } | null;
            hierarchy?: {
              /** Hierarchy level (0 for top-level) */
              level?: number;
              /** Place category (container, nested, or standalone) */
              category?: string;
              /** Whether this place contains other places */
              is_container?: boolean;
              /** Whether this place is inside another place */
              is_nested?: boolean;
              /** ID of parent place if nested */
              parent_place_id?: string | null;
              /** IDs of child places if container */
              child_place_ids?: string[];
              /** Floor level if applicable */
              floor_level?: string | null;
              /** Array of nested place objects if this is a container */
              nested_places?: object[];
              /** Count of nested places */
              nested_places_count?: number;
            };
          };
        },
        void
      >({
        path: `/api/places/${placeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all active place categories. When campus_id is provided, returns only categories that have top-level places in that campus.
     *
     * @tags Public - Places
     * @name PlacesCategoriesList
     * @summary Get available place categories
     * @request GET:/api/places/categories
     */
    placesCategoriesList: (
      query?: {
        /** Filter categories by campus (optional) - only categories with top-level places in the campus will be returned */
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            categories?: {
              /** Category ID */
              id?: string;
              /** Category name */
              name?: string;
              /** Category description */
              description?: string;
              /** Associated Google place types */
              google_types?: string[];
            }[];
            /** Total number of categories returned */
            total?: number;
          };
        },
        any
      >({
        path: `/api/places/categories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Compares photo data between different query methods
     *
     * @tags Public - Places
     * @name PlacesDebugPhotosDetail
     * @summary Debug endpoint to investigate photo issues
     * @request GET:/api/places/debug/photos/{campusId}
     */
    placesDebugPhotosDetail: (campusId: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/places/debug/photos/${campusId}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if the current user has already submitted a report for a specific item
     *
     * @tags Reports
     * @name ReportsCheckList
     * @summary Check if user has already reported an item
     * @request GET:/api/reports/check
     * @secure
     */
    reportsCheckList: (
      query: {
        /** Type of item being reported */
        report_type: "user" | "message" | "event" | "idea" | "space";
        /** ID of the item being checked */
        reported_item_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/reports/check`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Submit a report for a user, message, event, idea, or space
     *
     * @tags Reports
     * @name ReportsCreate
     * @summary Submit a new report
     * @request POST:/api/reports
     * @secure
     */
    reportsCreate: (
      data: {
        report_type: "user" | "message" | "event" | "idea" | "space";
        reported_item_id: string;
        reason: string;
        description?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/reports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of reports filtered by status, type, and school
     *
     * @tags Admin - Reports
     * @name AdminReportsList
     * @summary Get reports list (admin)
     * @request GET:/api/admin/reports
     * @secure
     */
    adminReportsList: (
      query?: {
        status?: "pending" | "under_review" | "resolved" | "dismissed";
        report_type?: string;
        school_id?: string;
        /** @default 1 */
        page?: number;
        /** @default 20 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          reports?: {
            _id?: string;
            reported_by?: {
              _id?: string;
              first_name?: string;
              last_name?: string;
              email?: string;
              campus_id?: string;
            };
            report_type?:
              | "user"
              | "event"
              | "space"
              | "idea"
              | "message"
              | "peers";
            reported_item_id?: string;
            reason?: string;
            description?: string;
            status?: "pending" | "under_review" | "resolved" | "dismissed";
            reviewed_by?: {
              _id?: string;
              first_name?: string;
              last_name?: string;
            };
            admin_notes?: string;
            /** @format date-time */
            resolved_at?: string;
            school_id?: {
              _id?: string;
              name?: string;
            };
            campus_id?: {
              _id?: string;
              campus_name?: string;
            };
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
          }[];
          pagination?: {
            page?: number;
            limit?: number;
            total?: number;
            pages?: number;
          };
        },
        void
      >({
        path: `/api/admin/reports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the status of a report (resolved, dismissed, under_review)
     *
     * @tags Admin - Reports
     * @name AdminReportsStatusPartialUpdate
     * @summary Update report status (admin)
     * @request PATCH:/api/admin/reports/{reportId}/status
     * @secure
     */
    adminReportsStatusPartialUpdate: (
      reportId: string,
      data: {
        status: "pending" | "under_review" | "resolved" | "dismissed";
        admin_notes?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          report?: Report;
        },
        void
      >({
        path: `/api/admin/reports/${reportId}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves complete report details including reported item and related reports
     *
     * @tags Admin - Reports
     * @name AdminReportsDetail
     * @summary Get detailed report with full context (admin)
     * @request GET:/api/admin/reports/{reportId}
     * @secure
     */
    adminReportsDetail: (reportId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          report?: Report;
          /** The reported item (user, event, space, idea, or message) */
          reportedItem?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            avatar_url?: string;
            profile_bio?: string;
            is_banned?: boolean;
            ban_reason?: string;
            report_count?: number;
          };
          relatedReports?: {
            _id?: string;
            reason?: string;
            description?: string;
            status?: string;
            /** @format date-time */
            createdAt?: string;
            reported_by?: {
              _id?: string;
              first_name?: string;
              last_name?: string;
            };
          }[];
          totalRelatedReports?: number;
        },
        void
      >({
        path: `/api/admin/reports/${reportId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Bans a user based on a report with configurable duration and reason
     *
     * @tags Admin - Reports
     * @name AdminReportsBanUserCreate
     * @summary Ban user based on report (admin)
     * @request POST:/api/admin/reports/{reportId}/ban-user
     * @secure
     */
    adminReportsBanUserCreate: (
      reportId: string,
      data: {
        /** Ban duration in days (0 or undefined for permanent) */
        ban_duration?: number;
        ban_reason?: string;
        resolve_related_reports?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          user?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            is_banned?: boolean;
            /** @format date-time */
            ban_date?: string;
            ban_reason?: string;
            ban_duration?: number;
            /** @format date-time */
            ban_expires_at?: string;
          };
          report?: Report;
          resolved_reports_count?: number;
        },
        void
      >({
        path: `/api/admin/reports/${reportId}/ban-user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes ban from a user account
     *
     * @tags Admin - Users
     * @name AdminUsersUnbanCreate
     * @summary Unban user (admin)
     * @request POST:/api/admin/users/{userId}/unban
     * @secure
     */
    adminUsersUnbanCreate: (
      userId: string,
      data: {
        unban_reason?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          user?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            is_banned?: boolean;
          };
        },
        void
      >({
        path: `/api/admin/users/${userId}/unban`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves paginated list of banned users with filtering options
     *
     * @tags Admin - Users
     * @name AdminUsersBannedList
     * @summary Get banned users list (admin)
     * @request GET:/api/admin/users/banned
     * @secure
     */
    adminUsersBannedList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 20 */
        limit?: number;
        /** Search by name or email */
        search?: string;
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          users?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            avatar_url?: string;
            /** @format date-time */
            ban_date?: string;
            ban_reason?: string;
            ban_duration?: number;
            /** @format date-time */
            ban_expires_at?: string;
            report_count?: number;
            banned_by?: {
              _id?: string;
              first_name?: string;
              last_name?: string;
            };
            school_id?: {
              _id?: string;
              name?: string;
            };
            campus_id?: {
              _id?: string;
              campus_name?: string;
            };
          }[];
          pagination?: {
            page?: number;
            limit?: number;
            total?: number;
            pages?: number;
          };
        },
        void
      >({
        path: `/api/admin/users/banned`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves complete ban history and all reports for a specific user
     *
     * @tags Admin - Users
     * @name AdminUsersBanHistoryList
     * @summary Get user ban history (admin)
     * @request GET:/api/admin/users/{userId}/ban-history
     * @secure
     */
    adminUsersBanHistoryList: (userId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/users/${userId}/ban-history`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates multiple reports at once (resolve, dismiss, or mark under review)
     *
     * @tags Admin - Reports
     * @name AdminReportsBulkPartialUpdate
     * @summary Bulk action on reports (admin)
     * @request PATCH:/api/admin/reports/bulk
     * @secure
     */
    adminReportsBulkPartialUpdate: (
      data: {
        report_ids: string[];
        action: "resolve" | "dismiss" | "under_review";
        admin_notes?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          updated_count?: number;
        },
        void
      >({
        path: `/api/admin/reports/bulk`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves report reasons with optional filtering by type and active status
     *
     * @tags Report Reasons
     * @name ReportReasonsList
     * @summary Get all report reasons
     * @request GET:/api/report-reasons
     */
    reportReasonsList: (
      query?: {
        includeInactive?: "true" | "false";
        type?: "user" | "event" | "space" | "idea" | "message";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/report-reasons`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves only active report reasons, optionally filtered by type (public endpoint)
     *
     * @tags Report Reasons
     * @name ReportReasonsActiveList
     * @summary Get active report reasons
     * @request GET:/api/report-reasons/active
     */
    reportReasonsActiveList: (
      query?: {
        type?: "user" | "event" | "space" | "idea" | "message";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/report-reasons/active`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves a single report reason by its ID
     *
     * @tags Report Reasons
     * @name ReportReasonsDetail
     * @summary Get report reason by ID
     * @request GET:/api/report-reasons/{id}
     */
    reportReasonsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/report-reasons/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new report reason with key, display name, and applicable types
     *
     * @tags Admin - Report Reasons
     * @name AdminReportReasonsCreate
     * @summary Create new report reason (admin)
     * @request POST:/api/admin/report-reasons
     * @secure
     */
    adminReportReasonsCreate: (
      data: {
        key: string;
        displayName: string;
        types?: ("user" | "event" | "space" | "idea" | "message")[];
        order?: number;
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/report-reasons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates an existing report reason
     *
     * @tags Admin - Report Reasons
     * @name AdminReportReasonsUpdate
     * @summary Update report reason (admin)
     * @request PUT:/api/admin/report-reasons/{id}
     * @secure
     */
    adminReportReasonsUpdate: (
      id: string,
      data: {
        key?: string;
        displayName?: string;
        types?: string[];
        order?: number;
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/report-reasons/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Soft deletes (deactivates) or permanently deletes a report reason
     *
     * @tags Admin - Report Reasons
     * @name AdminReportReasonsDelete
     * @summary Delete report reason (admin)
     * @request DELETE:/api/admin/report-reasons/{id}
     * @secure
     */
    adminReportReasonsDelete: (
      id: string,
      query?: {
        /** Set to 'true' for permanent deletion */
        permanent?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/report-reasons/${id}`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the display order of multiple report reasons at once
     *
     * @tags Admin - Report Reasons
     * @name AdminReportReasonsBulkOrderPartialUpdate
     * @summary Bulk update report reason order (admin)
     * @request PATCH:/api/admin/report-reasons/bulk-order
     * @secure
     */
    adminReportReasonsBulkOrderPartialUpdate: (
      data: {
        reasons: {
          id?: string;
          order?: number;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/report-reasons/bulk-order`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminUsersAssignRoleCreate
     * @summary Assign a role to a user
     * @request POST:/api/admin/users/{userId}/assign-role
     * @secure
     */
    adminUsersAssignRoleCreate: (
      userId: string,
      data: {
        role:
          | "super_admin"
          | "school_admin"
          | "campus_admin"
          | "editor"
          | "moderator"
          | "staff"
          | "viewer"
          | "student"
          | "faculty"
          | "parent";
        /** Required for campus-scoped roles */
        campus_id?: string;
        /** Required for school-scoped roles */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/users/${userId}/assign-role`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminRolesList
     * @summary Get all available roles
     * @request GET:/api/admin/roles
     * @secure
     */
    adminRolesList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          roles?: {
            _id?: string;
            name?: string;
            display_name?: string;
            description?: string;
            scope?: "global" | "school" | "campus";
            permissions?: string[];
          }[];
        },
        void
      >({
        path: `/api/admin/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminRolesCreate
     * @summary Create a new role
     * @request POST:/api/admin/roles
     * @secure
     */
    adminRolesCreate: (
      data: {
        name: string;
        display_name: string;
        description: string;
        permissions?: string[];
        scope: "global" | "school" | "campus";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/roles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminPermissionsList
     * @summary Get all available permissions
     * @request GET:/api/admin/permissions
     * @secure
     */
    adminPermissionsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          permissions?: Record<
            string,
            {
              action?: string;
              code?: string;
              description?: string;
            }[]
          >;
        },
        void
      >({
        path: `/api/admin/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminPermissionsCreate
     * @summary Create a new permission
     * @request POST:/api/admin/permissions
     * @secure
     */
    adminPermissionsCreate: (
      data: {
        resource: string;
        action: "create" | "read" | "update" | "delete" | "manage" | "assign";
        description: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/permissions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminUsersCheckPermissionCreate
     * @summary Check if user has a specific permission
     * @request POST:/api/admin/users/{userId}/check-permission
     * @secure
     */
    adminUsersCheckPermissionCreate: (
      userId: string,
      data: {
        /** Permission code (e.g., users:create) */
        permission: string;
        /** Optional campus scope */
        campus_id?: string;
        /** Optional school scope */
        school_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/users/${userId}/check-permission`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminUsersRolesList
     * @summary Get user's assigned roles
     * @request GET:/api/admin/users/{userId}/roles
     * @secure
     */
    adminUsersRolesList: (userId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          user?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            primary_role?: string;
            roles?: {
              role?: string;
              campus_id?: string;
              school_id?: string;
              assigned_by?: object;
              /** @format date-time */
              assigned_at?: string;
            }[];
          };
        },
        any
      >({
        path: `/api/admin/users/${userId}/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminUsersRemoveRoleDelete
     * @summary Remove a role from user
     * @request DELETE:/api/admin/users/{userId}/remove-role
     * @secure
     */
    adminUsersRemoveRoleDelete: (
      userId: string,
      data: {
        role: string;
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, any>({
        path: `/api/admin/users/${userId}/remove-role`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminRolesUpdate
     * @summary Update an existing role
     * @request PUT:/api/admin/roles/{roleId}
     * @secure
     */
    adminRolesUpdate: (
      roleId: string,
      data: {
        display_name?: string;
        description?: string;
        permissions?: string[];
        scope?: "global" | "school" | "campus";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/roles/${roleId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminRolesDelete
     * @summary Delete a role
     * @request DELETE:/api/admin/roles/{roleId}
     * @secure
     */
    adminRolesDelete: (roleId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/roles/${roleId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Roles
     * @name AdminPermissionsDelete
     * @summary Delete a permission
     * @request DELETE:/api/admin/permissions/{permissionId}
     * @secure
     */
    adminPermissionsDelete: (
      permissionId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/permissions/${permissionId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new school
     *
     * @name SchoolCreate
     * @summary Create a new school
     * @request POST:/api/school
     */
    schoolCreate: (
      data: {
        school_name?: string;
        email_domain?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        void,
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/school`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get all schools
     *
     * @name SchoolList
     * @summary Get all schools
     * @request GET:/api/school
     */
    schoolList: (params: RequestParams = {}) =>
      this.http.request<
        {
          _id?: string;
          school_name?: string;
          display_name?: string;
          email_domain?: string;
          logo_url?: string;
          is_active?: boolean;
          admins?: string[];
        }[],
        {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/school`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get a school
     *
     * @name SchoolDetail
     * @summary Get a school
     * @request GET:/api/school/{school_id}
     */
    schoolDetail: (schoolId: string, params: RequestParams = {}) =>
      this.http.request<
        void,
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/school/${schoolId}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Update a school
     *
     * @name SchoolUpdate
     * @summary Update a school
     * @request PUT:/api/school/{school_id}
     */
    schoolUpdate: (
      schoolId: string,
      data: {
        school_name?: string;
        display_name?: string;
        email_domain?: string;
        admins_id?: string[];
        ambassador_ids?: string[];
        logo_url?: string;
        email_domain_staff?: string;
        disallowed_staff_emails?: string[];
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        void,
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/school/${schoolId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Attach an existing campus to a school
     *
     * @name SchoolCampusCreate
     * @summary Attach a campus to a school
     * @request POST:/api/school/{school_id}/campus/{campus_id}
     */
    schoolCampusCreate: (
      schoolId: string,
      campusId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/campus/${campusId}`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Detach a campus from a school
     *
     * @name SchoolCampusDelete
     * @summary Detach a campus from a school
     * @request DELETE:/api/school/{school_id}/campus/{campus_id}
     */
    schoolCampusDelete: (
      schoolId: string,
      campusId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/campus/${campusId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Get all campuses attached to a specific school
     *
     * @name SchoolCampusesList
     * @summary Get all campuses for a school
     * @request GET:/api/school/{school_id}/campuses
     */
    schoolCampusesList: (schoolId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/campuses`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Get all users assigned to a specific school
     *
     * @name SchoolUsersList
     * @summary Get all users for a school
     * @request GET:/api/school/{school_id}/users
     */
    schoolUsersList: (schoolId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/users`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Assign an existing user to a school
     *
     * @name SchoolUserCreate
     * @summary Assign a user to a school
     * @request POST:/api/school/{school_id}/user/{user_id}
     */
    schoolUserCreate: (
      schoolId: string,
      userId: string,
      data: {
        /** Optional campus ID to assign the user to */
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/user/${userId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Remove a user from a school
     *
     * @name SchoolUserDelete
     * @summary Remove a user from a school
     * @request DELETE:/api/school/{school_id}/user/{user_id}
     */
    schoolUserDelete: (
      schoolId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/school/${schoolId}/user/${userId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Creates a new space within the user's campus with automatic owner membership
     *
     * @tags Spaces
     * @name SpacesCreate
     * @summary Create a new space
     * @request POST:/api/spaces
     * @secure
     */
    spacesCreate: (
      data: {
        /** Space title/name */
        name: string;
        description?: string;
        campus_id: string;
        image_url?: string;
        category?: string;
        contactEmail?: string;
        memberCountRange?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of spaces filtered by campus (unless admin with allCampuses flag)
     *
     * @tags Spaces
     * @name SpacesList
     * @summary Get list of spaces
     * @request GET:/api/spaces
     * @secure
     */
    spacesList: (
      query?: {
        /** Filter by category ID */
        category?: string;
        /** Search by title */
        q?: string;
        /** @default "newest" */
        sort?: "newest" | "size" | "alpha";
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
        /** Admin only - view spaces from all campuses */
        allCampuses?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific space
     *
     * @tags Spaces
     * @name SpacesDetail
     * @summary Get single space by ID
     * @request GET:/api/spaces/{spaceId}
     * @secure
     */
    spacesDetail: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates space details (owner or admin only, campus-scoped)
     *
     * @tags Spaces
     * @name SpacesUpdate
     * @summary Update space
     * @request PUT:/api/spaces/{spaceId}
     * @secure
     */
    spacesUpdate: (
      spaceId: string,
      data: {
        title?: string;
        about?: string;
        logoUrl?: string;
        coverImageUrl?: string;
        category?: string;
        contactEmail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Soft deletes a space and all its events and memberships (owner or admin only)
     *
     * @tags Spaces
     * @name SpacesDelete
     * @summary Soft delete space
     * @request DELETE:/api/spaces/{spaceId}
     * @secure
     */
    spacesDelete: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Checks if a space name already exists globally across all campuses
     *
     * @tags Spaces
     * @name SpacesCheckNameList
     * @summary Check if space name exists
     * @request GET:/api/spaces/check-name
     * @secure
     */
    spacesCheckNameList: (
      query: {
        name: string;
        /** Space ID to exclude from check (for editing) */
        excludeSpaceId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/check-name`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Restores a soft-deleted space and its events
     *
     * @tags Admin - Spaces
     * @name SpacesRestoreCreate
     * @summary Restore deleted space (admin only)
     * @request POST:/api/spaces/{spaceId}/restore
     * @secure
     */
    spacesRestoreCreate: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/restore`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves spaces the user has created or joined
     *
     * @tags Spaces
     * @name SpacesProfileDetail
     * @summary Get user's spaces profile
     * @request GET:/api/spaces/profile/{type}
     * @secure
     */
    spacesProfileDetail: (
      type: "created" | "joined",
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/profile/${type}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves list of all space categories
     *
     * @tags Space Categories
     * @name SpaceCategoriesList
     * @summary Get all space categories
     * @request GET:/api/space-categories
     */
    spaceCategoriesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/space-categories`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Retrieves a single space category by its ID
     *
     * @tags Space Categories
     * @name SpaceCategoriesDetail
     * @summary Get space category by ID
     * @request GET:/api/space-categories/{id}
     */
    spaceCategoriesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/space-categories/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates an existing space category
     *
     * @tags Admin - Space Categories
     * @name AdminSpaceCategoriesUpdate
     * @summary Update space category (admin)
     * @request PUT:/api/admin/space-categories/{id}
     * @secure
     */
    adminSpaceCategoriesUpdate: (
      id: string,
      data: {
        /** @maxLength 50 */
        name?: string;
        /** @maxLength 500 */
        description?: string;
        /**
         * JSON string with start and end colors, e.g. {"start":"#5dc9df","end":"#e2492b"}
         * @example "{"start":"#5dc9df","end":"#e2492b"}"
         */
        gradientColors?: string;
        /** @pattern ^#[0-9A-Fa-f]{6}$ */
        textColor?: string;
        imageUrl?: string;
        order?: number;
        isActive?: boolean;
        /**
         * Category icon image
         * @format binary
         */
        image?: File;
        /**
         * Default cover image file
         * @format binary
         */
        coverImageDefault?: File;
        /**
         * Default logo image file
         * @format binary
         */
        logoDefault?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/space-categories/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Deletes a space category
     *
     * @tags Admin - Space Categories
     * @name AdminSpaceCategoriesDelete
     * @summary Delete space category (admin)
     * @request DELETE:/api/admin/space-categories/{id}
     * @secure
     */
    adminSpaceCategoriesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/space-categories/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the display order of space categories
     *
     * @tags Admin - Space Categories
     * @name AdminSpaceCategoriesReorderCreate
     * @summary Reorder space categories (admin)
     * @request POST:/api/admin/space-categories/reorder
     * @secure
     */
    adminSpaceCategoriesReorderCreate: (
      data: {
        categories?: {
          id?: string;
          order?: number;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/space-categories/reorder`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves all categories with their associated spaces grouped
     *
     * @tags Space Categories
     * @name SpaceCategoriesWithSpacesList
     * @summary Get categories grouped with their spaces
     * @request GET:/api/space-categories/with-spaces
     */
    spaceCategoriesWithSpacesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/space-categories/with-spaces`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Retrieves a specific category with all its associated spaces
     *
     * @tags Space Categories
     * @name SpaceCategoriesWithSpacesList2
     * @summary Get single category with its spaces
     * @request GET:/api/space-categories/{id}/with-spaces
     * @originalName spaceCategoriesWithSpacesList
     * @duplicate
     */
    spaceCategoriesWithSpacesList2: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/space-categories/${id}/with-spaces`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new event owned by a space (space owner or admin only)
     *
     * @tags Space Events
     * @name SpacesEventsCreate
     * @summary Create space event
     * @request POST:/api/spaces/{spaceId}/events
     * @secure
     */
    spacesEventsCreate: (
      spaceId: string,
      data: {
        eventType: "outdoor" | "indoor";
        expandEvent?: boolean;
        interestId: string;
        defaultImage?: string;
        eventCustomImage?: string;
        currentImageSelected?: "default" | "custom";
        slots?: number;
        address: string;
        /** @format date-time */
        date_and_time: string;
        visibility: "public" | "private";
        name: string;
        description?: string;
        isCustom?: boolean;
        participants?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/events`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of events for a specific space
     *
     * @tags Space Events
     * @name SpacesEventsList
     * @summary Get events for a space
     * @request GET:/api/spaces/{spaceId}/events
     * @secure
     */
    spacesEventsList: (
      spaceId: string,
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
        /** Include private events (requires member or owner access) */
        includePrivate?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/events`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Updates a space-owned event (space owner or admin only)
     *
     * @tags Space Events
     * @name SpacesEventsUpdate
     * @summary Update space event
     * @request PUT:/api/spaces/events/{eventId}
     * @secure
     */
    spacesEventsUpdate: (
      eventId: string,
      data: {
        name?: string;
        description?: string;
        /** @format date-time */
        date_and_time?: string;
        address?: string;
        slots?: number;
        visibility?: "public" | "private";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/events/${eventId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Soft deletes a space-owned event (space owner or admin only)
     *
     * @tags Space Events
     * @name SpacesEventsDelete
     * @summary Delete space event
     * @request DELETE:/api/spaces/events/{eventId}
     * @secure
     */
    spacesEventsDelete: (eventId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/events/${eventId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Submits a membership request for a space (campus-scoped)
     *
     * @tags Space Membership
     * @name SpacesJoinCreate
     * @summary Request to join a space
     * @request POST:/api/spaces/{spaceId}/join
     * @secure
     */
    spacesJoinCreate: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/join`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Approves a pending membership request (space owner or admin only)
     *
     * @tags Space Membership
     * @name SpacesRequestsApproveCreate
     * @summary Approve join request
     * @request POST:/api/spaces/{spaceId}/requests/{userId}/approve
     * @secure
     */
    spacesRequestsApproveCreate: (
      spaceId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/requests/${userId}/approve`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Rejects a pending membership request (space owner or admin only)
     *
     * @tags Space Membership
     * @name SpacesRequestsRejectCreate
     * @summary Reject join request
     * @request POST:/api/spaces/{spaceId}/requests/{userId}/reject
     * @secure
     */
    spacesRequestsRejectCreate: (
      spaceId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/requests/${userId}/reject`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of pending join requests (space owner or admin only)
     *
     * @tags Space Membership
     * @name SpacesRequestsList
     * @summary Get pending join requests
     * @request GET:/api/spaces/{spaceId}/requests
     * @secure
     */
    spacesRequestsList: (
      spaceId: string,
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/requests`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves paginated list of space members
     *
     * @tags Space Membership
     * @name SpacesMembersList
     * @summary Get space members
     * @request GET:/api/spaces/{spaceId}/members
     * @secure
     */
    spacesMembersList: (
      spaceId: string,
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 100 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/members`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Removes a member from the space (space owner or admin only, cannot remove owner)
     *
     * @tags Space Membership
     * @name SpacesMembersDelete
     * @summary Remove member from space
     * @request DELETE:/api/spaces/{spaceId}/members/{userId}
     * @secure
     */
    spacesMembersDelete: (
      spaceId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/members/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Allows a member to leave a space (owner cannot leave)
     *
     * @tags Space Membership
     * @name SpacesLeaveCreate
     * @summary Leave space
     * @request POST:/api/spaces/{spaceId}/leave
     * @secure
     */
    spacesLeaveCreate: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/leave`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves the current user's membership status for a specific space
     *
     * @tags Space Membership
     * @name SpacesMembershipStatusList
     * @summary Get my membership status
     * @request GET:/api/spaces/{spaceId}/membership-status
     * @secure
     */
    spacesMembershipStatusList: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          spaceId?: string;
          membershipStatus?: "none" | "requested" | "joined";
          isMember?: boolean;
          isPending?: boolean;
        },
        void
      >({
        path: `/api/spaces/${spaceId}/membership-status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload a logo image for a specific space
     *
     * @tags Spaces
     * @name SpacesUploadLogoCreate
     * @summary Upload logo for a space
     * @request POST:/api/spaces/{spaceId}/upload-logo
     * @secure
     */
    spacesUploadLogoCreate: (
      spaceId: string,
      data: {
        /**
         * Logo image file
         * @format binary
         */
        logo?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            logoUrl?: string;
          };
        },
        void
      >({
        path: `/api/spaces/${spaceId}/upload-logo`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload a cover image for a specific space
     *
     * @tags Spaces
     * @name SpacesUploadCoverCreate
     * @summary Upload cover image for a space
     * @request POST:/api/spaces/{spaceId}/upload-cover
     * @secure
     */
    spacesUploadCoverCreate: (
      spaceId: string,
      data: {
        /**
         * Cover image file
         * @format binary
         */
        cover?: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          message?: string;
          data?: {
            coverImageUrl?: string;
          };
        },
        void
      >({
        path: `/api/spaces/${spaceId}/upload-cover`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove the logo image from a specific space
     *
     * @tags Spaces
     * @name SpacesRemoveLogoDelete
     * @summary Remove logo from a space
     * @request DELETE:/api/spaces/{spaceId}/remove-logo
     * @secure
     */
    spacesRemoveLogoDelete: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/remove-logo`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Remove the cover image from a specific space
     *
     * @tags Spaces
     * @name SpacesRemoveCoverDelete
     * @summary Remove cover image from a space
     * @request DELETE:/api/spaces/{spaceId}/remove-cover
     * @secure
     */
    spacesRemoveCoverDelete: (spaceId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/spaces/${spaceId}/remove-cover`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Surprise
     * @name SurpriseRollStartCreate
     * @summary Start a surprise dice roll
     * @request POST:/api/surprise/roll-start
     * @secure
     */
    surpriseRollStartCreate: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            rollId?: string;
            reshufflesLeft?: number;
            dailyLimit?: number;
          };
        },
        void
      >({
        path: `/api/surprise/roll-start`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Surprise
     * @name SurpriseRollEndCreate
     * @summary Complete a surprise dice roll with selected user
     * @request POST:/api/surprise/roll-end
     * @secure
     */
    surpriseRollEndCreate: (
      data: {
        /** The ID of the active roll */
        rollId: string;
        /** The ID of the selected user */
        selectedUserId: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/surprise/roll-end`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Surprise
     * @name SurpriseMyStatsList
     * @summary Get current user's surprise roll statistics
     * @request GET:/api/surprise/my-stats
     * @secure
     */
    surpriseMyStatsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            reshufflesLeft?: number;
            dailyLimit?: number;
            todayUsed?: number;
            totalReshufflesUsed?: number;
            totalRolls?: number;
            recentRolls?: any[];
          };
        },
        void
      >({
        path: `/api/surprise/my-stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Surprise
     * @name SurpriseAdminStatsList
     * @summary Get surprise roll statistics for admin dashboard
     * @request GET:/api/surprise/admin/stats
     * @secure
     */
    surpriseAdminStatsList: (
      query?: {
        /** Filter by campus ID */
        campus_id?: string;
        /**
         * Start date for filtering
         * @format date
         */
        startDate?: string;
        /**
         * End date for filtering
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/surprise/admin/stats`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Surprise
     * @name SurpriseAdminUserDetail
     * @summary Get surprise roll details for a specific user
     * @request GET:/api/surprise/admin/user/{userId}
     * @secure
     */
    surpriseAdminUserDetail: (userId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/surprise/admin/user/${userId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Surprise
     * @name SurpriseAdminResetDailyRollsCreate
     * @summary Reset daily rolls count for a specific user
     * @request POST:/api/surprise/admin/reset-daily-rolls/{userId}
     * @secure
     */
    surpriseAdminResetDailyRollsCreate: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            userId?: string;
            deletedCount?: number;
            previousTodayCount?: number;
            newReshufflesLeft?: number;
          };
        },
        void
      >({
        path: `/api/surprise/admin/reset-daily-rolls/${userId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsList
     * @summary Get all type mappings
     * @request GET:/api/admin/type-mappings
     * @secure
     */
    adminTypeMappingsList: (
      query?: {
        /** Filter by active status */
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsCreate
     * @summary Create a new type mapping
     * @request POST:/api/admin/type-mappings
     * @secure
     */
    adminTypeMappingsCreate: (
      data: {
        google_types: string[];
        app_categories: string[];
        description?: string;
        priority?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsUpdate
     * @summary Update a type mapping
     * @request PUT:/api/admin/type-mappings/{id}
     * @secure
     */
    adminTypeMappingsUpdate: (
      id: string,
      data: {
        google_types?: string[];
        app_categories?: string[];
        description?: string;
        priority?: number;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsDelete
     * @summary Deactivate a type mapping
     * @request DELETE:/api/admin/type-mappings/{id}
     * @secure
     */
    adminTypeMappingsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsGoogleTypesList
     * @summary Get all Google place types encountered
     * @request GET:/api/admin/type-mappings/google-types
     * @secure
     */
    adminTypeMappingsGoogleTypesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings/google-types`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsStatsList
     * @summary Get type mapping statistics
     * @request GET:/api/admin/type-mappings/stats
     * @secure
     */
    adminTypeMappingsStatsList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings/stats`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Type Mappings
     * @name AdminTypeMappingsAppCategoriesList
     * @summary Get all app categories in use
     * @request GET:/api/admin/type-mappings/app-categories
     * @secure
     */
    adminTypeMappingsAppCategoriesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/admin/type-mappings/app-categories`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Get all users
     *
     * @tags Users
     * @name UsersList
     * @summary Get all users by Admin
     * @request GET:/api/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.http.request<User[], Error>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get user by ID
     *
     * @tags Users
     * @name UsersDetail
     * @summary Get user by ID
     * @request GET:/api/users/{user_id}
     * @secure
     */
    usersDetail: (userId: string, params: RequestParams = {}) =>
      this.http.request<User, Error>({
        path: `/api/users/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update user information by user ID
     *
     * @tags Users
     * @name UsersUpdate
     * @summary Update user by ID
     * @request PUT:/api/users/{user_id}
     * @secure
     */
    usersUpdate: (userId: string, data: User, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "User updated successfully" */
          message?: string;
          user?: User;
        },
        Error
      >({
        path: `/api/users/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a user from the database by their ID
     *
     * @tags Users
     * @name UsersDelete
     * @summary Delete user by ID
     * @request DELETE:/api/users/{user_id}
     * @secure
     */
    usersDelete: (userId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          /** @example "User deleted successfully" */
          message?: string;
        },
        Error
      >({
        path: `/api/users/${userId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Decrease the unread notifications count for the authenticated user by 1, if it is greater than 0
     *
     * @tags Users
     * @name UsersUnreadNotificationsCreate
     * @summary Decrease unread notifications count
     * @request POST:/api/users/unread-notifications
     * @secure
     */
    usersUnreadNotificationsCreate: (
      data: {
        /**
         * The unread notifications count
         * @example 5
         */
        count?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** @example "Unread notifications count updated successfully" */
          message?: string;
          data?: User;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/users/unread-notifications`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all users from the same campus as the current user, including shared data fields
     *
     * @tags Users
     * @name UsersCampusList
     * @summary Get users from the same campus with shared data
     * @request GET:/api/users/campus
     * @secure
     */
    usersCampusList: (params: RequestParams = {}) =>
      this.http.request<
        {
          users?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            avatar_url?: string;
            shared?: {
              interest_ids?: string[];
              is_parent?: boolean;
              languages?: string[];
              peers?: string[];
              relationship_status?: string;
              graduation_term?: string;
              graduationYear?: string;
              spaces?: string[];
            };
          }[];
          totalCount?: number;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/users/campus`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersGroupedList
     * @summary Get all users grouped by different categories (except self and blocked)
     * @request GET:/api/users/grouped
     * @secure
     */
    usersGroupedList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** All users available for walk */
          walk?: any[];
          /** All users grouped by each interest */
          interests?: any[];
          /** All users grouped by dog ownership */
          dog?: any[];
          /** All users grouped by parent status */
          parent?: any[];
          /** All users grouped by languages */
          languages?: any[];
          /** All peers */
          peers?: any[];
          /** All users grouped by study field */
          study?: any[];
          /** All users grouped by relationship status */
          heart?: any[];
          /** All users with the same graduation year */
          graduationYear?: any[];
        },
        void
      >({
        path: `/api/users/grouped`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersNotificationSettingsList
     * @summary Get current user's notification settings
     * @request GET:/api/users/notification-settings
     * @secure
     */
    usersNotificationSettingsList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/api/users/notification-settings`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersNotificationSettingsUpdate
     * @summary Update current user's notification settings
     * @request PUT:/api/users/notification-settings
     * @secure
     */
    usersNotificationSettingsUpdate: (
      data: {
        /** Enable/disable event reminder notifications */
        event_reminders?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/api/users/notification-settings`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersRandomList
     * @summary Get random users per category based on current user's fields
     * @request GET:/api/users/random
     * @secure
     */
    usersRandomList: (
      query?: {
        /**
         * Number of random users to return per category (default 10)
         * @min 1
         * @max 100
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** Random users for walk */
          walk?: any[];
          /** Random users per interest */
          interests?: object;
          /** Random users by dog ownership */
          dog?: object;
          /** Random users by parent status */
          parent?: object;
          /** Random users per language */
          languages?: object;
          /** Random peers */
          peers?: any[];
          /** Random users by study field */
          study?: object;
          /** Random users by relationship status */
          heart?: object;
        },
        void
      >({
        path: `/api/users/random`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersGroupDetail
     * @summary Get users by specific interest group
     * @request GET:/api/users/group/{groupName}
     * @secure
     */
    usersGroupDetail: (groupName: string, params: RequestParams = {}) =>
      this.http.request<User[], void>({
        path: `/api/users/group/${groupName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walk Invites
     * @name WalkInvitesCreate
     * @summary Create a new walk invitation
     * @request POST:/api/walk-invites
     * @secure
     */
    walkInvitesCreate: (
      data: {
        receiver_id: string;
        campus_id: string;
        /** Selected Interest ID (required) */
        interest_id: string;
        /** Place ID (required) */
        place_id: string;
        place_name?: string;
        /** Type of walk invite */
        invite_type?: string;
        place_coordinates?: number[];
        sender_location?: number[];
        receiver_location?: number[];
        place_image?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        WalkInvite,
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/walk-invites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walk Invites
     * @name WalkInvitesList
     * @summary Get all walk invitations for the current user
     * @request GET:/api/walk-invites
     * @secure
     */
    walkInvitesList: (
      query?: {
        /** Filter by sent or received invitations */
        type?: "sent" | "received";
        /** Filter by status */
        status?: "pending" | "accepted" | "rejected" | "cancelled";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        WalkInvite[],
        {
          message?: string;
        }
      >({
        path: `/api/walk-invites`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walk Invites
     * @name WalkInvitesDetail
     * @summary Get a specific walk invitation
     * @request GET:/api/walk-invites/{id}
     * @secure
     */
    walkInvitesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        WalkInvite,
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/walk-invites/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walk Invites
     * @name WalkInvitesUpdate
     * @summary Update walk invitation status
     * @request PUT:/api/walk-invites/{id}
     * @secure
     */
    walkInvitesUpdate: (
      id: string,
      data: {
        status: "accepted" | "rejected" | "cancelled";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        WalkInvite,
        | {
            message?: string;
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/walk-invites/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walk Invites
     * @name WalkInvitesDelete
     * @summary Delete a walk invitation
     * @request DELETE:/api/walk-invites/{id}
     * @secure
     */
    walkInvitesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          message?: string;
        },
        | {
            errors?: object[];
          }
        | {
            message?: string;
          }
      >({
        path: `/api/walk-invites/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves walks count with various grouping and growth options
     *
     * @tags Walks
     * @name WalksCountList
     * @summary Get Walks Count
     * @request GET:/api/walks/count
     * @secure
     */
    walksCountList: (
      query?: {
        /**
         * The time period to group walks by
         * @default "month"
         */
        groupBy?: "month" | "week" | "day";
        /** Calculate monthly growth percentage */
        growth?: "monthly";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** Breakdown of walks */
          monthlyData?: {
            /** Label for the time period */
            label?: string;
            /** Number of walks in that period */
            count?: number;
          }[];
          /** Array of walk counts for chart integration */
          chartData?: number[];
          /** Array of labels for chart integration */
          chartLabels?: string[];
          /** Total number of walks */
          totalWalksCreated?: number;
          /** Monthly growth percentage */
          monthlyGrowthPercentage?: number;
          /** The time period covered by the data */
          period?: string;
          /**
           * ISO timestamp of the start of the period
           * @format date-time
           */
          since?: string;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/walks/count`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current number of active walks in the system
     *
     * @tags Walks
     * @name WalksRealtimeActiveList
     * @summary Get real-time count of active walks
     * @request GET:/api/walks/realtime/active
     * @secure
     */
    walksRealtimeActiveList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Current number of active walks in the system */
          active_count: number;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/walks/realtime/active`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current number of pending walks in the system
     *
     * @tags Walks
     * @name WalksRealtimePendingList
     * @summary Get real-time count of pending walks
     * @request GET:/api/walks/realtime/pending
     * @secure
     */
    walksRealtimePendingList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Current number of pending walks in the system */
          pending_count: number;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/walks/realtime/pending`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current number of completed walks in the system
     *
     * @tags Walks
     * @name WalksRealtimeCompletedList
     * @summary Get real-time count of completed walks
     * @request GET:/api/walks/realtime/completed
     * @secure
     */
    walksRealtimeCompletedList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Current number of completed walks in the system */
          completed_count: number;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/walks/realtime/completed`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current number of walks that were cancelled or closed in the system
     *
     * @tags Walks
     * @name WalksRealtimeCancelledList
     * @summary Get real-time count of cancelled or closed walks
     * @request GET:/api/walks/realtime/cancelled
     * @secure
     */
    walksRealtimeCancelledList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Current number of cancelled or closed walks in the system */
          cancelled_count: number;
        },
        void | {
          message?: string;
          /** Error details (only in development mode) */
          error?: string;
        }
      >({
        path: `/api/walks/realtime/cancelled`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walks
     * @name WalksGroupedList
     * @summary Get walks grouped by interest categories
     * @request GET:/api/walks/grouped
     * @secure
     */
    walksGroupedList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** Group name */
          name?: string;
          data?: any[];
        }[],
        void
      >({
        path: `/api/walks/grouped`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Walks
     * @name WalksGroupDetail
     * @summary Get walks by specific interest group
     * @request GET:/api/walks/group/{groupName}
     * @secure
     */
    walksGroupDetail: (groupName: string, params: RequestParams = {}) =>
      this.http.request<any[], void>({
        path: `/api/walks/group/${groupName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesList
     * @summary List all places with filtering and pagination
     * @request GET:/admin/places
     * @secure
     */
    placesList: (
      query?: {
        /** Filter by campus ID */
        campus_id?: string;
        /** Comma-separated app categories */
        categories?: string;
        /** Filter by status */
        status?: "active" | "inactive" | "removed";
        /** Minimum rating */
        rating_min?: number;
        /** Maximum rating */
        rating_max?: number;
        /** Filter places with photos */
        has_photos?: boolean;
        /** Search in place names */
        search?: string;
        /**
         * Number of places to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of places to skip
         * @default 0
         */
        offset?: number;
        /**
         * Sort field
         * @default "name"
         */
        sort?: "name" | "rating" | "updated_at" | "created_at";
        /**
         * Sort order
         * @default "asc"
         */
        order?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            places?: any[];
            pagination?: {
              total?: number;
              limit?: number;
              offset?: number;
            };
          };
        },
        void
      >({
        path: `/admin/places`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesCategoriesUpdate
     * @summary Manually update place app categories
     * @request PUT:/admin/places/{id}/categories
     * @secure
     */
    placesCategoriesUpdate: (
      id: string,
      data: {
        /** Array of app categories */
        app_categories: string[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: any;
        },
        void
      >({
        path: `/admin/places/${id}/categories`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncCampusCreate
     * @summary Trigger manual sync for a specific campus
     * @request POST:/admin/sync/campus/{campusId}
     * @secure
     */
    syncCampusCreate: (
      campusId: string,
      data?: {
        /** @default false */
        force_full_sync?: boolean;
        /** @default true */
        include_details?: boolean;
        max_api_calls?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/sync/campus/${campusId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncStatusList
     * @summary Get sync scheduler status
     * @request GET:/admin/sync/status
     * @secure
     */
    syncStatusList: (
      query?: {
        /** Filter by region ID */
        campus_id?: string;
        /**
         * Number of logs to return
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/sync/status`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesDelete
     * @summary Soft delete a place
     * @request DELETE:/admin/places/{id}
     * @secure
     */
    placesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/places/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesRestoreCreate
     * @summary Restore a soft-deleted place
     * @request POST:/admin/places/{id}/restore
     * @secure
     */
    placesRestoreCreate: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: any;
        },
        void
      >({
        path: `/admin/places/${id}/restore`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Photos
     * @name PlacesPhotoSyncStatsList
     * @summary Get place photo sync statistics
     * @request GET:/admin/places/photo-sync/stats
     * @secure
     */
    placesPhotoSyncStatsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            total_places?: number;
            places_with_photos?: number;
            places_with_synced_photos?: number;
            photos_needing_sync?: number;
            sync_progress?: number;
          };
        },
        void
      >({
        path: `/admin/places/photo-sync/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Photos
     * @name PlacesSyncPhotosCreate
     * @summary Sync photos for a specific place
     * @request POST:/admin/places/{place_id}/sync-photos
     * @secure
     */
    placesSyncPhotosCreate: (
      placeId: string,
      data?: {
        /**
         * Force re-sync even if photos already exist
         * @default false
         */
        force_resync?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            place_id?: string;
            photos_processed?: number;
            photos_uploaded?: number;
            errors?: string[];
          };
        },
        void
      >({
        path: `/admin/places/${placeId}/sync-photos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Photos
     * @name PlacesPhotoSyncBatchCreate
     * @summary Trigger batch photo sync for multiple places
     * @request POST:/admin/places/photo-sync/batch
     * @secure
     */
    placesPhotoSyncBatchCreate: (
      data?: {
        /** Array of Google Place IDs (optional, will auto-find if not provided) */
        place_ids?: string[];
        /**
         * Force re-sync even if photos already exist
         * @default false
         */
        force_resync?: boolean;
        /**
         * Maximum number of places to process (if auto-finding)
         * @default 50
         */
        limit?: number;
        /**
         * Number of places to process concurrently
         * @default 2
         */
        concurrency?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            total_places?: number;
            estimated_duration?: string;
          };
        },
        void
      >({
        path: `/admin/places/photo-sync/batch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesSystemInitCreate
     * @summary Initialize or reinitialize the Places System
     * @request POST:/admin/places/system/init
     * @secure
     */
    placesSystemInitCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/places/system/init`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesSystemStatusList
     * @summary Get Places System status
     * @request GET:/admin/places/system/status
     * @secure
     */
    placesSystemStatusList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/places/system/status`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesSystemRestartCreate
     * @summary Restart the Places System
     * @request POST:/admin/places/system/restart
     * @secure
     */
    placesSystemRestartCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/places/system/restart`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesNestedList
     * @summary Get nested places for a specific place
     * @request GET:/admin/places/{place_id}/nested
     * @secure
     */
    placesNestedList: (
      placeId: string,
      query?: {
        /**
         * Number of nested places to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of nested places to skip
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            parent_place?: {
              place_id?: string;
              name?: string;
              place_category?: string;
            };
            nested_places?: any[];
            pagination?: {
              total?: number;
              limit?: number;
              offset?: number;
              has_more?: boolean;
              current_page?: number;
              total_pages?: number;
            };
          };
        },
        void
      >({
        path: `/admin/places/${placeId}/nested`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesPopularList
     * @summary Get list of popular places for a school/campus
     * @request GET:/admin/places/popular
     * @secure
     */
    placesPopularList: (
      query: {
        /** School ID */
        school_id: string;
        /** Campus ID (optional, for campus-specific popular places) */
        campus_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/places/popular`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesPopularCreate
     * @summary Set popular places for a school/campus
     * @request POST:/admin/places/popular
     * @secure
     */
    placesPopularCreate: (
      data: {
        school_id: string;
        campus_id?: string;
        places?: {
          place_id: string;
          order: number;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/places/popular`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesPopularDelete
     * @summary Remove a popular place
     * @request DELETE:/admin/places/popular/{id}
     * @secure
     */
    placesPopularDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/places/popular/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Places
     * @name PlacesPopularReorderPartialUpdate
     * @summary Reorder popular places
     * @request PATCH:/admin/places/popular/reorder
     * @secure
     */
    placesPopularReorderPartialUpdate: (
      data: {
        updates?: {
          id: string;
          order: number;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/places/popular/reorder`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - App Categories
     * @name AppCategoriesList
     * @summary Get all app categories
     * @request GET:/admin/app-categories
     * @secure
     */
    appCategoriesList: (
      query?: {
        /** Return only active categories */
        active_only?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/app-categories`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - App Categories
     * @name AppCategoriesCreate
     * @summary Create a new app category
     * @request POST:/admin/app-categories
     * @secure
     */
    appCategoriesCreate: (
      data: {
        name: string;
        display_name: string;
        description?: string;
        icon?: string;
        color?: string;
        google_types: string[];
        sort_order?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/app-categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - App Categories
     * @name AppCategoriesUpdate
     * @summary Update an app category
     * @request PUT:/admin/app-categories/{id}
     * @secure
     */
    appCategoriesUpdate: (
      id: string,
      data: {
        display_name?: string;
        description?: string;
        icon?: string;
        color?: string;
        google_types?: string[];
        sort_order?: number;
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/app-categories/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - App Categories
     * @name AppCategoriesDelete
     * @summary Delete an app category
     * @request DELETE:/admin/app-categories/{id}
     * @secure
     */
    appCategoriesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/app-categories/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - App Categories
     * @name AppCategoriesGoogleTypesList
     * @summary Get all available Google Places types
     * @request GET:/admin/app-categories/google-types
     * @secure
     */
    appCategoriesGoogleTypesList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/app-categories/google-types`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringDashboardList
     * @summary Get monitoring dashboard data
     * @request GET:/admin/monitoring/dashboard
     * @secure
     */
    monitoringDashboardList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/dashboard`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringHealthList
     * @summary Get system health status
     * @request GET:/admin/monitoring/health
     * @secure
     */
    monitoringHealthList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/health`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringApiUsageList
     * @summary Get API usage metrics
     * @request GET:/admin/monitoring/api-usage
     * @secure
     */
    monitoringApiUsageList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/api-usage`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringSyncPerformanceList
     * @summary Get sync performance metrics
     * @request GET:/admin/monitoring/sync-performance
     * @secure
     */
    monitoringSyncPerformanceList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/sync-performance`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringDatabaseList
     * @summary Get database performance metrics
     * @request GET:/admin/monitoring/database
     * @secure
     */
    monitoringDatabaseList: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/database`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringAlertsList
     * @summary Get system alerts
     * @request GET:/admin/monitoring/alerts
     * @secure
     */
    monitoringAlertsList: (
      query?: {
        /** Filter unacknowledged alerts */
        unacknowledged?: boolean;
        /** Filter unresolved alerts */
        unresolved?: boolean;
        /** Filter by severity */
        severity?: "info" | "warning" | "critical";
        /**
         * Number of alerts to return
         * @default 50
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/alerts`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringAlertsAcknowledgeCreate
     * @summary Acknowledge an alert
     * @request POST:/admin/monitoring/alerts/{alertId}/acknowledge
     * @secure
     */
    monitoringAlertsAcknowledgeCreate: (
      alertId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/alerts/${alertId}/acknowledge`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringAlertsResolveCreate
     * @summary Resolve an alert
     * @request POST:/admin/monitoring/alerts/{alertId}/resolve
     * @secure
     */
    monitoringAlertsResolveCreate: (
      alertId: string,
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/alerts/${alertId}/resolve`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringErrorsList
     * @summary Get error statistics and recent errors
     * @request GET:/admin/monitoring/errors
     * @secure
     */
    monitoringErrorsList: (
      query?: {
        /**
         * Time range in hours
         * @default 24
         */
        hours?: number;
        /**
         * Number of recent errors to return
         * @default 50
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/monitoring/errors`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Monitoring
     * @name MonitoringMetricsExportList
     * @summary Export monitoring metrics as CSV
     * @request GET:/admin/monitoring/metrics/export
     * @secure
     */
    monitoringMetricsExportList: (
      query: {
        /** Type of metrics to export */
        type: "api_usage" | "sync_performance" | "errors" | "alerts";
        /**
         * Number of days to export
         * @default 7
         */
        days?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<string, void>({
        path: `/admin/monitoring/metrics/export`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesList
     * @summary Get all place types
     * @request GET:/admin/place-types
     * @secure
     */
    placeTypesList: (
      query?: {
        /** Filter by active status */
        is_active?: boolean;
        /** Search in name and description */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            name?: string;
            description?: string;
            google_types?: string[];
            is_active?: boolean;
            places_count?: number;
            createdAt?: string;
            updatedAt?: string;
          }[];
        },
        void
      >({
        path: `/admin/place-types`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesCreate
     * @summary Create a new place type
     * @request POST:/admin/place-types
     * @secure
     */
    placeTypesCreate: (
      data: {
        /** @maxLength 50 */
        name: string;
        /** @maxLength 200 */
        description?: string;
        /** @pattern ^#[0-9A-F]{6}$ */
        color?: string;
        /** @maxLength 50 */
        icon?: string;
        google_types: string[];
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            name?: string;
            description?: string;
            google_types?: string[];
            is_active?: boolean;
            createdAt?: string;
            updatedAt?: string;
          };
        },
        void
      >({
        path: `/admin/place-types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesDetail
     * @summary Get place type by ID
     * @request GET:/admin/place-types/{id}
     * @secure
     */
    placeTypesDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            name?: string;
            description?: string;
            google_types?: string[];
            is_active?: boolean;
            places_count?: number;
            createdAt?: string;
            updatedAt?: string;
          };
        },
        void
      >({
        path: `/admin/place-types/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesUpdate
     * @summary Update place type
     * @request PUT:/admin/place-types/{id}
     * @secure
     */
    placeTypesUpdate: (
      id: string,
      data: {
        /** @maxLength 50 */
        name?: string;
        /** @maxLength 200 */
        description?: string;
        /** @pattern ^#[0-9A-F]{6}$ */
        color?: string;
        /** @maxLength 50 */
        icon?: string;
        google_types?: string[];
        is_active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            _id?: string;
            name?: string;
            description?: string;
            google_types?: string[];
            is_active?: boolean;
            createdAt?: string;
            updatedAt?: string;
          };
        },
        void
      >({
        path: `/admin/place-types/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesDelete
     * @summary Delete place type
     * @request DELETE:/admin/place-types/{id}
     * @secure
     */
    placeTypesDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/place-types/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Place Types
     * @name PlaceTypesGoogleTypesList
     * @summary Get all available Google types from existing places
     * @request GET:/admin/place-types/google-types
     * @secure
     */
    placeTypesGoogleTypesList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          data?: {
            type?: string;
            places_count?: number;
          }[];
        },
        void
      >({
        path: `/admin/place-types/google-types`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Regions
     * @name RegionsCampusDetail
     * @summary Get campus region data
     * @request GET:/admin/regions/campus/{campus_id}
     * @secure
     */
    regionsCampusDetail: (campusId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/regions/campus/${campusId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Regions
     * @name RegionsCampusSummaryList
     * @summary Get campus summary with place statistics
     * @request GET:/admin/regions/campus/{campus_id}/summary
     * @secure
     */
    regionsCampusSummaryList: (campusId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/regions/campus/${campusId}/summary`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Regions
     * @name RegionsCampusPlacesList
     * @summary Get places in a campus
     * @request GET:/admin/regions/campus/{campus_id}/places
     * @secure
     */
    regionsCampusPlacesList: (
      campusId: string,
      query?: {
        /** Filter by app category */
        category?: string;
        /** Filter by status */
        status?: "active" | "inactive" | "removed";
        /**
         * Number of places to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of places to skip
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/regions/campus/${campusId}/places`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Regions
     * @name RegionsNearbyCreate
     * @summary Find nearby places across campuses
     * @request POST:/admin/regions/nearby
     * @secure
     */
    regionsNearbyCreate: (
      data: {
        campus_id: string;
        coordinates: {
          lat?: number;
          lng?: number;
        };
        /** @default 1000 */
        radius_meters?: number;
        /** @default 50 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/regions/nearby`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Regions
     * @name RegionsCampusStatsList
     * @summary Get campus statistics
     * @request GET:/admin/regions/campus/{campus_id}/stats
     * @secure
     */
    regionsCampusStatsList: (campusId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/regions/campus/${campusId}/stats`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncTriggerCreate
     * @summary Manually trigger sync for specific regions
     * @request POST:/admin/sync/trigger
     * @secure
     */
    syncTriggerCreate: (
      data: {
        /** Array of Region IDs (deprecated, use campus_ids) */
        region_ids: string[];
        /** Array of Campus IDs */
        campus_ids?: string[];
        force_full_sync?: boolean;
        include_details?: boolean;
        max_api_calls?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/sync/trigger`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncRetryFailedCreate
     * @summary Retry failed syncs
     * @request POST:/admin/sync/retry-failed
     * @secure
     */
    syncRetryFailedCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/sync/retry-failed`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncLogsList
     * @summary Get sync logs
     * @request GET:/admin/sync/logs
     * @secure
     */
    syncLogsList: (
      query?: {
        /** Filter by region ID */
        region_id?: string;
        /** Filter by sync status */
        sync_status?: "pending" | "in_progress" | "completed" | "failed";
        /**
         * Number of logs to return
         * @default 50
         */
        limit?: number;
        /**
         * Number of logs to skip
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/sync/logs`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncStatsDetail
     * @summary Get sync statistics for a region
     * @request GET:/admin/sync/stats/{region_id}
     * @secure
     */
    syncStatsDetail: (regionId: string, params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/sync/stats/${regionId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncSchedulerStartCreate
     * @summary Start the sync scheduler
     * @request POST:/admin/sync/scheduler/start
     * @secure
     */
    syncSchedulerStartCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/sync/scheduler/start`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncSchedulerStopCreate
     * @summary Stop the sync scheduler
     * @request POST:/admin/sync/scheduler/stop
     * @secure
     */
    syncSchedulerStopCreate: (params: RequestParams = {}) =>
      this.http.request<void, void>({
        path: `/admin/sync/scheduler/stop`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin - Sync
     * @name SyncSchedulerConfigUpdate
     * @summary Update scheduler configuration
     * @request PUT:/admin/sync/scheduler/config
     * @secure
     */
    syncSchedulerConfigUpdate: (
      data: {
        syncCronPattern?: string;
        maxApiCallsPerDay?: number;
        maxApiCallsPerRegion?: number;
        enableNotifications?: boolean;
        retryFailedSyncs?: boolean;
        syncTimeoutMs?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/admin/sync/scheduler/config`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  age = {
    /**
     * @description Returns all users with names, birthday, and age
     *
     * @tags Age
     * @name GetAge
     * @summary Get all users with age information
     * @request GET:/age
     * @secure
     */
    getAge: (params: RequestParams = {}) =>
      this.http.request<
        {
          ages?: number[];
          data?: {
            id?: string;
            firstName?: string;
            lastName?: string;
            /** @format date */
            birthday?: string;
            age?: number;
          }[];
          total?: number;
        },
        {
          message?: string;
        }
      >({
        path: `/age`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns users under the age of 18
     *
     * @tags Age
     * @name Under18List
     * @summary Get users under 18
     * @request GET:/age/under18
     * @secure
     */
    under18List: (params: RequestParams = {}) =>
      this.http.request<
        {
          data?: {
            id?: string;
            firstName?: string;
            lastName?: string;
            /** @format date */
            birthday?: string;
            age?: number;
          }[];
          total?: number;
        },
        {
          message?: string;
        }
      >({
        path: `/age/under18`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Calculate and retrieve the average age of all users
     *
     * @tags Age
     * @name AverageList
     * @summary Get average user age
     * @request GET:/age/average
     * @secure
     */
    averageList: (params: RequestParams = {}) =>
      this.http.request<
        {
          /** The average age of all users */
          averageAge?: number;
        },
        void
      >({
        path: `/age/average`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  ambassadors = {
    /**
     * No description
     *
     * @tags Ambassadors
     * @name AmbassadorsList
     * @summary Get all ambassadors
     * @request GET:/ambassadors
     * @secure
     */
    ambassadorsList: (params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Ambassador[];
          count?: number;
        },
        | {
            success?: boolean;
            message?: string;
            data?: object[];
            count?: number;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/ambassadors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ambassadors
     * @name AmbassadorsCreate
     * @summary Create a new ambassador
     * @request POST:/ambassadors
     * @secure
     */
    ambassadorsCreate: (
      data: {
        name: string;
        email: string;
        phone?: string;
        student_id?: string;
        campuses_id?: string[];
        school_id?: string;
        is_active?: boolean;
        profile_image_url?: string;
        bio?: string;
        graduation_year?: number;
        major?: string;
        /** User ID to create ambassador from existing user */
        user_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Ambassador;
        },
        | {
            success?: boolean;
            message?: string;
            error?: string;
            details?: object;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/ambassadors`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ambassadors
     * @name AmbassadorsDetail
     * @summary Get ambassador by ID
     * @request GET:/ambassadors/{id}
     * @secure
     */
    ambassadorsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Ambassador;
        },
        {
          success?: boolean;
          message?: string;
          error?: string;
        }
      >({
        path: `/ambassadors/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ambassadors
     * @name AmbassadorsUpdate
     * @summary Update an ambassador
     * @request PUT:/ambassadors/{id}
     * @secure
     */
    ambassadorsUpdate: (
      id: string,
      data: {
        name?: string;
        email?: string;
        phone?: string;
        student_id?: string;
        campuses_id?: string[];
        campus_name?: string;
        school_id?: string;
        is_active?: boolean;
        profile_image_url?: string;
        bio?: string;
        graduation_year?: number;
        major?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Ambassador;
          updatedFields?: string[];
        },
        | {
            success?: boolean;
            message?: string;
            error?: string;
            allowedFields?: string[];
            details?: object;
          }
        | {
            success?: boolean;
            message?: string;
            error?: string;
          }
      >({
        path: `/ambassadors/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ambassadors
     * @name AmbassadorsDelete
     * @summary Delete an ambassador
     * @request DELETE:/ambassadors/{id}
     * @secure
     */
    ambassadorsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: {
            deletedAmbassador?: {
              id?: string;
              name?: string;
              email?: string;
            };
          };
        },
        {
          success?: boolean;
          message?: string;
          error?: string;
        }
      >({
        path: `/ambassadors/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ambassadors
     * @name CampusDetail
     * @summary Get ambassadors by campus ID
     * @request GET:/ambassadors/campus/{campusId}
     * @secure
     */
    campusDetail: (campusId: string, params: RequestParams = {}) =>
      this.http.request<
        {
          success?: boolean;
          message?: string;
          data?: Ambassador[];
          count?: number;
        },
        {
          success?: boolean;
          message?: string;
          error?: string;
        }
      >({
        path: `/ambassadors/campus/${campusId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  audit = {
    /**
     * @description Retrieve login attempt logs for the authenticated user's school (admin only)
     *
     * @tags Audit
     * @name LoginLogsList
     * @summary Get login audit logs
     * @request GET:/audit/login-logs
     * @secure
     */
    loginLogsList: (
      query: {
        /**
         * Start date for log retrieval
         * @format date
         */
        startDate: string;
        /**
         * End date for log retrieval
         * @format date
         */
        endDate: string;
        /** Filter logs by specific user ID */
        userId?: string;
        /** Filter by success/failure status */
        success?: boolean;
        /** Filter by event type */
        eventType?:
          | "LOGIN_SUCCESS"
          | "LOGIN_FAILURE"
          | "LOGOUT"
          | "PASSWORD_CHANGE"
          | "PASSWORD_RESET"
          | "ACCOUNT_LOCKED"
          | "ACCOUNT_UNLOCKED"
          | "ACCOUNT_BANNED";
        /**
         * Maximum number of logs to return
         * @max 1000
         * @default 100
         */
        limit?: number;
        /**
         * Number of logs to skip for pagination
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          logs?: object[];
          total?: number;
          export_options?: object;
        },
        void
      >({
        path: `/audit/login-logs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve security events like account locks, bans, and suspicious activities
     *
     * @tags Audit
     * @name SecurityEventsList
     * @summary Get security events
     * @request GET:/audit/security-events
     * @secure
     */
    securityEventsList: (
      query: {
        /** @format date */
        startDate: string;
        /** @format date */
        endDate: string;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/audit/security-events`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve all activity logs for a specific user
     *
     * @tags Audit
     * @name UserActivityDetail
     * @summary Get user activity logs
     * @request GET:/audit/user-activity/{userId}
     * @secure
     */
    userActivityDetail: (
      userId: string,
      query?: {
        /**
         * @max 90
         * @default 30
         */
        days?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/audit/user-activity/${userId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Export audit logs in various formats (CSV, JSON)
     *
     * @tags Audit
     * @name ExportCreate
     * @summary Export audit logs
     * @request POST:/audit/export
     * @secure
     */
    exportCreate: (
      data: {
        format?: "csv" | "json";
        /** @format date */
        startDate?: string;
        /** @format date */
        endDate?: string;
        eventTypes?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, void>({
        path: `/audit/export`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  auth = {
    /**
     * @description Intermediate landing page after SAML authentication that attempts to open mobile app or shows download options
     *
     * @tags Authentication
     * @name LandingList
     * @summary Auth landing page
     * @request GET:/auth/landing
     */
    landingList: (
      query?: {
        /** JWT access token (on success) */
        access_token?: string;
        /** JWT refresh token (on success) */
        refresh_token?: string;
        /** User ID (on success) */
        userId?: string;
        /** Error message (on failure) */
        error?: string;
        /** Additional message */
        message?: string;
        /** Mobile platform */
        platform?: "ios" | "android";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<string, void>({
        path: `/auth/landing`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  users = {
    /**
     * @description Allows authenticated users to change their password with validation for breached passwords and password history
     *
     * @tags Users
     * @name ChangePasswordCreate
     * @summary Change password for authenticated user
     * @request POST:/users/change-password
     * @secure
     */
    changePasswordCreate: (
      data: {
        /** User's current password */
        current_password: string;
        /** New password (must not be breached or in last 10 passwords) */
        new_password: string;
        /** Confirmation of new password */
        new_password_confirmed: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** @example "Password changed successfully" */
          message?: string;
        },
        {
          message?: string;
          errors?: string[];
        } | void
      >({
        path: `/users/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if a password meets security requirements (not breached, not in history)
     *
     * @tags Users
     * @name ValidatePasswordCreate
     * @summary Validate a password without saving
     * @request POST:/users/validate-password
     * @secure
     */
    validatePasswordCreate: (
      data: {
        /** Password to validate */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          isValid?: boolean;
          errors?: string[];
          /** Password strength score (0-100) */
          strength?: number;
        },
        void
      >({
        path: `/users/validate-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  analytics = {
    /**
     * @description Retrieves the count of active users for a specified period (month, week, or day)
     *
     * @tags Analytics
     * @name UsersMonthlyActiveList
     * @summary Get Monthly Active Users
     * @request GET:/analytics/users/monthly-active
     * @secure
     */
    usersMonthlyActiveList: (
      query?: {
        /**
         * The time period to retrieve active users for
         * @default "month"
         */
        period?: "month" | "week" | "day";
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** Breakdown of active users */
          monthlyData?: {
            /** Label for the time period (e.g., "Monday", "Week of 05/20", or "January") */
            label?: string;
            /** Number of active users in that period */
            count?: number;
          }[];
          /** Array of user counts for easy chart integration */
          chartData?: number[];
          /** Array of labels for chart integration */
          chartLabels?: string[];
          /** Total unique active users over the entire period */
          totalActiveUsers?: number;
          /** Number of users active in the last 24 hours */
          last24HoursActiveUsers?: number;
          /** The time period covered by the data */
          period?: string;
          /**
           * ISO timestamp of the start of the period
           * @format date-time
           */
          since?: string;
        },
        Error
      >({
        path: `/analytics/users/monthly-active`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
