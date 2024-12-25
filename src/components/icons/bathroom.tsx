import React from "react";

interface BathroomIconProps extends React.SVGProps<SVGSVGElement> {}

const BathroomIcon: React.FC<BathroomIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 42 60"
    {...props}
  >
    <path
      d="M21 33c-5.78 0-12 1.408-12 4.5S15.22 42 21 42s12-1.408 12-4.5S26.78 33 21 33zm0 7c-6.6 0-10-1.752-10-2.5S14.4 35 21 35s10 1.752 10 2.5S27.6 40 21 40z"
      data-original="#000000"
    />
    <path
      d="M5 32h1.753C3.792 33.582 2 35.671 2 38c0 5.578 3.412 10.492 8.566 13.357l-.323 4.348A4 4 0 0 0 14.23 60h13.54a4 4 0 0 0 3.987-4.294l-.323-4.349C36.588 48.492 40 43.578 40 38c0-2.329-1.792-4.418-4.753-6H37a5.006 5.006 0 0 0 5-5V8a5.006 5.006 0 0 0-5-5h-6.508A15.755 15.755 0 0 0 21 0c-3.405-.052-6.735 1-9.492 3H5a5.006 5.006 0 0 0-5 5v19a5.006 5.006 0 0 0 5 5zm24.763 23.854A2 2 0 0 1 27.77 58H14.23a2 2 0 0 1-1.993-2.146l.263-3.564a21.971 21.971 0 0 0 17 0zM21 52c-7.221 0-13.389-3.734-15.849-8.975C8.525 45.438 14.305 47 21 47s12.475-1.562 15.849-3.975C34.389 48.266 28.221 52 21 52zm17-14c0 3.38-6.831 7-17 7S4 41.38 4 38s6.831-7 17-7c5.205 0 17 1.877 17 7zm2-30v19a3 3 0 0 1-3 3h-2.127c.248-.541.482-1.091.686-1.655A24 24 0 0 0 37 20.04C37 12.663 35.138 7.971 32.607 5H37a3 3 0 0 1 3 3zm-5 12.04a22 22 0 0 1-1.32 7.62 19.388 19.388 0 0 1-1.441 3.049A35.142 35.142 0 0 0 21 29a35.117 35.117 0 0 0-11.235 1.708 18.977 18.977 0 0 1-1.447-3.053A21.993 21.993 0 0 1 7 20.04C7 8.575 12.1 2 21 2s14 6.575 14 18.04zM2 8a3 3 0 0 1 3-3h4.393C6.862 7.971 5 12.663 5 20.04c-.014 2.83.474 5.64 1.439 8.3.207.571.454 1.117.7 1.66H5a3 3 0 0 1-3-3z"
      data-original="#000000"
    />
    <path
      d="M10 21.04a1 1 0 0 0 1-1C11 10.724 14.364 6 21 6a1 1 0 0 0 0-2C13.262 4 9 9.7 9 20.04a1 1 0 0 0 1 1z"
      data-original="#000000"
    />
  </svg>
);
export default BathroomIcon;
