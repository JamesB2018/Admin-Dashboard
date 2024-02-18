import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
    //define graphQL schema provided by Refine
  schema: "https://api.crm.refine.dev/graphql",
  extensions: {
    //codegen is a plugin that generates typescript types from GraphQL schema
    //https://the-guild.dev/graphql/codegen
    codegen: {
        //hooks are commands that are executed after a certain event
      hooks: {
        afterOneFileWrite: ["eslint --fix", "prettier --write"],
      },
      // generates typescript types from GraphQL schema
      generates: {
        //Specify the output path of the generated types
        "src/graphql/schema.types.ts": {
            //Use typescript plugin
          plugins: ["typescript"],
            //set the config of the typescript plugin
            // this defines how the generated types will look like
          config: {
            skipTypename: true, //skipTypename is used to remove __typename from the generated types
            enumsAsTypes: true, //enumAsTypes is used to generate enums as types instead of enums.
            //scalars is used todefine how the scalars interpret DateTime, JSON, etc. will be generated. 
            scalars: { 
                // scalar is a type that is not a list and does not have fields. It is a usually a primitive type
                // DateTime is a scalar type that is used to represent date and time
              DateTime: { 
                input: "string",
                output: "string",
                format: "date-time",
              },
            },
          },
        },
        // Generates typescript types from GraphQL operations. GraphQL operations are queries, mutations, and subscriptions we write in our code to communicate with the GraphQL API
        "src/graphql/types.ts": {
          preset: "import-types",
          documents: ["src/**/*.{ts,tsx}"],
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            // useTypeImports is used to import types using import type instead of just import
            useTypeImports: true,
          },
          // presetConfig is used to define the config of the preset
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;