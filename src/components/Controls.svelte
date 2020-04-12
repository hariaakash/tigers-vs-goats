<script>
	import {
		onMount
	} from 'svelte';

	onMount(async () => {});
</script>

<div class="box">
	<div class="tile is-ancestor is-vertical">
		<div class="tile is-parent is-vertical">
			<div class="tile is-child notification is-primary">
				<p class="title">Vertical...</p>
				<p class="subtitle">Top tile</p>
			</div>
			<div class="tile is-child notification is-warning">
				<p class="title">...tiles</p>
				<p class="subtitle">Bottom tile</p>
			</div>
		</div>
	</div>
</div>