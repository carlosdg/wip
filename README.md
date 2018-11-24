# Image Processor

The goal of this project is to have an application where we can load & download
images, apply operations and **visualize the changes** between the images.

[Link to application (hosted in Github Pages)](https://carlosdg.github.io/ImageProcessor/)

## How is this different from other applications?

This application was not created with the intention to be better than other
applications. Our main goal was to __learn how Image Processing is done__ at low
level while, at the same time, creating a helpful web application that can be
used to __apply basic operations without having to install any program__ (other
than, of course, a browser).

## Operations

Right now all the images are converted implicitly to grayscale so operations are
done using the gray values. In the future we plan to use the the HSI color space
for operations to process color images.

- Show histogram
- Crop
- Point operations
  - Convert to grayscale
  - Linear transformation specified via segments
  - Brightness & Contrast adjustment
  - Gamma Correction
  - Image Difference
  - Changes Detection
  - Histogram Specification
  - Histogram Equalization

And there are some more comming. An explanation of each operation is also comming

## Authors

- Daute Rodríguez Rodríguez &lt;[DauteRR](https://github.com/DauteRR)&gt;
- Carlos Domínguez García &lt;[carlosdg](https://github.com/carlosdg)&gt;