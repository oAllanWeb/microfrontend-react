# Micro React components para serem utilizados onde desejar

1. Criar o projeto com `npx create-react-app <nome-do-projeto>`
1. Faça um commit inicial para o projeto, caso contrário não será permitido executar os próximos passos
1. Realizar o eject para ter acesso aos arquivos de configuração `npm run eject`
1. Caso tenha problemas com as configurações do `eslint`, atualiza a `eslintConfig` do seu `package.json` para:
    ```json
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    },
    ```
1. Crie um arquivo chamado `.env` na raiz do projeto, e adicione a seguinte variável de ambiente:
    ```properties
    NODE_ENV=development
    ```
1. Para conferir se está tudo funcionando corretamente, execute o projeto com `npm start` e abra a URL `http://localhost:3000` em seu navegador.
