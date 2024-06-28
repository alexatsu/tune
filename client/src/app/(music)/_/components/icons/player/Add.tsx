import { SVGProps } from "react";

export function Add(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.31589 10.3718C1.46543 7.58016 2.46014 4.10933 5.24769 3.16599C6.71398 2.66849 8.52347 3.08349 9.55146 4.57433C10.5208 3.02849 12.3826 2.67183 13.8473 3.16599C16.6341 4.10933 17.6343 7.58016 16.7847 10.3718C15.461 14.7968 10.8426 17.1018 9.55146 17.1018C8.26112 17.1018 3.6839 14.8485 2.31589 10.3718Z"
        stroke="#ECECEC"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5139 6.30322C13.4706 6.40656 14.069 7.20406 14.0333 8.32156"
        stroke="#ECECEC"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
