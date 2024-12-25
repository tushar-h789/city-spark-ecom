import React from "react";

interface ChecklistAddIconProps extends React.SVGProps<SVGSVGElement> {}

const ChecklistAddIcon: React.FC<ChecklistAddIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      d="M3.926 24.185a4.858 4.858 0 0 0 4.851 4.852h9.188a1 1 0 1 0 0-2H8.777a2.855 2.855 0 0 1-2.851-2.852V6.852A2.855 2.855 0 0 1 8.777 4H22.26a2.855 2.855 0 0 1 2.852 2.852V19.89a.997.997 0 0 0 1 1 1 1 0 0 0 1-1V6.852A4.858 4.858 0 0 0 22.26 2H8.777a4.858 4.858 0 0 0-4.851 4.852z"
      data-original="#000000"
    />
    <path
      d="M21.296 14.519h-7.703a1 1 0 1 0 0 2h7.703a1 1 0 1 0 0-2zm0-4.815h-7.703a1 1 0 1 0 0 2h7.703a1 1 0 1 0 0-2zm0 9.629h-7.703a1 1 0 1 0 0 2h7.703a1 1 0 1 0 0-2zM9.76 9.704h-.009c-.552 0-.995.447-.995 1s.453 1 1.005 1a1 1 0 1 0 0-2zm0 4.815h-.009c-.552 0-.995.447-.995 1s.453 1 1.005 1a1 1 0 1 0 0-2zm0 4.814h-.009c-.552 0-.995.448-.995 1s.453 1 1.005 1a1 1 0 1 0 0-2zm13.701 3.207a.992.992 0 0 0-.275.682v1.89h-1.89a.991.991 0 0 0-.68.274.996.996 0 0 0-.32.725 1 1 0 0 0 1 1h1.89V29a1 1 0 1 0 2 0v-1.889h1.888a1 1 0 1 0 0-2h-1.888v-1.889a.995.995 0 0 0-1.724-.682z"
      data-original="#000000"
    />
  </svg>
);

export default ChecklistAddIcon;
