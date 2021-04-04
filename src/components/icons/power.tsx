import React, { ReactElement } from "react";

const Power = ({ ...props }: React.SVGProps<SVGSVGElement>): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M24 12C24 5.38323 18.6168 0 12 0C5.38323 0 0 5.38323 0 12C0 18.6163 5.38323 24 12 24C18.6173 24 24 18.6173 24 12ZM13.1784 11.9816C13.1784 12.611 12.6685 13.12 12.0401 13.12C11.4113 13.12 10.9013 12.61 10.9013 11.9816V6.05897C10.9013 5.43011 11.4113 4.92016 12.0401 4.92016C12.669 4.92016 13.1784 5.42963 13.1784 6.05897V11.9816ZM19.7488 12.0198C19.7488 16.2923 16.2729 19.7677 12 19.7677C7.72706 19.7677 4.25119 16.2923 4.25119 12.0198C4.25119 9.9486 5.05792 8.00161 6.52348 6.53847C6.74583 6.31612 7.03682 6.20543 7.32829 6.20543C7.61975 6.20543 7.91171 6.3166 8.13405 6.53943C8.57875 6.98461 8.57826 7.70531 8.13309 8.15C7.09917 9.18344 6.52928 10.5576 6.52928 12.0198C6.52928 15.036 8.98332 17.4891 12 17.4891C15.0167 17.4891 17.4702 15.036 17.4702 12.0198C17.4702 10.5586 16.9018 9.18489 15.8688 8.15145C15.4242 7.70628 15.4246 6.98558 15.8693 6.5404C16.3145 6.09522 17.0352 6.09619 17.4804 6.54088C18.9426 8.00451 19.7488 9.95054 19.7488 12.0198V12.0198Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Power;
