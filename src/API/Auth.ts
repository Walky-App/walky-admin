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

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Intermediate landing page after SAML authentication that attempts to open mobile app or shows download options
   *
   * @tags Authentication
   * @name LandingList
   * @summary Auth landing page
   * @request GET:/auth/landing
   */
  landingList = (
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
    this.request<string, void>({
      path: `/auth/landing`,
      method: "GET",
      query: query,
      ...params,
    });
}
