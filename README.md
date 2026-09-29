## Organização

A navegação fica em `src/app`, com o Expo Router. Cada arquivo de rota só lê o parâmetro da URL (`schoolId`, `classId`) e renderiza a tela da feature. Os `_layout` também ficam em `src/app`, porque o Expo só reconhece layout ali.

O restante fica em `src/features` e `src/shared`. Feature pode depender de shared. Shared não importa feature. Escola pode usar turma, porque excluir uma escola também remove as turmas dela.

| Parte | Onde | Papel |
| --- | --- | --- |
| Rotas | `src/app` | URL, stacks e passagem de `schoolId` / `classId` para a tela |
| Escolas | `src/features/schools` | Domínio, service, store Zustand, mock, hook e telas |
| Turmas | `src/features/classes` | O mesmo, sempre ligadas a uma escola |
| Compartilhado | `src/shared` | UI do Gluestack, header, action sheet, paginação e o servidor de mock |

Dentro de cada feature a divisão é a mesma: `domain`, `services`, `stores`, `mocks`, `hooks` e `presentation`.

O service faz `fetch` para `http://localhost:3000`. A tela não chama o service. Ela pede ao store. O store guarda a lista, o item selecionado e os estados de carregar, criar, atualizar, excluir e erro.

O mock é MirageJS e só sobe em desenvolvimento. Quem registra as rotas de escola e de turma é o layout raiz, `src/app/_layout.tsx`. O servidor em `src/shared/mocks` recebe essas rotas por callback, para o shared não depender das features. Os dados ficam em memória. `GET /schools` calcula `classCount` a partir das turmas. `DELETE /schools/:id` apaga a escola e as turmas daquele id.

## Telas

Listagem de escolas em cartões, com busca por nome, endereço ou cidade e paginação no cliente.

O menu de cada cartão abre uma folha de ações: ver, editar e excluir. Excluir pede confirmação.

Cadastro e edição da escola, com nome, endereço e cidade.

Detalhe da escola, com abas de turmas, informações e endereço. O lápis do topo abre a edição.

Listagem das turmas da escola, cadastro, detalhe e edição. Ano/série e turno são seleção. A turma nova já nasce vinculada à escola da URL.

Não há aluno, professor nem turma inativa. A aba Alunos do detalhe da turma fica vazia.

## Versões utilizadas

Expo SDK 57, com React Native 0.86 e React 19. A navegação é o Expo Router, a partir de `src/app`.

A interface é Gluestack UI v5 com NativeWind 5 (Tailwind CSS 4). A fonte é Poppins, carregada com `expo-font` e `@expo-google-fonts/poppins` na abertura do app.

O estado fica no Zustand. A API falsa é o MirageJS. Em desenvolvimento, o Metro injeta `src/shared/mocks/pretender-global.js` para o Pretender encontrar `self` no React Native.

## O que precisa estar instalado

- Node.js na versão LTS atual e npm.
- Um celular com o Expo Go compatível com o SDK 57, ou um emulador Android. No macOS, o simulador do iOS também serve.
- Para o emulador Android, Android Studio com uma imagem de sistema criada.

Não é preciso banco, backend nem conta na Expo para rodar em desenvolvimento. A porta 3000 não precisa de um servidor: o Mirage intercepta o `fetch`.

## Passos de instalação e execução

Na pasta do projeto:

```bash
npm install
npx expo start
```

No terminal do Expo, `a` abre o Android e `w` abre no navegador. No celular, o caminho é o QR code pelo Expo Go, com o aparelho na mesma rede da máquina.

O primeiro start baixa a fonte e sobe o mock. Se a porta 8081 já estiver ocupada por outro `expo start`, encerre esse processo antes de subir de novo.

Se o mock não interceptar as chamadas depois de uma mudança no `metro.config.js`, suba de novo limpando o cache:

```bash
npx expo start -c
```

Para checar os tipos:

```bash
npx tsc --noEmit
```
