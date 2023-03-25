import { get, writable } from "svelte/store";
import type { LngLat } from "maplibre-gl";
import { isGpx, lnglatFromGpx } from "./gpx";

/** 地図に表示する座標のリスト */
export const markerPoints = writable<LngLat[]>([]);

/** 地図を座標に合わせて拡大縮小させるかどうかのフラグ。 */
export const fitBoundsFlag = writable(false);

////////////////////////////////////////////////////////////////////////////////////

/**
 * 座標からマーカーをセットする。
 * @param lnglat 座標のリスト
 * @param fit 境界にフィットさせるか
 */
export function setMarkerPoints(lnglat: LngLat[], fit?: boolean) {
  if (fit === true) {
    fitBoundsFlag.set(true);
  } else {
    fitBoundsFlag.set(false);
  }
  markerPoints.set(lnglat);
}

// 画面に表示する座標一覧を更新する。
export function openGpx(gpx: string, fit?: boolean) {
  if (!isGpx(gpx)) {
    return;
  }

  const lnglat = lnglatFromGpx(gpx);

  setMarkerPoints(lnglat, true);
}
