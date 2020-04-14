<script>
    import positions from "../../static/boardPositions";
    import {
        processUserInput
    } from "../../helpers/utilities.js";

    const imageSize = 8;
    const circleRadius = 2.5;
    const img = {
        empty: "./img/empty.svg"
    };

    const callProcessHandler = event => {
        processUserInput({
            id: parseInt(event.target.id.replace("i", "")),
            class: event.target.className.baseVal
        });
    };
</script>

<style>
    .outline {
        fill: none;
        stroke: #8395a7;
    }

    .circle {
        opacity: 1;
        fill: #ff7f50;
        fill-opacity: 1;
    }

    .marker {
        text-align: center;
        fill: #ffffff;
        font-size: 15%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        text-anchor: middle;
    }
</style>

<svg viewBox="0 0 100 100" height="80%" width="80%">
    <g>
        <!-- Outline -->
        <g>
            <polygon id="triangle" points="50 10, 95 90, 5 90" class="outline" />
            <rect id="rectangle" x="5" y="40" width="90" height="30" class="outline" />
            <line id="middleLine" x1="5" y1="55" x2="95" y2="55" class="outline" />
            <line id="rightLine" x1="50" y1="10" x2="65" y2="90" class="outline" />
            <line id="leftLine" x1="50" y1="10" x2="35" y2="90" class="outline" />
        </g>
        <!-- Circle -->
        {#each positions as position, key}
            <g>
                <circle
                    id="c{key}"
                    cx={position.cx}
                    cy={position.cy}
                    r={circleRadius}
                    class="circle" />
                <text
                    id="t{key}"
                    x={position.cx}
                    y={position.cy}
                    alignment-baseline="central"
                    class="marker">
                    {key}
                </text>
                <image
                    on:click={callProcessHandler}
                    id="i{key}"
                    href={img.empty}
                    x={position.cx - imageSize / 2}
                    y={position.cy - imageSize / 2}
                    height={imageSize}
                    width={imageSize}
                    class="empty" />
            </g>
        {/each}
	</g>
</svg>