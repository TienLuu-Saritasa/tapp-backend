import { RawAxiosRequestHeaders } from 'axios';

export class EnvService {
  public getOxfordHeader = (): RawAxiosRequestHeaders => {
    return {
      Accept: 'application/json',
      app_id: process.env.OXFORD_APP_ID,
      app_key: process.env.OXFORD_APP_KEY
    };
  };
}
