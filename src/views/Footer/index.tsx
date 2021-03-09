import React from "react";
import Modal from "../Modal";
import modalData from "./modal-data";

export default function Footer() {
  const [dialogId, setDialogId] = React.useState<string>("");

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute("data-id") ?? "";
    setDialogId(id);
  };

  const handleClose = () => {
    setDialogId("");
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__row row align-end justify-between">
            <div className="footer__left">
              <div className="footer__site">
                <span>alchemist.farm</span>
                <br />
                Searching for the philosopher's stone
              </div>
            </div>
            <nav className="footer__right">
              <ul className="footer__menu menu">
                <li className="menu__item">
                  <a
                    data-id="code"
                    rel="noopener noreferrer"
                    href="https://github.com/alchemistcoin/alchemist"
                    target="_blank"
                    className="menu__link"
                  >
                    Code
                  </a>
                </li>
                <li className="menu__item">
                  <a
                    data-id="docs"
                    rel="noopener noreferrer"
                    href="https://discord.alchemist.wtf"
                    target="_blank"
                    className="menu__link"
                  >
                    Discord
                  </a>
                </li>
                <li className="menu__item">
                  <a
                    data-id="docs"
                    rel="noopener noreferrer"
                    href="https://hackmd.io/@thegostep/BJ40PSVQd"
                    target="_blank"
                    className="menu__link"
                  >
                    FAQ
                  </a>
                </li>
                <li className="menu__item">
                  <a
                    data-id="docs"
                    rel="noopener noreferrer"
                    href="https://cast.alchemist.wtf"
                    target="_blank"
                    className="menu__link"
                  >
                    Governance
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
      <Modal
        title={modalData[dialogId]?.title}
        isOpen={!!dialogId}
        buttonText={modalData[dialogId]?.buttonText}
        onButtonClick={handleClose}
      >
        {modalData[dialogId]?.content}
      </Modal>
    </>
  );
}
