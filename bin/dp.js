#!/usr/bin/env node
const chalk = require("chalk");
const { program } = require("commander");
const initProject = require("./script/init.js");
const clearProject = require("./script/clear.js");
const updateApp = require("./script/up.js");

console.log();
console.log(chalk.yellow("===== D E P L O Y - U T I L ====="));
console.log();

program
	.name("deploy-util")
	.description("util for updaete code, build images, deploy by docker")
	.version("0.1.22");

program
	.command("init")
	.description("init webapp codespace")
	.action(() => {
		initProject();
	});

program
	.command("clear")
	.description("clear webapp")
	.action(() => {
		clearProject();
	});

program
	.command("up")
	.description("pull code, build and deploy")
	.option("-a, --app <char>", "slecet the app to pull and build")
	.option(
		"-v, --version <char>",
		"the version to pull and build, default latest, can be used to rollback "
	)
	.action(({ app, version }) => {
		if (!app) {
			console.error("must has a target app, e.g. -a | --app blog");
		}
		const cmds = ["frontend", "middle", "backend", "home"];
		if (!cmds.includes(app)) {
			console.error(`仅支持${cmds.join("|")}之一`);
			return;
		}
		if (!version) {
			version = "latest";
		}

		updateApp(app, version);
	});

// 必要，否则上面的不起效
program.parse();
