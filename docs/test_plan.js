/*
I'm going to generate as much of the testing plan document as I can to save myself the hassle.

Since this file is not the testing document itself, and is not part of any of the JS code required for the project,
this shouldn't be part of anything that's supposed to be looked at for grading, at least as I understand it. 
This is purely a tool to leverage what I'm good at (coding) to save me frustration in other areas (technical writing).

The plan is to generate the test plan as a Markdown file, and then use Pandoc (https://pandoc.org/) to generate the final PDF.
If formatting is an issue, I may consider converting the Markdown to HTML first using appropriate JS libraries first.
*/

import cproc from "node:child_process";
import proc from "node:process";
import fs from "fs";
import yaml from "js-yaml";
import _ from "lodash";

// Import prisma client for querying:
import prisma from '../src/config/db.js';

// Input files
    const yaml_path = "./docs/openapi.yaml";
const yaml_overlay_path = "./docs/openapi_testplan_overlay.yaml";

// Output files
const doc_output_path = "./docs/generated/test_plan.docx";
const md_output_path = "./docs/generated/test_plan.md";
const yaml_merge_path = "./docs/generated/openapi_merged.yaml";
const resolved_yaml_path = "./docs/generated/openapi_resolved.yaml";

const assemble_document_text = async (seed_data, test_list) => `
# ITIS-4166 Final Project - Alex Schmid

## Relevant Links

* Repository: [https://github.com/aschmi23-charlotte/itis-4166-final-project](https://github.com/aschmi23-charlotte/itis-4166-final-project)
* API URL: [https://itis-4166-final-project-au83.onrender.com/api](https://itis-4166-final-project-au83.onrender.com/api)
* API Documentation: [https://itis-4166-final-project-au83.onrender.com/api-doc](https://itis-4166-final-project-au83.onrender.com/api-doc)

## Read Before Testing - General API Information

### Preamble

Throughout this API, you'll need to authenticate with both a user with the role USER and a user with the role ADMIN.
As you may need to switch accounts frequently, it is recommended that you acquire JWT tokens for both accounts now,
and store them somewhere you can easily access and paste from, like a text file. To reduce instances of needing to
reauthenticate, the JWT tokens are set to expire after 24 hours.

Recommended credentials for ADMIN role: \`{"email": "admin1@example.com", "password": "prod_secret_admin"}\`.

Recommended credentials for USER role: \`{"email": "user1@example.com", "password": "prod_secret_user"}\`.

### Public Vs Private Lists

The testing descriptions below mention ToDoLists being public or private. This is referring to the "isPublic" field of the ToDoList schema.
If "isPublic" is set to true, the list is public. If "isPublic" is set to false, the list is private.

The testing section will go into more detail on how public or private status affects authorization, but the general concept is that read-only
access is provided for public lists, regardless of authentication or other permissions.

### A Word on Ownership and Access Authorization

The test plans below make reference to ToDoLists being owned by specific users, and ToDoListItems and ToDoListNotes being owned by specific
ToDoLists. Let us go over how that works briefly.

A ToDoList entity has an integer attribute called "ownerId". The ToDoList is considered to be owned by the User entity whose "id" attribute
matches the value of "ownerId". For example, you'll see in the tables below that the ToDoLists with ids 1 and 2 both have an "ownerId" attribute
of 1, and are therefore owned by the User with the id of 1 (\`admin1@example.com\`). The ToDoLists with ids 3 and 4 are owned by User with the id 2,
and so on. This is important to understand because authorization to access a ToDoList is governed in part by which User user owns it.

Likewise, ToDoListItems and ToDoListNotes both have attributes called "listId", which functions in a similar way. The ToDoListItem or ToDoListNote
is considered to be owned by (or rather a part of) the ToDoList entity whose "id" attribute matches the value of "listId". The authorization logic
for these entities is a bit more complex, however, as access will be in part granted to ToDoListItems and ToDoListNotes based on *properties* of the ToDoList
corresponding to "listId" (specifically, the "ownerId" and "isPublic" fields). For example, if the User with the id 5 (\`user3@example.com\`) were to
make a GET request for the ToDoListItem with the id 1, the request would not be authorized; ToDoListItem 1 is owned by ToDoList 1, which is both private
and owned by a different user. If the ToDoList 1 was made public, User 5 would now be able to make a GET request for ToDoListItem 1, but PUT and DELETE requests
would still not be permitted since ToDoList 1 is not owned by User 5.

One last thing: Users with the ADMIN role have full access to all application resources, regardless of ownership or privacy status. In the previous example,
User 5 has the USER role and therefore the usual authorization logic applies. However, if User 5 was given the ADMIN role, they would be able to make PUT and
DELETE requests for ToDoListItem 1 regardless of ownership.

### Seeded Data

The following tables list the initial seeded content of the PostgreSQL as of assignment submission.

Note: Since knowing the timestamps stored in the createdAt fields are not beneficial for testing, these have been hidden to conserve space. This is indicated with '...'.
${seed_data}
## API Endpoint Test Plan

### Testing Setup

...

### Tests

${test_list}`;

/**
 * 
 * @param {string} table_name 
 * @param {array} row_names 
 * @param {array} hidden_row_names 
 * @param {string} additional_notes 
 */
async function assemble_seed_table(model, table_name, row_names, hidden_row_names, additional_notes) {
    // Handling for if hidden row names wasn't used:
    if (!hidden_row_names) {
        hidden_row_names = [];
    }

    let combined_row_names = [...row_names, ...hidden_row_names];
    let table_header = "| " + combined_row_names.join(" | ") + " |\n";
    let table_divider = ("| --- ".repeat(combined_row_names.length)) + "|\n";

    let retVal = `\n#### ${table_name}\n\n` + table_header + table_divider;
    
    // Now we get the data.
    let data = await model.findMany();

    for (let i in data) {
        let entry = data[i];
        
        let table_row = "";

        for (let j in combined_row_names) {
            let row_name = combined_row_names[j];
            let row_info = entry[row_name];
            
            // Hidden
            if (hidden_row_names.includes(row_name)) {
                table_row += `| ... `;
            } else {
                table_row += `| \`${row_info}\` `;
            }
            
        }
        table_row += "|\n";
        retVal += table_row;
    }

    if (additional_notes) {
        retVal += `\n${additional_notes}\n`
    }

    return retVal;
}

async function assemble_all_seed_tables() {
    let retVal = "";

    retVal += await assemble_seed_table(prisma.user, "User", ["id", "email", "role"], [ "password", "createdAt"], 
        "* Since knowing the bcrypt hash stored in the password field is not useful for testing, these have been hidden to conserve space. This is indicated with '...'.\n" + 
        "* All users with the USER role were given an initial password of 'prod_secret_user' (without the quotes)\n" + 
        "* All users with the ADMIN role were given an initial password of 'prod_secret_admin' (without the quotes)."
    );
    retVal += await assemble_seed_table(prisma.toDoList, "ToDoList", ["id", "title", "isPublic", "ownerId"], ["createdAt"]);
    retVal += await assemble_seed_table(prisma.toDoListItem, "ToDoListItem", ["id", "name", "details", "listId"], ["createdAt"]);
    retVal += await assemble_seed_table(prisma.toDoListNote, "ToDoListNote", ["id", "name", "content", "listId"], ["createdAt"]);
    return retVal;
}

async function assemble_test_plan() {
    let retVal = "";

    const specs_base = yaml.load(fs.readFileSync(yaml_path, 'utf8'));
    const test_overlay = yaml.load(fs.readFileSync(yaml_overlay_path, 'utf8'));
    const merge_data = _.merge(specs_base, test_overlay);
    fs.writeFileSync(yaml_merge_path, yaml.dump(merge_data));

    // We're gonna generate the scaffolding endpoint by reading from the openapi file itself.
    let resolver = cproc.spawnSync("npx", ["ref-resolver", yaml_merge_path, resolved_yaml_path], {shell: true});

    const specs = yaml.load(fs.readFileSync(resolved_yaml_path, 'utf8'));

    // Assembling the bullet list for each endpoint.
    for (let path in specs['paths']) {
        let endpoints = specs['paths'][path];

        for (let endpoint in endpoints) {
            let endpoint_info = endpoints[endpoint];

            retVal += `* ${endpoint.toUpperCase()} ${path}\n`;

            let description = endpoint_info["description"];
            retVal += `  * Description: ${description}\n`;

            retVal += `  * Test Setup:\n`;
            if (endpoint_info["test_setup"] !== undefined) {
                let test_setup = endpoint_info["test_setup"];

                for (let i in test_setup) {
                    retVal += `    * ${test_setup[i]}\n`;
                }
            }

            retVal += `  * Response Testing:\n`;

            let responses = endpoint_info["responses"];

            for (let response in responses) {
                let response_info = responses[response];
                retVal += `    * ${response}${response.startsWith('2') ? " (SUCCESS)" : ""} -- ${response_info['description']}\n`;

                // No Auth Steps:
                if (response_info["no_auth_steps"] !== undefined) {
                    let no_auth_steps = response_info["no_auth_steps"];
                    retVal += `      * With No Authentication:\n`;

                    for (let i in no_auth_steps) {
                        retVal += `        * ${no_auth_steps[i]}\n`;
                    }
                }

                if (response_info["user_steps"] !== undefined) {
                    let user_steps = response_info["user_steps"];
                    retVal += `      * While USER Role Authenticated:\n`;

                    for (let i in user_steps) {
                        retVal += `        * ${user_steps[i]}\n`;
                    }
                }

                if (response_info["admin_steps"] !== undefined) {
                    let admin_steps = response_info["admin_steps"];
                    retVal += `      * While ADMIN Role Authenticated:\n`;

                    for (let i in admin_steps) {
                        retVal += `        * ${admin_steps[i]}\n`;
                    }
                }

                if (response_info["test_steps"] !== undefined) {
                    let special_steps = response_info["test_steps"];
                    retVal += `      * Special Case:\n`;

                    for (let i in special_steps) {
                        retVal += `        * ${special_steps[i]}\n`;
                    }
                }
            }
        }
    }

    return retVal;
}

async function main() {
    let seed_data = await assemble_all_seed_tables();
    let test_list = await assemble_test_plan();
    let md_output = await assemble_document_text(seed_data, test_list);

    // console.log("================== Output ==================");
    // console.log(md_output);
    fs.writeFileSync(md_output_path, md_output);

    // Having some trouble generating the PDF. We'll generate a word doc for now.
    cproc.spawnSync("pandoc", [md_output_path, "-o", doc_output_path])
}

main();