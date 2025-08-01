//Import libraries
global.vm = require("vm");

//Initialise IPC processes
{
	process.on("message", async ({ task_id, code, args }) => {
		try {
			global.args = args;
			
			var result = await vm.runInThisContext(`
				(async () => {
					${code}
				})();
			`);
			
			process.send({ task_id, result });
		} catch (e) {
			process.send({ task_id, error: e.stack || e.message });
		}
	});
}