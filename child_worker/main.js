//Initialise IPC processes
{
	process.on("message", async ({ task_id, code, args }) => {
		try {
			var async_function = new Function("args", `
				return (async () => {
					${code}
				})();
			`);
			var result = await async_function(args);
			
			process.send({ task_id, result });
		} catch (e) {
			process.send({ task_id, error: e.message });
		}
	});
}