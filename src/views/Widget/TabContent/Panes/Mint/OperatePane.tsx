import React, { useState, useEffect, useContext } from "react";
import ICONS from "../../../../../img/icons.svg";
import ActionButton from "../../../common/ActionButton";
import Input from "../../../common/Input";
import Notification from "../../../common/Notification";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { mintAndLock } from "../../../../../contracts/alchemist";
import { getTokenBalances } from "../../../../../contracts/getTokenBalances";
import { initOnboard } from "../../../../../walletServices";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  const { onboard, signer, provider, readyToTransact, monitorTx } = useContext(
    Web3Context
  );

  const [lpBalance, setLpBalance] = useState("");

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    const name = ev.target.name;
    let value = ev.target.value;
    if (ev.target.type === "number")
      value =
        ev.target.value === ""
          ? ev.target.value
          : toMaxDecimalsRound(ev.target.value, +ev.target.step).toString();

    setLpBalance(value);
  };

  useEffect(() => {
    handleInputChange({
      lpBalance
    });
  }, [lpBalance, handleInputChange]);

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__operate operate">
            <div className="operate__form">
              <Notification>
                <span>
                  First you will need to provide liquidity to the ⚗️/ETH pair on
                  Uniswap through{" "}
                  <a href="https://app.uniswap.org/#/add/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab/ETH">
                    this
                  </a>
                  .
                </span>
              </Notification>
              <div className="form-group">
                <Input
                  value={lpBalance}
                  onChange={onChange}
                  name="lpBalance"
                  label="LP Balance "
                  placeholder="0.0"
                  type="number"
                  actionText="MAX"
                  onActionTextClick={()=>getTokenBalances(signer).then(({lp})=>setLpBalance(lp))}
                  hint={<>How many LP tokens you want to stake</>}
                />
              </div>
              {isConnected ? (
                <ActionButton
                  text="Stake"
                  className="operate__button"
                  onClick={async () => {
                    await readyToTransact();
                    const hash: string = await mintAndLock(
                      signer,
                      provider,
                      lpBalance
                    );
                    monitorTx(hash);
                  }}
                />
              ) : (
                <ActionButton
                  text="Connect wallet"
                  className="operate__button"
                  type="secondary"
                  onClick={() => onboard.walletSelect()}
                />
              )}
              <div className="note--bottom">
                Ledger wallets on Metamask don't support the signature types
                required, so they won't work. See{" "}
                <a href="https://github.com/MetaMask/metamask-extension/issues/10240">
                  the github issue
                </a>{" "}
                for more info.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatePane;
