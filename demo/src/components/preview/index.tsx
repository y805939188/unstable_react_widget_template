import React, { useState, useEffect } from 'react';
import { ReactFrame } from 'react-vue-micro-frame';
import data from './mock-data';
import './index.<%= style%>';

interface IState {
  recommend: any[];
  ranking: any[];
  quality: any[];
  downloads: any[];
}

const getComponentWithType = (arr: any[]) => {
  const obj: { [prop: string]: any[] } = { recommend: [], ranking: [], quality: [], downloads: [] };
  arr.forEach(item => {
    switch (item.type) {
      case 'recommend': obj.recommend.push(item); break;
      case 'ranking': obj.ranking.push(item); break;
      case 'quality': obj.quality.push(item); break;
      case 'downloads': obj.downloads.push(item); break;
    }
  });
  return obj;
}

const getRecommendComponent = (data: any[], handleClick: Function) => {
  return !data.length ? null : (
    <>
      <div onClick={handleClick(data[0])} className="common-background-color recommend-1">
        <div className="recommend-1-content">
          <ReactFrame jsurl={data[0].url} extraProps={data[0].defaultProps} />
        </div>
      </div>
      {data[1] ? (
        <div onClick={handleClick(data[1])} className="common-background-color recommend-2">
          <div className="recommend-2-content">
            <ReactFrame jsurl={data[1].url} extraProps={data[1].defaultProps} />
          </div>
        </div>
      ) : null}
    </>
  )
}

const getQualityComponent = (data: any[], handleClick: Function) => {
  return !data.length ? null : (
    <>
      <div className="substance-high-quality">
        {data.slice(0, 4).map((item: any, index: number) => (
          <div onClick={handleClick(item)} key={`${item.name}_${index}`} className="common-background-color high-quality-wrapper">
            <div className="high-quality-content">
              <ReactFrame jsurl={item.url} extraProps={item.defaultProps} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const getRankingComponent = (data: any[], handleClick: Function) => {
  return !data.length ? null : (
    <>
      <div className="ranking-1">
        <div onClick={handleClick(data[0])} className="common-background-color ranking-content-1">
          <ReactFrame jsurl={data[0].url} />
        </div>
      </div>
      {
        !data[1] ? null :
        (<div className="ranking-2">
          <div onClick={handleClick(data[1])} className="common-background-color ranking-content-2">
            <ReactFrame jsurl={data[1].url} />
          </div>
        </div>)
      }
    </>
  )
}

const getDownloadsComponent = (data: any[], handleClick: Function) => {
  console.log(98765,data)
  return !data.length ? null : (
    <div onClick={handleClick(data[0])} className="common-background-color downloads-content">
      <ReactFrame extraProps={data[0].defaultProps} jsurl={data[0].url} />
    </div>
  )
}

const Preview: React.FC<any> = (props) => {
  const [ result, setResult ] = useState<IState>({ recommend: [], ranking: [], quality: [], downloads: [] });
  useEffect(() => {
    setTimeout(() => {
      const res: any = getComponentWithType(data);
      console.log(9999, res)
      setResult(res);
    }, 500);
  }, []);
  const handleClick = (widget: any) => () => (
    window.open(`/board/#/detail/${encodeURIComponent(JSON.stringify(widget))}`)
  );
  return (
    <div className="preview-wrapper">
      <div className="content-substance">
        <div className="substance-recommend">
          {getRecommendComponent(result.recommend, handleClick)}
        </div>
        {getQualityComponent(result.quality, handleClick)}
      </div>
      <div className="content-ranking">
        {getRankingComponent(result.ranking, handleClick)}
      </div>
      <div className="content-downloads">
        {getDownloadsComponent(result.downloads, handleClick)}
      </div>
    </div>
  )
}

export default React.memo(Preview);
