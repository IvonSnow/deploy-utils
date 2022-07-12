const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const { error, success, info } = require("../util/logger.js");
const path = require("path");
const { execSync, exec } = require("child_process");
const buildForDeploy = require("../util/build.js");

const initProject = () => {
	fs.mkdir(path.join("", "./webapp"), (err) => {
		if (err) {
			error(`${err}`);
			return false;
		}
		success(`webapp文件创建成功`);
		const spinner = ora("加载webapp部署配置文件...\n").start();

		const templatePath = path.resolve(__dirname, `../template`); // 模板所在路径
		const projectPath = path.join("", `./webapp`);
		fs.copy(templatePath, projectPath, (err) => {
			spinner.stop();
			if (err) {
				error(`${err}`);
				return false;
			}
			success("webapp部署配置文件模版创建完成！");
			pullCode();
			return true;
		});
	});
};

/*
 * 从git上拉取代码
 */
const pullCode = () => {
	const question = [
		{
			type: "confirm",
			name: "ispullCode",
			message: `是否立即拉取项目代码？`,
		},
	];

	inquirer
		.prompt(question)
		.then(async (answers) => {
			if (answers.ispullCode) {
				const spinner = ora("开始拉取项目代码...\n").start();

				const spinner_service = ora("clone backend-service\n").start();
				execSync("git clone git@github.com:IvonSnow/backend-service.git", {
					cwd: path.join("", "./webapp/backend"),
					stdio: "inherit",
				});
				spinner_service.stop();

				const spinner_middle = ora("clone qingyun-middle\n").start();
				execSync("git clone git@github.com:IvonSnow/qingyun-middle.git", {
					cwd: path.join("", "./webapp/middle"),
					stdio: "inherit",
				});
				spinner_middle.stop();

				const spinner_blog = ora("clone blog-front\n").start();
				execSync("git clone git@github.com:IvonSnow/blog-front.git", {
					cwd: path.join("", "./webapp/frontend"),
					stdio: "inherit",
				});
				spinner_blog.stop();

				const spinner_home = ora("clone web-home\n").start();
				execSync("git clone git@github.com:IvonSnow/web-home.git", {
					cwd: path.join("", "./webapp/home"),
					stdio: "inherit",
				});
				spinner_home.stop();

				spinner.stop();
				success("代码拉取成功");
				buildForDeploy();
			}
		})
		.catch((err) => {
			if (err.isTtyError) {
				// Prompt couldn't be rendered in the current environment
				error("Prompt couldn't be rendered in the current environment");
			} else {
				// Something else went wrong
				console.error(err);
			}
		});
};

module.exports = initProject;
