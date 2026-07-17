import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 21c-2.11 0-3.5-1.5-3.5-3.5s1.39-3.5 3.5-3.5h7c2.11 0 3.5 1.5 3.5 3.5s-1.39 3.5-3.5 3.5h-7Z" />
    <path d="M9 14c0-1 .92-2 2.06-2.45" />
    <path d="M15.11 11.52c.86.33 1.39.73 1.39 1.48 0 .83-1.12 1.5-2.5 1.5-1.29 0-2.34-.6-2.48-1.34" />
    <path d="M11 6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .76-.43 1.4-1.05 1.6" />
    <path d="M15.5 6.5c1.1 0 2.5 1.5 2.5 3.5" />
    <path d="M8.5 6.5c-1.1 0-2.5 1.5-2.5 3.5" />
    <path d="M12 3v2" />
  </svg>
);


export const Icons = {
  google: (props: SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.58 2.03-4.66 2.03-3.87 0-6.99-3.1-6.99-7s3.12-7 6.99-7c2.16 0 3.63.89 4.49 1.68l2.52-2.34C18.16 3.01 15.61 2 12.48 2 7.1 2 3.01 6.02 3.01 11.25s4.09 9.25 9.47 9.25c2.82 0 5.12-1.04 6.9-2.73 1.83-1.73 2.73-4.22 2.73-6.81 0-.58-.05-1.15-.14-1.72H12.48z"
      />
    </svg>
  ),
};
