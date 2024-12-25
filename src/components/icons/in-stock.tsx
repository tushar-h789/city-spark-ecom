import React from "react";

interface InStockIconProps extends React.SVGProps<SVGSVGElement> {}

const InStockIcon: React.FC<InStockIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 24 24"
    {...props}
  >
    <g data-name="Layer 2">
      <path
        d="M19.75 11.65V4A1.76 1.76 0 0 0 18 2.25H4A1.76 1.76 0 0 0 2.25 4v14A1.76 1.76 0 0 0 4 19.75h7.65a5.74 5.74 0 1 0 8.1-8.1Zm-11-7.9h4.5V8a.25.25 0 0 1-.25.25H9A.25.25 0 0 1 8.75 8ZM4 18.25a.25.25 0 0 1-.25-.25V4A.25.25 0 0 1 4 3.75h3.25V8A1.76 1.76 0 0 0 9 9.75h4A1.76 1.76 0 0 0 14.75 8V3.75H18a.25.25 0 0 1 .25.25v6.71a5.62 5.62 0 0 0-2.25-.46A5.76 5.76 0 0 0 10.25 16a5.62 5.62 0 0 0 .46 2.25Zm12 2a4.23 4.23 0 0 1-3.38-1.7 5.69 5.69 0 0 1-.33-.52l-.07-.13a4.58 4.58 0 0 1-.2-.46l-.11-.33c0-.12-.06-.23-.08-.35a3.84 3.84 0 0 1-.08-.76A4.26 4.26 0 0 1 16 11.75a3.84 3.84 0 0 1 .76.08l.34.08.34.11a3.07 3.07 0 0 1 .45.2l.14.07a5.69 5.69 0 0 1 .52.33A4.24 4.24 0 0 1 16 20.25Z"
        data-original="#000000"
      />
      <path
        d="m17 14.47-1.5 1.47-.5-.47a.75.75 0 1 0-1 1.06l1 1a.75.75 0 0 0 1.06 0l2-2A.75.75 0 0 0 17 14.47Z"
        data-original="#000000"
      />
    </g>
  </svg>
);

export default InStockIcon;
