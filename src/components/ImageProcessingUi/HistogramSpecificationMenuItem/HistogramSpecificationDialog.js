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
import FilesListMenu from "../../Toolbar/FilesListMenu";
import { histogramSpecification } from "../../../lib/ImageProcessing/histogramSpecification";

/**
 * Dialog to prompt the user for the image name of the image to do the
 * histogram specification
 */
@withSnackbar
@inject("appStore")
@observer
class HistogramSpecificationDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    imgName: ""
  };

  onChange = e =>
    this.setState({
      imgName: e.selectedItemName
    });

  onSubmit = () => {
    const otherImgName = this.state.imgName;
    const { appStore, enqueueSnackbar } = this.props;
    const { index } = appStore.selectedGridItem;
    const otherImgIndex = appStore.imagesInfos.findIndex(
      ({ key }) => key === otherImgName
    );

    if (
      otherImgIndex < 0 ||
      otherImgIndex > appStore.imagesInfos.length
    ) {
      enqueueSnackbar(
        `Couldn't find an image with the selected name (${otherImgName})`,
        {
          variant: "error"
        }
      );
    } else {
      appStore.addImage(
        histogramSpecification(
          appStore.imagesInfos[index].imageBuffer,
          appStore.histogramInfos[index].cHistogram,
          appStore.histogramInfos[otherImgIndex].cHistogram
        )
      );
    }

    this.props.onClose();
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
        <DialogTitle id="form-dialog-title">
          Histogram Specificacion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, select the image with the histogram to perform the histogram
            specification to the current image
          </DialogContentText>
          <div className="center">
            <FilesListMenu
              menuTitle="Selected image"
              options={activeImagesNames}
              onItemSelection={this.onChange}
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

export default HistogramSpecificationDialog;
