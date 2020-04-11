<script>
	import {
		onMount
	} from "svelte";

	import Board from './components/Board.svelte';

	onMount(async () => {});
</script>

<main>
	<h1>Hello from Board</h1>
	<Board></Board>
</main>

<style>
	main {
		padding: 1em;
	}

	h1 {
		text-align: center;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>