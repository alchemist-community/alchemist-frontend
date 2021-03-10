import Notify from 'bnc-notify'
import Onboard from 'bnc-onboard'

const networkId = 1
const rpcUrl = "https://mainnet.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4"
const dappId = 'd5b4fc8d-04d7-4a94-aaef-4bbeb83af2c9'
const APP_NAME="Alchemist"

export function initOnboard(subscriptions) {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    // darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: "metamask", preferred: true },
        { walletName: "trust", preferred: true},
        { walletName: "authereum", preferred: true  },
        { walletName: "coinbase", preferred: true },
        {
          walletName: 'walletConnect',
          infuraKey: 'd5e29c9b9a9d4116a7348113f57770a8',
          preferred: true,
        },
        {
          walletName: "portis",
          label: 'Portis',
          apiKey: 'e86e917b-b682-4a5c-bbc5-0f8c3b787562',
          preferred: true,
        },
        { walletName: "opera" },
        { walletName: "torus" },
        { walletName: "status" },
        { walletName: "walletLink", appName: APP_NAME },
        { walletName: "frame" },

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
