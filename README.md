# BlueAsk

This is an anonymous Q&A site for Bluesky, hosted at [ask.zyntaks.ca](https://ask.zyntaks.ca).

Contributions are welcome. The project is MIT-licensed.


## Development

This is a Next.js-based project.

### First Time Setup

In order to run the project locally, you will need a Postgres database. Set `POSTGRES_URL` in .env appropriately.

Generate some random characters and set `JWT_SECRET` in .env appropriately, as a provisional JSON Web Tokens secret.

Run `npx prisma migrate dev` to apply all database migrations to your local postgres.

### Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To learn more about the Next.js framework, see the [Next.js Documentation](https://nextjs.org/docs).
