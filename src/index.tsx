import React, { useEffect, useState } from 'react';
import { getModelPreview } from './service';
import ModelPreview from './components/train-process/index';
import './index.<%= style%>';

const fakePrn = 'TaskController/PicoTraining-10001684-10001684-29d882.model';
const fakeWorkspaceId = 1;

const Widget: React.FC<any> = () => {
  const [ data, setData ] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const result = await getModelPreview(fakePrn, fakeWorkspaceId);
      const data = result?.data?.data;
      setData(data);
    })();
  }, []);
  return (
    <div>{ data &&  <ModelPreview data={data} />}</div>
  )
}

export default React.memo(Widget);
