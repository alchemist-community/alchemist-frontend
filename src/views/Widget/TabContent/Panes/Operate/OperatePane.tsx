import React, { useState, useEffect, useContext } from "react";
import ICONS from "../../../../../img/icons.svg";
import ActionButton from "../../../common/ActionButton";
import Input from "../../../common/Input";
import Notification from "../../../common/Notification";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { unstakeAndClaim } from "../../../../../contracts/unstakeAndClaim";
import Modal from "../../../../Modal";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  const { connectWallet } = useContext(Web3Context);

  const [amount2Withdraw, setAmount2Withdraw] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCrucible, setSelectedCrucible] = useState('');

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
  const withdraw = async () => {
    await unstakeAndClaim(selectedCrucible, amount2Withdraw);
    setModalIsOpen(false);
  };

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__operate operate">
            <div className="operate__form">
              <Modal
                title={"Withdraw"}
                isOpen={modalIsOpen}
                buttonText={"Withdraw"}
                onButtonClick={withdraw}
                onCloseClick={() => setModalIsOpen(false)}
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
                    placeholder="0.0"
                    onChange={formatAmount2Withdraw}
                  />
                </div>
              </Modal>
              {crucibles.map((crucible) => {
                return (
                  <div className="crucible-item">
                    <span className="crucible-attribute">
                      <span className="crucible-label">Balance:</span>{" "}
                      {crucible["balance"]}
                    </span>
                    <span
                      className="crucible-attribute"
                      style={{ flexGrow: 1 }}
                    >
                      <span className="crucible-label">ID:</span>{" "}
                      {crucible["id"]}
                    </span>
                    <span className="">
                      <ActionButton
                        text="Withdraw"
                        type="primary"
                        className="crucible-withdraw"
                        buttonStyle={{
                          fontSize: "1rem",
                          padding: "0rem 1rem",
                          minWidth: "0rem",
                        }}
                        onClick={() => {
                          setSelectedCrucible(crucible['id'])
                          setModalIsOpen(true)
                        }}
                      />
                    </span>
                  </div>
                );
              })}
              {isConnected ? (
                <></>
              ) : (
                <ActionButton
                  text="Connect wallet"
                  className="operate__button"
                  type="secondary"
                  onClick={connectWallet}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatePane;
