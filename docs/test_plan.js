/*
I'm going to generate as much of the testing plan document as I can to save myself the hassle.

Since this file is not the testing document itself, and is not part of any of the JS code required for the project,
this shouldn't be part of anything that's supposed to be looked at for grading, at least as I understand it. 
This is purely a tool to leverage what I'm good at (coding) to save me frustration in other areas (technical writing).

The plan is to generate the test plan as a Markdown file, and then use Pandoc (https://pandoc.org/) to generate the final PDF.
If formatting is an issue, I may consider converting the Markdown to HTML first using appropriate JS libraries first.

Ordinarily, I'd be more comfortable doing this kind of text generation in Python, but it's probably better to not use adding
Python code to this repo to avoid grading confusion. Don't want to give the impression that I used Python for things that are
supposed to be JS. That being said, I'll comment everything thoroughly for anyone wondering what I'm doing.
*/

import cproc from "node:child_process";
import fs from "fs";
import yaml from "js-yaml";
import _ from "lodash";

// Input files
const yaml_path = "./docs/openapi.yaml";
const yaml_overlay_path = "./docs/openapi_testplan_overlay.yaml";

// Output files
const doc_output_path = "./docs/generated/test_plan.docx";
const md_output_path = "./docs/generated/test_plan.md";
const yaml_merge_path = "./docs/generated/openapi_merged.yaml";
const resolved_yaml_path = "./docs/generated/openapi_resolved.yaml";

// Execution
let md_output = "";

const md_header = `
# ITIS-4166 Final Project - Alex Schmid

## Relevant Links

* Repository: [https://github.com/aschmi23-charlotte/itis-4166-final-project](https://github.com/aschmi23-charlotte/itis-4166-final-project)
* API URL: [https://itis-4166-final-project-au83.onrender.com/api](https://itis-4166-final-project-au83.onrender.com/api)
* API Documentation: [https://itis-4166-final-project-au83.onrender.com/api-doc](https://itis-4166-final-project-au83.onrender.com/api-doc)

## API Endpoint Test Plan

`;

md_output += md_header;


const specs_base = yaml.load(fs.readFileSync(yaml_path, 'utf8'));
const test_overlay = yaml.load(fs.readFileSync(yaml_overlay_path, 'utf8'));
const merge_data = _.merge(specs_base, test_overlay);
fs.writeFileSync(yaml_merge_path, yaml.dump(merge_data));

// We're gonna generate the scaffolding endpoint by reading from the openapi file itself.
let resolver = cproc.spawnSync("npx", ["ref-resolver", yaml_merge_path, resolved_yaml_path], {shell: true});
console.log(resolver);

const specs = yaml.load(fs.readFileSync(resolved_yaml_path, 'utf8'));

for (let path in specs['paths']) {
    let endpoints = specs['paths'][path];

    for (let endpoint in endpoints) {
        let endpoint_info = endpoints[endpoint];

        md_output += `* ${endpoint.toUpperCase()} ${path}\n`;


        let access_control = endpoint_info["access_control"];
        md_output += `  * Access Control: ${access_control}\n`;

        md_output += `  * Test Setup:\n`;
        if (endpoint_info["test_setup"] !== undefined) {
            let test_setup = endpoint_info["test_setup"];

            for (let i in test_setup) {
                md_output += `    * ${test_setup[i]}\n`;
            }
        }

        md_output += `  * Response Testing:\n`;

        let responses = endpoint_info["responses"];

        for (let response in responses) {
            let response_info = responses[response];
            md_output += `    * ${response}${response.startsWith('2') ? " (SUCCESS)" : ""} - ${response_info['description']}\n`;

            if (response_info["test_steps"] !== undefined) {
                let test_steps = response_info["test_steps"];

                for (let i in test_steps) {
                    md_output += `      * ${test_steps[i]}\n`;
                }
            }
        }
    }

}

// console.log("================== Output ==================");
// console.log(md_output);
fs.writeFileSync(md_output_path, md_output);

// Having some trouble generating the PDF. We'll generate a word doc for now.
cproc.spawnSync("pandoc", [md_output_path, "-o", doc_output_path])