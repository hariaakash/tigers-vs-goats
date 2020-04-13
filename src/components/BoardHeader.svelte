<script>
	const img = {
		tiger: './img/tiger.svg',
		goat: './img/goat.svg',
	};
</script>

<style>
	.is-primer-blue {
		background: #222f3e;
	}

	.is-orange {
		background: #ff7f50;
	}
</style>

<div class="notification is-primer-blue is-paddingless is-marginless">
	<div class="columns">
		<div class="column">
			<div class="tags is-pulled-left has-addons are-large">
				<span class="tag is-orange">
					<figure class="image is-32x32">
						<img src="{img.goat}" alt="goats" />
					</figure>
				</span>
				<span id="outSideGoats" class="tag"></span>
			</div>
		</div>
		<div class="column">
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
</div>