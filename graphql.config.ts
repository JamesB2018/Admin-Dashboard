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
            skipTypename: true,
            enumsAsTypes: true,
            scalars: {
              DateTime: {
                input: "string",
                output: "string",
                format: "date-time",
              },
            },
          },
        },
        "src/graphql/types.ts": {
          preset: "import-types",
          documents: ["src/**/*.{ts,tsx}"],
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            useTypeImports: true,
          },
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;