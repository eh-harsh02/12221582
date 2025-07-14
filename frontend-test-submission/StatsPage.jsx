import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useLogger } from "../logging-middleware/LoggerProvider";
import { logEvent } from "../logging-middleware/logger";

function StatsPage() {
  const { log } = useLogger();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("shortened") || "[]");
    setRecords(data);

    log("info", `StatsPage loaded with ${data.length} entries.`);
    logEvent("frontend", "info", "page", `StatsPage loaded with ${data.length} records`);
  }, []);

  return (
    <Box>
      <Typography variant="h4">URL Stats</Typography>
      {records.length === 0 ? (
        <Typography>No URL data found.</Typography>
      ) : (
        records.map((rec, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2 }}>
            <Typography><strong>Short URL:</strong> <a href={rec.shortLink}>{rec.shortLink}</a></Typography>
            <Typography><strong>Created At:</strong> {new Date(rec.createdAt).toString()}</Typography>
            <Typography><strong>Expires At:</strong> {new Date(rec.expiresAt).toString()}</Typography>
            <Typography><strong>Clicks:</strong> 0 (static)</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default StatsPage;
