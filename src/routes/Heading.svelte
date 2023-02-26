<script lang="ts">
	export let level: 1 | 2 = 2;
</script>

<svelte:element this={'h' + level}>
	<span><slot />&hairsp;.</span>
</svelte:element>

<style>
	h1,
	h2 {
		position: relative;
		font-size: var(--fluid-step-0);
	}

	h1 span,
	h2 span {
		display: inline-block;
		background-color: #ffffff;
		padding-right: var(--space-200);
	}

	h1::before,
	h2::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 100%;
		height: 1px;
		background-color: var(--c-gray-200);
		z-index: -1;
	}
</style>
