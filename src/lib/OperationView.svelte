<script lang="ts">
  import { decreaseStraightPoint } from "../scripts/lnglat";
  import { markerPoints } from "../scripts/stores";

  function runDecreaseStraight() {
    console.log("run");
    const lnglat = decreaseStraightPoint($markerPoints);
    $markerPoints = lnglat;
  }
</script>

<div id="component">
  <div id="wrapper">
    <div class="box">ポイント数: {$markerPoints.length}</div>
    <div class="box">
      直線削減<br />
      <button on:click={runDecreaseStraight}>直線削減実行</button>
    </div>
  </div>
</div>

<style>
  #component {
    background: hsl(204, 6%, 83%);
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
    padding: 0.1em 0.4em;
    margin-bottom: 0.4em;
  }
  /* MapLibre のスタイルが効いてしまうので、色々と指定する。 */
  button {
    padding: 0.2em 0.6em;
    border: 1px solid gray;
    border-radius: 4px;
    background: linear-gradient(hsl(0, 0%, 96%), hsl(0, 0%, 80%));
  }
</style>
