import { UUID } from "crypto";

interface userInterface {
  id: UUID;
  email: string;
  first_name: string;
  last_name: string;
  subscription_type: string;
  subscription_start_date: string;
  subscription_end_date: string;
  is_active: boolean;
  storage_limit: number;
  storage_used: number;
  created_at: string; // ISO 8601 date string
  updated_at: string | null; // ISO 8601 date string
  avatar?: string;
}

export type { userInterface };
