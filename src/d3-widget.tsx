import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import './index.less';

const data = [
  { x: "这是", y: 320 },
  { x: "React", y: 200 },
  { x: "和", y: 25 },
  { x: "D3的", y: 190 },
  { x: "Widget", y: 90 },
];

const margin = { top: 20, right: 0, bottom: 30, left: 40 };

const WIDTH = 450;
const HEIGHT = 400;

const chartWidth = WIDTH - margin.left - margin.right;
const chartHeight = HEIGHT - margin.top - margin.bottom;

const xScale = d3
  .scaleBand()
  .domain(data.map(d => d.x))
  .range([0, chartWidth])
  .paddingInner(0.3)
  .paddingOuter(0.4)
  .round(true);

const yScale = d3
  .scaleLinear()
  .domain([0, (d3.max(data.map(d => d.y)) as number)])
  .range([chartHeight, 0])
  .nice();

const bandwidth = xScale.bandwidth();

const Bar: React.FC<null> = () => {
  const [value, setValue] = useState(() => data.map(d => ({ ...d, y: 0 })));
  const svgRef = useRef(null);
  useEffect(() => {
    const t = d3.transition().duration(1000);
    t.tween("height", () => {
      const interpolates = data.map((d, i) => {
        const start = (value[i] && value[i].y) || 0;
        return d3.interpolateNumber(start, d.y);
      });
      return (t: number) => {
        const newData = data.map((d, i) => {
          return { ...d, y: interpolates[i](t) };
        });
        setValue(newData);
      };
    });
  }, []);
  return (
    <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
      <linearGradient id="linear-gradient" x1={0} x2={0} y1={1} y2={0}>
        <stop offset="0%" stopColor="#16a3ff" />
        <stop offset="100%" stopColor="#6ddead" />
      </linearGradient>
      {/* x轴 */}
      <g className="x-axis" transform={`translate(${margin.left},${HEIGHT - margin.bottom})`} >
        {/* 轴线 */}
        <line x1={0} y1={0} x2={chartWidth} y2={0} stroke={"#000"} />
        {/* 轴标签*/}
        <g className="tick">
          {data.map((d, i) => {
            const x = (xScale as Function)(d.x) + bandwidth / 2;
            return (
              <g key={i}>
                {/* 轴刻度 */}
                <line x1={x} x2={x} y1={0} y2={6} stroke={"#000"} />
                {/* 轴标签文本 */}
                <text x={x} y={20} fontSize={12} textAnchor={"middle"}>
                  {d.x}
                </text>
              </g>
            );
          })}
        </g>
      </g>

      {/* y轴 */}
      <g
        className="y-axis"
        transform={`translate(${margin.left},${margin.top})`}
      >
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke={"#000"} />
        <g className="tick">
          {yScale.ticks(10).map((d, i) => {
            const y = yScale(d);
            return (
              <g key={i} transform={`translate(0, ${y})`}>
                <line x1={0} x2={-6} y1={0} y2={0} stroke={"#000"} />
                <text
                  x={-12}
                  y={0}
                  dy={"0.32em"}
                  fontSize={12}
                  textAnchor={"end"}
                >
                  {d}
                </text>
              </g>
            );
          })}
        </g>
      </g>

      {/* 柱子 */}
      <g
        transform={`translate(${margin.left}, ${margin.top})`}
        fill={"url(#linear-gradient)"}
      >
        {value.map((d, i) => {
          const x = xScale(d.x);
          const y = yScale(d.y);
          const height = chartHeight - y;
          return (
            <g key={i}>
              <rect x={x} y={y} width={bandwidth} height={height} />
              <text
                x={(x || 0) + bandwidth / 2}
                y={y - 4}
                fontSize={12}
                textAnchor={"middle"}
              >
                {d.y.toFixed(0)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default React.memo(Bar);
