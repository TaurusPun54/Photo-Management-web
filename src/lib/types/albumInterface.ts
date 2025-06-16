import { UUID } from "crypto";

interface albumInterface {
  name: string;
  description: string;
  id: UUID;
  user_id: UUID;
  cover_photo_id: UUID;
  cover_photo_url: string | null;
  is_locked: boolean;
  created_at: string;
  updated_at: string | null;
}

export type { albumInterface };
