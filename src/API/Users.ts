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

export class Users<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Allows authenticated users to change their password with validation for breached passwords and password history
   *
   * @tags Users
   * @name ChangePasswordCreate
   * @summary Change password for authenticated user
   * @request POST:/users/change-password
   * @secure
   */
  changePasswordCreate = (
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
    });
  /**
   * @description Check if a password meets security requirements (not breached, not in history)
   *
   * @tags Users
   * @name ValidatePasswordCreate
   * @summary Validate a password without saving
   * @request POST:/users/validate-password
   * @secure
   */
  validatePasswordCreate = (
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
    });
}
