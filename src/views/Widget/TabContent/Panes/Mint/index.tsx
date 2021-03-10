import React, { useState, useContext } from "react";
import OperatePane from "./OperatePane";
import Web3Context from "../../../../../Web3Context";
import { convertToUint } from "../../../utils";
import BN from "bn.js";

const Operate: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const { web3, userAddress } = useContext(Web3Context);

  if (!!errorMsg) {
    return <span>{errorMsg}</span>;
  } else {
    return (
      <OperatePane
        handleInputChange={(form) => {}}
        isConnected={web3 !== null}
      />
    );
  }
};

export default Operate;
