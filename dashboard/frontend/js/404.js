$(function () {
	$('.gohome').click(function () {
		window.location.href = '/';
	});
	$('.gologin').click(function () {
		window.location.href = '/api/discord/login';
	});
	$('.joinKingdom').click(function () {
		window.location.href = `${window.location.href}?confirm=yes`;
	});
	$('.gochannel').click(function () {
		const urlParams = new URLSearchParams(window.location.search);
		const channel = urlParams.get('channel');
		if (!channel) return alert('Missing channel on URL!');
		window.location.href = `https://discord.com/channels/528602970569441282/${channel}`;
	});
	window.addEventListener('hashchange', function () {
		if (window.location.href.includes('#')) {
			const sel = window.location.href.split('#');
			window.location.href = `/#${sel[1]}`;
		}
	});
});
