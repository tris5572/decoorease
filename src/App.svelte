<script lang="ts">
  import DropZone from "./lib/DropZone.svelte";
  import Map from "./lib/Map.svelte";
  import OperationView from "./lib/OperationView.svelte";
</script>

<main>
  <div id="container">
    <Map />
    <OperationView />
  </div>
  <DropZone />
</main>

<style>
  /* ページの余白を削除する */
  :global(#app) {
    margin: 0;
    padding: 0;
  }

  #container {
    display: flex;
    flex-wrap: nowrap;
    width: 100dvw;
  }
</style>
