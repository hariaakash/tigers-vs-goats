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

	import {
		faAngleLeft
	} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
	import {
		faAngleRight
	} from '@fortawesome/free-solid-svg-icons/faAngleRight';
	import {
		faAngleDoubleRight
	} from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight';

	import app from '../../stores/app.helper';

	import {
		startGame,
		stopGame,
		resetGame,
		moveNow,
		moveBack,
		moveForward,
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
	}

	button {
		border: none;
	}

	button[disabled] {
		opacity: 0.5;
		background-color: #ff7f50;
		border: none;
		margin-left: 1px;
		margin-right: 1px;
	}
</style>

<div class="columns">
	<div class="column">
		<div class="tags has-addons are-large is-centered">
			<span class="tag is-orange">
				<figure class="image is-24x24">
					<img src="{img.goat}" alt="goats" />
				</figure>
			</span>
			<span id="outSideGoats" class="tag"></span>
		</div>
	</div>
	<div class="column">
		<div class="buttons has-addons is-centered">
			<button on:click="{toggleGame}" class="button is-orange">
				<Icon icon="{playIcon}" class="has-text-white" />
			</button>
			<button on:click="{resetGame}" class="button is-orange">
				<Icon icon="{faTrash}" class="has-text-white" />
			</button>
			<button on:click="{onToggle}" class="button is-orange">
				<Icon icon="{fullscreenIcon}" class="has-text-white" />
			</button>
		</div>
	</div>
	<div class="column">
		<div class="buttons has-addons is-centered">
			<button id="moveBackButton" on:click="{moveBack}" class="button is-orange" disabled>
				<Icon icon="{faAngleLeft}" class="has-text-white" />
			</button>
			<button id="moveNowButton" on:click="{moveNow}" class="button is-orange" disabled>
				<Icon icon="{faAngleDoubleRight}" class="has-text-white" />
			</button>
			<button id="moveForwardButton" on:click="{moveForward}" class="button is-orange" disabled>
				<Icon icon="{faAngleRight}" class="has-text-white" />
			</button>
		</div>
	</div>
	<div class="column">
		<div class="tags has-addons are-large is-centered">
			<span id="outSideTigers" class="tag"></span>
			<span class="tag is-orange">
				<figure class="image is-24x24">
					<img src="{img.tiger}" alt="tigers" />
				</figure>
			</span>
		</div>
	</div>
</div>