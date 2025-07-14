import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLogger } from "../logging-middleware/LoggerProvider";
import { logEvent } from "../logging-middleware/logger";

function RedirectPage() {
  const { short } = useParams();
  const { log } = useLogger();

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("shortened") || "[]");
    const found = entries.find((e) => e.code === short);

    if (found) {
      log("info", `Redirecting to ${found.url}`);
      logEvent("frontend", "info", "middleware", `Redirecting to ${found.url} via ${short}`);
      window.location.href = found.url;
    } else {
      alert("Invalid or expired short link.");
      log("error", `No matching short code: ${short}`);
      logEvent("frontend", "error", "middleware", `Invalid or expired short code used: ${short}`);
    }
  }, [short]);

  return null;
}

export default RedirectPage;
