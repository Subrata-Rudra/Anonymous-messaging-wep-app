import "../styles/SignUpPage.css";
import backButtonIcon from "../assets/back.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpPage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameVal, setUsernameVal] = useState("");

  const submitHandler = async () => {
    if (usernameVal === "") {
      return;
    }
    setLoading(true);
    const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/createUser";
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const dataToSend = {
        username: usernameVal,
      };
      const response = await axios.post(url, dataToSend, config);
      if (response.status == 201) {
        const data = await response.data;
        localStorage.setItem("BenamiUserInfo", JSON.stringify(data));
        navigate("/home");
      }
      setLoading(false);
    } catch (error) {
      console.error(`Error occurred in signing up. ERROR_DETAILS: ${error}`);
    }
  };

  return (
    <>
      <div className="container">
        {!showForm ? (
          <>
            <h1 id="mainHeading">Benami (Anoymous)</h1>
            <div className="card">
              <h2>
                Get to know what others think about you by receiving anonymous
                messages from others.
              </h2>
              <button id="getStartedBtn" onClick={() => setShowForm(true)}>
                Get Started!
              </button>
            </div>
          </>
        ) : (
          <>
            {loading === false ? (
              <div className="formcard">
                <div id="signupPageBackButtonDiv">
                  <button id="backBtn" onClick={() => setShowForm(false)}>
                    <img
                      width="15rem"
                      src={backButtonIcon}
                      alt="back button icon"
                    />
                  </button>
                </div>
                <p>Choose a username</p>
                <input
                  type="text"
                  onChange={(e) => setUsernameVal(e.target.value)}
                  placeholder="username"
                />
                <button id="submitBtn" onClick={submitHandler}>
                  Continue
                </button>
              </div>
            ) : (
              <>
                <div id="loaderIcon" className="invisible">
                  <div id="loaderContainer">
                    <div className="loader"></div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SignUpPage;
