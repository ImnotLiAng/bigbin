import fs from "fs";
import * as Babel from "@babel/core";

async function transformTs(str: string, filePath: string) {
  console.log(filePath);
  try {
    const res = await Babel.transform(str, {
      presets: [["@babel/preset-typescript", {
        isTSX: true,
        allExtensions: true,
        jsxPragma: 'MReact',
        jsxPragmaFrag: 'MReact.Fragment'
      }]],
    });
    if (filePath.endsWith('.tsx')) {
      console.log(res);
    }
    return res?.code || "";
  } catch(err) {
    console.log(err);
  }
  
  return "";
}
 
const parse = async (fullPath: string) => {
    const data: string = await readAsString(fullPath);
    switch (fullPath.split('.').pop()) {
        case 'tsx':
        case 'ts':
            const res = await transformTs(data, fullPath);
            return res;
        default:
            return data;
    }
}

async function readAsString(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err: any, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

export default parse;
