process.on('uncaughtException', (err, origin) => {
        console.log(
		err,
		origin
	);
});