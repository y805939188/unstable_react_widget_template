import dao, { axios, DAOInstance } from 'dao';

const modelDAO: DAOInstance = dao.create({
  getList: {
    url: '/hinton/v1/models',
    method: 'GET',
  },
  deleteModels: {
    url: '/hinton/v1/models',
    method: 'DELETE',
  },
  getModel: {
    url: '/hinton/v1/model-info',
    method: 'GET',
  },
  getModelPreview: {
    url: '/telamon/v1/models/preview/data',
    method: 'GET',
  },
  /** 传递参数为modelPrn */
  getReportsLatest: {
    url: '/hinton/v1/reports-latest',
    method: 'GET',
  },
  /** 传递参数为modelPrn、type */
  getReports: {
    url: '/hinton/v1/reports',
    method: 'GET',
  },
  /** params为reportPrn */
  getReport: {
    url: '/hinton/v1/report-info',
    method: 'GET',
  },
  /** params为reportPrns */
  deleteReports: {
    url: '/hinton/v1/reports',
    method: 'DELETE',
  },
  /** params为reportPrn */
  downloadReport: {
    url: '/hinton/v1/reports/download',
    method: 'GET',
  },
  /*
  "releatedModelPrn": "http://pdmsHost/81ec0a0a-d618-4535-a9ef-7e59e4a95e4c",
  "type": "FEATURE_IMPORTANCE_REPORT",
  "limit": 10,
  "offset": 0, */
  getRuns: {
    url: '/hinton/v1/runs',
    method: 'GET',
  },
  getRun: {
    url: '/hinton/v1/run-info',
    method: 'GET',
  },
  /** 提交任务
  * "modelPrn": "http://pdmsHost/81ec0a0a-d618-4535-a9ef-7e59e4a95e4c",
  "type": "FEATURE_IMPORTANCE_REPORT",
  "name": "LRFeatureImportance", // GBDTFeatureImportance、LRVisual、GBDTVisual 算子名称
  "tablePrn": "http://pdmsHost/81ec0a0a-d618-4535-a9ef-7e59e4a95e4c", // 仅LRFeatureImportance需要提供tablePrn
  "config": {}
  */
  postRun: {
    url: '/hinton/v1/runs',
    method: 'POST',
  },
  stopRun: {
    url: '/hinton/v1/runs/stop',
    method: 'POST',
  },
  /**/
  getLRStructureSlotDetail: {
    url: '/hinton/v1/report-info/features',
    method: 'GET',
  },
  downloadLRStructureSlotDetail: {
    url: '/hinton/v1/report-info/features/download',
    method: 'GET',
  },
  getGBDTStructureTreeDetail: {
    url: '/hinton/v1/report-info/trees',
    method: 'GET',
  },
  previewMeta: {
    url: '/hinton/v1/models/meta',
    method: 'GET',
  },
  modelTransfer: {
    url: '/hinton/v1/models/import',
    method: 'POST',
  },
  getFileList: {
    url: '/hinton/v1/models/check',
    method: 'POST',
  },
  updateModel: {
    url: '/hinton/v1/models/update',
    method: 'POST',
  },
  getJobByPrn: {
    url: '/hinton/v1/models/job-info', // ?modelPrn=
    method: 'GET',
  },
  stopJob: {
    url: '/hinton/v1/models/stop-job', // ?jobPrn=
    method: 'POST',
  },
});

export default modelDAO;
