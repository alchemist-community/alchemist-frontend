import { css } from "@emotion/react";

export const GlobalStyles = css`
  /*
  This will hide the focus indicator if the element receives focus via the mouse,
  but it will still show up on keyboard focus.
*/
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }

  // Styles for onboard wallet modal
  .bn-onboard-custom.bn-onboard-modal {
    padding: 0 1.5rem;
    font-family: Poppins;
    .bn-onboard-modal-content.bn-onboard-dark-mode {
      background: #192e54;
      width: 100%;
      max-width: 480px;
      border-radius: 3rem;
      @media (min-width: 480px) {
      }
      padding-right: 0.8em;

      .bn-onboard-modal-content-close {
        :hover {
          background: unset;
        }
      }

      .bn-onboard-modal-select-wallets {
        flex-flow: unset;
        flex-direction: column;
        overflow: auto;
        height: 400px;
        margin-top: 1.25em;
        margin-bottom: 0;

        & > li {
          width: 100%;
          padding-right: 0.8em;
          & > button {
            height: 70px;
            width: inherit;
            justify-content: space-between;
            flex-direction: row-reverse;
            border-radius: 1rem;
            border: 1px solid #304370;

            :hover {
              border-color: #0072ff;
              background: inherit;
            }
            &.bn-onboard-selected-wallet {
              background: inherit;
              border-color: #c45df4;
            }

            & > span {
              font-size: 1.3rem;
              font-weight: 400;
              margin-left: 0;

              & > i {
                margin-right: 8px;
              }
            }

            & > div {
              height: 30px;
              width: 30px;
            }
          }
        }
      }

      .bn-onboard-modal-content-header,
      .bn-onboard-select-description,
      .bn-onboard-select-wallet-info,
      .bn-onboard-prepare-button {
        display: none;
      }
    }
  }
`;
