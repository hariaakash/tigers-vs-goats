<script>
	import Icon from 'fa-svelte';

	import {
		faExpand
	} from '@fortawesome/free-solid-svg-icons/faExpand';
	import {
		faCompress
	} from '@fortawesome/free-solid-svg-icons/faCompress';
	import {
		faPlay
	} from '@fortawesome/free-solid-svg-icons/faPlay';
	import {
		faPause
	} from '@fortawesome/free-solid-svg-icons/faPause';
	import {
		faTrash
	} from '@fortawesome/free-solid-svg-icons/faTrash';

	import app from '../../stores/app.helper';

	import {
		moveNow,
		moveBack,
		moveForward,
		startGame,
		stopGame,
		resetGame,
	} from '../../helpers/utilities';

	export let isFull;
	export let onToggle;

	const img = {
		tiger: './img/tiger.svg',
		goat: './img/goat.svg',
	};

	$: fullscreenIcon = isFull ? faCompress : faExpand;
	$: playIcon = $app.isInProgress ? faPause : faPlay;
	const toggleGame = () => {
		return $app.isInProgress ? stopGame() : startGame();
	}
</script>

<style>
	.is-orange {
		background: #ff7f50;
		color: #000000;
	}

	button {
		border: none;
	}
</style>

<div class="columns">
	<div class="column is-3">
		<div class="tags is-pulled-left has-addons are-large">
			<span class="tag is-orange">
				<figure class="image is-24x24">
					<img src="{img.goat}" alt="goats" />
				</figure>
			</span>
			<span id="outSideGoats" class="tag"></span>
		</div>
	</div>
	<div class="column is-6">
		<button id="playButton" on:click="{toggleGame}" class="button is-orange">
			<Icon icon="{playIcon}" class="has-text-white" />
		</button>
		<button id="resetButton" on:click="{resetGame}" class="button is-orange">
			<Icon icon="{faTrash}" class="has-text-white" />
		</button>
		<button on:click="{onToggle}" class="button is-orange">
			<Icon icon="{fullscreenIcon}" class="has-text-white" />
		</button>
	</div>
	<div class="column is-3">
		<div class="tags is-pulled-right has-addons are-large">
			<span id="outSideTigers" class="tag"></span>
			<span class="tag is-orange">
				<figure class="image is-24x24">
					<img src="{img.tiger}" alt="tigers" />
				</figure>
			</span>
		</div>
	</div>
</div>