import "../styles/SendMessagePage.css";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import checkedIcon from "../assets/checked.png";

function SendMessagePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessageSentWindow, setShowMessageSentWindow] = useState(false);

  const sendMessageHandler = async () => {
    if (username === "" || message === "") {
      return;
    }
    setLoading(true);
    const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/sendMessage";
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const dataToSend = {
        username: username,
        content: message,
      };
      const response = await axios.post(url, dataToSend, config);
      if (response.status != 201) {
        const data = await response.data;
        throw new Error(data.message);
      } else {
        setMessage("");
        setShowMessageSentWindow(true);
      }
    } catch (error) {
      console.error(`Error occurred in signing up. ERROR_DETAILS: ${error}`);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="SendMessagePage">
        {showMessageSentWindow ? (
          <div className="messageSentDiv">
            <img width="65rem" src={checkedIcon} alt="checked tick icon" />
            <p>Sent!</p>
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Get your own messages!
            </button>
            <p
              id="sendAnotherMsgLink"
              onClick={() => {
                setShowMessageSentWindow(false);
              }}
            >
              Send another message
            </p>
          </div>
        ) : (
          <div className="sendMessageBox">
            <div className="sendMessageHeading">
              @{username}
              <br />
              send me anonymous messages!
            </div>
            <div className="sendMessageBody">
              <textarea
                type="text"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                placeholder="enter your message"
                value={message}
              />
            </div>
            <button onClick={sendMessageHandler} disabled={loading}>
              {loading ? "Sending..." : "Send!"}
            </button>

            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Get your own messages!
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SendMessagePage;
