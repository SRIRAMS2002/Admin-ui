"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    overwrite: true,
    // This assumes your server is running on the standard port
    // and with the default admin API path. Adjust accordingly.
    schema: 'http://localhost:3000/admin-api',
    config: {
        // This tells codegen that the `Money` scalar is a number
        scalars: { Money: 'number' },
        // This ensures generated enums do not conflict with the built-in types.
        namingConvention: { enumValues: 'keep' },
    },
    generates: {
        './src/plugins/banner/gql/generated.ts': { plugins: ['typescript'] },
        './src/plugins/banner/ui/gql/': {
            preset: 'client',
            documents: './src/plugins/banner/ui/**/*.ts',
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
};
exports.default = config;
