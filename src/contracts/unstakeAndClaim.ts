/*
task('unstake-and-claim', 'Unstake lp tokens and claim reward')
  .addParam('crucible', 'Crucible vault contract')
  .addParam('aludel', 'Aludel reward contract')
  .addParam('recipient', 'Address to receive stake and reward')
  .addParam('amount', 'Amount of staking tokens with decimals')
  .addFlag('private', 'Use taichi network to avoid frontrunners')
  .setAction(async (args, { ethers, run, network }) => {
*/

/*
export async function unstakeAndClaim(){
    const args = {
        crucible: '',
        aludel: '',
        recipient: '',
        amount: ''
    }
    // log config

    console.log('Network')
    console.log('  ', network.name)
    console.log('Task Args')
    console.log(args)

    // compile

    await run('compile')

    // get signer

    let signer = (await ethers.getSigners())[0]
    console.log('Signer')
    console.log('  at', signer.address)
    console.log('  ETH', formatEther(await signer.getBalance()))
    const signerWallet = Wallet.fromMnemonic(process.env.DEV_MNEMONIC || '')
    expect(signer.address).to.be.eq(signerWallet.address)

    // fetch contracts

    const aludel = await ethers.getContractAt('Aludel', args.aludel, signer)
    const stakingToken = await ethers.getContractAt(
      IUniswapV2ERC20.abi,
      (await aludel.getAludelData()).stakingToken,
      signer,
    )
    const crucible = await ethers.getContractAt(
      'Crucible',
      args.crucible,
      signer,
    )

    // declare config

    const amount = parseUnits(args.amount, await stakingToken.decimals())
    const nonce = await crucible.getNonce()
    const recipient = args.recipient

    // validate balances

    expect(await stakingToken.balanceOf(crucible.address)).to.be.gte(amount)

    // craft permission

    console.log('Sign Unlock permission')

    const permission = await signPermission(
      'Unlock',
      crucible,
      signerWallet,
      aludel.address,
      stakingToken.address,
      amount,
      nonce,
    )

    console.log('Unstake and Claim')

    const populatedTx = await aludel.populateTransaction.unstakeAndClaim(
      crucible.address,
      recipient,
      amount,
      permission,
    )

    if (args.private) {
      const gasPrice = await signer.getGasPrice()
      const gasLimit = await signer.estimateGas(populatedTx)
      const nonce = await signer.getTransactionCount()
      const signerWallet = Wallet.fromMnemonic(
        process.env.DEV_MNEMONIC || '',
      ).connect(ethers.provider)

      const signedTx = await signerWallet.signTransaction({
        ...populatedTx,
        gasPrice,
        gasLimit,
        nonce,
      })

      const taichi = new ethers.providers.JsonRpcProvider(
        'https://api.taichi.network:10001/rpc/private',
        'mainnet',
      )

      const unstakeTx = await taichi.sendTransaction(signedTx)
      console.log(`  in https://taichi.network/tx/${unstakeTx.hash}`)
    } else {
      const unstakeTx = await signer.sendTransaction(populatedTx)
      console.log('  in', unstakeTx.hash)
    }

    console.log('Withdraw from crucible')

    const withdrawTx = await crucible.transferERC20(
      stakingToken.address,
      recipient,
      amount,
    )

    console.log('  in', withdrawTx?.hash)
  }
  */

export {};
