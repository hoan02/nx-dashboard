import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'categories',
  exposes: {
    './Routes': 'apps/categories/src/app/app.routes.ts',
    './CategoryService': 'apps/categories/src/app/services/category.service.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
