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

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Audit<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Retrieve login attempt logs for the authenticated user's school (admin only)
   *
   * @tags Audit
   * @name LoginLogsList
   * @summary Get login audit logs
   * @request GET:/audit/login-logs
   * @secure
   */
  loginLogsList = (
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
    });
  /**
   * @description Retrieve security events like account locks, bans, and suspicious activities
   *
   * @tags Audit
   * @name SecurityEventsList
   * @summary Get security events
   * @request GET:/audit/security-events
   * @secure
   */
  securityEventsList = (
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
    });
  /**
   * @description Retrieve all activity logs for a specific user
   *
   * @tags Audit
   * @name UserActivityDetail
   * @summary Get user activity logs
   * @request GET:/audit/user-activity/{userId}
   * @secure
   */
  userActivityDetail = (
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
    });
  /**
   * @description Export audit logs in various formats (CSV, JSON)
   *
   * @tags Audit
   * @name ExportCreate
   * @summary Export audit logs
   * @request POST:/audit/export
   * @secure
   */
  exportCreate = (
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
    });
}
