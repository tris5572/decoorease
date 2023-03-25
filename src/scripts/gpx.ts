import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { LngLat } from "maplibre-gl";

export function updateGpxByDroppedFile() {}

/**
 * GPXファイルから座標のリストを生成する。
 * @param gpx GPXファイルの中身の文字列
 * @returns 座標のリスト。
 */
export function lnglatFromGpx(gpx: string): LngLat[] {
  const lnglat = [];

  // パース時のオプション。trkpt の lat と lon を取得するために指定。
  const parsingOptions = {
    ignoreAttributes: false,
  };
  const parser = new XMLParser(parsingOptions);
  let jsonObj = parser.parse(gpx);

  // gpx > trk > trkseg に、配列として trkpt があるはず。
  const array = jsonObj.gpx.trk.trkseg.trkpt;

  // trkpt を座標として出力用へ格納。
  for (const a of array) {
    // lnglat.push([Number(a["@_lat"]), Number(a["@_lon"])]);
    lnglat.push(new LngLat(Number(a["@_lon"]), Number(a["@_lat"])));
  }

  return lnglat;
}

/**
 * 渡された文字列がGPXファイルかどうかを判別する。
 * @param gpx ファイルの中身の文字列
 * @returns GPXファイルか否か
 */
export function isGpx(gpx: string): boolean {
  const parser = new XMLParser();
  let jsonObj = parser.parse(gpx);

  // {} が返ってきたらXMLではない。
  if (Object.keys(jsonObj).length === 0) {
    console.log("XMLファイルではないと判定されました。");
    return false;
  }

  // キーに gpx を含んでいたらGPXと判定。
  for (const key of Object.keys(jsonObj)) {
    if (key.toUpperCase() === "GPX") {
      return true;
    }
  }

  console.log("GPXファイルではないと判定されました。");
  return false;
}
