import "../styles/SettingsPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SettingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const toggleHandler = () => {
    const newToggleState = !isOn;
    setIsOn(newToggleState);

    if (newToggleState) {
      pauseLinkHandler();
    } else {
      resumeLinkHandler();
    }
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("BenamiUserInfo"));
    if (userDetails) {
      setUser(userDetails);
      setIsOn(userDetails.paused === true);
    }
  }, []);

  const pauseLinkHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/pauseUser";
      const response = await axios.put(url, {}, config);
      if (response.status === 200) {
        const updatedUser = { ...user, paused: true };
        localStorage.setItem("BenamiUserInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        throw new Error(
          "Error in pausing link. Error_details: " + response.data.message
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resumeLinkHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/resumeUser";
      const response = await axios.put(url, {}, config);
      if (response.status === 200) {
        const updatedUser = { ...user, paused: false };
        localStorage.setItem("BenamiUserInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        throw new Error(
          "Error in resuming link. Error_details: " + response.data.message
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const url = import.meta.env.VITE_BACKEND_SERVER_URL + "/deleteUser";
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        const updatedUser = { ...user, paused: false };
        localStorage.removeItem("BenamiUserInfo");
        navigate("/");
        setUser(null);
      } else {
        throw new Error(
          "Error in deleting user. Error_details: " + response.data.message
        );
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="settingsPageContainer">
        {showDeleteUserModal && (
          <>
            <div className="deleteUserModal">
              <p className="deleteUserModalHeader">Are you sure?</p>
              <p className="deleteUserModalBody">
                If you delete your account, you will lose access to your
                username and all messages
              </p>
              <div className="deleteUserModalBtns">
                <button
                  onClick={() => setShowDeleteUserModal(false)}
                  id="modalCancelBtn"
                >
                  Cancel
                </button>
                <button onClick={deleteUserHandler} id="modalDeleteBtn">
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
        {!showDeleteUserModal && (
          <div>
            <div className="pauseResumeLinkDiv">
              Pause my link
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={toggleHandler}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="deleteAccountDiv">
              <button
                id="deleteBtn"
                onClick={() => setShowDeleteUserModal(true)}
              >
                Delete account
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SettingsPage;
