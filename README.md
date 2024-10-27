To install dependencies:

```bash
bun install
```

Paste your [api key](https://clickup.com/api/developer-portal/authentication#personal-token)
```bash
echo "API_KEY=pk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" > .env
```

To run:

```bash
bun run index.ts export --baht 2.75 --start 2024-09-28 --end 2024-10-28
```
