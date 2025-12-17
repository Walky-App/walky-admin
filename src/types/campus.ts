import { Campus as ApiCampus } from "../API/data-contracts";

// Extended Campus type with additional properties used in legacy code
export interface Campus extends ApiCampus {
  id?: string;
  name?: string;
  location?: string;
}

export type { ApiCampus };
