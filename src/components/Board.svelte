<script>
	import {
		onMount
	} from 'svelte';

	import positions from '../static/boardPositions';

	const app = {};
	const imageSize = 8;
	const goat = './img/goat.svg';
	const tiger = './img/tiger.svg';

	onMount(async () => {
		const board = document.getElementById('board');
	});
</script>

<style>
	.outline {
		fill: none;
		stroke: #34495e;
	}

	.circle {
		opacity: 1;
		fill: #34495e;
		fill-opacity: 1;
	}

	.marker {
		text-align: center;
		fill: #FFFFFF;
		font-size: 15%;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		text-anchor: middle;
	}
</style>

<div class="box">
	<svg id="board" viewBox="0 0 100 100" height="80%" width="80%">
		<g>
			<!-- Outline -->
			<g>
				<polygon id="triangle" points="50 10, 90 90, 10 90" class="outline" />
				<rect id="rectangle" x="10" y="40" width="80" height="30" class="outline" />
				<line id="middleLine" x1="10" y1="55" x2="90" y2="55" class="outline" />
				<line id="rightLine" x1="50" y1="10" x2="65" y2="90" class="outline" />
				<line id="leftLine" x1="50" y1="10" x2="35" y2="90" class="outline" />
			</g>
			<!-- Circle -->
			{#each positions as position, key}
				<g>
					<circle id="c{key}" cx="{position.cx}" cy="{position.cy}" r="2" class="circle" />
					<text id="t{key}" x="{position.cx}" y="{position.cy}" alignment-baseline="central" class="marker">{key}</text>
					<image
						id="i{key}"
						href="{ key%2 === 0 ? tiger : goat}"
						x="{position.cx - imageSize/2}"
						y="{position.cy - imageSize/2}"
						height="{imageSize}"
						width="{imageSize}"
						alt="Position {key}"
					/>
				</g>
			{/each}
		</g>
	</svg>
</div>