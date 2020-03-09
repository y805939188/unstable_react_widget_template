export const throwError = (reason, description) => {
    const msg = `【PCharts】${reason}${description ? `:${description}` : ''}`;
    throw new Error(msg);
};

export const printWarn = (reason, description) => {
    const msg = `【PCharts】${reason}${description ? `:${description}` : ''}`;
    console.warn(msg);
};
