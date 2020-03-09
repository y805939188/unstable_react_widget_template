const checkSlotDuplicate = (list: any[], { checkSlot, checkFeasIndex, checkDetailIndex }: any): boolean => {
  list.forEach((detail: any, i1: number) => {
    const { feas } = detail;
    feas.forEach(({ slot }: any, i2: number) => {
      if (slot === checkSlot && (i1 !== checkDetailIndex || i2 !== checkFeasIndex)) return false;
    });
  });
  return false;
}


export const toFixed = (number: number, decimal: number = 4) => {
  if (typeof number === 'number') return parseFloat(number.toFixed(decimal));
  return '暂无';
};

export const calcEvaluation = (res: any, needFixed: boolean = true) => {
  const { scorer, trainScore } = res;
  if (!scorer) return '-';
  return needFixed ? `${scorer}: ${toFixed(trainScore)}` : `${scorer}: ${trainScore}`;
};

// export const isLoadModelPreviewInfo = (framework) => {
//   if (framework === FRAMEWORKKEY.PicoTraining
//     || framework === FRAMEWORKKEY.h2o) {
//     return true;
//   }
//   return false;
// };

export const transImportanceReport = (report: any, algorithm: string) => {
  const { content } = report;
  if (!content) return report;
  const detailArray = content.featureDetails;
  if (algorithm === 'lr') {
    detailArray.forEach((detail: any) => (detail.name = detail.slotName));
  } else if (algorithm === 'gbdt' || algorithm === 'gbdt-fpga') {
    /** 结构，有组合特征
     * {
     *   "feas": [{
     *     "slotName": "f_age",
     *     "signName": "10",
     *     "slot": 1,
     *     "sign": 1244555,
     *     "type": "discrete",
     *   }],
     *   "importance": 0.8,
     *   "frequency": 66,
     * }
     */
    detailArray.forEach((detail: any, detailIndex: number) => {
      const { feas } = detail;
      let name = '';
      const length = feas.length - 1;
      feas.forEach((item: any, i: number) => {
        name += item.slotName;
        /**
         * 由于连续特征也可能存在多个sign。判断显示sign的逻辑更改为：
         * 离散特征，显示sign信息
         * 连续特征，slot有重复，也显示sign相关信息
         */
        const needCheckSlot = {
          checkSlot: item.slot,
          checkFeasIndex: i,
          checkDetailIndex: detailIndex,
        };
        if (item.type === 'discrete' || checkSlotDuplicate(detailArray, needCheckSlot)) {
          name += item.signName ? `:${item.signName}` : `:${item.sign}`;
        }
        if (i < length) name += '_';
      });
      detail.name = name;
    });
  }
  return report;
};

