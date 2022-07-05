# Deploy-util 便捷管理前后端部署工具

- 需要运行在 linux 环境中

## 安装

`npm install deploy-util -g`

## 指令

- `deploy-util --help`查看帮助信息
- `deploy-util init`初始化 webapp 项目，复制模板; 拉取代码; 编译镜像部署容器
- `deploy-util clear`清理项目，需要在`webapp`的父文件中运行
- `deploy-util up` 拉取代码并编译部署
  - `-a, -app [fronted | middle | backend]` 指定操作的应用，默认对所有应用执行操作
  - `-v, --version` 指定回滚的 git 版本号，默认拉取最新代码
