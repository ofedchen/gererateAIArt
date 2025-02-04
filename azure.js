// Include required dependencies
import { DefaultAzureCredential } from '/@azure/identity';  
import { SecretClient } from '/@azure/keyvault-secrets';  

// Authenticate to Azure
const credential = new DefaultAzureCredential(); 

// Create SecretClient
const vaultName = 'generateartauth';  
const url = `https://${vaultName}.vault.azure.net`;  
const client = new SecretClient(url, credential);  

console.log(vaultName, url, client)

// Get secret
const secret = await client.getSecret("MySecretName");

console.log(secret)