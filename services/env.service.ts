import { RawAxiosRequestHeaders } from 'axios';
import { CredentialBody } from 'google-auth-library';
import { sheets_v4 } from 'googleapis';

export class EnvService {

  public getOxfordHeader = (): RawAxiosRequestHeaders => {
    return {
      Accept: 'application/json',
      app_id: process.env.OXFORD_APP_ID,
      app_key: process.env.OXFORD_APP_KEY
    };
  };

  public getGoogleCredentials = (): CredentialBody => {
    return {
      client_email: Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_EMAIL ?? '', 'base64').toString('ascii'),
      private_key: Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY ?? '', 'base64').toString('ascii')
    };
  };

  public getGoogleSheetId = (): sheets_v4.Params$Resource$Spreadsheets$Values$Clear['spreadsheetId'] => {
    return process.env.GOOGLE_SHEET_ID;
  };
}
