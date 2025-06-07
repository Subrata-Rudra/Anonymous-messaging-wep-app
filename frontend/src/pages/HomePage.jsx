import "../styles/HomePage.css";
import envelopeIcon from "../assets/envelope.png";
import appleIcon from "../assets/apple.png";
import facebookIcon from "../assets/facebook.png";
import twitterIcon from "../assets/twitter.png";
import { useState, useEffect } from "react";

function HomePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("BenamiUserInfo"));
    setUsername(userDetails.username);
    setUser(userDetails);
  }, []);

  const currentHost = window.location.origin;
  const roomLink = `${currentHost.substring(7)}/send/${username}`;

  const coplyLinkHandler = () => {
    navigator.clipboard.writeText(roomLink);
  };

  if (!username) return null;

  return (
    <>
      <div className="homePageContainer">
        <div className="homePageCard">
          <img width="38rem" src={envelopeIcon} alt="envelope icon" />
          <p>send me anonymous messages!</p>
        </div>
        <p>Share the link on:</p>
        <div className="shareBox">
          <a
            href={"https://wa.me/?text=Send me secret messages! " + roomLink}
            target="_blank"
          >
            <img width="30rem" src={appleIcon} alt="envelope icon" />
          </a>
          <a
            href={"https://www.facebook.com/sharer.php?u=" + roomLink}
            target="_blank"
          >
            <img width="30rem" src={facebookIcon} alt="envelope icon" />
          </a>
          <a
            href={
              "https://x.com/intent/tweet?text=Send me secret messages! " +
              roomLink +
              "&hashtags=benami"
            }
            target="_blank"
          >
            <img width="30rem" src={twitterIcon} alt="envelope icon" />
          </a>
        </div>
        <div className="copyLinkDiv">
          <p id="copyHelpText">Copy your link</p>
          <input type="text" id="copy" defaultValue={roomLink} />
          <button id="copyBtn" onClick={coplyLinkHandler}>
            Copy link
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
