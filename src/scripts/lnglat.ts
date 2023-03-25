import type { LngLat } from "maplibre-gl";

/** 直線と判別する閾値。単位はラジアン。 */
const STRAIGHT_THRESHOLD = 0.005;

/** 近接判定の閾値。単位は緯度経度の距離の2乗。 */
const CLOSE_THRESHOLD = 0.00000005;

/**
 * 直線の座標を削減する。最大で 1/max の座標数になる。
 * @param lnglat
 * @param max
 * @returns
 */
export function decreaseStraightPoint(lnglat: LngLat[], max = 5): LngLat[] {
  let i = 0;
  const output: LngLat[] = [];
  output.push(lnglat[0]);

  while (i < lnglat.length - max) {
    const p1 = lnglat[i];
    let j = 1;
    for (let j = 1; j <= max; j++) {
      const p2 = lnglat[i + j];
      const p3 = lnglat[i + j + 1];

      const rad1 = Math.atan2(p2.lng - p1.lng, p2.lat - p1.lat);
      const rad2 = Math.atan2(p3.lng - p1.lng, p3.lat - p1.lat);

      if (Math.abs(rad1 - rad2) < STRAIGHT_THRESHOLD) {
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

// 近接した座標を削除する。
/**
 *
 * @param lnglat 座標のリスト
 * @param dist 近接判定とするおよその距離(メートル)
 * @returns 座標のリスト
 */
export function decreaseClosePoint(lnglat: LngLat[], dist?: number): LngLat[] {
  const output: LngLat[] = [];
  let flag = false; // 前回のループでスキップしたかどうかのフラグ。近接が連続したときに消えすぎないようにする。
  const threshold = dist == null ? CLOSE_THRESHOLD : dist * dist * 0.0000000001;

  // 前の座標と近すぎるときにスキップする。
  for (let i = 0; i < lnglat.length - 1; i++) {
    const p1 = lnglat[i];
    const p2 = lnglat[i + 1];
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
