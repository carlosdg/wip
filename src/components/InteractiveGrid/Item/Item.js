import React from "react";
import PropTypes from "prop-types";
import DeleteButton from "../../DeleteButton";
import "./Item.css";

/** Helper method to prevent the default behaviour and stop the propagation of
 * an event */
const stopEvent = event => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Grid Item component. Forces grid items to be draggable only by a toolbar at
 * the top and also allows to listen to delete events (renders a delete button
 * and the event fires when the user wants to delete the item). It can also
 * notifiy when the user selects and deselects this component via props
 */
export default class Item extends React.Component {
  /** The rest of the props are provided by the grid */
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.symbol,
      PropTypes.object
    ]).isRequired,
    name: PropTypes.string,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    isSelected: PropTypes.bool
  };

  static defaultProps = {
    name: "",
    onDelete: null,
    onSelect: null,
    onDeselect: null,
    isSelected: false
  };

  /** We only want to allow the item being drag when the user is trying to drag
   * it from a part of the item, a toolbar at the top */
  state = {
    isDraggable: false
  };

  /**
   * Listen for document mouse up event so we can react to it even if the users
   * triggers it out of this element
   */
  componentDidMount() {
    document.addEventListener("mouseup", this.onDragHandleMouseUp);
  }

  /**
   * Clean the mouse up listener from the document when the component will be
   * unmounted
   */
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.onDragHandleMouseUp);
  }

  /** Update the state to allow the item be dragged only when the user is
   * clicking on the top toolbar */
  onDragHandleMouseDown = () => this.setState({ isDraggable: true });

  /** Update the state to forbid the item being dragged when the user stops
   * clicking the top toolbar. This listener is attached to the document so it
   * works even if the user drags the element out of the viewport and releses
   * the mouse there */
  onDragHandleMouseUp = () =>
    this.state.isDraggable &&
    this.setState({
      isDraggable: false
    });

  /** Listener for the drag start event, but only allow the drag behaviour if
   * the state says so */
  onDragStart = event => {
    if (this.state.isDraggable) {
      stopEvent(event);
      this.props.onMouseDown && this.props.onMouseDown(event);
    }
  };

  /** Listener for the drag end event */
  onDragEnd = event => {
    if (this.state.isDraggable) {
      stopEvent(event);
      this.props.onMouseUp && this.props.onMouseUp(event);
    }
  };

  /** When the user wants to delete the item, call the props `onDelete` callback
   * with the ID of this element */
  onDelete = () => this.props.onDelete(this.props.id);

  /** When the user selects this item, call the props `onSelect` callback with
   * the ID of this element */
  onSelect = () => this.props.onSelect(this.props.id);

  render() {
    const {
      children,
      className,
      style,
      name,
      onSelect,
      onDelete,
      isSelected
    } = this.props;

    return (
      <div
        className={`Item ${className} ${isSelected && "is-selected"}`}
        style={style}
        draggable={this.state.isDraggable}
        onDragStart={this.onDragStart}
        onMouseUp={this.onDragEnd} // OnMouseUp instead of DragEnd because DragStart prevents default
        onFocus={onSelect ? this.onSelect : null}
        tabIndex="0"
      >
        <div onMouseDown={this.onDragHandleMouseDown} className="Item__toolbar">
          <DeleteButton
            onMouseDown={stopEvent}
            onDelete={onDelete ? this.onDelete : null}
          />
          <span className="Item__name">{name}</span>
        </div>
        <div className="Item__childrenContainer">{children}</div>
      </div>
    );
  }
}
