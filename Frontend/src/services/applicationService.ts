import api from "@/utils/api";

export type SchemeApplicationStatus = "applied" | "not_applied" | "pending";

export interface SchemeApplicationRecord {
  schemeId: string;
  applied: boolean;
  status: SchemeApplicationStatus;
  applied_at: string | null;
  updated_at: string;
}

interface SaveApplicationResponse {
  message: string;
  data: SchemeApplicationRecord;
}

export const saveApplicationStatus = async (schemeId: string, applied: boolean) => {
  const res = await api.post<SaveApplicationResponse>("/api/apply", {
    schemeId,
    applied,
  });
  return res.data.data;
};

export const getMyApplications = async (schemeId?: string) => {
  const res = await api.get<SchemeApplicationRecord[]>("/api/applications/me", {
    params: schemeId ? { schemeId } : undefined,
  });
  return res.data;
};

export const updateApplicationStatus = async (schemeId: string, applied: boolean) => {
  const res = await api.put<SaveApplicationResponse>(`/api/apply/${schemeId}`, {
    applied,
  });
  return res.data.data;
};
