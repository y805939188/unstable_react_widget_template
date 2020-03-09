// import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import less from 'rollup-plugin-less';
import RollupPluginLess2 from 'rollup-plugin-less2';
import LessPluginCssModules from 'less-plugin-css-modules';
// import lessModules from 'rollup-plugin-less-modules';
// import postcss from 'rollup-plugin-postcss';
// import css from 'rollup-plugin-css-only';
// import css from 'rollup-plugin-css';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';
const originPath = process.cwd();

export default {
  // input: `${originPath}/src/index.tsx`,
  // input: `${originPath}/src/model-preview.tsx`,
  input: `${originPath}/src/feature-importance-report.tsx`,
  output: {
    file: `${originPath}/lib/index.js`,
    name: 'model-preview',
    format: 'esm',
    sourcemap: true,
  },
  watch: {
    include: [`${originPath}/demo/**`, `${originPath}/src/**`],
  },
  plugins: [
    typescript({ declaration: true }),
    babel({
      exclude: `${originPath}/node_modules/**`,
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts',
        '.tsx',
      ]
    }),
    // postcss({
    //   extensions: [ '.css' ],
    // }),
    // css(),
    RollupPluginLess2({
      output: false,
      cssModules: true,
      options: {
        plugins: [ new LessPluginCssModules({ mode: 'local' }) ]
      }
    }),
    // lessModules(),
    json(),
    commonjs(),
    sourcemaps(),
  ]
};
