import React from "react";
import { observable, action, decorate } from "mobx";
import { ImageInfo } from "wiplib";
import * as GridLayoutHelper from "../lib/grid/calculateLayout";
import HistogramAndInfoComponent from "../components/HistogramAndInfoComponent";
import ProfilesComponent from "../components/ProfilesComponent";

class AppStoreSingleton {
  /** All the information relative to the images loaded */
  imagesInfos = [];
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
  /** Right side menu state */
  rightSideMenu = {
    open: false,
    selectedImageInfo: {
      name: "",
      width: "",
      height: ""
    },
    menuTitle: "",
    menuContent: []
  };

  addImage = imageBuffer => {
    const region = {
      top: 0,
      left: 0,
      width: imageBuffer.width,
      height: imageBuffer.height
    };
    const extraInfo = new ImageInfo(imageBuffer);
    const key = `Image ${this.imagesInfos.length + this._removedImagesCount}`;

    this.imagesInfos.push({
      key,
      imageBuffer,
      region,
      extraInfo,
      profilesInfos: []
    });

    this.gridLayouts = GridLayoutHelper.addNewElementsToLayouts(
      this.gridLayouts,
      [key]
    );
  };

  addProfile = (profileValues, firstDerivativeProfileValues) => {
    this.imagesInfos[this.selectedGridItem.index].profilesInfos.push({
      profileValues,
      firstDerivativeProfileValues
    });
    this.updateRightSideMenuImageInfo();
  };

  removeImageInfo = index => {
    const newLayouts = GridLayoutHelper.removeElementsFromLayout(
      this.gridLayouts,
      [this.imagesInfos[index].key]
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

    this.imagesInfos = this.imagesInfos.filter((_, i) => i !== index);
    this.gridLayouts = newLayouts;
    this.selectedGridItem = newSelectedItem;
    this._removedImagesCount = this._removedImagesCount + 1;

    this.updateRightSideMenuImageInfo();
    if (this.imagesInfos.length < 1) {
      this.pixelCoords = { x: 0, y: 0 };
      this.pixelValue = [0, 0, 0, 255];
    }
  };

  updateImageRegion = (index, newRegion) =>
    (this.imagesInfos[index].region = newRegion);

  updateLayout = (_, newLayouts) =>
    requestAnimationFrame(() => (this.gridLayouts = newLayouts));

  updateSelectedImageItem = index => {
    this.selectedGridItem = { type: "image", index };
    this.updateRightSideMenuImageInfo();
  };

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

  closeRightSideMenu = () => (
    this.rightSideMenu.open = false,
    this.rightSideMenu.menuContent = []
  );

  openRightSideMenu = () => (
    this.rightSideMenu.open = true,
    this.rightSideMenu.menuContent = [
      <HistogramAndInfoComponent data={this.imagesInfos[this.selectedGridItem.index].extraInfo} />
    ],
    this.imagesInfos[this.selectedGridItem.index].profilesInfos.forEach(profileInfo => {
      this.rightSideMenu.menuContent.push(
        <ProfilesComponent info={profileInfo} />
      );
    })
  );

  updateRightSideMenuImageInfo = () => {
    if (this.selectedGridItem.index === -1) {
      this.rightSideMenu.selectedImageInfo = {
        name: "",
        width: "",
        height: ""
      };
      this.rightSideMenu.menuTitle = "";
      this.rightSideMenu.menuContent = [];
    } else {
      const selectedImageInfo = this.imagesInfos[this.selectedGridItem.index];
      const { extraInfo } = selectedImageInfo;
      this.rightSideMenu.menuTitle = `${selectedImageInfo.key} - Information`;
      this.rightSideMenu.selectedImageInfo = {
        name: selectedImageInfo.key,
        width: selectedImageInfo.imageBuffer.width,
        height: selectedImageInfo.imageBuffer.height
      };
      this.rightSideMenu.menuContent = [
        <HistogramAndInfoComponent data={extraInfo} />
      ];
      selectedImageInfo.profilesInfos.forEach(profileInfo => {
        this.rightSideMenu.menuContent.push(
          <ProfilesComponent info={profileInfo} />
        );
      });
    }
  };
}

decorate(AppStoreSingleton, {
  imagesInfos: observable,
  gridLayouts: observable,
  imageSelectionMehod: observable,
  selectedGridItem: observable,
  pixelCoords: observable,
  pixelValue: observable,
  rightSideMenu: observable,
  addImage: action,
  addProfile: action,
  updateImageRegion: action,
  removeProfile: action,
  updateLayout: action,
  updateSelectedImageItem: action,
  setCurrentPixel: action,
  updateImageSelectionMehod: action,
  openRightSideMenu: action,
  closeRightSideMenu: action
});

export default new AppStoreSingleton();
