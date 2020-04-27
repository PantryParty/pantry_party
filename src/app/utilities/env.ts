interface EnvConfig {
  adTesting: boolean;
  enableNgProdMode: boolean;
}

const PROD_CONFIG: EnvConfig = {adTesting: false, enableNgProdMode: true};
const DEV_CONFIG: EnvConfig = {adTesting: true, enableNgProdMode: false};

export const  envConfig = (global as any).PROD
  ? PROD_CONFIG
  : DEV_CONFIG;
