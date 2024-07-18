import { SVGProps } from "react";

export function ThreeDots(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={"menu-icon"}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.24962 8.94595C8.61109 8.94595 8.90413 8.63785 8.90413 8.25779C8.90413 7.87774 8.61109 7.56964 8.24962 7.56964C7.88814 7.56964 7.59511 7.87774 7.59511 8.25779C7.59511 8.63785 7.88814 8.94595 8.24962 8.94595Z"
        stroke="var(--text)"
        strokeWidth="1.3763"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.24962 4.12887C8.61109 4.12887 8.90413 3.82077 8.90413 3.44072C8.90413 3.06066 8.61109 2.75256 8.24962 2.75256C7.88814 2.75256 7.59511 3.06066 7.59511 3.44072C7.59511 3.82077 7.88814 4.12887 8.24962 4.12887Z"
        stroke="var(--text)"
        strokeWidth="1.3763"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.24962 13.763C8.61109 13.763 8.90413 13.4549 8.90413 13.0749C8.90413 12.6948 8.61109 12.3867 8.24962 12.3867C7.88814 12.3867 7.59511 12.6948 7.59511 13.0749C7.59511 13.4549 7.88814 13.763 8.24962 13.763Z"
        stroke="var(--text)"
        strokeWidth="1.3763"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
