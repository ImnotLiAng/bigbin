import path from "path";

const root = process.cwd();

export default {
  appSrcDir: path.join(root, "app", "src"),
  appDistDir: path.join(root, "dist"),
  keyDir: path.join(root, "keys"),
  port: 8443,
  socketPort: 8444
}