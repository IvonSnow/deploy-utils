const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const { error, success, info } = require("../util/logger.js");
const { execSync } = require("child_process");
const path = require("path");
const process = require("process");
const buildForDeploy = require("../util/build.js");

// 从.env文件中加载环境变量
require("dotenv").config({ path: path.join("", "./webapp/.env") });

const updateApp = async (app, version) => {
	fs.access("./webapp", (err) => {
		if (err) {
			error("不存在webapp文件夹, 请在webapp的父文件夹中执行该命令");
			return;
		}

		const question = [
			{
				type: "confirm",
				name: "isUpdate",
				message: `是否拉取并重建${app}:${version}?`,
			},
		];

		inquirer.prompt(question).then(async (answers) => {
			if (answers.isUpdate) {
				// 1 清理已有容器和镜像
				const spinner_clear = ora("clear container and image\n").start();
				try {
					let containerName = "";
					let imageName = "";
					if (app === "backend") {
						containerName = "backend_server";
						imageName = `backend:${process.env.BACKEND_COMMIT}`;
					} else if (app === "middle") {
						containerName = "qingyun_middle";
						imageName = `qingyun:${process.env.MIDDLE_COMMIT}`;
					} else if (app === "frontend") {
						containerName = "blog_front";
						imageName = `blog:${process.env.BLOG_COMMIT}`;
					} else {
						error("无效的app:" + app);
						return;
					}

					// 删除容器
					info(`移除容器${containerName}`);
					execSync(`docker rm ${containerName} -f`, {
						stdio: "inherit",
					});
					// 删除镜像
					info(`移除镜像${imageName}`);
					execSync(`docker rmi ${imageName} -f`, {
						stdio: "inherit",
					});
				} catch (err) {
					warn(err);
				}
				spinner_clear.stop();

				// 2 更新版本代码
				const spinner_pull = ora(`update code ${app}:${version}\n`).start();
				let appName = "";
				app === "backend" && (appName = "backend-service");
				app === "middle" && (appName = "qingyun-middle");
				app === "frontend" && (appName = "blog-front");

				if (version === "latest") {
					// 获取最新的代码
					execSync("git pull", {
						cwd: path.join("", `./webapp/${app}/${appName}`),
						stdio: "inherit",
					});
				} else {
					// 回滚
					execSync(`git revert ${version}`, {
						cwd: path.join("", `./webapp/${app}/${appName}`),
						stdio: "inherit",
					});
				}
				spinner_pull.stop();

				// 3 编译镜像部署容器
				buildForDeploy();

				// 4 清理可能存在的无用项
				clearNone();
			}
		});
	});
};

module.exports = updateApp;
