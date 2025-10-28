import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
export const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  link: string;
  doi: string;
  open_access: number;
  summary: string;
  use_case: string;
  dataset: string;
  model: string;
  results: string;
  business_impact: string;
  industry: string;
  function: string;
  modality: string;
  technique: string;
  stage: string;
  source_evidence: string;
};

export type PapersResponse = {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  papers: Paper[];
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchPapers(
  params: Record<string, any> = {},
  signal?: AbortSignal
): Promise<PapersResponse> {
  try {
    const { data } = await api.get('/api/papers', { params, signal });
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error; // Re-throw cancellation errors
    }
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.status ?? 500,
        error.response?.data?.message ?? 'Failed to fetch papers'
      );
    }
    throw error;
  }
}

export async function fetchPaper(id: string, signal?: AbortSignal): Promise<Paper> {
  try {
    const { data } = await api.get(`/api/papers/${id}`, { signal });
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.status ?? 500,
        error.response?.data?.message ?? 'Failed to fetch paper'
      );
    }
    throw error;
  }
}

