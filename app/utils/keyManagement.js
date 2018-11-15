import KeyringController from 'eth-keyring-controller';
import Store from './store';

const store = new Store({ configName: 'keyManagement', defaults: { vault: null } });
export const createVault = async (password, mnemonic) => {
  const keyRingController = new KeyringController({});
  const controller = await keyRingController.createNewVaultAndRestore(password, mnemonic);
  const vault = keyRingController.store.getState();
  storeKeyData(JSON.stringify(vault));
  return keyRingController;
}

export const restoreVault = async (password) => {
  const keyStore = JSON.parse(getKeyData());
  const keyRingController = new KeyringController({
    initState: keyStore
  });
  const controller = await keyRingController.submitPassword(password);
  return keyRingController;
}

export const getKeyData = () => store.get('vault');
export const storeKeyData = vault => {
  store.set('vault', vault);
}
