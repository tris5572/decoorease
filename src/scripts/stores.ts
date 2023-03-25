import { get, writable } from "svelte/store";
import type { LngLat } from "maplibre-gl";
import { isGpx, lnglatFromGpx } from "./gpx";

/** 地図に表示する座標のリスト */
export const markerPoints = createMarkerPoints();

function createMarkerPoints() {
  const { subscribe, set, update } = writable<LngLat[]>([]);
  return {
    subscribe,
    set: (v: LngLat[]) => set(v),
    append: (v: LngLat[]) => update((a) => [...a, ...v]),
    clear: () => set([]),
  };
}

/** 地図を座標に合わせて拡大縮小させるかどうかのフラグ。 */
export const fitBoundsFlag = createFitBoundsFlag();

function createFitBoundsFlag() {
  const { subscribe, set, update } = writable(false);
  return {
    subscribe,
    on: () => set(true),
    off: () => set(false),
  };
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * 座標からマーカーをセットする。
 * @param lnglat 座標のリスト
 * @param fit 境界にフィットさせるか
 */
export function setMarkerPoints(lnglat: LngLat[], fit?: boolean) {
  if (fit === true) {
    fitBoundsFlag.on();
  } else {
    fitBoundsFlag.off();
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
