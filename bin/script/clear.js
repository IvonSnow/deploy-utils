import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import { error, success, info } from "../util/logger.js";
import { execSync } from "child_process";
import path from "path";
import process from "process";
import "dotenv/config";

import dotenv from "dotenv";
import {} from "dotenv/config";
dotenv.config({ path: path.join("", "./webapp/.env") });

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
					const spinner_image = ora("清理镜像...\n").start();
					execSync("docker-compose down", {
						cwd: path.join("", "./webapp"),
						stdio: "inherit",
					});
					// execSync(
					// 	'docker images | grep "backend" | awk \'{print $1":"$2}\' | xargs docker rmi',
					// 	{
					// 		stdio: "inherit",
					// 	}
					// );
					// execSync("docker rmi backend:$BACKEND_COMMIT", {
					// 	stdio: "inherit",
					// });
					// execSync("docker rmi qingyun:$MIDDLE_COMMIT", {
					// 	stdio: "inherit",
					// });
					// execSync("docker rmi blog:$BLOG_COMMIT", {
					// 	stdio: "inherit",
					// });
					spinner_image.stop();

					// 清除文件夹
					await fs.remove("./webapp");

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

export default clearProject;
