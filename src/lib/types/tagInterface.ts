import { UUID } from "crypto";

interface tagInterface {
  id: UUID;
  name: string;
  photo_count: number;
  category: string;
}

export type { tagInterface };
