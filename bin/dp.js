#!/usr/bin/node
import chalk from "chalk";
import { Command } from "commander";
import initProject from "./script/init.js";
import clearProject from "./script/clear.js";

const program = new Command();

console.log();
console.log(chalk.yellow("===== D E P L O Y - U T I L ====="));
console.log();

program
	.name("deploy-util")
	.description("util for updaete code, build images, deploy by docker")
	.version("0.1.0");

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
	.option("-p, --pull <char>", "only pull code")
	.action(({ pull }) => {
		console.log(pull);
	});

// 必要，否则上面的不起效
program.parse();
