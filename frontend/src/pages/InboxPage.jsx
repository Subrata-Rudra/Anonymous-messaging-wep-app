import "../styles/InboxPage.css";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";
import closeButtonIcon from "../assets/close.png";
import rightArrowIcon from "../assets/right-arrow.png";

function InboxPage() {
  const [user, setUser] = useState(null);
  const [allMessages, setAllMessages] = useState(null);
  const [showMessageDetailBox, setShowMessageDetailBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const messageBoxContainerRef = useRef(null);
  const msgDetailBoxRef = useRef(null);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("BenamiUserInfo"));
    setUser(userDetails);
  }, []);

  const openMsgHandler = (messageContent) => {
    setShowMessageDetailBox(true);
    setSelectedMessage(messageContent);
  };

  const timeAgo = (time, isRealtime) => {
    let seconds = Math.max(0, Math.floor((new Date() - new Date(time)) / 1000));
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const getAllMessages = useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/getAllMessages";
      const response = await axios.get(url, config);
      setAllMessages(response.data.allMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getNewRealtimeMessages = () => {
    const url =
      import.meta.env.VITE_BACKEND_SERVER_URL + "/getRealtimeMessages";
    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        setAllMessages((prevMessages) => [
          {
            content: newMessage.message,
            createdAt: newMessage.createdAt,
            _id: newMessage._id || Date.now(), // use a unique fallback
          },
          ...prevMessages,
        ]);
      } catch (error) {
        console.error("Failed to parse new message. ERROR_DETAILS: " + error);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE error", error);
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };
  };

  useEffect(() => {
    if (!user || !user.accessToken) {
      return;
    }
    getAllMessages();
    getNewRealtimeMessages();
  }, [user]);

  return (
    <>
      <div className="container">
        {loading && (
          <div id="loaderIcon" className="invisible">
            <div id="loaderContainer">
              <div className="loader"></div>
            </div>
          </div>
        )}
        {!showMessageDetailBox && allMessages && allMessages.length > 0 ? (
          <div className="messageBoxContainer" ref={messageBoxContainerRef}>
            {allMessages.map((message, i) => (
              <div
                className="messageBox"
                onClick={() => openMsgHandler(message.content)}
                key={message._id || i}
              >
                <div className="messageText">
                  {message.content.length > 30
                    ? message.content.substring(0, 30) + "..."
                    : message.content}
                </div>{" "}
                <div className="messageTime">
                  {timeAgo(message.createdAt, false)}
                </div>
                <img
                  width="15rem"
                  src={rightArrowIcon}
                  alt="right arrow icon"
                />
              </div>
            ))}
          </div>
        ) : (
          <>{!showMessageDetailBox && !loading && <p>No messages yet.</p>}</>
        )}
        {showMessageDetailBox && (
          <>
            <div className="msgDetailBox" ref={msgDetailBoxRef}>
              <div className="backButtonDiv">
                <button
                  id="backBtn"
                  onClick={() => setShowMessageDetailBox(false)}
                >
                  <img
                    width="15rem"
                    src={closeButtonIcon}
                    alt="back button icon"
                  />
                </button>
              </div>
              <p id="msgBoxHeading">send me anonymous messages!</p>
              <p id="msgBoxContent">{selectedMessage}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default InboxPage;
