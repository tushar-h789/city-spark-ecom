import React from 'react';

interface LeftArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const LeftArrowIcon: React.FC<LeftArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"  // Default size for the icon
    height="24" // Default size for the icon
    viewBox="0 0 64 64" // Ensures proper scaling
    fill="currentColor" // Inherit the current text color, customizable
    {...props} // Spread the remaining props to enable customization
  >
    <g>
      <path
        d="M60 30H8.83l8.58-8.59a2 2 0 0 0-2.82-2.82l-12 12a2.06 2.06 0 0 0-.59 1.8 2.16 2.16 0 0 0 .55 1l12 12a2 2 0 1 0 2.82-2.82L8.83 34H60a2 2 0 0 0 0-4z"
      />
    </g>
  </svg>
);

export default LeftArrowIcon;
