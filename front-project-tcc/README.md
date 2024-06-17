# [FRONT-END] Aplicação de agendamentos de discentes pelo NUAPE

Documentação responsável pelo lado do cliente da aplicação web desenvolvida para o agendamento de alunos com o NUAPE. Esta aplicação está em sua _Versão 1.0.0_.

## Funcionalidades implementadas

- Cadastrar aluno do sistema;
- Realizar login utilizando o "Registro acadêmico", tanto para alunos quanto para profissionais;
- Visualizar as áreas do NUAPE;
- Realizar o agendamento com um profissional;
- Cancelar um agendamento;
- Definir uma sessão agendada como concluída;
- Realizar o agendamento com um aluno de forma manual;
- Realizar logout.

## Funcionalidades não implementadas

- Realizar a definição de horários de um profissional na aplicação;
- Realizar o remarque de uma sessão agendada para uma nova data;
- Permitir a visualização dos agendamentos de toda a equipe existente no NUAPE.

## Tecnologias e Bibliotecas

Um pré-requisito é possuir as seguintes ferramentas instaladas:

- **Node.js - Versão 20.10.0**
- **npm**

O desenvolvimento deste projeto partiu do uso da biblioteca de componentização JavaScript.

- **React.js - Versão 18.2.0**

Abaixo estão as bibliotecas utilizadas neste projeto:

- **Axios - Versão 1.6.8**
- **Buffer - Versão 6.0.3**
- **Prop-types - Versão 15.8.1**
- **React-Icons - Versão 5.0.1**
- **React-Jwt - Versão 1.2.1**
- **React-Router-Dom - Versão 6.22.3**
- **React-Toastfy - Versão 10.0.5**

## Utilização

Para utilizar esse projeto em ambiente de desenvolvimento, primeiro execute as seguintes instruções em um terminal ou IDE.

#### Instalação

```http
 npm install
 npm run dev
```

Isso iniciará o servidor de desenvolvimento e abrirá a aplicação no seu navegador padrão.

## Estrutura do projeto

Breve descrição da estrutura de diretórios e arquivos principais do projeto.

```http
front-project-tcc/
├── node_modules/
├── public/
│   └── images
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── api.js/
│   ├── App.jss
│   ├── index.css
│   ├── main.jsx
│   └── router.jsx
├── package.json
├── index.html
└── README.md
```

## Autor

Este projeto foi desenvolvimento por:

- [Ricardo Rebelo Junior](https://www.linkedin.com/in/rrebelojr/)
