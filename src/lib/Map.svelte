<script lang="ts">
  import maplibregl, { LngLat, LngLatBounds, Map, Marker } from "maplibre-gl";
  import { onMount } from "svelte";
  import { markerPoints } from "../scripts/stores";

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
        const marker = new Marker({ element: markerElement() })
          .setLngLat(ll)
          .addTo(map);
        markers.push(marker);
        bounds.extend(ll);
      }
      // 表示をフィットさせる。
      if (!bounds.isEmpty()) {
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
    // el.innerHTML = `
    // <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    //   <circle cx="5" cy="5" r="4" stroke="blue" stroke-width="2" fill="none" />
    // </svg>`;

    return el;
  }
</script>

<!------------------------------------------------------------------------------>

<svelte:head>
  <link
    href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
    rel="stylesheet"
  />
</svelte:head>
<main>
  <div id="map" />
</main>

<!------------------------------------------------------------------------------>
<style>
  /* 画面いっぱいに地図を表示する */
  #map {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
  }
  :global(.custom-marker) {
    margin: 0;
    padding: 0;
    width: 10px;
    height: 10px;
  }
  :global(.marker-circle) {
    stroke: hsl(180, 89%, 35%);
    fill: hsla(180, 100%, 50%, 0.2);
    stroke-width: 2px;
  }
</style>
