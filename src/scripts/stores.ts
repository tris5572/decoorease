import { get, writable } from "svelte/store";
import type { LngLat } from "maplibre-gl";
import { isGpx, lnglatFromGpx } from "./gpx";

/** 地図に表示する座標のリスト */
export const markerPoints = writable<LngLat[]>([]);

// 画面に表示する座標一覧を更新する。
export function openGpx(gpx: string, fit?: boolean) {
  if (!isGpx(gpx)) {
    return;
  }

  const lnglat = lnglatFromGpx(gpx);

  markerPoints.set(lnglat);
}
