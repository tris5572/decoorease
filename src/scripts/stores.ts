import { writable } from "svelte/store";
import { isGpx, pointsFromGpx } from "./gpx";
import type { Point } from "./point";

/** 地図に表示する座標のリスト */
export const markerPoints = createMarkerPoints();

function createMarkerPoints() {
  const { subscribe, set, update } = writable<Point[]>([]);
  return {
    subscribe,
    set: (v: Point[]) => set(v),
    append: (v: Point[]) => update((a) => [...a, ...v]),
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

/** 表示しているGPXファイルの中身。 */
export const sourceGpx = createSourceGpx();

function createSourceGpx() {
  const { subscribe, set, update } = writable("");
  return {
    subscribe,
    set: (v: string) => set(v),
    clear: () => set(""),
  };
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * 座標からマーカーをセットする。
 * @param lnglat 座標のリスト
 * @param fit 境界にフィットさせるか
 */
export function setMarkerPoints(lnglat: Point[], fit?: boolean) {
  if (fit === true) {
    fitBoundsFlag.on();
  } else {
    fitBoundsFlag.off();
  }
  markerPoints.set(lnglat);
}

// GPXファイルを元に画面に反映させる。
export function openGpx(gpx: string, fit?: boolean) {
  if (!isGpx(gpx)) {
    return;
  }

  const lnglat = pointsFromGpx(gpx);
  setMarkerPoints(lnglat, true);
  sourceGpx.set(gpx);
}
