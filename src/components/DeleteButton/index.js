import React from "react";
import PropTypes from "prop-types";
import "./DeleteButton.css";

/**
 * Delete button component. Renders a circular button with a
 * cross to let the user know that they can delete something.
 *
 * The parent component is notified when the user wants to
 * delete via the `onDelete` prop. If `onDelete` is not
 * provided, the button will be rendered as a disabled button
 */
const DeleteButton = ({ onDelete, ...props }) => (
  <button
    className="DeleteButton"
    onClick={onDelete}
    disabled={!onDelete}
    aria-label="delete"
    {...props}
  >
    ×
  </button>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func
};

DeleteButton.defaultProps = {
  onDelete: null
};

export default DeleteButton;
