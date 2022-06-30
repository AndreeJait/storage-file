import { appendFile } from "fs";

const printLog = (args) => {
  console.log(`[ ${Date().toString()} ] : ${args}`);
  appendFile(
    "infolog.log",
    `[ ${Date().toString()} ] : ${args}` + "\n",
    function name(err) {
      if (err) throw err;
    }
  );
};

const errorLog = (args) => {
  console.error(`[ ${Date().toString()} ] : ${args}`);
  appendFile(
    "errorlog.log",
    `[ ${Date().toString()} ] : ${args}` + "\n",
    function name(err) {
      if (err) throw err;
    }
  );
};

const warningLog = (args) => {
  console.warn(`[ ${Date().toString()} ] : ${args}`);
  appendFile(
    "warninglog.log",
    `[ ${Date().toString()} ] : ${args}` + "\n",
    function name(err) {
      if (err) throw err;
    }
  );
};

export { printLog, errorLog, warningLog };
