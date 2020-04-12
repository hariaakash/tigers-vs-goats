<script>
	import {
		onMount
	} from 'svelte';

	import app from '../stores/app.helper';

	import {
		moveNow,
		moveBack,
		moveForward,
		startGame,
		stopGame,
		resetGame,
	} from '.././helpers/utilities';

	onMount(async () => {
		app.init();
	});
</script>

<div class="card">
	<div class="card">
		<header class="card-header">
			<p class="card-header-title has-text-centered">Game Controls</p>
		</header>
		<div class="card-content">
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<label class="label">Game Type</label>
				</div>
				<div class="field-body">
					<div class="field is-narrow">
						<div class="control">
							<div class="select">
								<select id="gameType">
									<optgroup label="Computer plays as:">
										<option value="0">Computer plays as tigers</option>
										<option value="1">Computer plays as goats</option>
										<option value="2">Computer vs Computer</option>
										<option value="3">Human vs Human</option>
									</optgroup>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<p>Side to move: <span id="SideToMove">Tiger</span></p>
			<p>Game Status: <span id="Status"></span></p>
			<p>Outside Goats: <span id="OutSideGoats">0</span></p>
			<button on:click="{startGame}" id="StartButton" class="button" type="button">Start</button>
			<button on:click="{moveBack}" id="MoveBackButton" class="button" type="button">&lt;</button>
			<button on:click="{moveNow}" id="MoveNowButton" class="button" type="button">Move Now!</button>
			<button on:click="{moveForward}" id="MoveForwardButton" class="button" type="button">&gt;</button>
			<button on:click="{stopGame}" id="StopButton" class="button" type="button">Stop</button>
			<button on:click="{resetGame}" id="ResetButton" class="button" type="reset">Reset</button>
		</div>
	</div>
</div>