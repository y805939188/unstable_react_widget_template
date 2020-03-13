import React, { useState, useCallback, useEffect } from 'react';


import './index.less';




const Search: React.FC<any> = (props) => {

  console.log('dingdingding', props);
  return (
    <div id="board-search-wrapper">
      搜索
    </div>
  )
}

export default React.memo(Search);
