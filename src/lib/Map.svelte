<script lang="ts">
  import maplibregl, {
    GeoJSONSource,
    LngLatBounds,
    Map,
    Marker,
  } from "maplibre-gl";
  import { onMount } from "svelte";
  import { lnglatValuesFromPoints } from "../scripts/point";
  import { fitBoundsFlag, markerPoints } from "../scripts/stores";

  const MARKER_LINE_ID = "marker_line";

  let map: Map;
  const markers: Marker[] = [];

  // 地図を初期化する。
  onMount(() => {
    map = new maplibregl.Map({
      container: "map",
      style:
        "https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json", // スタイル指定
      center: [139.75, 35.685], // 初期表示位置。 [lng, lat] で経度・緯度の順なので注意
      zoom: 8, // 初期表示拡大率
    });

    // 拡大縮小コントロールを表示する。
    map.addControl(new maplibregl.NavigationControl({}));

    // 線を初期化する。
    // 初期状態では線自体は描画しないが、HMR時には描画する。
    map.on("load", () => {
      map.addSource(MARKER_LINE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: lnglatValuesFromPoints($markerPoints),
          },
        },
      });
      map.addLayer({
        id: MARKER_LINE_ID,
        type: "line",
        source: MARKER_LINE_ID,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "hsla(180, 89%, 35%, 0.6)",
          "line-width": 2,
        },
      });
    });
  });

  // 表示する座標を更新する。
  $: {
    if (map != null) {
      const bounds = new LngLatBounds(); // ズーム用の境界

      // 既存マーカーを削除する。
      for (const m of markers) {
        m.remove();
      }
      markers.length = 0;

      // マーカーを表示する。
      for (const ll of $markerPoints) {
        const marker = new Marker({
          element: markerElement(),
          offset: [0, -4], // なぜか下にズレるのでオフセット
        })
          .setLngLat(ll)
          .addTo(map);
        markers.push(marker);
        bounds.extend(ll.lnglat());
      }

      // 線の表示を更新する。
      updateLine();

      // 表示をフィットさせる。
      if (!bounds.isEmpty() && $fitBoundsFlag) {
        map.fitBounds(bounds, { padding: 40, linear: false });
      }
    }
  }

  // マーカーとして使用するHTML要素（中身はSVG）を生成する。
  function markerElement(): HTMLElement {
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="4" class="marker-circle" />
    </svg>`;

    return el;
  }

  // 描画する線を更新する。
  function updateLine() {
    if (map == null || $markerPoints.length === 0) {
      return;
    }

    (map.getSource(MARKER_LINE_ID) as GeoJSONSource)?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: lnglatValuesFromPoints($markerPoints),
      },
    });
  }
</script>

<!------------------------------------------------------------------------------>

<svelte:head>
  <link
    href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
    rel="stylesheet"
  />
</svelte:head>
<div id="map" />

<!------------------------------------------------------------------------------>
<style>
  /* 画面いっぱいに地図を表示する */
  #map {
    width: 100%;
    height: 100dvh;
  }
  :global(.custom-marker) {
    margin: 0;
    padding: 0;
    width: 10px;
    height: 10px;
    vertical-align: middle;
  }
  :global(.marker-circle) {
    stroke: hsla(180, 89%, 35%, 0.6);
    fill: hsla(180, 100%, 50%, 0.2);
    stroke-width: 2px;
  }
</style>
