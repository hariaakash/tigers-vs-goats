<script>
	import Icon from 'fa-svelte';

	import {
		faExpand
	} from '@fortawesome/free-solid-svg-icons/faExpand';
	import {
		faCompress
	} from '@fortawesome/free-solid-svg-icons/faCompress';

	export let isFull;
	export let onToggle;

	$: fullscreenIcon = isFull ? faCompress : faExpand;
	const img = {
		tiger: './img/tiger.svg',
		goat: './img/goat.svg',
	};
</script>

<style>
	.is-orange {
		background: #ff7f50;
	}
</style>

<div class="columns">
	<div class="column is-4">
		<div class="tags is-pulled-left has-addons are-large">
			<span class="tag is-orange">
				<figure class="image is-32x32">
					<img src="{img.goat}" alt="goats" />
				</figure>
			</span>
			<span id="outSideGoats" class="tag"></span>
		</div>
	</div>
	<div class="column is-4">
		<button on:click="{onToggle}" class="button is-rounded">
			<Icon icon="{fullscreenIcon}" />
		</button>
	</div>
	<div class="column is-4">
		<div class="tags is-pulled-right has-addons are-large">
			<span id="outSideTigers" class="tag"></span>
			<span class="tag is-orange">
				<figure class="image is-32x32">
					<img src="{img.tiger}" alt="tigers" />
				</figure>
			</span>
		</div>
	</div>
</div>