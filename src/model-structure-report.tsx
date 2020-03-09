import React, { PureComponent, ReactNode } from 'react';
import { axios } from 'dao';
import Select from 'antd/es/select'
import modelDAO from './service/setting';
import 'antd/es/select/style/index.css';
import { transImportanceReport } from './service/utils';
import ReportStructure from './charts-components/report-structure';


interface IPropsBase {
  workspaceId: number;
  height?: number;
  width?: number;
}

interface IProps1 extends IPropsBase {
  prn: string;
  reportPrn?: string;
}

interface IProps2 extends IPropsBase {
  reportPrn: string;
  prn?: string;
}

type IProps = IProps1 | IProps2;

interface IState {
  currentReport: { [prop: string]: any };
  algorithm: string;
  error: string;
}

const { Option } = Select;
const ALGORITHM: string[] = ['GBDT', 'GBDT-FPGA', 'LR'];
const REPORTTYPE: { [prop: string]: string } = {
  FEATURE_IMPORTANCE_REPORT: 'FEATURE_IMPORTANCE_REPORT',
  MODEL_STRUCTURE_REPORT: 'MODEL_STRUCTURE_REPORT',
  BINARY_CLASSIFICATION_REPORT: 'BINARY_CLASSIFICATION_REPORT',
  MULTICALSS_CLASSIFICATION_REPORT: 'MULTICALSS_CLASSIFICATION_REPORT',
  REGRESSION_REPORT: 'REGRESSION_REPORT',
};

class ModelStructureReport extends PureComponent<IProps, IState> {
  private readonly type: string = REPORTTYPE.MODEL_STRUCTURE_REPORT;
  private reportList: any[] = [];
  private reportMap: { [prop: string]: any } = {};
  constructor(props: IProps) {
    super(props);
    axios.defaults.headers.common['X-Prophet-Workspace-Id'] = props.workspaceId;
    this.state = { currentReport: {}, algorithm: '', error: '' };
  }
  componentDidMount = async () => {
    const { prn, reportPrn } = this.props;
    if (!prn) return false;
    const algorithm = (await this.fetchModal(prn)).algorithm;
    if (!algorithm) return this.setState({ error: '暂不支持该模型' });
    if (!ALGORITHM.includes(algorithm.toUpperCase())) return this.setState({ error: '暂不支持该模型' });
    const currentReportPrn = reportPrn || await this.fetchReportPrn(prn, this.type) || '';
    const currentReport = await this.fetchCurrentReport(currentReportPrn);
    this.reportMap[currentReportPrn] = currentReport;
    if (currentReport) this.setState({ currentReport, algorithm });
  }

  fetchModal = (modelPrn: string): Promise<any> => {
    return modelDAO.getModel({ params: { modelPrn }, loading: true }).then(res => {
      return res?.data?.data || null;
    });
  }
  
  fetchReportPrn = (reportPrn: string, type: string): Promise<string> => {
    return modelDAO.getReports({ params: { modelPrn: reportPrn, type } }).then(res => {
      const reports = res?.data?.data?.list;
      return reports && reports.length && (this.reportList = reports) && reports[0].prn;
    });
  }

  fetchCurrentReport = (reportPrn: string): Promise<{}> => {
    return modelDAO.getReport({ params: { reportPrn } }).then(res => {
      const reportData = res?.data?.data;
      const temporary = { ...reportData };
      try {
        temporary.content = JSON.parse(reportData.content);
      } catch (err) {
        console.warn('fetchCurrentReport 方法在转换json字符串时候出错');
        temporary.content = null;
      }
      return temporary.content ? temporary : null;
    })
  }

  isLoadModelPreviewInfo = (framework: string): boolean => {
    return framework === 'PicoTraining' || framework === 'h2o';
  }

  renderReport = (report: IState['currentReport'], algorithm: IState['algorithm']): ReactNode => {
    const { height, width } = this.props;
    // const currentReport = (this.type === REPORTTYPE.MODEL_STRUCTURE_REPORT) ?
    //   report : (this.type === REPORTTYPE.FEATURE_IMPORTANCE_REPORT) ?
    //     transImportanceReport(report, algorithm) : report;
    console.log('这里的值是', 88888888)
    return (<ReportStructure height={height} width={width} report={report} type={algorithm} />);
  }

  handleOnChange = async (value: number) => {
    const currntPrn = (this.reportList[value] || {}).prn;
    if (!currntPrn) return;
    const currentReport = this.reportMap[currntPrn] || await this.fetchCurrentReport(currntPrn);
    !this.reportMap[currntPrn] && (this.reportMap[currntPrn] = currentReport);
    this.setState({ currentReport });
  }

  render = () => {
    const { currentReport, algorithm, error } = this.state;
    return (
      <div id="widgets-feature-importance-report-wrapper">
        {currentReport.content ? (
          <>
            {/* <div className="reports-select">
              <Select defaultValue={0} style={{ width: 120 }} onChange={this.handleOnChange} >
                {
                  this.reportList.map((item, index) => {
                    return (<Option value={index} key={item.prn} >{item.prn}</Option>)
                  })
                }
              </Select>
            </div> */}
            {this.renderReport(currentReport, algorithm)}
          </>
        ) : (error || null)}
      </div>
    )
  }
};

export default ModelStructureReport;
