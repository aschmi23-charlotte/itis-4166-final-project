"use strict";

var _nodeChild_process = _interopRequireDefault(require("node:child_process"));

var _nodeProcess = _interopRequireDefault(require("node:process"));

var _fs = _interopRequireDefault(require("fs"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _lodash = _interopRequireDefault(require("lodash"));

var _db = _interopRequireDefault(require("../src/config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Input files
var yaml_path = "./docs/openapi.yaml";
var yaml_overlay_path = "./docs/openapi_testplan_overlay.yaml"; // Output files

var doc_output_path = "./docs/generated/test_plan.docx";
var md_output_path = "./docs/generated/test_plan.md";
var yaml_merge_path = "./docs/generated/openapi_merged.yaml";
var resolved_yaml_path = "./docs/generated/openapi_resolved.yaml";

var assemble_document_text = function assemble_document_text(seed_data, test_list, ownership_table_user, ownership_table_admin) {
  return regeneratorRuntime.async(function assemble_document_text$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", "\n# ITIS-4166 Final Project - Alex Schmid\n\n## Relevant Links\n\n* Repository: [https://github.com/aschmi23-charlotte/itis-4166-final-project](https://github.com/aschmi23-charlotte/itis-4166-final-project)\n* API URL: [https://itis-4166-final-project-au83.onrender.com/api](https://itis-4166-final-project-au83.onrender.com/api)\n* API Documentation: [https://itis-4166-final-project-au83.onrender.com/api-doc](https://itis-4166-final-project-au83.onrender.com/api-doc)\n\n## Read Before Testing - General API Information\n\nThis API is a To-Do List system. Users can register and create ToDoLists entities (AKA, lists) attached to their account.\nFurthermore, ToDoLists can have ToDoListItems associated with them (think of these as individual bullet points on a conventional to-do list),\nas well as ToDoListNotes associated with them (think of these as blocks of additional information users can store within the lists).\n\n### Public Vs Private Lists\n\nThe testing descriptions below mention ToDoLists being public or private. This is referring to the \"isPublic\" field of the ToDoList schema.\nIf \"isPublic\" is set to true, the list is public. If \"isPublic\" is set to false, the list is private.\n\nThe testing section will go into more detail on how public or private status affects authorization, but the general concept is that read-only\naccess is provided for public lists, regardless of authentication or other permissions.\n\n### Ownership and Access Authorization\n\nThe test plans below make reference to ToDoLists being owned by specific users, and ToDoListItems and ToDoListNotes being owned by specific\nToDoLists. Let us go over how that works briefly.\n\nA ToDoList entity has an integer attribute called \"ownerId\". The ToDoList is considered to be owned by the User entity whose \"id\" attribute\nmatches the value of \"ownerId\". For example, you'll see in the tables below that the ToDoLists with ids 1 and 2 both have an \"ownerId\" attribute\nof 1. This means that these lists are owned by the User with the id of 1 (`admin1@example.com`). The ToDoLists with ids 3 and 4 are owned by User with the id 2,\nand so on. This is important to understand because authorization for accessing a ToDoList is governed in part by which User user owns it.\n\nLikewise, ToDoListItems and ToDoListNotes both have attributes called \"listId\", which functions in a similar way. The ToDoListItem or ToDoListNote\nis considered to be owned by (or rather, a part of) the ToDoList whose \"id\" attribute matches the value of \"listId\". The authorization logic\nfor these entities is a bit more complex, however. Part of the authorization logic for ToDoListItems and ToDoListNotes looks at the *properties* of the ToDoList\ncorresponding to \"listId\" (specifically, the ToDoList's \"ownerId\" and \"isPublic\" fields). A user will have full access to a ToDoListItem or ToDoListNote\nif they owns the associated ToDoList. Additionally, if the list's \"isPublic\" field is set to true, then users who do not own that list will still have\nread-only access to the ToDoList, and it's associated ToDoListItems and ToDoListNotes.\n\nFor example, if the User with the id 5 (`user2@example.com`) were to make a GET request for the ToDoListItem with the id 1, the request would not be authorized;\nToDoListItem 1 is owned by ToDoList 1, which is both private and owned by a different user. If the ToDoList 1 was made public, User 5 would now be able to make a\nGET request for ToDoListItem 1, but PUT and DELETE requests would still not be permitted since ToDoList 1 is not owned by User 5.\n\nOne last thing: These rules only apply if the user making the request has the USER role. Users with the ADMIN role have full access to all application resources,\nregardless of ownership or privacy status. In the previous example, User 5 has the USER role and therefore the usual authorization logic applies. However, if\nUser 5 was given the ADMIN role, they would be able to make PUT and DELETE requests for ToDoListItem 1 regardless of ownership.\n\n### Seeded Data\n\nThe following tables list the initial seeded content of the PostgreSQL database as of assignment submission.\n\nSince knowing the timestamps stored in the \"createdAt\" fields are not beneficial for testing, these have been hidden to conserve space. This is indicated\nwith '...'.\n\nThe same is true of the \"password\" field of the User table, as passwords are stored as bcrypt hashes and cannot be used to log in directly. All users seeded\nwith the ADMIN role have \"prod_secret_admin\" set as their initial password, and all users with the USER role have \"prod_secred_user\" set as their initial password.\nBoth passwords are without quotes.\n\n".concat(seed_data, "\n## API Endpoint Test Plan\n\n### Global Testing Setup\n\nMany of the endpoints need to be tested in multiple states of authentication, and the testing steps of each response are grouped based on which state needs to be\nused for a certain set of steps. The three authentication states to consider are:\n\n* No authentication at all (indicated with the with header \"With No Authentication\").\n* Authenticated as a user with the USER role (indicated with the with header \"With USER Role Authentication\").\n* Authenticated as a user with the ADMIN role (indicated with the with header \"With ADMIN Role Authentication\").\n\nIt is HIGHLY recommended that you acquire JWT keys for both the USER and ADMIN roles in advance, and store them somewhere easily accessible like a text file.\nThis will be much more efficient than having to reacquire a new JWT from the  \"/login\" endpoint every time you need to switch accounts. To authenticate, simply\npaste the JWT into SwaggerUI's **Authorize** popup and click \"Login\". To disable authentication, open the popup again and click \"Logout\".\n\nFor USER role, use these credentials. You should be able to paste them directly into the request body of SwaggerUI's *Try it out* feature on the \"/login\" endpoint:\n `{\"email\": \"user1@example.com\", \"password\": \"prod_secret_user\"}`.\n\nThe information for this user and all of the entities it owns are as follows:\n\n").concat(ownership_table_user, "\nFor ADMIN role, use these credentials. You should be able to paste them directly into the request body of SwaggerUI's *Try it out* feature on the \"/login\" endpoint:\n `{\"email\": \"admin1@example.com\", \"password\": \"prod_secret_admin\"}`.\n\nThe information for this user and all of the entities it owns are as follows:\n\n").concat(ownership_table_admin, "\nIt might be more efficient to run all of the tests for one Authentication state before switching to the next one (IE, running all of the USER tests before\nrunning ADMIN tests). The fact that the tests are broken up by authentication state makes this easy, and you can use CTRL+F to jump through all of the headers \ncorresponding to an authentication state.\n\nLastly, some tests specify using the ADMIN JWT when testing behaviors not specific to the ADMIN role. This is simply to help you avoid running into authorization\nerrors accidentally, since ADMINs are authorized for everything.\n\n### Endpoint Tests\n\n").concat(test_list));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};
/**
 * 
 * @param {string} table_name 
 * @param {array} row_names 
 * @param {array} hidden_row_names 
 * @param {string} additional_notes 
 */


function assemble_seed_table(data, table_name, row_names, hidden_row_names) {
  var combined_row_names, table_header, table_divider, retVal, i, entry, table_row, j, row_name, row_info;
  return regeneratorRuntime.async(function assemble_seed_table$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Handling for if hidden row names wasn't used:
          if (!hidden_row_names) {
            hidden_row_names = [];
          }

          combined_row_names = [].concat(_toConsumableArray(row_names), _toConsumableArray(hidden_row_names));
          table_header = "| " + combined_row_names.join(" | ") + " |\n";
          table_divider = "| --- ".repeat(combined_row_names.length) + "|\n";
          retVal = "#### ".concat(table_name, "\n\n") + table_header + table_divider;

          for (i in data) {
            entry = data[i];
            table_row = "";

            for (j in combined_row_names) {
              row_name = combined_row_names[j];
              row_info = entry[row_name]; // Hidden

              if (hidden_row_names.includes(row_name)) {
                table_row += "| ... ";
              } else {
                table_row += "| `".concat(row_info, "` ");
              }
            }

            table_row += "|";
            retVal += table_row;

            if (i < data.length) {
              retVal += "\n";
            }
          }

          return _context2.abrupt("return", retVal);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function assemble_all_seed_tables() {
  var tables;
  return regeneratorRuntime.async(function assemble_all_seed_tables$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          tables = [];
          _context3.t0 = tables;
          _context3.t1 = regeneratorRuntime;
          _context3.t2 = assemble_seed_table;
          _context3.next = 6;
          return regeneratorRuntime.awrap(_db["default"].user.findMany());

        case 6:
          _context3.t3 = _context3.sent;
          _context3.t4 = ["id", "email", "role"];
          _context3.t5 = ["password", "createdAt"];
          _context3.t6 = (0, _context3.t2)(_context3.t3, "User", _context3.t4, _context3.t5);
          _context3.next = 12;
          return _context3.t1.awrap.call(_context3.t1, _context3.t6);

        case 12:
          _context3.t7 = _context3.sent;

          _context3.t0.push.call(_context3.t0, _context3.t7);

          _context3.t8 = tables;
          _context3.t9 = regeneratorRuntime;
          _context3.t10 = assemble_seed_table;
          _context3.next = 19;
          return regeneratorRuntime.awrap(_db["default"].toDoList.findMany());

        case 19:
          _context3.t11 = _context3.sent;
          _context3.t12 = ["id", "title", "isPublic", "ownerId"];
          _context3.t13 = ["createdAt"];
          _context3.t14 = (0, _context3.t10)(_context3.t11, "ToDoList", _context3.t12, _context3.t13);
          _context3.next = 25;
          return _context3.t9.awrap.call(_context3.t9, _context3.t14);

        case 25:
          _context3.t15 = _context3.sent;

          _context3.t8.push.call(_context3.t8, _context3.t15);

          _context3.t16 = tables;
          _context3.t17 = regeneratorRuntime;
          _context3.t18 = assemble_seed_table;
          _context3.next = 32;
          return regeneratorRuntime.awrap(_db["default"].toDoListItem.findMany());

        case 32:
          _context3.t19 = _context3.sent;
          _context3.t20 = ["id", "name", "details", "listId"];
          _context3.t21 = ["createdAt"];
          _context3.t22 = (0, _context3.t18)(_context3.t19, "ToDoListItem", _context3.t20, _context3.t21);
          _context3.next = 38;
          return _context3.t17.awrap.call(_context3.t17, _context3.t22);

        case 38:
          _context3.t23 = _context3.sent;

          _context3.t16.push.call(_context3.t16, _context3.t23);

          _context3.t24 = tables;
          _context3.t25 = regeneratorRuntime;
          _context3.t26 = assemble_seed_table;
          _context3.next = 45;
          return regeneratorRuntime.awrap(_db["default"].toDoListNote.findMany());

        case 45:
          _context3.t27 = _context3.sent;
          _context3.t28 = ["id", "name", "content", "listId"];
          _context3.t29 = ["createdAt"];
          _context3.t30 = (0, _context3.t26)(_context3.t27, "ToDoListNote", _context3.t28, _context3.t29);
          _context3.next = 51;
          return _context3.t25.awrap.call(_context3.t25, _context3.t30);

        case 51:
          _context3.t31 = _context3.sent;

          _context3.t24.push.call(_context3.t24, _context3.t31);

          return _context3.abrupt("return", tables.join("\n"));

        case 54:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function assemble_ownership_tables(user_id) {
  var tables, users, lists, list_ids, i, list;
  return regeneratorRuntime.async(function assemble_ownership_tables$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Handling for if hidden row names wasn't used:
          tables = []; // We specifically want this as an array.

          _context4.next = 3;
          return regeneratorRuntime.awrap(_db["default"].user.findMany({
            where: {
              id: user_id
            }
          }));

        case 3:
          users = _context4.sent;
          _context4.t0 = tables;
          _context4.next = 7;
          return regeneratorRuntime.awrap(assemble_seed_table(users, "User info for `".concat(users[0].email, "` (id ").concat(user_id, ")"), ["id", "email", "role"], ["password", "createdAt"]));

        case 7:
          _context4.t1 = _context4.sent;

          _context4.t0.push.call(_context4.t0, _context4.t1);

          _context4.next = 11;
          return regeneratorRuntime.awrap(_db["default"].toDoList.findMany({
            where: {
              ownerId: user_id
            }
          }));

        case 11:
          lists = _context4.sent;
          _context4.t2 = tables;
          _context4.next = 15;
          return regeneratorRuntime.awrap(assemble_seed_table(lists, "ToDoLists owned by user id ".concat(user_id), ["id", "title", "isPublic", "ownerId"], ["createdAt"]));

        case 15:
          _context4.t3 = _context4.sent;

          _context4.t2.push.call(_context4.t2, _context4.t3);

          list_ids = [];

          for (i in lists) {
            list = lists[i];
            list_ids.push(list.id);
          }

          _context4.t4 = tables;
          _context4.t5 = regeneratorRuntime;
          _context4.t6 = assemble_seed_table;
          _context4.next = 24;
          return regeneratorRuntime.awrap(_db["default"].toDoListItem.findMany({
            where: {
              listId: {
                "in": list_ids
              }
            }
          }));

        case 24:
          _context4.t7 = _context4.sent;
          _context4.t8 = "ToDoListItems owned by user id ".concat(user_id);
          _context4.t9 = ["id", "name", "details", "listId"];
          _context4.t10 = ["createdAt"];
          _context4.t11 = (0, _context4.t6)(_context4.t7, _context4.t8, _context4.t9, _context4.t10);
          _context4.next = 31;
          return _context4.t5.awrap.call(_context4.t5, _context4.t11);

        case 31:
          _context4.t12 = _context4.sent;

          _context4.t4.push.call(_context4.t4, _context4.t12);

          _context4.t13 = tables;
          _context4.t14 = regeneratorRuntime;
          _context4.t15 = assemble_seed_table;
          _context4.next = 38;
          return regeneratorRuntime.awrap(_db["default"].toDoListNote.findMany({
            where: {
              listId: {
                "in": list_ids
              }
            }
          }));

        case 38:
          _context4.t16 = _context4.sent;
          _context4.t17 = "ToDoListNotes owned by user id ".concat(user_id);
          _context4.t18 = ["id", "name", "content", "listId"];
          _context4.t19 = ["createdAt"];
          _context4.t20 = (0, _context4.t15)(_context4.t16, _context4.t17, _context4.t18, _context4.t19);
          _context4.next = 45;
          return _context4.t14.awrap.call(_context4.t14, _context4.t20);

        case 45:
          _context4.t21 = _context4.sent;

          _context4.t13.push.call(_context4.t13, _context4.t21);

          return _context4.abrupt("return", tables.join("\n"));

        case 48:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function assemble_test_plan() {
  var retVal, specs_base, test_overlay, merge_data, resolver, specs, path, endpoints, endpoint, endpoint_info, description, test_setup, i, responses, response, response_info, no_auth_steps, _i, user_steps, _i2, admin_steps, _i3, special_steps, _i4;

  return regeneratorRuntime.async(function assemble_test_plan$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          retVal = "";
          specs_base = _jsYaml["default"].load(_fs["default"].readFileSync(yaml_path, 'utf8'));
          test_overlay = _jsYaml["default"].load(_fs["default"].readFileSync(yaml_overlay_path, 'utf8'));
          merge_data = _lodash["default"].merge(specs_base, test_overlay);

          _fs["default"].writeFileSync(yaml_merge_path, _jsYaml["default"].dump(merge_data)); // We're gonna generate the scaffolding endpoint by reading from the openapi file itself.


          resolver = _nodeChild_process["default"].spawnSync("npx", ["ref-resolver", yaml_merge_path, resolved_yaml_path], {
            shell: true
          });
          specs = _jsYaml["default"].load(_fs["default"].readFileSync(resolved_yaml_path, 'utf8')); // Assembling the bullet list for each endpoint.

          for (path in specs['paths']) {
            endpoints = specs['paths'][path];

            for (endpoint in endpoints) {
              endpoint_info = endpoints[endpoint];
              retVal += "* ".concat(endpoint.toUpperCase(), " ").concat(path, "\n");
              description = endpoint_info["description"];
              retVal += "  * Description: ".concat(description, "\n");
              retVal += "  * Test Setup:\n";

              if (endpoint_info["test_setup"] !== undefined) {
                test_setup = endpoint_info["test_setup"];

                for (i in test_setup) {
                  retVal += "    * ".concat(test_setup[i], "\n");
                }
              }

              retVal += "  * Response Testing:\n";
              responses = endpoint_info["responses"];

              for (response in responses) {
                response_info = responses[response];
                retVal += "    * ".concat(response).concat(response.startsWith('2') ? " (SUCCESS)" : "", " -- ").concat(response_info['description'], "\n"); // No Auth Steps:

                if (response_info["no_auth_steps"] !== undefined) {
                  no_auth_steps = response_info["no_auth_steps"];
                  retVal += "      * With No Authentication:\n";

                  for (_i in no_auth_steps) {
                    retVal += "        * ".concat(no_auth_steps[_i], "\n");
                  }
                }

                if (response_info["user_steps"] !== undefined) {
                  user_steps = response_info["user_steps"];
                  retVal += "      * With USER Role Authentication:\n";

                  for (_i2 in user_steps) {
                    retVal += "        * ".concat(user_steps[_i2], "\n");
                  }
                }

                if (response_info["admin_steps"] !== undefined) {
                  admin_steps = response_info["admin_steps"];
                  retVal += "      * With ADMIN Role Authentication:\n";

                  for (_i3 in admin_steps) {
                    retVal += "        * ".concat(admin_steps[_i3], "\n");
                  }
                }

                if (response_info["test_steps"] !== undefined) {
                  special_steps = response_info["test_steps"];
                  retVal += "      * Special Case:\n";

                  for (_i4 in special_steps) {
                    retVal += "        * ".concat(special_steps[_i4], "\n");
                  }
                }
              }
            }
          }

          return _context5.abrupt("return", retVal);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function main() {
  var seed_data, test_list, user_owns, admin_owns, md_output;
  return regeneratorRuntime.async(function main$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(assemble_all_seed_tables());

        case 2:
          seed_data = _context6.sent;
          _context6.next = 5;
          return regeneratorRuntime.awrap(assemble_test_plan());

        case 5:
          test_list = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(assemble_ownership_tables(4));

        case 8:
          user_owns = _context6.sent;
          _context6.next = 11;
          return regeneratorRuntime.awrap(assemble_ownership_tables(1));

        case 11:
          admin_owns = _context6.sent;
          _context6.next = 14;
          return regeneratorRuntime.awrap(assemble_document_text(seed_data, test_list, user_owns, admin_owns));

        case 14:
          md_output = _context6.sent;

          // console.log("================== Output ==================");
          // console.log(md_output);
          _fs["default"].writeFileSync(md_output_path, md_output); // Having some trouble generating the PDF. We'll generate a word doc for now.


          _nodeChild_process["default"].spawnSync("pandoc", [md_output_path, "-o", doc_output_path]);

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  });
}

main();