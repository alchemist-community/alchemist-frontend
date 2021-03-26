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
      border-radius: 2rem;
      padding-right: 0.6rem;

      .bn-onboard-modal-content-close {
        svg {
          height: 14px;
          width: 14px;
        }
        :hover {
          background: unset;
        }
      }

      .bn-onboard-modal-select-wallets {
        flex-flow: unset;
        flex-direction: column;
        overflow: auto;
        height: 400px;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;

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
              border-color: inherit;

              :hover {
                border-color: #0072ff;
              }
            }

            & > span {
              font-size: 1.3rem;
              font-weight: 500;
              margin-left: 0;

              & > i {
                display: none;
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
