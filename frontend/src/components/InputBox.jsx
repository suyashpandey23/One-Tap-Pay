import React from "react";

export function InputBox({ label, type, placeholder, onChange, error }) {
  const uniqueId = `input-${Math.random().toString(36).substring(2, 11)}`;
  return (
    <div className="text-left mb-4">
      <label
        htmlFor={uniqueId}
        className={`w-full text-[0.875rem] ${
          error ? "text-[#a8200d]" : "text-[#454745]"
        }`}
      >
        <span className="pt-1">{label}</span>
      </label>
      <input
        id={uniqueId}
        onChange={onChange}
        placeholder={placeholder}
        name={uniqueId}
        type={type}
        required
        className={`border py-3 px-4 font-semibold text-lg rounded-lg text-[#0e0f0c] w-full outline-none ${
          error ? "border-[#a8200d]" : ""
        }`}
      />
      {error && (
        <div className="my-1 flex items-center text-[#a8200d]">
          <span className="me-2" aria-hidden="true">
            <svg
              width="16"
              height="16"
              fill="currentColor"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M1.714 11.999c0 5.657 4.629 10.285 10.286 10.285S22.286 17.656 22.286 12C22.286 6.34 17.657 1.713 12 1.713S1.714 6.34 1.714 11.999Zm1.715 0c0-4.715 3.857-8.572 8.571-8.572 4.714 0 8.572 3.857 8.572 8.572 0 4.714-3.858 8.571-8.572 8.571-4.714 0-8.571-3.857-8.571-8.571Zm9.428-5.142h-1.714v6.858h1.714V6.857ZM12 18.001a1.286 1.286 0 1 0 0-2.571A1.286 1.286 0 0 0 12 18Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="py-1">{error}</span>
        </div>
      )}
    </div>
  );
}
