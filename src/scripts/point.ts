import { LngLat } from "maplibre-gl";

/** 座標を扱うデータのクラス。経度・緯度・標高を持つ。 */
export class Point {
  constructor(public lng: number, public lat: number, public ele?: number) {}

  /**
   * 経度緯度のみの maplibregl.LngLat を返す。
   * ただこれで変換せzにそのまま LngLat が必要とされるところへ渡しても問題ない。
   * @returns 経度緯度のみの値
   */
  lnglat(): LngLat {
    return new LngLat(this.lng, this.lat);
  }
}

// Point のリストから LngLat のリストを生成する。
export function lnglatsFromPoints(points: Point[]): LngLat[] {
  const output = [];

  for (const v of points) {
    output.push(v.lnglat());
  }

  return output;
}

////////////////////////////////////////////////////////////////////////////////
// 操作関係
////////////////////////////////////////////////////////////////////////////////

/** 直線と判別する閾値。単位はラジアン。 */
const STRAIGHT_THRESHOLD = 0.005;

/** 近接判定の閾値。単位は緯度経度の距離の2乗。 */
const CLOSE_THRESHOLD = 0.00000005;

/**
 * 直線の座標を削減する。最大で 1/max の座標数になる。
 * @param points
 * @param angle 直線と判定する角度。単位は度[deg]。
 * @param max
 * @returns
 */
export function decreaseStraightPoint(
  points: Point[],
  angle?: number,
  max = 5
): Point[] {
  const threshold =
    angle == null ? STRAIGHT_THRESHOLD : (angle * Math.PI) / 180;

  let i = 0;
  const output: Point[] = [];
  output.push(points[0]);

  while (i < points.length - max) {
    const p1 = points[i];
    let j = 1;
    for (let j = 1; j <= max; j++) {
      const p2 = points[i + j];
      const p3 = points[i + j + 1];

      const rad1 = Math.atan2(p2.lng - p1.lng, p2.lat - p1.lat);
      const rad2 = Math.atan2(p3.lng - p1.lng, p3.lat - p1.lat);

      if (Math.abs(rad1 - rad2) < threshold) {
        // 角度が閾値より小さいときは直線として引き続き読み飛ばす。
        // ただし j が max に達しているときはそこでひとまず完了とする。
        if (j === max) {
          i = i + j;
          output.push(p2);
        }
        continue;
      } else {
        // 軌跡が曲がっている場合は出力に追加してから次の座標へ。
        output.push(p2);
        i = i + j;
        break;
      }
    }
  }
  return output;
}

/**
 * 近接した座標を削除する。
 * @param points 座標のリスト
 * @param dist 近接判定とするおよその距離(メートル)
 * @returns 座標のリスト
 */
export function decreaseClosePoint(points: Point[], dist?: number): Point[] {
  const output: Point[] = [];
  let flag = false; // 前回のループでスキップしたかどうかのフラグ。近接が連続したときに消えすぎないようにする。
  const threshold = dist == null ? CLOSE_THRESHOLD : dist * dist * 0.0000000001;

  // 前の座標と近すぎるときにスキップする。
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const d = Math.pow(p1.lng - p2.lng, 2) + Math.pow(p1.lat - p2.lat, 2);

    if (threshold < d || flag === true) {
      // 距離が遠いか、前回スキップしていれば出力対象。
      output.push(p1);
      flag = false;
    } else {
      flag = true;
    }
  }
  return output;
}
