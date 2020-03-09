import React, { PureComponent, ReactNode } from 'react';
import { axios } from 'dao';
import modelDAO from './service/setting';
import ModelPreviewGraph from './charts-components/model-preview-graph';
import 'elf-visualization/dist/main.css';


interface IProps {
  prn: string;
  workspaceId: number;
  height?: number;
  width?: number;
}

interface IState {
  modelPreview: { [prop: string]: any } | null;
  error: string;
}

class ModelPreview extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    axios.defaults.headers.common['X-Prophet-Workspace-Id'] = props.workspaceId;
    this.state = { modelPreview: null, error: '' };
  }
  componentDidMount = async () => {
    const { prn } = this.props;
    const modelPreview = await this.fetchModelPreview(prn || '');
    if (modelPreview) this.setState({ modelPreview });
  }

  fetchModelPreview = (prn: string): null | Promise<any> => {
    if (!prn) return null;
    return modelDAO.getModelPreview({ params: { uri: prn }, loading: true }).then(res => {
      return res?.data?.data;
    });
  }

  renderPreview = (modelPreview: IState['modelPreview']): ReactNode => {
    const { height, width } = this.props;
    console.log(9999, modelPreview);
    return <ModelPreviewGraph data={modelPreview} /> ;
  }

  render = () => {
    const { modelPreview, error } = this.state;
    return (
      <div id="widgets-model-preview-wrapper">
        {modelPreview ? (this.renderPreview(modelPreview)) : (error || null)}
      </div>
    )
  }
};

export default ModelPreview;
