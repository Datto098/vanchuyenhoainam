import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const dashboardDir = resolve(dirname(new URL(import.meta.url).pathname), '..');
const projectDir = resolve(dashboardDir, '..');
const sourceDir = resolve(projectDir, 'extension');
const releaseDir = resolve(projectDir, 'release');
const outputDir = resolve(releaseDir, 'extension');
const zipPath = resolve(releaseDir, 'extension.zip');
const manifest = JSON.parse(readFileSync(resolve(sourceDir, 'manifest.json'), 'utf8'));
const javascriptFiles = ['background.js', 'content.js'];

rmSync(outputDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(outputDir, { recursive: true });

for (const filename of javascriptFiles) {
  const source = readFileSync(resolve(sourceDir, filename), 'utf8');
  const result = JavaScriptObfuscator.obfuscate(source, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.35,
    deadCodeInjection: false,
    identifierNamesGenerator: 'hexadecimal',
    numbersToExpressions: true,
    renameGlobals: true,
    selfDefending: true,
    simplify: true,
    sourceMap: false,
    splitStrings: true,
    splitStringsChunkLength: 8,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayThreshold: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersParametersMaxCount: 4,
    transformObjectKeys: true,
  });
  writeFileSync(resolve(outputDir, filename), result.getObfuscatedCode());
}

for (const filename of ['icon.png', 'popup.html']) {
  copyFileSync(resolve(sourceDir, filename), resolve(outputDir, filename));
}

writeFileSync(resolve(outputDir, 'manifest.json'), JSON.stringify(manifest));
for (const filename of javascriptFiles) {
  execFileSync(process.execPath, ['--check', resolve(outputDir, filename)], { stdio: 'inherit' });
}
execFileSync('zip', ['-q', '-r', zipPath, '.'], { cwd: outputDir, stdio: 'inherit' });
process.stdout.write(`Extension v${manifest.version} release ready: ${zipPath}\n`);
