import { SVGProps } from "react";

interface FacebookIconProps extends SVGProps<SVGSVGElement> {}

const FacebookIcon: React.FC<FacebookIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    {...props}
  >
    <path
      fill="#039be5"
      d="M12 0C5.373 0 0 5.373 0 12c0 5.989 4.388 10.952 10.125 11.854V15.47H7.078v-3.47h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.952 24 17.989 24 12c0-6.627-5.373-12-12-12z"
    />
  </svg>
);
export default FacebookIcon;
