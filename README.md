# Kolabr

A Kanban board application with live collaboration capabilities. Made with [SvelteKit](https://kit.svelte.dev/) & [Liveblocks](https://liveblocks.io).

## About this project

Technologies used in this project include:

- Svelte
- SvelteKit
- Liveblocks
- lucia-auth
- mongoose
- tailwindcss
- shadcn/ui (shadcn-svelte)

## Features

- Intuitive drag-and-drop interface for managing tasks
- Real-time collaboration with Liveblocks
- User authentication with lucia-auth
- Integration with MongoDB using mongoose
- Stylish UI components from shadcn-svelte

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
cp .env.example .env
```

3. Start the development server:

```sh
pnpm dev
```

## License

Licensed under the [MIT license](https://github.com/jecktor/kolabr/blob/main/LICENSE).
