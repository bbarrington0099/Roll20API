import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/ProximityTrigger.js',
        format: 'iife',
        name: 'ProximityTrigger',
        banner: '/* ProximityTrigger - Proximity-Based Automation for Roll20 */',
        strict: false,
        sourcemap: false
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            sourceMap: false,
            declaration: false,
            declarationMap: false
        }),
        resolve(),
        commonjs()
    ]
};

