import React, { useState, useContext } from "react";
import OperatePane from "./OperatePane";
import Web3Context from "../../../../../Web3Context";

const Operate: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const { wallet, crucibles, rewards } = useContext(Web3Context);

  if (!!errorMsg) {
    return <span>{errorMsg}</span>;
  } else {
    return (
      <OperatePane
        handleInputChange={(form) => {}}
        isConnected={!!wallet.provider}
        rewards={rewards}
        crucibles={crucibles}
      />
    );
  }
};

export default Operate;
