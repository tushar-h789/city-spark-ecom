import * as React from "react";

interface ElectricalIconProps extends React.SVGProps<SVGSVGElement> {}

const ElectricalIcon: React.FC<ElectricalIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 480.003 480.003"
    {...props}
  >
    <path
      d="M395.203 359.907c8.441-9.466 8.059-23.866-.872-32.872l-23.72-23.72c31.763-41.387 27.98-99.895-8.848-136.848L259.315 64.003l2.064-2.064c14.169-14.169 14.169-37.143 0-51.312-14.169-14.169-37.143-14.169-51.312 0l-42.064 42.064-45.376-45.376c-9.751-9.751-25.561-9.751-35.312 0-9.751 9.751-9.751 25.561 0 35.312l45.376 45.376-44.688 44.688-45.376-45.376c-9.751-9.751-25.561-9.751-35.312 0-9.751 9.751-9.751 25.561 0 35.312l45.376 45.376-42.064 42.064c-14.169 14.169-14.169 37.143 0 51.312 14.169 14.169 37.143 14.169 51.312 0l2.064-2.064 102.464 102.464c36.922 36.896 95.483 40.683 136.848 8.848l23.72 23.72c8.973 9.006 23.434 9.39 32.872.872l84.784 84.784h35.312v-35.312l-84.8-84.784zM98.627 31.315a8.971 8.971 0 0 1 0-12.688 8.971 8.971 0 0 1 12.688 0l45.376 45.376-12.688 12.688-45.376-45.376zm-80 80a8.971 8.971 0 0 1 0-12.688 8.971 8.971 0 0 1 12.688 0l45.376 45.376-12.688 12.688-45.376-45.376zm34.064 136.688-2.064 2.064c-8.047 7.797-20.891 7.595-28.688-.452-7.624-7.868-7.624-20.368 0-28.236l42.064-42.064 35.312-35.312 44.688-44.688 35.312-35.312 42.064-42.064c8.047-7.797 20.891-7.595 28.688.452 7.624 7.868 7.624 20.368 0 28.236l-2.064 2.064L52.691 248.003zm249.544 102.464c-34.39 34.312-90.066 34.312-124.456 0L75.315 248.003 248.003 75.315l102.464 102.464c34.312 34.39 34.312 90.065 0 124.456l-48.232 48.232zm47.424 32.568a8 8 0 0 1-11.312 0l-23.032-23.032 44.688-44.688 23.032 23.032a8 8 0 0 1 0 11.312l-33.376 33.376zm114.344 80.968h-12.688l-80-80 12.688-12.688 80 80v12.688z"
      data-original="#000000"
    />
    <path
      d="m295.859 294.523-24-128a8 8 0 0 0-13.512-4.176l-23.424 23.424-11.496-28.736a8 8 0 0 0-5.824-4.864 7.906 7.906 0 0 0-7.264 2.176l-40 40a8.001 8.001 0 0 0-1.776 8.624l32 80a8 8 0 0 0 13.088 2.688l26.352-26.344 42.344 42.344a8 8 0 0 0 13.512-7.136zm-50.2-52.176a8 8 0 0 0-11.312 0l-23.424 23.424-25.528-63.832 27.688-27.696 11.496 28.736a8 8 0 0 0 13.088 2.688l21.272-21.272 16.448 87.672-29.728-29.72z"
      data-original="#000000"
    />
  </svg>
);
export default ElectricalIcon;
