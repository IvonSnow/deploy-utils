const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const { error, success, info } = require("../util/logger.js");
const { execSync } = require("child_process");
const path = require("path");
const process = require("process");

// 从.env文件中加载环境变量
require("dotenv").config({ path: path.join("", "./webapp/.env") });

const clearProject = async () => {
	fs.access("./webapp", (err) => {
		if (err) {
			error("不存在webapp文件夹, 请在webapp的父文件夹中执行该命令");
			return;
		}

		const question = [
			{
				type: "confirm",
				name: "isClear",
				message: `是否清除项目？`,
			},
		];

		inquirer.prompt(question).then(async (answers) => {
			if (answers.isClear) {
				const spinner = ora("开始清理项目...\n").start();

				try {
					fs.accessSync("./webapp/docker-compose.yml");

					const spinner_image = ora("清理容器镜像...\n").start();

					execSync("docker-compose down", {
						cwd: path.join("", "./webapp"),
						stdio: "inherit",
					});

					try {
						execSync("docker system prune -f", {
							stdio: "inherit",
						});
					} catch (err) {}

					try {
						execSync(
							"docker rmi $(docker images | grep 'backend' | awk '{print $3}')",
							{
								stdio: "inherit",
							}
						);
					} catch (err) {}

					try {
						execSync(
							"docker rmi $(docker images | grep 'qingyun' | awk '{print $3}')",
							{
								stdio: "inherit",
							}
						);
					} catch (err) {}

					try {
						execSync(
							"docker rmi $(docker images | grep 'blog' | awk '{print $3}')",
							{
								stdio: "inherit",
							}
						);
					} catch (err) {}

					try {
						execSync(
							"docker rmi $(docker images | grep 'proxy_nginx' | awk '{print $3}')",
							{
								stdio: "inherit",
							}
						);
					} catch (err) {}

					spinner_image.stop();

					// 清除文件夹
					await fs.remove("./webapp");

					// 显示现在的容器和镜像
					try {
						execSync("docker ps", {
							stdio: "inherit",
						});

						execSync("docker images", {
							stdio: "inherit",
						});
					} catch (err) {}

					spinner.stop();
					success("webapp已清理");
				} catch (err) {
					spinner.stop();
					error(err);
				}
			}
		});
	});
};

module.exports = clearProject;
