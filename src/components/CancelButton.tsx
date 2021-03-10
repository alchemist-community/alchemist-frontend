import React from "react";

type CancelProps = {
  fill?: string;
  width?: string;
  height?: string;
  margin: object;
  handleClick: () => void;
};
const CancelButton = ({
  fill = "#000A28",
  width = "16px",
  height = "16px",
  margin = {},
  handleClick,
}: CancelProps) => (
  <button
    onClick={handleClick}
    style={{ border: "none", outline: "none", ...(Object.keys(margin).length && {...margin}) }}
    className="reset"
  >
    <svg
      style={{
        cursor: "pointerEvent",
        pointerEvents: "none",
      }}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
        fill={fill}
      />
    </svg>
  </button>
);

export default CancelButton;
