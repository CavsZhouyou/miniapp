const { platformMap } = require("miniapp-builder-shared");
const { existsSync } = require("fs-extra");
const { resolve } = require("path");
const setBaseConfig = require("./setBaseConfig");

module.exports = (
  config,
  userConfig = {},
  { context, target, entryPath, outputPath }
) => {
  // 获取不同小程序的配置信息
  const platformInfo = platformMap[target];
  // 获取 sourceMap 开关和常量文件夹
  const { turnOffSourceMap = false, constantDir = [] } = userConfig;
  // 获取根目录和输入命令
  const { rootDir, command } = context;

  let disableCopyNpm;

  // 是否禁止 npm 复制操作
  if (Object.prototype.hasOwnProperty.call(userConfig, "disableCopyNpm")) {
    disableCopyNpm = userConfig.disableCopyNpm;
  } else {
    disableCopyNpm = command === "build";
  }

  const loaderParams = {
    // start | build
    mode: command,
    // 入口路径
    entryPath,
    // 输出路径
    outputPath,
    // 是否禁止 npm 复制操作
    disableCopyNpm,
    // 是否关闭 sourceMap
    turnOffSourceMap,
    // 小程序平台相关信息
    platform: platformInfo,
  };

  // 设置解析入口
  config.entryPoints.clear();
  config.entry("component").add(`./${entryPath}?role=component`);

  // Set constantDir
  // `public` directory is the default static resource directory
  const isPublicFileExist = existsSync(resolve(rootDir, "src/public"));

  // To make old `constantDir` param compatible
  loaderParams.constantDir = isPublicFileExist
    ? ["src/public"].concat(constantDir)
    : constantDir;

  setBaseConfig(config, userConfig, {
    context,
    entryPath,
    outputPath,
    loaderParams,
    target,
  });
};
