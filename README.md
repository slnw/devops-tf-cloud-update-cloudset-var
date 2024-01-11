# Update Terraform Cloud Variable

This action updates a Terraform Cloud variable **set**
https://www.terraform.io/docs/cloud/api/variables.html

It borrows heavily from the work done by https://github.com/patrontech/devops-tf-cloud-update-var and https://github.com/sarathkrish/invoke-terraform-run-api so shout out to them.

## Inputs

### `organizationName`

**Required** Your Organization.

### `terraformToken`

**Required** Your Terraform token. Please use secret to store your Terraform token.

 ### `terraformHost`

This is the Terraform Host Name.  default: app.terraform.io.

### `variableName`

**Required** The variable name to be updated.

 ### `variableValue`

**Required** The value to update the variable with.

 ### `variableSetName`

**Required** The name of the variable set.

## Outputs

### `variableId`

 The variable ID.

## Example usage

```
uses: slnw/devops-tf-cloud-set-update@v1.0   
with:  
  variableSetName: mySet  
  organizationName: {{env.organization}}  
  terraformToken: {{secrets.Terraform_Token}}
  terraformHost: 'app.terraform.io'
  variableName: 'container_tag'
  variableValue: 'v1.1.1'
```