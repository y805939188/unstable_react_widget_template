import React, { PureComponent } from 'react';
import { LR, GBDT } from './components';
import modelDAO from '../service/setting';

interface IProps {
  report: { [prop: string]: any };
  type: string;
  height?: number;
  width?: number;
}

interface IState {
  featureDetail: { [prop: string]: any } | null;
  treeDetail: { [prop: string]: any } | null;
}

export default class ReportStructure extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      featureDetail: null,
      treeDetail: null,
    }
  }

  onFeatureClick = (slot: any) => {
    const { prn } = this.props.report;
    modelDAO.getLRStructureSlotDetail({ params: {
      reportPrn: prn,
      featureId: slot,
    } }).then(res => {
      const featureDetail = res?.data?.data;
      this.setState({ featureDetail });
    });
  }

  downloadLRFeatureDetail = (slot: any) => {
    const { prn } = this.props.report;
    const url = `/hinton/v1/report-info/features/download?reportPrn=${encodeURIComponent(prn)}&featureId=${slot}`;
    window.location.assign(url);
  }

  onTreeIndexChange = (treeIndex: any) => {
    const { prn, content } = this.props.report;
    modelDAO.getGBDTStructureTreeDetail({ params: {
      reportPrn: prn,
      treeIndex: treeIndex - 1,
    }, loading: true }).then((res: any) => {
      const data = res?.data?.data;
      const treeDetail = data && JSON.parse(data);
      treeDetail.n_learner = content.n_learner;
      this.setState({ treeDetail });
    });
  }

  render = () => {
    const { report, type, height, width } = this.props;
    const { featureDetail } = this.state;
    return (
      type === 'lr' ?
        <LR
          // @ts-ignore
          data={report.content}
          // @ts-ignore
          onFeatureClick={this.onFeatureClick}
          // @ts-ignore
          featureDetail={featureDetail}
          // @ts-ignore
          download={this.downloadLRFeatureDetail}
        />  :
      (type === 'gbdt' || type === 'gbdt-fpga') ?
        <GBDT
          // @ts-ignore
          height={height}
          // @ts-ignore
          width={width}
          // @ts-ignore
          data={report.content.tree}
          treeCount={report.content.n_learner}
          // @ts-ignore
          onTreeIndexChange={this.onTreeIndexChange}
        />
        :
      null
    )
  }
}
