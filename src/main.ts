import "./devServer";
import "./watch";
import config from "./config";
import { build } from "./build";

build(config.appSrcDir);
