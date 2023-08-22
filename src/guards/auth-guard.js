import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks/use-auth";

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);
  const isAuthenticated = useAuth();

  useEffect(() => {
    console.log("isAuthenticateddddddddddddddddddddd");
    console.log(isAuthenticated.stateData.isAuthinticate);
    if (!router.isReady) {
      return;
    }

    if (ignore.current) {
      return;
    }

    ignore.current = true;

    if (!isAuthenticated.stateData.isAuthinticate) {
      console.log("Not authenticated, redirecting");
      router
        .replace({
          pathname: "/auth/login",
          query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } else {
      setChecked(true);
    }
  }, [router.isReady, isAuthenticated]);

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};