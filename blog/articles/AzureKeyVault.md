# Removing Credentials From Source Code With Azure Key Vault

Published: May 10, 2019

I client I have been working with instructs multiple agencies to develop applications which are hosted in the same Azure ecosystem.  One of the best practice requirements that each agency has agreed to was to keep credentials out of source code by using Azure Key Vault.  The following is how I solved this requirement with an EPiServer CMS website build.

## Configuring Azure Key Vault in the Azure Portal

It's fairly straight forward to create an Azure Key Vault, simply log into the [Azure portal](https://portal.azure.com), click on **Create a resource** and search for **Key Vault**.  There are few properties required to create your Azure Key Vault.

![Creating an Azure Key Vault](/articles/images/AzureKeyVault1.png)

If you want to store a connection string or app setting in Azure Key Vault, then you should enter them both as secrets.  You can do this by navigating to your Azure Key Vault, clicking on **Secrets** and then clicking on **Generate/Import**

![Adding a secret to Azure Key Vault](/articles/images/AzureKeyVault2.png)

## Adding Azure Key Vault to an ASP.NET 4.7 web project

The following steps will add Azure Key Vault to your web project, this will automatically add all of the nuget packages you require as well as amending your web.config so that you can store app settings and connection strings in Azure Key Vault.  This does however require that you are logged into Visual Studio with an account which is either the same account or an account linked to the Azure account which hosts your Azure Key Vault.

1. Right click on your web project and add a new *Connected Service*.
2. Select *Secure Secrets with Azure Key Vault*.
![Connecting to Azure Key Vault in Visual Studio](/articles/images/AzureKeyVault4.png)
3. Select your *Subscription* and *Key Vault*, you should be able to select the Key Vault you created previously if you are logged into Visual Studio with the same account you use for Azure.
![Connecting to Azure Key Vault in Visual Studio](/articles/images/AzureKeyVault5.png)

So what if your visual studio account is completely separate to the Azure account which hosts your Azure Key Vault?  You can still achieve the same as the above, but you will need to follow the steps in the following two sections:

### Connecting to an Azure Account with Azure CLI

The Azure CLI will allow you to connect to an Azure account at a system level, this means you can be logged into Visual Studio with your developer account while being connected to separate Azure account.  I've tested this by having an Azure Key Vault in my personal azure account while being logged into visual studio with my separate business account.

- Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
- Open a command prompt
- Log into the correct Azure account with the following command (This will open a browser to complete the login process):

```cmd
az login
```

Once you're finished developing and no longer need to be connected to azure, simply run the following command to logout:

```cmd
az logout
```

### Manually Adding Azure Key Vault to your solution

1. Use Nuget to add the following packages to your web project:
    - Microsoft.Azure.KeyVault
    - Microsoft.Azure.Services.AppAuthentication
    - Microsoft.Configuration.ConfigurationBuilders.Azure**
2. Update your web.config with the following (Replacing *MyKeyVaultName* with the name of your own Azure Key Vault):

```XML
<configSections>
    <section name="configBuilders" type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" restartOnExternalChanges="false" requirePermission="false" />
</configSections>
<configBuilders>
    <builders>
        <add name="AzureKeyVault" vaultName="MyKeyVaultName" type="Microsoft.Configuration.ConfigurationBuilders.AzureKeyVaultConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.Azure, Version=1.0.0.0, Culture=neutral" vaultUri="https://MyKeyVaultName.vault.azure.net" />
    </builders>
</configBuilders>
<appSettings configBuilders="AzureKeyVault">
    <add key="MySecret" value="" />
</appSettings>
<connectionStrings configBuilders="AzureKeyVault">
  <add name="EPiServerDB" connectionString="" providerName="System.Data.SqlClient" />
</connectionStrings>
```

The addition of *configBuilders="AzureKeyVault"* to the connectionStrings or appSettings node tells the project to replace values in these sections with those found in the Azure Key Vault.  If you haven't provided a corresponding value in the Azure Key Vault, then the value in the web.config file will be used instead.

## Using Azure Key Vault with multiple environments

If you have a Continuous Integration system in place with multiple environments (e.g. dev, test, staging, etc.), then you should create an Azure Key Vault per environment.  You can then use transform files to change your target Azure Key Vault for each environment.  If those environments are not in Azure, then you will need to connect to the relevant Azure account by running the Azure CLI in the relevant environment.

### Using a secrets file for development and test environments

If you don't want to create an Azure Key Vault for development and test environments, you can instead create a secrets file and store outside of your project folder.  This does bring you back into the realms of having credentials in source code, so do consider carefully where this file will live.  Microsoft provide details for how to do this here: [Securely save secret application settings for a web application](https://docs.microsoft.com/en-us/azure/key-vault/vs-secure-secret-appsettings)

Example secrets file:

```xml
<root>
    <secrets ver="1.0">
        <secret name="secret1" value="foo_one" />
        <secret name="secret2" value="foo_two" />
    </secrets>
</root>
```

You would need to set your web.config transform files to point the configuration builder to the secrets file:

```XML
<configBuilders>
    <builders>
        <add name="Secrets"
             secretsFile="C:\Users\AppData\MyWebApplication1\secret.xml" type="Microsoft.Configuration.ConfigurationBuilders.UserSecretsConfigBuilder,
                Microsoft.Configuration.ConfigurationBuilders, Version=1.0.0.0, Culture=neutral" />
    </builders>
</configBuilders>
```

## References

- [What is Azure Key Vault?](https://docs.microsoft.com/en-gb/azure/key-vault/key-vault-overview)
- [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-portal)
- [Quickstart: Set and retrieve a secret from Azure Key Vault by using a .NET web app](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-net)
- [Add Key Vault to your web application by using Visual Studio Connected Services](https://docs.microsoft.com/en-us/azure/key-vault/vs-key-vault-add-connected-service)
- [Securely save secret application settings for a web application](https://docs.microsoft.com/en-us/azure/key-vault/vs-secure-secret-appsettings)
- [Azure Command-Line Interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
- [Securely save secret application settings for a web application](https://docs.microsoft.com/en-us/azure/key-vault/vs-secure-secret-appsettings)