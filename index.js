const core = require("@actions/core");
const axios = require("axios");

async function main() {
  try {
    const variableSet = core.getInput("variableSetName");
    const organizationName = core.getInput("organizationName");
    const token = core.getInput("terraformToken");
    const terraformHost = "app.terraform.io";
    const variableValue = core.getInput("variableValue");
    const variableName = core.getInput("variableName");
    let variableHCL = core.getInput("variableHCL");

    if (variableHCL !== "true") {
      variableHCL = "false";
    }

    const options = {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Authorization: "Bearer " + token,
      },
    };

    // Fetching WorkSpaceId
    // TODO: Throw exception if workspace don't exist.
    const terraformWorkSpaceEndpoint =
      "https://" +
      terraformHost +
      "/api/v2/organizations/" +
      organizationName +
      "/varsets";
    const response = await axios.get(terraformWorkSpaceEndpoint, options);
    var variableSetId = response.data.data.find(
      (item) => item.attributes.name === variableSet
    )?.id;
    console.log("variable set id:" + variableSetId);

    if (variableSetId == null) {
      core.setFailed("Variable Set Could Not Be Found");
    }

    // find variable id from variable name in variable set
    const terraformVariableSetEndpoint =
      "https://" + terraformHost + "/api/v2/varsets/" + variableSetId + "/vars";
    const response1 = await axios.get(terraformVariableSetEndpoint, options);
    var variableId = response1.data.data.find(
      (item) => item.attributes.key === variableName
    )?.id;

    console.log("variable id:" + variableId);
    if (variableId == null) { // if variable not found, create it
        console.log("variable not found, creating it");
        const terraformVariableSetEndpoint =
            "https://" + terraformHost + "/api/v2/varsets/" + variableSetId + "/vars";
        await axios.post(terraformVariableSetEndpoint, {
            data: {
            type: "vars",
            attributes: {
                key: variableName,
                value: variableValue,
                hcl: variableHCL,
                category: "terraform",
            },
            },
        }, options);
        console.log("variable created");
    }else{
        console.log("variable found, updating it");
        const terraformVariableSetEndpoint =
            "https://" + terraformHost + "/api/v2/varsets/" + variableSetId + "/vars/" + variableId;
        await axios.patch(terraformVariableSetEndpoint, {
            data: {
            type: "vars",
            attributes: {
                key: variableName,
                value: variableValue,
                hcl: variableHCL,
                category: "terraform",
            },
            },
        }, options);
        console.log("variable updated");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
