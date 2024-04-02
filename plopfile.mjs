export default function (plop) {
  plop.setGenerator('component', {
    description: 'criar um componente de React',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'nome do componente',
      },
    ],
    actions: function (data) {
      const actions = [];


        actions.push(
          {
            type: 'add',
            path: './src/pages/{{pascalCase name}}/{{pascalCase name}}.tsx',
            templateFile: 'templates/component/component.tsx.hbs',
          },
          {
            type: 'add',
            path: './src/pages/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
            templateFile: 'templates/component/component.test.tsx.hbs',
          },
          {
            type: 'add',
            path: './src/pages/{{pascalCase name}}/index.ts',
            templateFile: 'templates/component/index.ts.hbs',
          }
        );
      
      

      return actions;
    },
  });

  plop.setGenerator('page', {
    description: 'criar uma pagina de React',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'nome da pagina',
      },
    ],
    actions: function (data) {
      const actions = [];


        actions.push(
          {
            type: 'add',
            path: './src/pages/{{pascalCase name}}.tsx',
            templateFile: 'templates/pages/page.tsx.hbs',
          },
          {
            type: 'add',
            path: './src/entries/{{pascalCase name}}.ts',
            templateFile: 'templates/pages/entry.ts.hbs',
          },
         
        );

      return actions;
    },
  });
}

