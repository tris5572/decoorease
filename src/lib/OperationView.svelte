<script lang="ts">
  import { decreaseClosePoint, decreaseStraightPoint } from "../scripts/lnglat";
  import { markerPoints, setMarkerPoints } from "../scripts/stores";

  let closeValue = 30;

  // 直線部分を間引く。
  function runDecreaseStraight() {
    const lnglat = decreaseStraightPoint($markerPoints);
    setMarkerPoints(lnglat, false);
  }

  // 近接部分を間引く。
  function runDecreaseClose() {
    const lnglat = decreaseClosePoint($markerPoints, closeValue);
    setMarkerPoints(lnglat, false);
  }
</script>

<div id="component">
  <div id="wrapper">
    <div class="box">
      <p class="header">ポイント数</p>
      <div class="inner">
        {$markerPoints.length}
      </div>
    </div>
    <div class="box">
      <p class="header">直線削減</p>
      <div class="inner">
        <button on:click={runDecreaseStraight}>直線削減実行</button>
      </div>
    </div>
    <div class="box">
      <p class="header">近接削減</p>
      <div class="inner">
        間引き間隔：約{closeValue}m
        <input type="range" min="5" max="200" bind:value={closeValue} />
        <button on:click={runDecreaseClose}>近接削減実行</button>
      </div>
    </div>
  </div>
</div>

<style>
  #component {
    background: hsl(200, 6%, 83%);
    width: 15em;
    height: 100dvh;
    overflow-y: scroll;
  }
  #wrapper {
    padding: 0.4em;
    text-align: left;
    color: black;
    font-size: small;
  }
  .box {
    border: 1px solid hsl(0, 0%, 50%);
    padding: 0;
    margin-bottom: 0.4em;
  }
  .header {
    margin: 0;
    padding: 0em 0.2em 0.1em;
    background: hsl(200, 5%, 40%);
    color: white;
  }
  .inner {
    padding: 0.2em 0.4em;
  }
  /* MapLibre のスタイルが効いてしまうので、色々と指定する。 */
  button {
    padding: 0.2em 0.6em;
    border: 1px solid gray;
    border-radius: 4px;
    background: linear-gradient(hsl(0, 0%, 96%), hsl(0, 0%, 80%));
  }
</style>
