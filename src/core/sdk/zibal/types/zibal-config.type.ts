export type ZibalCredentials = {
  merchant: string;
  callbackUrl: string;
  lazy?: boolean;
};
export interface IZibalConfig {
  credentials: ZibalCredentials;
  getGatewayURL(trackId: number): string;
}

export interface IZibalFeatureConfig {
  moduleScope: string;
  lazy?: boolean;
}
