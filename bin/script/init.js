import fs from "fs-extra";
import path from "path";
import { error, success, info } from "../util/logger.js";
import ora from "ora";
import inquirer from "inquirer";
import { execSync, exec } from "child_process";
import { fileURLToPath } from "url";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workdirname = process.cwd();

const initProject = () => {
	fs.mkdir(path.join("", "./webapp"), (err) => {
		if (err) {
			error(`${err}`);
			return false;
		}
		success(`webapp文件创建成功`);
		const spinner = ora("加载webapp部署配置文件...\n").start();

		const templatePath = path.resolve(__dirname, `../template`);
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
			// console.log(":)", back_commit, middle_commit, blog_commit);

			// 保存进.env使其能够再docker-compose中被引用
			await fs.writeFile(
				"./webapp/.env",
				`BACKEND_COMMIT=${back_commit}\nMIDDLE_COMMIT=${middle_commit}\nBLOG_COMMIT=${blog_commit}\n`
			);

			execSync("docker-compose up", {
				cwd: path.join("", "./webapp"),
				stdio: "inherit",
			});

			spinner.stop();
		}
	});
};

export default initProject;
