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

import { Ambassador } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Ambassadors<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Ambassadors
   * @name AmbassadorsList
   * @summary Get all ambassadors
   * @request GET:/ambassadors
   * @secure
   */
  ambassadorsList = (params: RequestParams = {}) =>
    this.request<
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
    });
  /**
   * No description
   *
   * @tags Ambassadors
   * @name AmbassadorsCreate
   * @summary Create a new ambassador
   * @request POST:/ambassadors
   * @secure
   */
  ambassadorsCreate = (
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
    },
    params: RequestParams = {},
  ) =>
    this.request<
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
    });
  /**
   * No description
   *
   * @tags Ambassadors
   * @name AmbassadorsDetail
   * @summary Get ambassador by ID
   * @request GET:/ambassadors/{id}
   * @secure
   */
  ambassadorsDetail = (id: string, params: RequestParams = {}) =>
    this.request<
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
    });
  /**
   * No description
   *
   * @tags Ambassadors
   * @name AmbassadorsUpdate
   * @summary Update an ambassador
   * @request PUT:/ambassadors/{id}
   * @secure
   */
  ambassadorsUpdate = (
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
    this.request<
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
    });
  /**
   * No description
   *
   * @tags Ambassadors
   * @name AmbassadorsDelete
   * @summary Delete an ambassador
   * @request DELETE:/ambassadors/{id}
   * @secure
   */
  ambassadorsDelete = (id: string, params: RequestParams = {}) =>
    this.request<
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
    });
  /**
   * No description
   *
   * @tags Ambassadors
   * @name CampusDetail
   * @summary Get ambassadors by campus ID
   * @request GET:/ambassadors/campus/{campusId}
   * @secure
   */
  campusDetail = (campusId: string, params: RequestParams = {}) =>
    this.request<
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
    });
}
