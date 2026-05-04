import React from "react";
import JDGDLabel from "../../atoms/JDGDLabel/JDGDLabel.jsx";
import JDGDInput from "../../atoms/JDGDInput/JDGDInput.jsx";
import "./JDGDFormField.css";

const JDGDFormField = ({
  JDGDName,
  JDGDLabel,
  JDGDType = "text",
  JDGDPlaceholder = "",
  JDGDValue,
  JDGDOnChange,
  JDGDRequired = false,
  JDGDDisabled = false,
  JDGDError = "",
  JDGDHint = "",
}) => {
  const JDGDTieneError = Boolean(JDGDError);

  return (
    <div
      className={`JDGD-form-field ${JDGDTieneError ? "JDGD-form-field--error" : ""} ${JDGDDisabled ? "JDGD-form-field--disabled" : ""}`}
    >
      {JDGDLabel && (
        <JDGDLabel
          JDGDText={JDGDLabel}
          JDGDHtmlFor={JDGDName}
          JDGDRequired={JDGDRequired}
        />
      )}

      <JDGDInput
        JDGDName={JDGDName}
        JDGDType={JDGDType}
        JDGDPlaceholder={JDGDPlaceholder}
        JDGDValue={JDGDValue}
        JDGDOnChange={JDGDOnChange}
        JDGDDisabled={JDGDDisabled}
        JDGDError={JDGDTieneError}
      />

      {JDGDTieneError && (
        <span className="JDGD-form-field__error" role="alert">
          <svg
            className="JDGD-form-field__error-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 4.5v4M8 11h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {JDGDError}
        </span>
      )}

      {!JDGDTieneError && JDGDHint && (
        <span className="JDGD-form-field__hint">{JDGDHint}</span>
      )}
    </div>
  );
};

export default JDGDFormField;