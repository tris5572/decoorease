import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { get } from "svelte/store";
import { Point } from "./point";
import { markerPoints, sourceGpx } from "./stores";

export function updateGpxByDroppedFile() {}

/**
 * GPXファイルから座標(Point)のリストを生成する。
 * @param gpx GPXファイルの中身の文字列
 * @returns 座標のリスト。
 */
export function pointsFromGpx(gpx: string): Point[] {
  const points = [];

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
    points.push(
      new Point(Number(a["@_lon"]), Number(a["@_lat"]), Number(a["ele"]))
    );
  }

  return points;
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

/**
 * 削減結果を元に、出力するGPXファイルを生成する。
 * @returns GPXファイルの文字列。出力不可のときは undefined。
 */
export function createOutputGpx(): string | undefined {
  const parsingOptions = {
    ignoreAttributes: false,
  };
  const parser = new XMLParser(parsingOptions);
  let jsonObj = parser.parse(get(sourceGpx));

  // GPXでなかったり、正常に生成できない恐れがあるときは undefined を返す。
  if (jsonObj.gpx?.trk?.trkseg?.trkpt == null) {
    return undefined;
  }

  const outTrkpts = []; // 座標を追加したリスト

  // 編集後の座標のリストを生成して、読み込んだGPXデータの当該部分を上書き。
  for (const v of get(markerPoints)) {
    const obj = {};
    obj["@_lon"] = v.lng;
    obj["@_lat"] = v.lat;
    obj["ele"] = v.ele;
    outTrkpts.push(obj);
  }
  jsonObj.gpx.trk.trkseg.trkpt = outTrkpts;

  const buildingOptions = {
    ignoreAttributes: false,
    format: true,
  };
  const builder = new XMLBuilder(buildingOptions);
  let xmlDataStr = builder.build(jsonObj);

  return xmlDataStr;
}
