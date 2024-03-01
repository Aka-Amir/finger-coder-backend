import { kavenegar } from 'kavenegar';

export interface IKavenegarRootConfig extends kavenegar.Options {
  sender?: string;
}

export interface IKavenegarFeatureConfig {
  sender?: string;
}
