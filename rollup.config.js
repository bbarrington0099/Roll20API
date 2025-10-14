import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/ProximityNPC.js',
        format: 'iife',
        name: 'ProximityNPC',
        banner: '/* ProximityNPC */',
        strict: false
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};

