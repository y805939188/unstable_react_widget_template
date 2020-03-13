import axios from 'axios';

export const getModelPreview: (prn: string, workspacerId: number) => Promise<any> = (prn: string, workspacerId: number) => {
  axios.defaults.headers.common['X-Prophet-Workspace-Id'] = workspacerId;
  return axios.get(`/telamon/v1/models/preview/data?uri=${prn}`);
};
