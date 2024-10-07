module.exports = plop => {
  plop.setGenerator('structure', {
    description: 'Create a component with folder structure',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?'
      },
    ],
    actions: [
      {
        // Create main component file
        type: 'add',
        path: 'src/modules/{{name}}/{{name}}.module.ts',
         templateFile: 'templates/module.ts'

      },
      {
        // Create flow folder with a placeholder file
        type: 'add',
        path: 'src/modules/{{name}}/flow/index.ts',

      },
      {
        // Create controller folder with a placeholder file
        type: 'add',
        path: 'src/modules/{{name}}/controller/{{name}}.controller.ts',
         templateFile: 'templates/controller.ts'

      },
      {
        // Create service folder with a placeholder file
        type: 'add',
        path: 'src/modules/{{name}}/service/{{name}}.service.ts',
         templateFile: 'templates/service.ts'

      },
       {
        // Create service folder with a placeholder file
        type: 'add',
        path: 'src/modules/{{name}}/model/{{name}}.data.ts',
      },
    ],
  });
};