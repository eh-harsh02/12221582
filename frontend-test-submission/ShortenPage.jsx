import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Grid, Paper, Box } from "@mui/material";
import { useLogger } from "../logging-middleware/LoggerProvider";
import { logEvent } from "../logging-middleware/logger";

function ShortenPage() {
  const { log } = useLogger();
  const [entries, setEntries] = useState(
    Array(5).fill({ url: "", duration: "", code: "" })
  );
  const [output, setOutput] = useState([]);

  useEffect(() => {
    logEvent("frontend", "info", "page", "ShortenPage loaded");
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInput = (i, key, val) => {
    const copy = [...entries];
    copy[i][key] = val;
    setEntries(copy);
  };

  const generateShortUrls = () => {
    const requests = [];

    for (let i = 0; i < entries.length; i++) {
      const { url, duration, code } = entries[i];
      if (!url.trim()) continue;

      if (!isValidUrl(url)) {
        alert(`Entry ${i + 1} has an invalid URL.`);
        log("error", `Invalid URL at index ${i}`);
        logEvent("frontend", "warn", "component", `Invalid URL at index ${i}`);
        return;
      }

      if (duration && isNaN(+duration)) {
        alert(`Entry ${i + 1} has an invalid duration.`);
        log("error", `Invalid duration: ${duration}`);
        logEvent("frontend", "error", "component", `Invalid duration value: ${duration}`);
        return;
      }

      requests.push({
        url,
        duration: duration ? +duration : 30,
        code,
      });
    }

    const result = requests.map((req, idx) => {
      const sc = req.code || Math.random().toString(36).substring(2, 8 + idx);
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + req.duration * 60000);
      return {
        ...req,
        code: sc,
        shortLink: `http://localhost:3000/${sc}`,
        createdAt,
        expiresAt,
      };
    });

    setOutput(result);
    localStorage.setItem("shortened", JSON.stringify(result));
    log("info", `Created ${result.length} short URLs.`);
    logEvent("frontend", "info", "component", `Generated ${result.length} short URLs`);
  };

  return (
    <Box>
      <Typography variant="h4">Shorten Your URLs</Typography>
      {entries.map((item, i) => (
        <Paper key={i} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full URL"
                fullWidth
                value={item.url}
                onChange={(e) => handleInput(i, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Duration (min)"
                fullWidth
                value={item.duration}
                onChange={(e) => handleInput(i, "duration", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Custom Code"
                fullWidth
                value={item.code}
                onChange={(e) => handleInput(i, "code", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button variant="contained" onClick={generateShortUrls}>
        Generate Short Links
      </Button>

      <Box mt={4}>
        {output.map((item, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2 }}>
            <Typography><strong>Original:</strong> {item.url}</Typography>
            <Typography><strong>Short:</strong> <a href={item.shortLink}>{item.shortLink}</a></Typography>
            <Typography><strong>Expires:</strong> {item.expiresAt.toString()}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default ShortenPage;
