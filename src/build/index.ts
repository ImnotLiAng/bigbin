import config from "../config";
import fs from "fs";
import path from "path";
import ts from "typescript";

const { appSrcDir, appDistDir } = config;

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

function pack<T extends string>(fullPath: T): Promise<T> {
  if (!fullPath.endsWith(".ts")) {
    return new Promise((resolve, reject) => {
      try { 
        fs.copyFile(fullPath, convertToOutputPath(fullPath), (err) => {
          if (err) reject(err);
          resolve(fullPath);
        });
      } catch(err) {
        reject(err);
      }
      
    })
  }
  return new Promise((resolve, reject) => {
    fs.readFile(fullPath, {encoding :'utf-8'}, (err, source) => {
      if (err) reject(err);
      const result = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext }
      });
      const parsedPath = path.parse(convertToOutputPath(fullPath));
      const outPutPath = path.format({
        ...parsedPath,
        base: undefined, // 避免 base 覆盖
        ext: '.js'
      });
      fs.writeFile(outPutPath, result.outputText, {encoding: 'utf8'}, (err) => {
        if (err) reject(err);
        resolve(fullPath);
      });
    });
        
  })
  
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

const build = (dir: string) => {
  // todo: rmAppDistDirSync
  traverseDirectory(dir, pack);
}

const buildSingal = pack;

export {
  build, 
  buildSingal
}