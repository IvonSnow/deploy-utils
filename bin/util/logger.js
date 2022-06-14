import chalk from "chalk";

const padStart = String.prototype.padStart;

const format = (label, msg) =>
	msg
		.split("\n")
		.map((line, i) =>
			i === 0 ? `${label} ${line}` : padStart(line, chalk.reset(label).length)
		)
		.join("\n");

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

export function info(msg, tag = null) {
	console.log(
		format(
			`${chalk.bgCyan.black(" INFO ")}${tag ? chalkTag(tag) : ""}`,
			chalk.cyan(` ♫ ${msg}`)
		)
	);
}

export function success(msg, tag = null) {
	console.log(
		format(
			`${chalk.bgGreen.black(" DONE ")}${tag ? chalkTag(tag) : ""}`,
			` ✔ ${msg}`
		)
	);
}

export function warn(msg, tag = null) {
	console.warn(
		format(
			`${chalk.bgYellow.black(" WARN ")}${tag ? chalkTag(tag) : ""}`,
			chalk.yellow(` ❣ ${msg}`)
		)
	);
}

export function error(msg, tag = null) {
	console.error(
		format(
			`${chalk.bgRed(" ERROR ")}${tag ? chalkTag(tag) : ""}`,
			chalk.red(` ✘ ${msg}`)
		)
	);
	if (msg instanceof Error) {
		console.error(msg.stack);
	}
}
