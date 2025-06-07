import "./App.css";
import LandingPage from "./pages/LandingPage";
import SendMessagePage from "./pages/SendMessagePage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/send/:username" element={<SendMessagePage />} />
        <Route path="/*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;
