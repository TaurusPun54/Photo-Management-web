import { UUID } from "crypto";

interface photoInterface {
  description: string;
  is_liked: boolean;
  is_archived: boolean;
  is_processed: boolean;
  mime_type: string;
  format: string;
  width: number;
  height: number;
  file_name: string;
  original_file_size: number;
  restored_file_size: number;
  id: UUID; // UUID
  user_id: UUID; // UID
  created_at: string; // ISO 8601 date string
  updated_at: string | null; // ISO 8601 date string
  presigned_url_original: string;
  presigned_url_restored: string | null;
  presigned_url_thumbnail: string;
  tags: string[];
}

export type { photoInterface };
