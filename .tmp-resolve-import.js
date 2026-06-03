const ts = require('typescript');
const path = require('path');
const cwd = process.cwd();
const configPath = path.join(cwd, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
const resolved = ts.resolveModuleName('../lib/game-logic', path.join(cwd, 'app', 'page.tsx'), parsed.options, ts.sys);
console.log(resolved.resolvedModule ? resolved.resolvedModule.resolvedFileName : 'NOT RESOLVED');
