import React, { useState, useEffect } from "react";
import "./styles/Profile.css";
import dum_pic from "../../static/images/Test.jpg";
import { Link, useNavigate } from "react-router-dom";
import Switch from "react-switch";

const Profile = () => {
  const navigate = useNavigate();
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // STATE FOR HIDING USER PROFILE SECTIONS
  const [checkedUser, setCheckedUser] = useState(false);
  const [checkedUserName, setCheckedUserName] = useState(false);
  const [checkedUserEmail, setCheckedUserEmail] = useState(false);
  const [checkedUserPhoneNumber, setCheckedUserPhoneNumber] = useState(false);
  const [checkedUserMajor, setCheckedUserMajor] = useState(false);

  // Function to fetch user data from the API
  const fetchUserData = async (userID) => {
    try {
      // Make API request
      const userID = sessionStorage.getItem("userID");
      const response = await fetch(`/api/user/${userID}`);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      // Parse JSON response
      const data = await response.json();

      // Set user data in state
      setUserData(data);
      // Set loading state to false
      setIsLoading(false);
    } catch (error) {
      // Set error state
      setError(error.message);
      // Set loading state to false
      setIsLoading(false);
    }
  };
  const handleEditClick = () => {
    setIsEditMode(true);
  };
  const handleImgError = () => {
    setImgError(true);
  };
  const onClickHandler = () => {
    imageGalleryRef.current.fullscreen();
  };

  const imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    fetch("/api/user/savefile", {
      method: "POST",
      body: formData,
    });
    setUserData({ ...userData, PhotoFileName: e.target.files[0].name });
  };

  // Function to handle the "Save" button click
  const handleSaveClick = async () => {
    // Perform logic to save the modified data to the API
    try {
      const userID = sessionStorage.getItem("userID");
      const response = await fetch(`/api/user/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to save user data");
      }

      // Notify the user that the data was saved successfully
      alert("Successfully changed the profile");

      // Exit edit mode
      setIsEditMode(false);
      setImgError(false);
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  };

  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) {
      return;
    }
    setCheckedUser(userData.UserAnonymous);
    setCheckedUserName(userData.UserNameAnonymous);
    setCheckedUserEmail(userData.UserEmailAnonymous);
    setCheckedUserPhoneNumber(userData.UserPhoneNumberAnonymous);
    setCheckedUserMajor(userData.UserMajorAnonymous);
  }, [userData]);

  // Render loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  function handlePrivate() {
    setIsPrivate(true);
    setUserData({ ...userData, isPrivate: true });
  }
  function handlePublic() {
    setIsPrivate(false);
    setUserData({ ...userData, isPrivate: false });
  }

  function handleCalendarClick() {
    return navigate("/calendar");
  }

  // FUNCTIONS FOR HIDING USER PROFILE SECTIONS
  const handleChangeUser = (checkedUser) => {
    setCheckedUser(checkedUser);
    userData.UserAnonymous = !userData.UserAnonymous;
  };

  const handleChangeUserName = (checkedUserName) => {
    setCheckedUserName(checkedUserName);
    userData.UserNameAnonymous = !userData.UserNameAnonymous;
  };

  const handleChangeUserEmail = (checkedUserEmail) => {
    setCheckedUserEmail(checkedUserEmail);
    userData.UserEmailAnonymous = !userData.UserEmailAnonymous;
  };

  const handleChangeUserPhoneNumber = (checkedUserPhoneNumber) => {
    setCheckedUserPhoneNumber(checkedUserPhoneNumber);
    userData.UserPhoneNumberAnonymous = !userData.UserPhoneNumberAnonymous;
  };

  const handleChangeUserMajor = (checkedUserMajor) => {
    setCheckedUserMajor(checkedUserMajor);
    userData.UserMajorAnonymous = !userData.UserMajorAnonymous;
  };

  if (isEditMode) {
    return (
      <div className="profile-style">
        <div className="top">Edit User Profile</div>
        <label htmlFor="photo-upload" className="custom-file-upload fas">
          <div className="img-wrap img-upload">
            <img
              htmlFor="photo-upload"
              src={
                imgError
                  ? dum_pic
                  : "../../static/images/" + userData.PhotoFileName
              }
              onError={handleImgError}
            />
          </div>
          <input id="photo-upload" type="file" onChange={imageUpload} />
        </label>

        {/* NAME */}
        <label className="label">
          Name:
          <input
            type="text"
            value={
              userData?.UserAnonymous && "Anonymous"
                ? "Anonymous"
                : `${userData.Name}`
            }
            onChange={(e) => setUserData({ ...userData, Name: e.target.value })}
          />
          <Switch
            onChange={handleChangeUser}
            checked={checkedUser}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>
        {/* USERNAME */}
        <label className="label">
          UserName:
          <input
            type="text"
            value={
              userData?.UserNameAnonymous && "Anonymous"
                ? "Anonymous"
                : `${userData.UserName}`
            }
            onChange={(e) =>
              setUserData({ ...userData, UserName: e.target.value })
            }
          />
          <Switch
            onChange={handleChangeUserName}
            checked={checkedUserName}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>

        {/* EMAIL */}
        <label className="label">
          Email:
          <input
            type="text"
            value={
              userData?.UserEmailAnonymous && "Anonymous"
                ? "Anonymous"
                : `${userData.UserEmail}`
            }
            onChange={(e) =>
              setUserData({ ...userData, UserEmail: e.target.value })
            }
          />
          <Switch
            onChange={handleChangeUserEmail}
            checked={checkedUserEmail}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>

        {/* PHONE NUMBER */}
        <label className="label">
          Phone Number:
          <input
            type="text"
            value={
              userData?.UserPhoneNumberAnonymous && "Anonymous"
                ? "Anonymous"
                : `${userData.UserPhoneNumber}`
            }
            onChange={(e) =>
              setUserData({ ...userData, PhoneNumber: e.target.value })
            }
          />
          <Switch
            onChange={handleChangeUserPhoneNumber}
            checked={checkedUserPhoneNumber}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>

        {/* MAJOR */}
        <label className="label">
          Major:
          <input
            type="text"
            value={
              userData?.UserMajorAnonymous && "Anonymous"
                ? "Anonymous"
                : `${userData.UserMajor}`
            }
            onChange={(e) =>
              setUserData({ ...userData, Major: e.target.value })
            }
          />
          <Switch
            onChange={handleChangeUserMajor}
            checked={checkedUserMajor}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>

        <button className="margin-topp" onClick={handlePrivate}>
          I want my information to be private
        </button>
        <button onClick={handlePublic}>
          I want my information to be public
        </button>
        <button className="save-btn" onClick={handleSaveClick}>
          Save
        </button>
      </div>
    );
  }

  if (userData.isPrivate) {
    return (
      <div className="profile-style">
        <div className="top">User Profile</div>
        <label className="custom-file-upload fas">
          <div className="img-wrap">
            <img
              htmlFor="photo-upload"
              src={"../../static/images/" + userData.PhotoFileName}
              onClick={onClickHandler}
            />
          </div>
        </label>
        <div className="name">
          <label className="label">Name:</label> {userData.Name}
        </div>
        <div className="name">
          {" "}
          <label className="label">UserName: </label>
          {userData.UserName}
        </div>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={handleCalendarClick}>My Calendar</button>
      </div>
    );
  }

  // Render user profile
  return (
    <div className="profile-style">
      <div className="top">User Profile</div>
      <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img
            htmlFor="photo-upload"
            src={"../../static/images/" + userData.PhotoFileName}
            onClick={onClickHandler}
          />
        </div>
      </label>
      <div className="name">
        <label className="label">Name:</label> {userData.Name}
      </div>
      <div className="name">
        {" "}
        <label className="label">UserName: </label>
        {userData.UserName}
      </div>
      <div className="name">
        <label className="label">Email:</label>
        {userData.UserEmail}
      </div>
      <div className="name">
        <label className="label">Phone Number:</label>
        {userData.PhoneNumber}
      </div>
      <div className="name">
        <label className="label">Major:</label>
        {userData.Major}
      </div>
      <div className="name">
        <label className="label">Interest:</label>
        {userData.Interest}
      </div>
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleCalendarClick}>My Calendar</button>
    </div>
  );
};

export default Profile;
