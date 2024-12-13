import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const ActiveLink = ({
  href,
  children,
  className,
  activeClassName,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  activeClassName?: string;
}) => {
  const router = useRouter();
  const elementRef = useRef(null);

  useEffect(() => {
    if (router.isReady && elementRef.current) {
      const element = elementRef.current as HTMLElement;
      if (router.asPath == href) {
        if (activeClassName) {
          element.classList.add(activeClassName);
        }
      } else {
        if (activeClassName) {
          element.classList.remove(activeClassName);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, elementRef]);

  return (
    <Link className={`${className}`} href={href} ref={elementRef}>
      {children}
    </Link>
  );
};

export default ActiveLink;
