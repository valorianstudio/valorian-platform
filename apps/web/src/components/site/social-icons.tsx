import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export const LinkedinIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13c0-1.7 1-2.5 2.2-2.5S16 11.3 16 13v3" />
  </Icon>
);
export const GithubIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.2a2.8 2.8 0 0 0-.8-2.2c2.700-.3 5.500-1.300 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.300 4.300 0 0 0-.1-3.200s-1-.3-3.300 1.300a11.400 11.400 0 0 0-6 0C6.700 2.900 5.700 3.200 5.700 3.200a4.300 4.300 0 0 0-.1 3.200A4.600 4.600 0 0 0 4.300 9.600c0 4.600 2.800 5.700 5.500 6A2.800 2.800 0 0 0 9 17.800V21" />
  </Icon>
);
export const TwitterIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 4l16 16M20 4L4 20" />
  </Icon>
);
export const FacebookIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14 8h2.500V4.500H14A3.500 3.500 0 0 0 10.500 8v2H8v3.500h2.500V21H14v-7.500h2.500L17 10h-3V8.500c0-.3.200-.5.500-.5Z" />
  </Icon>
);
export const InstagramIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.500 6.500v.01" />
  </Icon>
);
