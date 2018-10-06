import React from "react";

const stopEvent = event => {
  event.preventDefault();
  event.stopPropagation();
};

export default class Item extends React.Component {
  state = {
    isDraggable: false
  };

  onDragHandleMouseDown = () => this.setState({ isDraggable: true });
  onDragHandleMouseUp = () => this.setState({ isDraggable: false });

  onDragStart = event => {
    if (this.state.isDraggable) {
      stopEvent(event);
      this.props.onMouseDown && this.props.onMouseDown(event);
    }
  };

  onDragEnd = event => {
    if (this.state.isDraggable) {
      stopEvent(event);
      this.props.onMouseUp && this.props.onMouseUp(event);
    }
  };

  onDelete = () => this.props.onDelete && this.props.onDelete(this.props.id)

  render() {
    const { children, style, className } = this.props;
    const [childs, resizeHandle] = children;

    return (
      <div
        style={{
          ...style,
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "white"
        }}
        className={className}
        draggable={this.state.isDraggable}
        onDragStart={this.onDragStart}
        onMouseUp={this.onDragEnd} // OnMouseUp instead of DragEnd because DragStart prevents default
      >
        <div
          onMouseDown={this.onDragHandleMouseDown}
          onMouseUp={this.onDragHandleMouseUp}
          style={{
            backgroundColor: "#ddd",
            borderBottom: "1px solid #ddd",
            padding: "3px"
          }}
        >
          <button
            onMouseDown={stopEvent}
            onClick={this.onDelete}
            disabled={!this.props.onDelete}
            style={{
              background: "inherit",
              backgroundColor: "#fff",
              border: "inherit",
              borderRadius: "50%",
              width: "1.5rem",
              height: "1.5rem",
              fontSize: "1rem",
              textAlign: "center",
              padding: "0"
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ height: "80%", padding: "5px" }}>{childs}</div>
        {resizeHandle}
      </div>
    );
  }
}
