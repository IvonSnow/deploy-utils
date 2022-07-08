const { execSync } = require("child_process");

function clearNone() {
	try {
		// 删除<none>
		execSync("docker system prune -f");
		// 删除未使用镜像
		execSync("docker rmi $(docker ps -q)");
		// 删除未使用容器
		execSync("docker rm -f $(docker ps -q)");
	} catch (e) {
		console.error(e);
	}
}

module.exports = clearNone;
