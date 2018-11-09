export class User {
  constructor(pubkey, username) {
    this.pubkey = pubkey;
    this.username = username;
    this.online = false;
    this.lastSeen = 0;
  }
}
