import fs from "fs";
import ts from "typescript";
 
const parse = async (fullPath: string) => {
    const data: string = await readAsString(fullPath);
    let res;
    switch (fullPath.split('.').pop()) {
        case 'ts':
            res = ts.transpileModule(data, {
                compilerOptions: { module: ts.ModuleKind.ESNext }
            });
            return res.outputText;
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
