# <p><img src="./client/assets/favicon.svg" width="25" height="25"/> Auth</p>

User authentication and authorization server

- [ Auth](#-auth)
  - [Overview](#overview)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Developemnt](#developemnt)
    - [Building](#building)
    - [Production](#production)
    - [Cleaning](#cleaning)
  - [Api Documentation](#api-documentation)
  - [Live Demo](#live-demo)

## Overview

Auth is a robust user authentication and authorization server built with Express.js and React. It utilizes server-side rendering (SSR) for optimized performance.

## Features

- User authentication and authorization
- Server-side rendering (SSR) for optimized performance
- Built with Express.js and React

## Technology Stack

- Express.js: Node.js web framework
- React: JavaScript library for building user interfaces
- Server-side rendering (SSR): Rendering React components on the server
- MongoDB non-relational database
- pnpm: Package manager for efficient package installation

## Installation

To install the project dependencies, run the following command:

```bash
pnpm install
```
> setup `environment variables` from [variables file](/env_setup.md).

### Developemnt

To start the development server, run the following command:

```bash
pnpm dev
```

### Building

To build the project for production, run the following command:

```bash
pnpm build
```

This will build both the client and server sides of the application.

### Production

To start the production server, run the following command:

```bash
pnpm preview
```

### Cleaning

To remove the dist directory, run the following command:

```bash
pnpm clean
```

## Api Documentation

[Auth api's doc](https://documenter.getpostman.com/view/26238267/2sAY4ydfot)

## Live Demo

[Auth-ssr live demo][demo]

[demo] : https://auth-new.vercel.app/
