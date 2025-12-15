import { Ambassador as ApiAmbassador } from "../API/data-contracts";

// Extended Ambassador type with additional properties used in legacy code
export interface Ambassador extends ApiAmbassador {
  id?: string;
  campus_name?: string;
  avatar_url?: string;
}

export type { ApiAmbassador };
