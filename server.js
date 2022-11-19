const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");

  if (req.url === "/getTree") {
    getData(res);
  } else if (req.url === "/writeTree") {
    writeData(req, res);
  } else if (req.url === "/upload") {
    saveFile(req, res);
  } else if (req.url === "/deleteFiles") {
    deleteFiles(req, res);
  } else if (req.url === "/generate") {
    generateSite(req, res);
  } else {
    res.end(JSON.stringify("Ended empty"));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getData(res) {
  //const pathToFile = __dirname + "\\src\\assets\\mock.json";
  const pathToFile = path.join("src/assets", "mock.json");
  const readStream = fs.createReadStream(pathToFile);
  let buffer = "";
  readStream.on("data", (chunk) => {
    buffer += chunk;
  });
  readStream.on("end", () => {
    res.end(buffer);
  });
}

function saveFile(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const oldpath = files.my_file.filepath;
    const newpath = "src/assets/tempFiles/" + files.my_file.originalFilename;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write(JSON.stringify("File uploaded and moved!"));
      res.end();
    });
  });
}

async function writeData(req, res) {
  const path = __dirname + "\\src\\assets\\mock.json";
  const raw = await getBodyData(req);
  if (raw) {
    const data = JSON.parse(raw).body;
    const writeStream = fs.createWriteStream(path);
    writeStream.write(JSON.stringify(data));
  }
  res.end(JSON.stringify("Wrote to treeData.json"));
}

async function deleteFiles(req, res) {
  const raw = await getBodyData(req);
  if (raw) {
    const data = JSON.parse(raw).body;
    data.forEach((fileName) => {
      remove(fileName);
    });
  }
  res.end(JSON.stringify("File deleted!"));
}

function getBodyData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function remove(fileName) {
  const pathToFile = "resources/app/dist/builder/assets/tempFiles/" + fileName;
  fs.unlink(pathToFile, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
}

async function generateSite(req, res) {
  const raw = await getBodyData(req);
  if (raw) {
    const siteName = JSON.parse(raw).body;
    const dummySrcDir = "resources/app/dist/dummy";
    const filesSrcDir = "resources/app/dist/builder/assets/tempFiles/";
    const commonDest =
      path.join(__dirname, "../../") + "\\YOUR_SITES" + `\\${siteName}`;
    const dummyDestDir = commonDest;
    const filesDestDir = commonDest + `\\assets\\tempFiles`;

    copyFolder(dummySrcDir, dummyDestDir);
    copyFolder(filesSrcDir, filesDestDir);

    function copyFolder(src, dest) {
      const exists = fs.existsSync(src);
      const stats = exists && fs.statSync(src);
      const isDirectory = exists && stats.isDirectory();
      if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function (childItemName) {
          copyFolder(
            path.join(src, childItemName),
            path.join(dest, childItemName)
          );
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    insertData();
    function insertData() {
      const pathToData = path.join("resources/assets", "mock.json");
      const treeData = fs
        .readFileSync(pathToData)
        .toString()
        .replace(/(\\r\\n)/g, "\\\\r\\\\n")
        .replace(/(\\n)/g, "\\\\n")
        .replace(/(\\r)/g, "\\\\r")
        .replace(/\'/g, "\\'")
        .replace(/\\"/g, '\\\\"');
      const siteFiles = fs.readdirSync(commonDest);
      const mainFileName = siteFiles.filter((filename) =>
        filename.includes("main")
      )[0];
      const pathToMainFile = path.join(commonDest, mainFileName);
      const mainFile = fs.readFileSync(pathToMainFile).toString();
      const magicString = '[{"CUSTOM_STRING":"TO_REPLACE"}]';
      const newMainFileContent = mainFile.replace(magicString, treeData);
      fs.writeFileSync(pathToMainFile, newMainFileContent);
    }
  }
  res.end(JSON.stringify("Generated!"));
}
