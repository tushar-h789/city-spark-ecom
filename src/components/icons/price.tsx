import React from "react";

interface PriceIconProps extends React.SVGProps<SVGSVGElement> {}

const PriceIcon: React.FC<PriceIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 682.667 682.667"
    {...props}
  >
    <defs>
      <clipPath id="b" clipPathUnits="userSpaceOnUse">
        <path d="M0 512h512V0H0Z" data-original="#000000" />
      </clipPath>
    </defs>
    <mask id="a">
      <rect width="100%" height="100%" fill="#fff" data-original="#ffffff" />
    </mask>
    <g mask="url(#a)">
      <g
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={40}
        clipPath="url(#b)"
        transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
      >
        <path
          d="m0 0 97.625 96.193a60.004 60.004 0 0 1 17.284 48.527l-17.11 167.963L-70.6 329.798a59.997 59.997 0 0 1-48.529-17.302l-171.216-170.649c-23.391-23.431-23.383-61.38.018-84.8l131.348-131.456C-135.559-97.85-97.57-98.42-74.129-75"
          data-original="#000000"
          style={{
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(327.883 112)"
        />
        <path
          d="M0 0s136.262 7.169 136.204 108.325v.797c0 15.397-12.482 27.878-27.878 27.878 0 0-72.122-6-91.082-57"
          data-original="#000000"
          style={{
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(355.796 355)"
        />
        <path
          d="m0 0 79.283-79.592"
          data-original="#000000"
          style={{
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(134 216.592)"
        />
        <path
          d="m0 0 47.192-47.376"
          data-original="#000000"
          style={{
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(200.069 267.758)"
        />
        <path
          d="m0 0-23.321 23.412c-13.762 13.817-35.747 13.993-49.531.156-20.89-20.971-29.49-40.975-43.852-55.393-32.599-32.726-60.202-23.966-69.408-14.723"
          data-original="#000000"
          style={{
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(322 263.14)"
        />
      </g>
    </g>
  </svg>
);

export default PriceIcon;
