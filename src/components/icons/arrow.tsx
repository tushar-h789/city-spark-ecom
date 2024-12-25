import React from 'react';

interface RightArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const RightArrowIcon: React.FC<RightArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" // You can set a default size, or use props to allow customization
    height="24"
    viewBox="0 0 64 64" // This viewBox sets up the scale
    fill="currentColor"  // This allows the icon color to be easily customizable
    {...props} // Spread all other props to make it flexible
  >
    <g>
      <path
        d="M50.134 24.843l-10.504-10.004c-0.829-0.791-2.492-0.762-3.285 0.068-0.792 0.829-0.762 2.492 0.067 3.284L43.558 24H2c-1.046 0-2 0.954-2 2s0.954 2 2 2h41.557l-7.162 6.824c-0.829 0.792-0.859 2.455-0.067 3.284 0.793 0.831 2.457 0.858 3.285 0.068l10.504-10 .018-.019c0.833-0.818 0.808-2.522-.001-3.314z"
      />
    </g>
  </svg>
);

export default RightArrowIcon;

