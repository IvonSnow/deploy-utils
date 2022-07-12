const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const { error, success, info } = require("../util/logger.js");
const path = require("path");
const { execSync, exec } = require("child_process");

/*
 * 编译并部署
 */
const buildForDeploy = () => {
	const question = [
		{
			type: "confirm",
			name: "isBuildCode",
			message: `是否立即编译镜像？`,
		},
	];

	inquirer.prompt(question).then(async (answers) => {
		if (answers.isBuildCode) {
			const spinner = ora("开始编译项目...\n").start();

			// 确保.env文件存在
			fs.ensureFileSync(path.join("", "./webapp/.env"));
			// 获取版本号
			const back_commit = execSync("git rev-parse --short HEAD", {
				cwd: path.join("", "./webapp/backend/backend-service"),
			}).toString();
			const middle_commit = execSync("git rev-parse --short HEAD", {
				cwd: path.join("", "./webapp/middle/qingyun-middle"),
			}).toString();
			const blog_commit = execSync("git rev-parse --short HEAD", {
				cwd: path.join("", "./webapp/frontend/blog-front"),
			}).toString();
			const home_commit = execSync("git rev-parse --short HEAD", {
				cwd: path.join("", "./webapp/home/web-home"),
			}).toString();
			// console.log("当前git版本号:", back_commit, middle_commit, blog_commit);

			// 保存进.env使其能够在docker-compose中被引用
			await fs.writeFile(
				"./webapp/.env",
				`BACKEND_COMMIT=${back_commit}\nMIDDLE_COMMIT=${middle_commit}\nBLOG_COMMIT=${blog_commit}\nHOME_COMMIT=${home_commit}\n`
			);

			execSync("docker-compose up -d", {
				cwd: path.join("", "./webapp"),
				stdio: "inherit",
			});

			try {
				execSync("docker system prune -f", {
					stdio: "inherit",
				});
			} catch (err) {}

			spinner.stop();
		}
	});
};

module.exports = buildForDeploy;
