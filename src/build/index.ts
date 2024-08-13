import config from "../config";
import fs from "fs";
import path from "path";
import {parse} from "../parseFile";

const { appSrcDir, appDistDir } = config;

function removeRecursive(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    let stats;
    try {
      stats = fs.lstatSync(entryPath);
    } catch {
      continue;
    }
    if (stats.isDirectory()) removeRecursive(entryPath);
    else fs.unlinkSync(entryPath);
  }
  fs.rmdirSync(dir);
}

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// 接收一个完整的源码路径，并将其转换为输出路径中的对应目录
function convertToOutputPath(sourcePath: string) {
  // 确保 sourcePath 是绝对路径
  const absoluteSourcePath = path.resolve(sourcePath);

  // 检查 sourcePath 是否在 appSrcDir 中
  if (!absoluteSourcePath.startsWith(appSrcDir)) {
    throw new Error('The source path is not inside the source directory');
  }

  // 计算相对路径
  const relativePath = path.relative(appSrcDir, absoluteSourcePath);

  // 生成输出路径
  const outputPath = path.join(appDistDir, relativePath);

  return outputPath;
}


async function pack<T extends string>(fullPath: T): Promise<T> {
  const TargetPath = convertToOutputPath(fullPath);
  ensureDirectoryExistence(TargetPath);
  
  return new Promise(async (resolve, reject) => {
    const data = await parse(fullPath);
    let outPutPath = TargetPath;
  
    if (TargetPath.endsWith('.ts')) {
      outPutPath = path.format({
        ...path.parse(TargetPath),
        base: undefined, // 避免 base 覆盖
        ext: '.js'
      });
    }
  
    fs.writeFile(outPutPath, data, (err) => {
      if (err) reject(err);
      resolve(fullPath);
    });
  });
}

function traverseDirectory(dir: string, callback: (arg: string) => any) {
  // 读取目录内容
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      // 构建文件或子目录的完整路径
      const fullPath = path.join(dir, file);

      // 获取文件或子目录的元数据
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats of file ${fullPath}:`, err);
          return;
        }

        // 如果是目录，递归调用
        if (stats.isDirectory()) {
          traverseDirectory(fullPath, callback);
        } else {
          // 如果是文件，调用回调函数
          callback(fullPath);
        }
      });
    });
  });
}

function isValidDirectory(p: string) {
  try {
    const stats = fs.lstatSync(p); // 获取路径状态
    return stats.isDirectory(); // 判断是否为目录
  } catch (err) {
    return false;
  }
}

const build = (srcDir: string, distDir: string) => {
  if (isValidDirectory(distDir)) {
    removeRecursive(distDir);
  }
  
  traverseDirectory(srcDir, pack);
}

const buildSingle = pack;

export {
  build, 
  buildSingle
}