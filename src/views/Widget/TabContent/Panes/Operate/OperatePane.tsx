import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { Button } from "@chakra-ui/button";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  const { connectWallet } = useContext(Web3Context);

  const [amount2Withdraw, setAmount2Withdraw] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  const [crucibles, setCrucibles] = useState(
    [] as {
      id: string;
      balance: string;
    }[]
  );
  useEffect(() => {
    getOwnedCrucibles().then(setCrucibles);
  }, [isConnected]);

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    const name = ev.target.name;
    let value = ev.target.value;
    if (ev.target.type === "number")
      value =
        ev.target.value === ""
          ? ev.target.value
          : toMaxDecimalsRound(ev.target.value, +ev.target.step).toString();

    setFormValues((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    handleInputChange(formValues);
  }, [formValues, handleInputChange]);

  //todo
  const formatAmount2Withdraw = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let amount = ev.target.value;

    setAmount2Withdraw(amount);
  };

  //todo
  const withdraw = () => {
    setModalIsOpen(false);
  };

  // todo - restyle, check Mint/OperatePane
  return (
    <div>
      {/* <Modal
                title={"Withdraw"}
                isOpen={modalIsOpen}
                buttonText={"Withdraw"}
                onButtonClick={withdraw}
              >
                <div style={{ marginBottom: "2rem" }}>
                  Input the amount to withdraw
                </div>
                <div className="form-group">
                  <Input
                    value={amount2Withdraw}
                    name="balance"
                    type="number"
                    label="Amount "
                    onChange={formatAmount2Withdraw}
                  />
                </div>
              </Modal> */}
      {crucibles.map((crucible) => {
        return (
          <div className="crucible-item">
            <span className="crucible-attribute">
              <span className="crucible-label">Balance:</span>{" "}
              {crucible["balance"]}
            </span>
            <span className="crucible-attribute" style={{ flexGrow: 1 }}>
              <span className="crucible-label">ID:</span> {crucible["id"]}
            </span>
            <span className="">
              <Button
                colorScheme="primary"
                onClick={() => setModalIsOpen(true)}
              >
                Withdraw
              </Button>
            </span>
          </div>
        );
      })}
      {/* {crucibles.map(crucible=>
                <div
                key={crucible['id']}
                >
                <div className="form-group">
                <Input
                  disabled= {true}
                  value={crucible['id']}
                  name="id"
                  label="ID "
                  hint={
                    <>
                      ID of the NFT
                    </>
                  }
                />
              </div>
              <div className="form-group">
                <Input
                  disabled= {true}
                  value={crucible['balance']}
                  name="balance"
                  type= "number"
                  label="Amount "
                  hint={
                    <>
                      Amount of LP tokens on it
                    </>
                  }
                />
              </div>
              <hr></hr>
                </div>)
              } */}
      {isConnected ? (
        <></>
      ) : (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="green.300"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "green.400" }}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default OperatePane;
