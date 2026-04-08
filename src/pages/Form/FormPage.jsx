import { TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import cloud from "../../assets/clouds.svg";
import lastBg from "../../assets/lastBg.png";
import successimage from "../../assets/success-image.png";
import trees from "../../assets/Trees.svg";
import Buttons from "../../components/button";
import { apiHost } from "../../config/config";
import { SurveyDataContext } from "../../contexts/surveyData/SurveyDataContext";
import "./FormPage.css";
import success from "/src/assets/success.gif";

const FormPage = () => {
  const { score, clearSurveyStorage } = useContext(SurveyDataContext) || {};
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (score !== undefined && score !== null) {
      let percentage = (((score / 14.4)) * 100).toFixed(2) - 100;
      setPercentage(percentage)
      if (percentage > 0) {
        setTreeCount(((percentage / 100) * 60).toFixed(0))
      }
    }
  }, [score])
  const [treeCount, setTreeCount] = useState(1);



  const [formData, setFormData] = useState({
    survey_id: 1,
    name: "",
    phone_number: "",
    e_mail: "",
    location: "",
    tree_count: "",
    purpose: "",
  });

  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const [showSuccessImage, setShowSuccessImage] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (hasSubmitted) {
      validate({ [name]: value });
    }
  };

  const validate = (fieldValues = formData) => {
    let validationErrors = { ...errors };
    const phoneNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ("name" in fieldValues) {
      if (!fieldValues.name || /\d/.test(fieldValues.name)) {
        validationErrors.name = "Name is required and cannot contain numbers.";
      } else {
        delete validationErrors.name;
      }
    }

    if ("phone_number" in fieldValues) {
      if (!fieldValues.phone_number) {
        validationErrors.phone_number = "Phone number is required.";
      } else if (!phoneNumberPattern.test(fieldValues.phone_number)) {
        validationErrors.phone_number = "Phone number must be 10 digits.";
      } else {
        delete validationErrors.phone_number;
      }
    }

    if ("e_mail" in fieldValues) {
      if (!fieldValues.e_mail) {
        validationErrors.e_mail = "Email is required.";
      }
      else if (!emailPattern.test(fieldValues.e_mail)) {
        validationErrors.e_mail = "! invalid Valid email.";
      }
      else {
        delete validationErrors.e_mail;
      }
    }

    if ("location" in fieldValues) {
      if (!fieldValues.location || /\d/.test(fieldValues.location)) {
        validationErrors.location = "Location is required.";
      } else {
        delete validationErrors.location;
      }
    }

    if ("tree_count" in fieldValues) {
      if (!fieldValues.tree_count) {
        validationErrors.tree_count = "Tree count required";
      }
      else if (fieldValues.tree_count <= 0) {
        validationErrors.tree_count = "Tree count not be negative";
      }
      else if (fieldValues.tree_count < treeCount) {
        validationErrors.tree_count = `Tree count must be at least ${treeCount}.`;
      }
      else {
        delete validationErrors.tree_count;
      }
    }

    if ("purpose" in fieldValues) {
      if (!fieldValues.purpose || /\d/.test(fieldValues.purpose)) {
        validationErrors.purpose = "Purpose is required.";
      } else {
        delete validationErrors.purpose;
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (validate()) {
      try {
        const response = await fetch(`${apiHost}/api/formpost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([formData]),
        });

        if (response.ok) {
          clearSurveyStorage();
          setSubmit(true);
        } else {
          console.error("Error submitting form data");
        }
      } catch (error) {
        console.error("Error connecting to the backend:", error);
      }
    }
  };

  useEffect(() => {
    if (submit) {
      const timer = setTimeout(() => {
        setShowSuccessImage(true);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [submit]);

  return (
    <>
      <div className="form-main">
        {submit ? (
          <div style={{ width: "100%", height: "100%", background: "#f0f4fa" }}>
            <div className="bgimage">
              <img src={lastBg} alt="lastbg" className="background-img" />
            </div>
            <div className="column">
              <div className="video-container">
                {!showSuccessImage ? (
                  <img
                    src={success}
                    alt="Success GIF"
                    className="success-gif"
                  />
                ) : (
                  <img
                    src={successimage}
                    alt="Success Image"
                    className="success-image"
                  />
                )}
              </div>
              <div className="success-message">Form submitted successfully</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="background-images">
              <img src={cloud} className="png cloud" />
              <img src={trees} className="png trees" />
            </div>
            <div className="text-content">
              Great job! You're making a positive
              <br />
              contribution to preserving our
              <br />
              green environment.
            </div>
            <div className="plantation-form">
              <div className="head">
                <p className="form-title">Fill out this form</p>
                <span
                  className="form-description"
                  style={{ fontWeight: "lighter" }}
                >
                  Our team will reach out to you to help with your tree
                  plantation
                </span>
              </div>
              <div className="form">
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      Your Name<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  error={!!errors.name}
                  FormHelperTextProps={{
                    style: { fontSize: "5px" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      Phone number<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="Phone number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                  FormHelperTextProps={{
                    style: { fontSize: "8px" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      Email<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="Email"
                  name="e_mail"
                  value={formData.e_mail}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  error={!!errors.e_mail}
                  helperText={errors.e_mail}
                  FormHelperTextProps={{
                    style: { fontSize: "8px" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      Location<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  error={!!errors.location}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      How many trees you want to plant?
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="How many trees you want to plant?"
                  name="tree_count"
                  value={formData.tree_count}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  type="number"
                  error={!!errors.tree_count}
                  helperText={errors.tree_count}
                  FormHelperTextProps={{
                    style: { fontSize: "8px" },
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <TextField
                  id="outlined-textarea"
                  size="small"
                  label={
                    <span>
                      Purpose of planting
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  placeholder="Purpose of planting"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="custom-textfield"
                  error={!!errors.purpose}
                  helperText={errors.purpose}
                  FormHelperTextProps={{
                    style: { fontSize: "0px" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
                <div className="submit-btn">
                  <Buttons
                    text="Submit"
                    color="#fff"
                    border="none"
                    padding="10px 20px"
                    fontWeight="500"
                    width="100%"
                    fontSize="14px"
                    height="48px"
                    background="#1D78EC"
                    borderRadius="8px"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FormPage;
