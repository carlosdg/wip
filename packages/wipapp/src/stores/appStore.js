import { observable, action, decorate } from "mobx";
import Histogram from "../lib/Histogram";
import CumulativeHistogram from "../lib/CumulativeHistogram";
import * as GridLayoutHelper from "../lib/grid/calculateLayout";

class AppStoreSingleton {
  /** All the information relative to the images loaded */
  imagesInfos = [];
  /** All the information relative to the histograms of each image */
  histogramInfos = [];
  /** All the information relative to the profiles  */
  profilesInfos = [];
  /** Grid layouts for the elements on screen */
  gridLayouts = GridLayoutHelper.createNewSetOfLayouts();
  /** Indicates the current method for selecting a part of the image */
  imageSelectionMehod = "selection";
  /** Information of the current grid item being selected (item type & index) */
  selectedGridItem = { type: "", index: -1 };
  /** Coordenates of the pixel that was last being pointed by the mouse */
  pixelCoords = { x: 0, y: 0 };
  /** Value of the pixel that was last being pointed by the mouse */
  pixelValue = [0, 0, 0, 255];
  /** Amount of removed images, needed for proper indexing images on the grid */
  _removedImagesCount = 0;
  /** Amount of added profiles, needed for proper indexing profiles on the grid */
  _profilesCount = 0;

  addImage = imageBuffer => {
    const imageSection = {
      top: 0,
      left: 0,
      width: imageBuffer.width,
      height: imageBuffer.height
    };
    const histogram = new Histogram(imageBuffer);
    const cHistogram = new CumulativeHistogram(histogram.histogramValues);
    const imageKey = `Image ${this.imagesInfos.length +
      this._removedImagesCount}`;
    const histogramKey = `Histogram ${this.histogramInfos.length +
      this._removedImagesCount}`;

    this.imagesInfos.push({ key: imageKey, imageBuffer, region: imageSection });

    this.histogramInfos.push({
      key: histogramKey,
      histogram,
      cHistogram,
      visible: false
    });

    this.gridLayouts = GridLayoutHelper.addNewElementsToLayouts(
      this.gridLayouts,
      [imageKey]
    );
  };

  addProfile = (profileValues, firstDerivativeProfileValues) => {
    const profileKey = `Profile ${this._profilesCount}`;
    this._profilesCount = this._profilesCount + 1;

    const firstDerivativeKey = "First derivative of " + profileKey;

    this.profilesInfos.push({
      key: profileKey,
      profileValues,
      firstDerivativeProfileValues
    });

    this.gridLayouts = GridLayoutHelper.addNewElementsToLayouts(
      this.gridLayouts,
      [profileKey, firstDerivativeKey]
    );
  };

  removeImageInfo = index => {
    const newLayouts = GridLayoutHelper.removeElementsFromLayout(
      this.gridLayouts,
      [this.histogramInfos[index].key, this.imagesInfos[index].key]
    );
    let newSelectedItem = { ...this.selectedGridItem };

    // We are removing an element from an array, we have to update the
    // selected item index if it is the element removed or after it
    if (index <= newSelectedItem.index) {
      newSelectedItem.index -= 1;
      if (newSelectedItem.index < 0) {
        newSelectedItem.type = "";
      }
    }

    this.histogramInfos = this.histogramInfos.filter((_, i) => i !== index);
    this.imagesInfos = this.imagesInfos.filter((_, i) => i !== index);
    this.gridLayouts = newLayouts;
    this.selectedGridItem = newSelectedItem;
    this._removedImagesCount = this._removedImagesCount + 1;
  };

  updateImageRegion = (index, newRegion) =>
    (this.imagesInfos[index].region = newRegion);

  /** Hides the given histogram from the view */
  hideHistogram = index => {
    // Set the visibility to false, remove its layout information and resets the
    // current selected item if it was the histogram to hide
    this.histogramInfos[index].visible = false;
    this.gridLayouts = GridLayoutHelper.removeElementsFromLayout(
      this.gridLayouts,
      [this.histogramInfos[index].key]
    );
    if (this.isGridItemSelected("histogram", index)) {
      this.selectedGridItem = { type: "", index: -1 };
    }
  };

  removeProfile = index => {
    const newLayouts = GridLayoutHelper.removeElementsFromLayout(
      this.gridLayouts,
      [this.profilesInfos[index].key]
    );
    let newSelectedItem = { ...this.selectedGridItem };

    if (index <= newSelectedItem.index) {
      newSelectedItem.index -= 1;
      if (newSelectedItem.index < 0) {
        newSelectedItem.type = "";
      }
    }

    this.profilesInfos = this.profilesInfos.filter((_, i) => i !== index);
    this.gridLayouts = newLayouts;
    this.selectedGridItem = newSelectedItem;
  };

  showHistogramOfCurrentImage = () => {
    const { type, index } = this.selectedGridItem;

    if (type === "image") {
      this.histogramInfos[index].visible = true;

      this.gridLayouts = GridLayoutHelper.addNewElementsToLayouts(
        this.gridLayouts,
        [this.histogramInfos[index].key]
      );
    }
  };

  updateLayout = (_, newLayouts) =>
    requestAnimationFrame(() => (this.gridLayouts = newLayouts));

  updateSelectedImageItem = index =>
    (this.selectedGridItem = { type: "image", index });

  updateSelectedHistogramItem = index =>
    (this.selectedGridItem = { type: "histogram", index });

  updateSelectedProfileItem = index =>
    (this.selectedGridItem = { type: "line", index });

  setCurrentPixel = (coords, value) => {
    this.pixelCoords = coords;
    this.pixelValue = value;
  };

  updateImageSelectionMehod = newMethodType => {
    this.imageSelectionMehod = newMethodType;
  };

  isGridItemSelected = (type, index) =>
    this.selectedGridItem.index === index &&
    this.selectedGridItem.type === type;
}

decorate(AppStoreSingleton, {
  imagesInfos: observable,
  histogramInfos: observable,
  profilesInfos: observable,
  gridLayouts: observable,
  imageSelectionMehod: observable,
  selectedGridItem: observable,
  pixelCoords: observable,
  pixelValue: observable,
  addImage: action,
  addProfile: action,
  removeImageInfo: action,
  updateImageRegion: action,
  hideHistogram: action,
  removeProfile: action,
  showHistogramOfCurrentImage: action,
  updateLayout: action,
  updateSelectedImageItem: action,
  updateSelectedHistogramItem: action,
  updateSelectedProfileItem: action,
  setCurrentPixel: action,
  updateImageSelectionMehod: action
});

export default new AppStoreSingleton();
