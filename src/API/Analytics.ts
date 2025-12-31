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

import { Error } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Analytics<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Retrieves the count of active users for a specified period (month, week, or day)
   *
   * @tags Analytics
   * @name UsersMonthlyActiveList
   * @summary Get Monthly Active Users
   * @request GET:/analytics/users/monthly-active
   * @secure
   */
  usersMonthlyActiveList = (
    query?: {
      /**
       * The time period to retrieve active users for
       * @default "month"
       */
      period?: "month" | "week" | "day";
    },
    params: RequestParams = {},
  ) =>
    this.request<
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
    });
}
