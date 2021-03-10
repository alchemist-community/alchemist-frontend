import React from "react";
import UserAddress from "../UserAddress";
import LOGO from "../../img/alembic.png";
import UserWallet from "../UserWallet";
import Web3Context from "../../Web3Context";

const Header: React.FC = () => {
  const { address } = React.useContext(Web3Context);
  return (
    <header className={"header header--short"}>
      <div className={"container"}>
        <div className={`${"header__row"} ${"row"} ${"justify-between"}`}>
          <div className={"header__left"}>
            <a href="/" className={"logo"}>
              <img className={"logo__img"} src={LOGO} width="70" alt="" />
            </a>
          </div>
          <div className={"header__right column"}>
            <UserAddress />
            {address !== null ? <UserWallet /> : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
