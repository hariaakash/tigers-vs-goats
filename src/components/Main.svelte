<script>
    import {
        onMount
    } from "svelte";

    import Board from './Board/Main.svelte';
    import ControlsHeader from './ControlsHeader.svelte';
    import Controls from './Controls.svelte';
</script>

<div class="container">
    <div class="columns">
        <div class="column is-8 has-text-centered">
            <Board />
        </div>
        <div class="column is-4">
            <ControlsHeader />
            <Controls />
        </div>
    </div>
</div>