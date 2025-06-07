import "../styles/LandingPage.css";
import HomePage from "./HomePage";
import InboxPage from "./InboxPage";
import SettingsPage from "./SettingsPage";
import SignUpPage from "./SignUpPage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("BenamiUserInfo"));
    if (!user) {
      navigate("/");
    } else {
      setUser(user);
      if (location.pathname === "/") {
        navigate("/home");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="title" content="Home" />
        <meta
          name="decription"
          content="Get to know what others think about you by receiving anonymous messages from others."
        />
        <meta
          name="keywords"
          content="anonymous, messaging, anonymous-messaging-app"
        />
      </Helmet>
      <div className="LandingPage">
        {user ? (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<SignUpPage />} />
          </Routes>
        )}
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
