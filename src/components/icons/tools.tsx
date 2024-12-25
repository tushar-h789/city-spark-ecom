import { SVGProps } from "react";

interface ToolsIconProps extends SVGProps<SVGSVGElement> {}

const ToolsIcon: React.FC<ToolsIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 64 64"
    {...props}
  >
    <path
      d="M54.77 56H39.23A4.24 4.24 0 0 1 35 51.77v-3.49a4.24 4.24 0 0 1 4.23-4.23h15.54A4.24 4.24 0 0 1 59 48.28v3.49A4.24 4.24 0 0 1 54.77 56zM39.23 46A2.23 2.23 0 0 0 37 48.28v3.49A2.23 2.23 0 0 0 39.23 54h15.54A2.23 2.23 0 0 0 57 51.77v-3.49a2.23 2.23 0 0 0-2.23-2.23zm12.82-18H31.56A3.57 3.57 0 0 1 28 24.44V11.56A3.57 3.57 0 0 1 31.56 8h20.49a10 10 0 0 1 0 20zM31.56 10A1.56 1.56 0 0 0 30 11.56v12.88A1.56 1.56 0 0 0 31.56 26h20.49a8 8 0 0 0 0-16z"
      data-original="#000000"
    />
    <path
      d="m30 26.32-9-1.83v-13l9-1.83zm-7-3.46 5 1V12.07l-5 1z"
      data-original="#000000"
    />
    <path
      d="M23 23h-2.28A4.73 4.73 0 0 1 16 18.25v-.55a4.72 4.72 0 0 1 4.72-4.7H23zm-2.28-8A2.72 2.72 0 0 0 18 17.7v.55A2.73 2.73 0 0 0 20.72 21H21v-6z"
      data-original="#000000"
    />
    <path
      d="M16.83 19H3a1 1 0 0 1 0-2h13.83a1 1 0 0 1 0 2zM33 12h6v2h-6zm0 4h6v2h-6zm23.25 30h-13l-4.5-20h13zM44.8 44h9l-3.6-16h-9z"
      data-original="#000000"
    />
    <path
      d="M43.25 37H36.5a2.5 2.5 0 0 1-2.5-2.5v-.34a2.56 2.56 0 0 1 1.45-2.27 1.08 1.08 0 0 0 .24-.18A1 1 0 0 0 36 31v-5h4.8zM38 28v3a3 3 0 0 1-.89 2.13 2.86 2.86 0 0 1-.73.53c-.09.05-.38.22-.38.5v.34a.51.51 0 0 0 .5.5h4.25l-1.55-7z"
      data-original="#000000"
    />
  </svg>
);
export default ToolsIcon;
