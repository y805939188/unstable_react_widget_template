
import React from 'react';
import NoReportIcon from '../images/noreport.png';

function ErrorLRChart() {
    return (
        <section className="no-report middle-center">
            <figure>
                <div className="img-wrapper middle-center"><img src={NoReportIcon} alt="noreport" /></div>
                <p className="report-error">未产出有效信息，请检查模型输入特征是否为空</p>
            </figure>
        </section>
    );
}

export default ErrorLRChart;
