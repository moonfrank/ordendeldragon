import fs from "node:fs";
import { PNG } from "pngjs";

export async function decode() {
  const cipher = await import("../data/cipher.json", {
    assert: { type: "json" },
  }).then(data => data.default);
  const data = fs.readFileSync("./dist/data/msg_c0de 1.txt", {
    encoding: "utf8",
  });
  const frames = data.split("\r\n中国电视 - 中国电视 - 中国电视\r\n");
  frames.shift();
  frames.pop();
  let framesRGB = {};
  frames.forEach((frame, index) => {
    let rgbFrameData = frame;
    for (const [key, value] of Object.entries(cipher)) {
      rgbFrameData = rgbFrameData.replaceAll(value, `${key} `);
    }
    let rgbFrameDataRows = rgbFrameData.split("\r\n");
    let rgbFrameDataTuples = [];
    rgbFrameDataRows.forEach((row) => {
      let rowNumbers = row.split(" ");
      while (rowNumbers.length >= 3) {
        rgbFrameDataTuples.push(rowNumbers.splice(0, 3));
      }
    });
    let rgbMappedData = [];
    while (rgbFrameDataTuples.length >= 360) {
      rgbMappedData.push(rgbFrameDataTuples.splice(0, 360));
    }
    framesRGB[index + 1] = rgbMappedData;
  });
  Object.entries(framesRGB).forEach(([key, value]) => {
    let png = new PNG({
      width: 240,
      height: 360,
      filterType: -1,
    });

    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        let idx = (png.width * y + x) << 2;
        [png.data[idx], png.data[idx + 1], png.data[idx + 2]] = value[x][y]; // rgb
        png.data[idx + 3] = 255; // alpha
      }
    }

    png.pack().pipe(fs.createWriteStream(`./out/frame_${key}.png`));
    console.log(`frame_${key}.png created!`);
  });
}
