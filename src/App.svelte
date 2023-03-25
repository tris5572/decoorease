<script lang="ts">
  import DropZone from "./lib/DropZone.svelte";
  import Map from "./lib/Map.svelte";
</script>

<main>
  <Map />
  <DropZone />
</main>

<style>
  /* ページの余白を削除する */
  :global(#app) {
    margin: 0;
    padding: 0;
  }
</style>
