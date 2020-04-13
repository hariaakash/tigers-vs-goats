<script>
	import "./styles.scss"

	import Header from './components/Header.svelte';
	import Main from './components/Main.svelte';
</script>

<section class="section">
	<Header />
	<Main />
</section>

<style>
	:global(body) {
		background-color: #ff7f50;
		width: 100vw;
		height: 100vh;
	}
</style>