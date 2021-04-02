Frontend for alchemist

LICENSE: MIT

Original frontend design: bakarapara

# Buttons (language on left, technical description on right)

## Stake Pane

- Withdraw <> Transfer unlocked LP tokens from Crucible to msg.sender
  \*\* Max amount = crucible balance - locked balance
- Increase stake <> Deposit more LP tokens to crucible lock
  \*\* Max = undelegated LP token balance
- Unstake and claim <> Claim/transfer existing rewards (proportional to LP token amount) from Aludel to recipient and unlock LP tokens from crucible
  \*\* Max = locked LP balance

## Mint Pane

- Mint and Stake <> Mint Crucible, Lock LP tokens, and Stake
- Lock <> Take unlocked LP tokens already on the crucible and lock them

## Running on a test network

- You can run the project locally on Rinkeby with `npm run start:rinkeby`
- To get MIST and LP token, go to [app.uniswap.org](https://app.uniswap.org), switch to Rinkeby Network, and add token 0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef. Then [add liquidity](https://app.uniswap.org/#/add/ETH/0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef)
