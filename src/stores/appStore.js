import { observable, action } from "mobx";
import Histogram from "../lib/Histogram";
import CumulativeHistogram from "../lib/CumulativeHistogram";
import * as GridLayoutHelper from "../lib/grid/calculateLayout";

class AppStoreSingleton {
  /** All the information relative to the images loaded */
  @observable imagesInfos = [];
  /** All the information relative to the histograms of each image */
  @observable histogramInfos = [];
  /** Grid layouts for the elements on screen */
  @observable gridLayouts = GridLayoutHelper.createNewSetOfLayouts();
  /** Information of the current grid item being selected (item type & index) */
  @observable selectedGridItem = { type: "", index: -1 };
  /** Coordenates of the pixel that was last being pointed by the mouse */
  @observable pixelCoords = { x: 0, y: 0 };
  /** Value of the pixel that was last being pointed by the mouse */
  @observable pixelValue = [0, 0, 0, 255];
  /** Amount of removed images, needed for proper indexing images on the grid */
  @observable removedImagesCount = 0;

  @action addImage = imageBuffer => {
    const imageSection = {
      top: 0,
      left: 0,
      width: imageBuffer.width,
      height: imageBuffer.height
    };
    const histogram = new Histogram(imageBuffer);
    const cHistogram = new CumulativeHistogram(histogram.histogramValues);
    const imageKey = `Image ${this.imagesInfos.length +
      this.removedImagesCount}`;
    const histogramKey = `Histogram ${this.histogramInfos.length +
      this.removedImagesCount}`;

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

  @action removeImageInfo = index => {
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
    this.removedImagesCount = this.removedImagesCount + 1;
  };

  @action updateImageRegion = (index, newRegion) =>
    (this.imagesInfos[index].region = newRegion);

  /** Hides the given histogram from the view */
  @action hideHistogram = index => {
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

  @action showHistogramOfCurrentImage = () => {
    const { type, index } = this.selectedGridItem;

    if (type === "image") {
      this.histogramInfos[index].visible = true;

      this.gridLayouts = GridLayoutHelper.addNewElementsToLayouts(
        this.gridLayouts,
        [this.histogramInfos[index].key]
      );
    }
  };

  @action updateLayout = (_, newLayouts) =>
    requestAnimationFrame(() => (this.gridLayouts = newLayouts));

  @action updateSelectedImageItem = index =>
    (this.selectedGridItem = { type: "image", index });

  @action updateSelectedHistogramItem = index =>
    (this.selectedGridItem = { type: "histogram", index });

  @action setCurrentPixel = (coords, value) => {
    this.pixelCoords = coords;
    this.pixelValue = value;
  };

  isGridItemSelected = (type, index) =>
    this.selectedGridItem.index === index &&
    this.selectedGridItem.type === type;
}

export default new AppStoreSingleton();
