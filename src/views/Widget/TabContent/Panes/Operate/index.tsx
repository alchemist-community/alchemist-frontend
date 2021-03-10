import React, { useState, useContext, useEffect } from "react";
import OperatePane from "./OperatePane";
import Web3Context from "../../../../../Web3Context";

const Operate: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const { wallet, address } = useContext(Web3Context);

  if (!!errorMsg) {
    return <span>{errorMsg}</span>;
  } else {
    return (
      <OperatePane
        handleInputChange={(form) => {}}
        isConnected={!!wallet.provider}
      />
    );
  }
};

export default Operate;
