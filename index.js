#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import ncp from "ncp";
import path from "path";

const runCommand = (command) => {
    try {
        execSync(command, { stdio: "inherit" });
        return true;
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        process.exit();
    }
};

/**
 * Current working directory of the user
 */
const cwd = process.cwd();

/**
 * Update package name inside the `package.json`
 */
const updatePackageName = (projectName) => {
    const filePath = path.join(cwd, projectName, "package.json");
    const packageJson = JSON.parse(readFileSync(filePath, "utf-8"));
    packageJson.name = projectName;
    writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
};

/**
 * Copy template file from `./template` directory to the project direcoty
 */
function copyDirectory(projectName) {
    console.log("Installing template...");
    return new Promise((resolve) => {
        ncp("./template/v1", path.join(cwd, projectName), (e) => {
            if (e) {
                console.error("Failed to install template.");
                process.exit(1);
            }
            console.log("Template installed.");
            resolve();
        });
    });
}

const questions = inquirer.prompt([
    {
        name: "project-name",
        message: "What is the name of the project?",
        type: "input",
        default: "exmon",
        validate: (input) => {
            const valid = /^[a-zA-Z0-9-]+$/.test(input);
            return valid ? true : "Invalid project name. Only alphanumeric characters and hyphens are allowed.";
        },
    },
    { name: "git-init", message: "Do you want to initiate a new git repository for this project?", type: "confirm", default: "y" },
    { name: "install-deps", message: "Do you want to install the dependencies?", type: "confirm", default: "y" },
]);

(async () => {
    const answers = await questions;
    const projectName = answers["project-name"];
    const gitInit = answers["git-init"];
    const installDeps = answers["install-deps"];

    await copyDirectory(projectName);
    updatePackageName(projectName);

    if (gitInit) {
        runCommand(`cd ${projectName} && git init && mv .env.example .env`);
    } else {
        runCommand(`cd ${projectName} && rm -f .gitignore`);
    }

    if (installDeps) {
        console.log(chalk.green("Installing dependencies..."));
        runCommand(`cd ${projectName} && npm install`);
    }

    console.log("\nEXMON template is ready. Follow the following commands to start.");
    installDeps
        ? console.log(chalk.green(`cd ${projectName}\nnpm run dev`))
        : console.log(chalk.green(`cd ${projectName}\nnpm install\nnpm run dev`));
})();
