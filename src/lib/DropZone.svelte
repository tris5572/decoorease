<script lang="ts">
  import { openGpx } from "../scripts/stores";

  // ファイルをドロップするためのドロップゾーン。
  // ウィンドウ内にファイルをドラッグするとゾーンを有効化し、
  // ドラッグがゾーンの外に出たらゾーンを無効化する。

  let activeFlag = false;

  function showZone() {
    activeFlag = true;
  }

  function hideZone() {
    activeFlag = false;
  }

  // ドロップするファイルがウィンドウ内にドラッグされたときゾーンを有効化する。
  function windowDragEnter(e: DragEvent) {
    e.preventDefault();
    showZone();
  }

  function dropHandler(e: DragEvent) {
    // 規定の動作を防ぎ、ファイルが開かれないようにする。
    e.preventDefault();
    hideZone();

    if (e.dataTransfer.items) {
      // DataTransferItemList インターフェイスを使用して、ファイルにアクセスする
      [...e.dataTransfer.items].forEach((item, i) => {
        // ドロップしたものがファイルでない場合は拒否する
        if (item.kind === "file") {
          const file = item.getAsFile();
          // console.log(`…items file[${i}].name = ${file.name}`);
          readFile(file);
        }
      });
    } else {
      // DataTransfer インターフェイスを使用してファイルにアクセスする
      [...e.dataTransfer.files].forEach((file, i) => {
        // console.log(`…files file[${i}].name = ${file.name}`);
        readFile(file);
      });
    }
  }

  function dragOverHander(e: DragEvent) {
    e.preventDefault();
  }

  /**
   * ファイルのドラッグがドロップゾーンの外に出たときに非表示にするハンドラ。
   * これを window に対して行うと、enter と leave が繰り返し発生して正常に動作しない。
   * @param e
   */
  function dragLeaveHandler(e: DragEvent) {
    hideZone();
  }

  /**
   * 実際にファイルの内容を読み込み、GPXファイルならば座標を表示用にセットする。
   * @param file
   */
  async function readFile(file: File) {
    openGpx(await file.text(), true);
    // console.log("Dropped.");
  }
</script>

<svelte:window on:dragenter={windowDragEnter} />

<div
  id="area"
  class={activeFlag ? "active" : ""}
  on:drop={dropHandler}
  on:dragover={dragOverHander}
  on:dragleave={dragLeaveHandler}
/>

<style>
  #area {
    position: fixed;
    left: 0;
    top: 0;
    height: 100dvh;
    width: 100dvw;
    z-index: 100000;
    display: none;
    opacity: 30%;
    background-color: white;
  }
  #area.active {
    display: block;
  }
</style>
