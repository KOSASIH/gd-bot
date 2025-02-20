import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { Effect } from './types';

interface Spin {
  id: number;
  created_at: string;
  expired_at: string;
  purchase_id: null | number;
}

interface StartSpinResponse {
  points: number;
}

export const getLastPlayedFreeSpin = async () => {
  const url = `${API_PATH}/last/spin`;
  const { data } = await axiosInstance.get<{ data: Spin | null }>(url);
  return data.data;
};

export const getPendingSpins = async () => {
  const url = `${API_PATH}/pending/spin`;
  const { data } = await axiosInstance.get<{ data: Spin[] | null }>(url);
  return data.data;
};

export const startSpin = async (id?: number | null) => {
  const url = id ? `${API_PATH}/spin/${id}` : `${API_PATH}/spin`;
  const { data } = await axiosInstance.post<Effect<StartSpinResponse>>(url);
  return data;
};
