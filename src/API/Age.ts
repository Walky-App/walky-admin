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

import { HttpClient, RequestParams } from "./http-client";

export class Age<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns all users with names, birthday, and age
   *
   * @tags Age
   * @name GetAge
   * @summary Get all users with age information
   * @request GET:/age
   * @secure
   */
  getAge = (params: RequestParams = {}) =>
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
    });
  /**
   * @description Returns users under the age of 18
   *
   * @tags Age
   * @name Under18List
   * @summary Get users under 18
   * @request GET:/age/under18
   * @secure
   */
  under18List = (params: RequestParams = {}) =>
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
    });
  /**
   * @description Calculate and retrieve the average age of all users
   *
   * @tags Age
   * @name AverageList
   * @summary Get average user age
   * @request GET:/age/average
   * @secure
   */
  averageList = (params: RequestParams = {}) =>
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
    });
}
