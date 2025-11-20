const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export type Sex = "male" | "female" | "other";
export type Status = "ACTIVE" | "PAUSED";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  status: Status;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: Member[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface ListMembersParams {
  page?: number;
  limit?: number;
}

export async function listMembers(
  params: ListMembersParams = {}
): Promise<PaginatedResponse> {
  const { page = 1, limit = 10 } = params;

  const url = new URL(`${BASE_URL}/members`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

interface CreateMemberData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  status: Status;
}

export async function createMember(data: CreateMemberData): Promise<Member> {
  const url = `${BASE_URL}/members`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function getSingleMember(id: string): Promise<Member> {
  const url = `${BASE_URL}/members/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteMember(id: string): Promise<void> {
  const url = `${BASE_URL}/members/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
