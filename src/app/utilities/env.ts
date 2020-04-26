interface EnvConfig {
  adTesting: boolean;
}

const PROD_CONFIG: EnvConfig = {adTesting: false};
const DEV_CONFIG: EnvConfig = {adTesting: true};

export const  envConfig = (global as any).PROD
  ? PROD_CONFIG
  : DEV_CONFIG;
