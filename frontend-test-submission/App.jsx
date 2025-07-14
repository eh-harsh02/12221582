import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import ShortenPage from "./ShortenPage";
import StatsPage from "./StatsPage";
import RedirectPage from "./RedirectPage";
import NavigationBar from "./NavigationBar";
import LoggerProvider from "../logging-middleware/LoggerProvider";

function App() {
  return (
    <LoggerProvider>
      <Router>
        <CssBaseline />
        <NavigationBar />
        <Container>
          <Routes>
            <Route path="/" element={<ShortenPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path=":short" element={<RedirectPage />} />
          </Routes>
        </Container>
      </Router>
    </LoggerProvider>
  );
}

export default App;