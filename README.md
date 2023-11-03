# Preparando o projeto Frontend

## Criando o projeto

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
      "parserOptions": {
        "babelOptions": {
          "presets": [
            [
              "babel-preset-react-app",
              false
            ],
            "babel-preset-react-app/prod"
          ]
        }
      }
    },
    ```

1. Crie um arquivo chamado `.env` na raiz do projeto, e adicione a seguinte variável de ambiente:
    ```properties
    NODE_ENV=development
    ```

1. Para conferir se está tudo funcionando corretamente, execute o projeto com `npm start` e abra a URL `http://localhost:3000` em seu navegador.

## Customizando as configurações do `webpack`

1. Apague todo o conteúdo dos diretórios `src` e `public`, e então na pasta `src` crie os sub-diretórios:

    - `src/components/`: onde ficarão os componentes da nossa aplicação
    - `src/entries/`: onde ficarão os arquivos responsáveis por expor os componentes que serão compilados individualmente
    - `src/helpers`: onde ficarão arquivos auxiliares

1. Crie em `src/helpers/entries.js` a função responsável por renderizar seu componente React em qualquer local de uma página web.
    
    Link: https://gist.github.com/douglasjunior/306119512543924a8ac178d2c23bbba2

1. Defina em `config/entries.js` o script que irá varrer e indexar o diretório `src/entries` para compilar seus componentes React individualmente.
    
    Link: https://gist.github.com/douglasjunior/c452c8e42f3eb3652504808989a3ed92

1. Nos arquivos `scripts/build.js` e `scripts/start.js`, comente o trecho de código que irá validar se o `index.js` e o `index.html` existem na aplicação. Isso é necessário pois nosso objetivo é que cada componente seja compilado individualmente, sendo assim não existirá um `index`.

    ```diff js
    -// Warn and crash if required files are missing
    -if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    -  process.exit(1);
    -}
    ```

1. Modifique o arquivo `config/webpack.config.js` para que seus componentes definidos no diretório `src/entries` sejam compilados e exportados individualmente, bem como
definir como será realizado a pré-visualização dos componentes durante o desenvolvimento.

    - No início do arquivo, adicione a importação do `config/entries.js`

        ```js
        const { entries, entriesNames } = require('./entries');
        ```
    
    - No arquivo `config/entries.js` vamos encontrar um `module.exports` responsável por exportar a função que define as configurações do `webpack`, é no objeto retornado por essa função que iremos trabalhar em seguida.

    - Define na propriedade `entry` o array de `entries` que importamos inicialmente.

        ```diff js
        -entry: paths.appIndexJs,
        +entry: entries,
        ```
    
    - Na propriedade `output.path` adicionar um condicional para que ela só existe quando compilado em produção

        ```diff js
        output: {
           // The build folder.
        -  path: paths.appBuild,
        +  path: isEnvProduction ? paths.appBuild : undefined,
        ```

    - Mais abaixo, em `output.filename` vamos adicionar um `wildcard` no caminho de exportação dos componentes, para garantir que cada componente seja exportado separadamente.

        ```diff js
        output: {
          // ...
          // There will be one main bundle, and one file per asynchronous chunk.
          // In development, it does not produce real files.
          filename: isEnvProduction
              ? 'static/js/[name].[contenthash:8].js'
        -     : isEnvDevelopment && 'static/js/bundle.js',
        +     : isEnvDevelopment && 'static/js/[name].bundle.js',
        ```

    - Entrando nas configurações de plugins, devemos modificar a configuração do `HtmlWebpackPlugin`, responsável por gerar o arquivo `html` contendo a tag `script` que fará a importação do componente. Essa é uma das partes mais importantes da configuração, e um difirencial que faz com que o `webpack` facilite muito o processo.

        ```diff js
            plugins: [
            // Generates an `index.html` file with the <script> injected.
        -   new HtmlWebpackPlugin(
        -     Object.assign(
        -       {},
        -       {
        -         inject: true,
        -         template: paths.appHtml,
        -       },
        -       isEnvProduction
        -         ? {
        -           minify: {
        -             removeComments: true,
        -             collapseWhitespace: true,
        -             removeRedundantAttributes: true,
        -             useShortDoctype: true,
        -             removeEmptyAttributes: true,
        -             removeStyleLinkTypeAttributes: true,
        -             keepClosingSlash: true,
        -             minifyJS: true,
        -             minifyCSS: true,
        -             minifyURLs: true,
        -           },
        -         }
        -         : undefined
        -     )
        -   ),
        +   ...entriesNames.map(fileName => {
        +       /**
        +        * Quando compilado para produção, será gerado um arquivo HTML para cada entrada.
        +        * 
        +        * Ou seja, cada componente compilado individualmente terá seu próprio arquivo HTML,
        +        * que será usado para importar os arquivos JS e CSS necessários.
        +        */
        +       const productionOptions = {
        +         templateContent: ({ htmlWebpackPlugin }) => `
        +           ${htmlWebpackPlugin.tags.headTags}
        +           ${htmlWebpackPlugin.tags.bodyTags}
        +         `,
        +         minify: {
        +           removeComments: true,
        +           collapseWhitespace: true,
        +           removeRedundantAttributes: true,
        +           useShortDoctype: true,
        +           removeEmptyAttributes: true,
        +           removeStyleLinkTypeAttributes: true,
        +           keepClosingSlash: true,
        +           minifyJS: true,
        +           minifyCSS: true,
        +           minifyURLs: true,
        +         },
        +       };
        +        
        +       /**
        +        * Quando em modo de desenvolvimento, será gerado um único arquivo HTML em memória
        +        * que será utilizado para pré-visualizar o componente no navegador.
        +        */
        +       const developmentOptions = {
        +         templateContent: ({ htmlWebpackPlugin }) => `
        +         <html>
        +         <head>
        +           <title>${'App ' + fileName}</title>
        +           </head>
        +           <body>
        +           <div id="root"></div>
        +           ${htmlWebpackPlugin.tags.headTags}
        +           ${htmlWebpackPlugin.tags.bodyTags}
        +         </body>  
        +         </html>  
        +       `,
        +       }
        +        
        +       return new HtmlWebpackPlugin({
        +         filename: fileName + '.html',
        +         chunks: [fileName],
        +         inject: false,
        +         scriptLoading: 'blocking',
        +         ...(isEnvProduction ? productionOptions : developmentOptions)
        +       });
        +     }),
        ```

    - Por fim, devemos remover o plugin `WebpackManifestPlugin`, responsável por gerar os arquivos de manifesto do projeto e transformá-lo em um PWA, o que não é nosso objetivo aqui.

        ```diff js
        // Generate an asset manifest file with the following content:
        // - "files" key: Mapping of all asset filenames to their corresponding
        //   output file so that tools can pick it up without having to parse
        //   `index.html`
        // - "entrypoints" key: Array of files which are included in `index.html`,
        //   can be used to reconstruct the HTML if necessary
        -new WebpackManifestPlugin({
        -  fileName: 'asset-manifest.json',
        -  publicPath: paths.publicUrlOrPath,
        -  generate: (seed, files, entrypoints) => {
        -    const manifestFiles = files.reduce((manifest, file) => {
        -      manifest[file.name] = file.path;
        -      return manifest;
        -    }, seed);
        -    const entrypointFiles = entrypoints.main.filter(
        -      fileName => !fileName.endsWith('.map')
        -    );
        -
        -    return {
        -      files: manifestFiles,
        -      entrypoints: entrypointFiles,
        -    };
        -  },
        -}),
        ```

## Criando e exportando seus componentes

1. Dentro di diretório `src/components` crie os componentes desejados, da forma que desejar, utilizando estilos, bibliotecas e tudo que uma aplicação React convencional permitir. Exemplo:

    HelloWorld.js
    ```js
    import { useState } from 'react';
    import styles from './HelloWorld.module.css';

    const HelloWorld = () => {
      const [counter, setCounter] = useState(0);
      const increment = () => setCounter(counter + 1);
      const decrement = () => setCounter(counter - 1);
      return (
        <div>
          <h1>Olá Mundo!</h1>
          <div className={styles.counter}>
            <button onClick={decrement}>-</button>
            <span>{counter}</span>
            <button onClick={increment}>+</button>
          </div>
        </div>
      );
    }

    export default HelloWorld;
    ```

    HelloWorld.module.css
    ```css
    .counter {
      display: flex;
      gap: 16px;
    }
    ```

1. Defina o arquivo de entrada deste componente em `src/entries`, exemplo:

    ```js
    import HelloWorld from '../components/HelloWorld';
    import { createEntry } from '../helpers/entries';

    createEntry({
      component: HelloWorld,
      name: 'HelloWorld',
    });
    ```

1. Para rodar o projeto em modo desenvolvimento, execute o comando `npm start`. Para pré-visualizar o componente que acabamos de criar acesse no navegador `http://localhost:3000/HelloWorld.html`.

1. Para compilar o projeto em produção, execute no terminal `npm run build`, então você poderá encontrar o HTML gerado em `build/HelloWorld.html`. Já o código JavaScript e CSS compiladores ficarão em `build/static`. 
    
    > !!! Guarde esta informação pois iremos utilizar para integrar nossos componentes dentro da aplicação legada. !!!

## Integrando os componentes React na aplicação legada

1. Clone ou baixe o projeto do repositório: https://github.com/douglasjunior/php-legacy-code-example

1. O projeto PHP consiste em uma aplicação simples, que utiliza PHP para renderizar páginas HTML no servidor. Para inciá-la, basta acessar a raiz do repositório e executar o comando `docker-compose up`, após a inicialização acesse no navegador `http://127.0.0.1:8000`.

1. Finalmente, para adicionar nossos componentes React a aplicação PHP, devemos:

    - Copiar todo o conteúdo da pasta `build/` gerado quando executamos `npm run build`, para dentro da pasta `src/` da aplicação PHP.

    - Incluir/injetar o arquivo HTML do nosso componente, na seção `<head>` do arquivo `src/index.php`, exemplo:

        ```html
        <head>
          <?php include_once('./HelloWorld.html') ?>
        </head>
        ```

    - Finalmente, renderizar o componente no local desejado dentro da seção `<body>` ou outro sub-componente, exemplo:

        ```html
        <body>
          <script>
            window.renderReactComponent.HelloWorld();
          </script>

          <main class="app">
          <!-- outros conteúdos da aplicação -->
          </main>
        </body>
        ```

1. Pronto, você acaba de renderizar um componente React moderno em uma aplicação PHP legada!
