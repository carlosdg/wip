import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { ChromePicker } from "react-color";
import FilesListMenu from "../../Toolbar/FilesListMenu";
import { operations } from "wiplib";

const { changesDetection } = operations;

/**
 * Dialog to prompt the user for the image name of the image to do the
 * changes detection, color and threshold
 */
class ChangesDetectionDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    imgName: "",
    rgbaColor: { r: 255, g: 0, b: 0 },
    threshold: ""
  };

  onImgNameChange = e =>
    this.setState({
      imgName: e.selectedItemName
    });

  onThresholdChange = e => {
    const newValue = Number.parseFloat(e.target.value);

    this.setState({
      threshold: Number.isFinite(newValue) ? newValue : ""
    });
  };

  handleChangeComplete = color => this.setState({ rgbaColor: color.rgb });

  onSubmit = () => {
    const { imgName, rgbaColor, threshold } = this.state;
    this.applyChangesDetection({
      imgName,
      rgbaColor,
      threshold: threshold === "" ? 0 : threshold
    });
    this.props.onClose();
  };

  applyChangesDetection = ({ imgName, rgbaColor, threshold }) => {
    const { appStore, enqueueSnackbar } = this.props;
    const { index } = appStore.selectedGridItem;
    const otherImageInfo = appStore.imagesInfos.find(
      ({ key }) => key === imgName
    );
    let { currentVersionIndex, versionsHistory } = otherImageInfo;
    const imageBuffer = otherImageInfo && versionsHistory[currentVersionIndex].imageBuffer;
    
    currentVersionIndex = appStore.imagesInfos[index].currentVersionIndex;
    versionsHistory = appStore.imagesInfos[index].versionsHistory;
    
    if (imageBuffer === undefined) {
      enqueueSnackbar(
        `Couldn't find an image with the selected name (${imgName})`,
        {
          variant: "error"
        }
      );
    } else {
      appStore.addOperationResult(
        changesDetection(
          versionsHistory[currentVersionIndex].imageBuffer,
          imageBuffer,
          threshold,
          rgbaColor
        )
      );
    }
  };

  render() {
    const activeImagesNames = this.props.appStore.imagesInfos.map(
      img => img.key
    );

    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Changes Detection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, select the image to detect the changes between them. Also
            enter the color which will be used to highlight the differences and
            the difference threshold, value that will determine what is
            considered a difference and what not
          </DialogContentText>
          <div className="center" style={{ justifyContent: "space-around" }}>
            <FilesListMenu
              menuTitle="Selected image"
              options={activeImagesNames}
              onItemSelection={this.onImgNameChange}
            />
            <TextField
              placeholder="0"
              type="number"
              value={this.state.threshold}
              onChange={this.onThresholdChange}
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Threshold: </InputAdornment>
                )
              }}
            />
          </div>
          <div className="center" style={{ marginTop: "1rem" }}>
            <ChromePicker
              color={this.state.rgbaColor}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(ChangesDetectionDialog))
);
