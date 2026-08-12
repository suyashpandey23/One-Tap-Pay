// Notification.js
// import React from "react";
// import PropTypes from "prop-types";
// import styled, { css } from "styled-components";

// const NotificationWrapper = styled.div`
//   padding: 16px;
//   border-radius: 5px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   transition: opacity 0.5s ease-in-out;
//   max-width: 500px;
//   font-size: 1.3rem;
//   font-weight: 600;
//   ${({ type }) =>
//     type === "info" &&
//     css`
//       background-color: #e0f7fa;
//       color: #00796b;
//     `}
//   ${({ type }) =>
//     type === "success" &&
//     css`
//       background-color: #e8f5e9;
//       color: #388e3c;
//     `}
//     ${({ type }) =>
//     type === "warning" &&
//     css`
//       background-color: #fff8e1;
//       color: #fbc02d;
//     `}
//     ${({ type }) =>
//     type === "danger" &&
//     css`
//       background-color: #ffebee;
//       color: #d32f2f;
//     `}
// `;

// const CloseButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 16px;
//   color: inherit;
// `;

// export const Notification = ({ type, message, onClose }) => {
//   return (
//     <NotificationWrapper type={type}>
//       <span>{message}</span>
//       <CloseButton onClick={onClose}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2}
//           stroke="currentColor"
//           className="size-8"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//           />
//         </svg>
//       </CloseButton>
//     </NotificationWrapper>
//   );
// };

// Notification.propTypes = {
//   type: PropTypes.oneOf(["info", "success", "warning", "danger"]).isRequired,
//   message: PropTypes.string.isRequired,
//   onClose: PropTypes.func.isRequired,
// };
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const NotificationWrapper = styled.div`
    padding: 16px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: opacity 0.5s ease-in-out;
    max-width: 500px;
    font-size: 1.3rem;
    font-weight: 600;

    ${({ type }) => type === 'info' && css`
        background-color: #e0f7fa;
        color: #00796b;
    `}
    ${({ type }) => type === 'success' && css`
        background-color: #e8f5e9;
        color: #388e3c;
    `}
    ${({ type }) => type === 'warning' && css`
        background-color: #fff8e1;
        color: #fbc02d;
    `}
    ${({ type }) => type === 'danger' && css`
        background-color: #ffebee;
        color: #d32f2f;
    `}
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: inherit;
    margin-left: 10px;
`;

export const Notification = ({ type, message, onClose }) => {
    const shouldShowClose = type === 'warning' || type === 'danger';

    return (
        <NotificationWrapper type={type}>
            <span>{message}</span>
            {shouldShowClose && (
                <CloseButton onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </CloseButton>
            )}
        </NotificationWrapper>
    );
};

Notification.propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']).isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
