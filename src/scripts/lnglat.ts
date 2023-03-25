import type { LngLat } from "maplibre-gl";

/** 直線と判別する閾値。単位はラジアン。 */
const STRAIGHT_THRESHOLD = 0.005;

// 直線の座標を削減する。maxは最大で何個先まで見るか。
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
