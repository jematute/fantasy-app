import { OAuthSettings } from "./oauthsettings";

export class ClientSettings {

  private static instance: ClientSettings;
  private constructor() {
      // do something construct...
  }
  oAuthSettings: OAuthSettings;

  static getInstance() {
      if (!ClientSettings.instance) {
          ClientSettings.instance = new ClientSettings();
          // ... any one time initialization goes here ...
      }
      return ClientSettings.instance;
  }

}
