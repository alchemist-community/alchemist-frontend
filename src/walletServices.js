import Notify from 'bnc-notify'
import Onboard from 'bnc-onboard'

const networkId = 1
const rpcUrl = "https://mainnet.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4"
const dappId = 'd5b4fc8d-04d7-4a94-aaef-4bbeb83af2c9'

export function initOnboard(subscriptions) {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    // darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask' },
        {
          walletName: 'trezor',
          appUrl: 'https://reactdemo.blocknative.com',
          email: 'aaron@blocknative.com',
          rpcUrl
        },
        {
          walletName: 'ledger',
          rpcUrl
        },
        { walletName: 'authereum', disableNotifications: true },
        {
          walletName: 'lattice',
          appName: 'Onboard Demo',
          rpcUrl
        },
        { walletName: 'coinbase' },
        { walletName: 'status' },
        { walletName: 'walletLink', rpcUrl },
        {
          walletName: 'portis',
          apiKey: 'b2b7586f-2b1e-4c30-a7fb-c2d1533b153b'
        },
        { walletName: 'fortmatic', apiKey: 'pk_test_886ADCAB855632AA' },
        { walletName: 'torus' },
        { walletName: 'trust', rpcUrl },
        {
          walletName: 'walletConnect',
          infuraKey: 'd5e29c9b9a9d4116a7348113f57770a8'
        },
        { walletName: 'opera' },
        { walletName: 'operaTouch' },
        { walletName: 'imToken', rpcUrl },
        { walletName: 'meetone' },
        { walletName: 'mykey', rpcUrl },
        { walletName: 'wallet.io', rpcUrl },
        { walletName: 'huobiwallet', rpcUrl },
        { walletName: 'hyperpay' },
        { walletName: 'atoken' },
        { walletName: 'liquality' },
        { walletName: 'frame' },
      ]
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' }
    ]
  })
}

export function initNotify() {
  return Notify({
    dappId,
    networkId,
  })
}
