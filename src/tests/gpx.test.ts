import { expect, test } from "vitest";
import { isGpx, pointsFromGpx } from "../scripts/gpx";
import { Point } from "../scripts/point";

///////////////////////////////////////////////////////////////////////////////

test("isGpx()", () => {
  const gpx = `
  <?xml version="1.0" encoding="UTF-8"?>
  <gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxdata="http://www.cluetrust.com/XML/GPXDATA/1/0" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.cluetrust.com/XML/GPXDATA/1/0 http://www.cluetrust.com/Schemas/gpxdata10.xsd" version="1.1" creator="http://ridewithgps.com/">
    <metadata>
      <name>TEST</name>
      <link href="https://ridewithgps.com/routes/000000">
        <text>TEST</text>
      </link>
      <time>2023-02-03T10:20:30Z</time>
    </metadata>
    <trk>
      <name>TEST</name>
      <trkseg>
        <trkpt lat="35.1000" lon="139.6000">
          <ele>50.0</ele>
        </trkpt>
        <trkpt lat="35.6000" lon="139.1000">
          <ele>40.0</ele>
        </trkpt>
      </trkseg>
    </trk>
  </gpx>
    `;
  expect(isGpx(gpx)).toBeTruthy();

  const notGpx = "This is NOT GPX.\n";
  expect(isGpx(notGpx)).toBeFalsy();

  const html = `
  <!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>

  </body>
  </html>
  `;
  expect(isGpx(html)).toBeFalsy();
});

///////////////////////////////////////////////////////////////////////////////

test("lnglatFromGpx()", () => {
  // 普通のGPXファイルのパターン
  const gpx1 = `
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxdata="http://www.cluetrust.com/XML/GPXDATA/1/0" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.cluetrust.com/XML/GPXDATA/1/0 http://www.cluetrust.com/Schemas/gpxdata10.xsd" version="1.1" creator="http://ridewithgps.com/">
  <metadata>
    <name>TEST</name>
    <link href="https://ridewithgps.com/routes/000000">
      <text>TEST</text>
    </link>
    <time>2023-02-03T10:20:30Z</time>
  </metadata>
  <trk>
    <name>TEST</name>
    <trkseg>
      <trkpt lat="35.1000" lon="139.6000">
        <ele>50.0</ele>
      </trkpt>
      <trkpt lat="35.6000" lon="139.1000">
        <ele>40.0</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
`;
  const r1 = pointsFromGpx(gpx1);
  expect(r1).toEqual([new Point(139.6, 35.1, 50), new Point(139.1, 35.6, 40)]);

  // 標高 ele がないパターン
  const gpx2 = `
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxdata="http://www.cluetrust.com/XML/GPXDATA/1/0" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.cluetrust.com/XML/GPXDATA/1/0 http://www.cluetrust.com/Schemas/gpxdata10.xsd" version="1.1" creator="http://ridewithgps.com/">
  <metadata>
    <name>TEST</name>
    <link href="https://ridewithgps.com/routes/000000">
      <text>TEST</text>
    </link>
    <time>2023-02-03T10:20:30Z</time>
  </metadata>
  <trk>
    <name>TEST</name>
    <trkseg>
      <trkpt lat="35.1000" lon="139.6000" />
      <trkpt lat="35.6000" lon="139.1000" />
    </trkseg>
  </trk>
</gpx>
`;
  const r2 = pointsFromGpx(gpx2);
  expect(r2).toEqual([new Point(139.6, 35.1), new Point(139.1, 35.6)]);
});

///////////////////////////////////////////////////////////////////////////////
