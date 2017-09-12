/* eslint-disable no-console */
// @flow

const TOLERANCE = 64;
const enableDebugging = true;

export default (image: HTMLImageElement) => {
    let canvas: HTMLCanvasElement = (document.querySelector('#backgroundProcessor'): any);
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'backgroundProcessor';
        canvas.style.display = 'none';
        if (document.body) {
            document.body.appendChild(canvas);
        } else {
            throw new DOMError();
        }
    }

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context: CanvasRenderingContext2D = (canvas.getContext('2d'): any);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    const bgColor = data.slice(0, 4);
    const bgFillColor = [0, 0, 0, 0];
    const fgFillColor = [255, 255, 255, 255];
    const bgIsAlpha = bgColor[3] === 0;
    const rowsToRemove: number[] = [];

    enableDebugging && console.groupCollapsed(image.alt);
    enableDebugging && console.log('bgColor', bgColor, 'bgIsAlpha', bgIsAlpha, 'bgFillColor', bgFillColor, 'fgFillColor', fgFillColor);

    let rowIsSameAsBackground = true;

    for (let i = 0; i < data.length; i += 4) {
        const currentColor = [data[i], data[i + 1], data[i + 2], data[i + 3]];

        const range = [0, 1, 2, 3];
        const doesntMatchBackground = !range.every(index =>
            currentColor[index] >= (bgColor[index] - TOLERANCE) &&
            currentColor[index] <= (bgColor[index] + TOLERANCE),
        );

        if (rowIsSameAsBackground) {
            rowIsSameAsBackground = !doesntMatchBackground;
        }

        if (i !== 0 && i / 4 % canvas.width === 0) {
            // reached end of (an) row

            if (rowIsSameAsBackground) {
                // remove this row from final data
                rowsToRemove.push(i / 4 / canvas.width);
            }

            // reset value for next row
            rowIsSameAsBackground = true;
        }

        if (doesntMatchBackground) {
            const destColor = data[i] + data[i + 1] + data[i + 2];
            const targetColor = bgColor[0] + bgColor[1] + bgColor[2];

            for (const index of range) {
                if (index === 3) {
                    const debug = enableDebugging && i % 10000 === 0;
                    debug && console.log('random sampler!', i);
                    if (bgIsAlpha) {
                        debug && console.log('ALPHA untouched');
                        // leave alpha channel untouched
                        continue;
                    } else {
                        let diff = targetColor - destColor;
                        debug && console.log('diff', diff);
                        if (diff > 0) {
                            diff = Math.round(215 + (diff / (255 * 4) * 40));
                            debug && console.log('ALPHA SET TO ', diff);
                            data[i + index] = diff;
                            continue;
                        }
                    }
                }
                data[i + index] = fgFillColor[index];
            }
        } else {
            for (const index of range) {
                data[i + index] = bgFillColor[index];
            }
        }
    }

    const finalData = Array.from(data);
    if (rowsToRemove.length) {
        enableDebugging && console.log('detected rows in image that only consist of background color, removing:', rowsToRemove);
        for (let i = data.length; i > -1; i -= (canvas.width * 4)) {
            if (rowsToRemove.includes(i / 4 / canvas.width)) {
                // this row needs to be removed
                finalData.splice(i, canvas.width * 4);
            }
        }
    }

    const carray = new Uint8ClampedArray(finalData.length);
    carray.set(finalData);

    imageData = new ImageData(carray, imageData.width, carray.length / 4 / imageData.width);

    enableDebugging && console.groupEnd();

    canvas.height = imageData.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
};
