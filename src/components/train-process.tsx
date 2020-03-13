import React, { createRef, RefObject } from 'react';
// import echarts, { EChartOption } from 'echarts';
import Echarts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
//导入折线图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
// import 'echarts/lib/component/markPoint'
import Tabs from './training-process-tab.jsx';
import './css/training-process.css';
import loglossGraph from './conf/logloss';
import aucGraph from './conf/auc.js';

interface IProps {
	data: { [prop: string]: any };
}

interface IState {
	tabStatus: 'logloss' | 'auc';
	xName: string;
	echartsOptions: ReactEchartsPropsTypes['option'] | null;
}

interface IGraphItemsProps {
	name: string;
	value: 'logloss' | 'auc';
}

export default class TrainProcess extends React.Component<IProps, IState> {
	private graphItems: IGraphItemsProps[];
	private oDivRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
	constructor(props: IProps) {
		super(props);

		const algorithmName = this.props.data?.algorithmName || '';
		const xName = (algorithmName === 'gbdt' || algorithmName === 'HE-TreeNet') ? '树的棵数' : '训练迭代次数';
		this.state = { tabStatus: 'logloss', echartsOptions: null, xName };
		const loglossName = algorithmName === 'svm' ? 'Hingeloss' : 'Logloss';
		this.graphItems = [
			{ name: loglossName, value: 'logloss' },
			{ name: 'AUC', value: 'auc' }
		];
	}

	componentDidMount() {
		const graphData = this.parseLoglossData();
		const oDiv = this.oDivRef.current;
		// if (graphData) this.setState({ echartsOptions: graphData });
		if (graphData && oDiv) {
			const graph = echarts.init(oDiv);
			graph.setOption(graphData);
		}
		// window.addEv
	}
	onTabChange = () => {
		const { tabStatus } = this.state;
		const graphData = tabStatus === 'logloss' ? this.parseAucData() : this.parseLoglossData();
		const state: any = { tabStatus: tabStatus === 'logloss' ? 'auc' : 'logloss' };
		graphData && (state.echartsOptions = graphData);
		this.setState(state);
	}

	series = ({ name, data, color }: { name: string; data: any[], color?: string }) => {
		return {
			name, data, type: 'line', smooth: true,
			symbolSize: 12, showSymbol: data.length === 1,
			hoverAnimation: false, itemStyle: { normal: { lineStyle: { color, width: 3 } } },
		};
	}

	parseLoglossData() {
		const graphs = this.props.data.graph;
		const logloss = graphs.trainLogloss;
		const loglossValidate = graphs.validateLogloss;
		const loglossParse: number[][] = [];
		const loglossValidateParse: number[][] = [];
		logloss.forEach((item: number, index: number) => {
			const ele: number[] = [];
			ele.push(index + 1);
			ele.push(item);
			loglossParse.push(ele);
		});
		// 验证logloss
		loglossValidate.forEach((item: number, index: number) => {
			const ele = [];
			ele.push(index + 1);
			ele.push(item);
			loglossValidateParse.push(ele);
		});
		if (logloss) {
			const { data = {} } = this.props;
			const loglossName = data.algorithmName === 'svm' ? 'Hingeloss' : 'Logloss';
			loglossGraph.series[0] = this.series({
				name: `训练${loglossName}`,
				data: loglossParse,
			});
			loglossGraph.series[1] = this.series({
				name: `验证${loglossName}`,
				data: loglossValidateParse,
			});
			loglossGraph.legend.data = [];
			if (loglossValidate.length > 1) {
				loglossGraph.legend.data = [
					{ name: `训练${loglossName}`, icon: 'rect' },
					{ name: `验证${loglossName}`, icon: 'rect' },
				];
			}
			loglossGraph.xAxis.name = this.state.xName;
			loglossGraph.yAxis.name = loglossName;
			loglossGraph.yAxis.max = null;
		}
		return loglossGraph || null;
	}
	parseAucData = () => {
		const graphs = this.props.data.graph;
		const auc = graphs.train;
		const aucParse: number[][] = [];
		auc.forEach((item: number, index: number) => {
			const ele: number[] = [];
			ele.push(index + 1);
			ele.push(item);
			aucParse.push(ele);
		});
		const aucValidate = graphs.validate;
		const aucValidateParse: number[][] = [];
		aucValidate.forEach((item: number, index: number) => {
			const ele = [];
			ele.push(index + 1);
			ele.push(item);
			aucValidateParse.push(ele);
		});

		if (auc) {
			aucGraph.series[0] = this.series({ name: '训练AUC', data: aucParse });
			aucGraph.series[1] = this.series({ name: '验证AUC', data: aucValidateParse });
			aucGraph.legend.data = [];
			if (aucValidate.length > 1) {
				aucGraph.legend.data = [
					{ name: '训练AUC', icon: 'rect' },
					{ name: '验证AUC', icon: 'rect' }
				];
			}
			aucGraph.xAxis.name = this.state.xName;
			aucGraph.yAxis.name = 'AUC';
		}
		return aucGraph || null;
	}
	render() {
		const result = this.props.data;
		const { echartsOptions } = this.state;
		return (
			<div className="visualization-model-outside-container visualization-model-container">
				<Tabs items={this.graphItems} padding="16px 0px 0px 18px" onTabChange={this.onTabChange} />
				<div className="visualization-model-row">
					<div ref={this.oDivRef} className="visualization-graph" />
					{/* {echartsOptions && <Echarts className={"visualization-graph"} option={echartsOptions} />} */}
					<div className="visualization-rightTable">
						<table>
							<tbody>
								<tr>
									<td>训练用时</td>
									<td>{result.trainTime || '暂无'}</td>
								</tr>
								<tr><td>{this.state.xName}</td><td>{result.iterations || '暂无'}</td></tr>
								<tr><td>{this.props.data.algorithmName === 'svm' ? '训练Hingeloss' : '训练Logloss'}</td>
									<td>{result.trainLogloss === 'NaN' ? '暂无' : result.trainLogloss}</td>
								</tr>
								{result.validateLogloss === 'NaN' ? null : (
									<tr>
										<td>{this.props.data.algorithmName === 'svm' ? '验证Hingeloss' : '验证Logloss'}</td>
										<td>{result.validateLogloss === 'NaN' ? '暂无' : result.validateLogloss}</td>
									</tr>
								)}
								<tr>
									<td>训练AUC</td>
									<td>{result.train === 'NaN' ? '暂无' : result.train}</td>
								</tr>
								{result.validate === 'NaN' ? null : (
									<tr>
										<td>验证AUC</td>
										<td>{result.validate === 'NaN' ? '暂无' : result.validate}</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
