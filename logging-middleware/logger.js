
const LOGGING_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";


const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaHJhajAzODFAZ21haWwuY29tIiwiZXhwIjoxNzUyNDc0NTY0LCJpYXQiOjE3NTI0NzM2NjQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiZWExNWExZS04YmU5LTQ5Y2QtYTg0MS1mZjkxNzA0ZjcxYjgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoYXJzaCByYWoiLCJzdWIiOiJkMDRjMzk1NC1kNmEyLTQyN2ItODQxNy01YTUwZGY4OWRjZDkifSwiZW1haWwiOiJoYXJzaHJhajAzODFAZ21haWwuY29tIiwibmFtZSI6ImhhcnNoIHJhaiIsInJvbGxObyI6IjEyMjIxNTgyIiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiZDA0YzM5NTQtZDZhMi00MjdiLTg0MTctNWE1MGRmODlkY2Q5IiwiY2xpZW50U2VjcmV0IjoiV2tmeXhocWNaa3BObmRiSCJ9.oFe3HscIvq4xMHDlEDHed0TrV1qJTDlZFFUc6GZ9Loo";


/**
 * Send a structured log message to the remote evaluation log server.
 *
 * @param {'frontend'} stack - The application stack (frontend only).
 * @param {'debug' | 'info' | 'warn' | 'error' | 'fatal'} level - Severity level.
 * @param {'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils'} packageName - Logical package origin.
 * @param {string} message - Descriptive log message.
 */
export async function logEvent(stack, level, packageName, message) {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message: message.trim(),
  };

  try {
    const response = await fetch(LOGGING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`[Logger] Failed to send log: ${response.statusText}`);
    } else {
      const { logID } = await response.json();
      console.debug(`[Logger] Log recorded successfully with ID: ${logID}`);
    }
  } catch (error) {
    console.error("[Logger] Network or server error:", error.message);
  }
}
