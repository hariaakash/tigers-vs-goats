<script>
	import {
		onMount
	} from 'svelte';

	import app from '../stores/app.helper';

	onMount(async () => {
		app.init();
	});
</script>

<div class="card">
	<header class="card-header">
		<h1 class="card-header-title">Game Controls</h1>
	</header>
	<div class="card-content">
		<div class="field is-horizontal">
			<div class="field-label is-normal">
				<label class="label">Mode</label>
			</div>
			<div class="field-body">
				<div class="field is-narrow">
					<div class="control">
						<div class="select is-full-width">
							<select id="gameType">
								<optgroup label="Game Types:">
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
	</div>
</div>