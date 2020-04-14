<script>
    import Fullscreen from 'svelte-fullscreen';

    import Header from './Header.svelte';
    import Content from './Content.svelte';

    let isFull = false;
</script>

<style>
    .is-primer-blue {
        background: #222f3e;
    }
</style>

<Fullscreen let:onToggle on:change="{() => isFull = !isFull}">
    <div id="board" class="box is-primer-blue p-b-0">
        <Header isFull="{isFull}" onToggle="{onToggle}" />
        <Content />
    </div>
</Fullscreen>