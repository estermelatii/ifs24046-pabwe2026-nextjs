export type LostFound = {
  id: number;
  user_id?: number;
  title: string | null;
  description: string | null;
  status: "lost" | "found" | string;
  is_completed: number;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
  author?: {
    name?: string;
    photo?: string | null;
  };
};

export type User = {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
};

export type ApiResult<T = unknown> = {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
};

export type { RootState, AppDispatch } from "@/store";
