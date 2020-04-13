<script>
    import {
        onMount
    } from "svelte";

    import BoardHeader from './BoardHeader.svelte';
    import Board from './Board.svelte';
    import Controls from './Controls.svelte';
</script>

<div class="container">
    <div class="columns">
        <div class="column is-8 has-text-centered">
            <Board />
        </div>
        <div class="column is-4">
            <BoardHeader />
            <Controls />
        </div>
    </div>
</div>