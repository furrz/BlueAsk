# BlueAsk

This is an anonymous Q&A site for Bluesky, hosted at [ask.zyntaks.ca](https://ask.zyntaks.ca).

Contributions are welcome. The project is MIT-licensed.


## Development

This is a Next.js-based project.

### First Time Setup

In order to run the project locally, you need access to Vercel KV., you will want to make a [vercel](https://vercel.com) deployment: run `vercel` from the project directory, then go to the website and link a Vercel KV (redis) database under storage. Finally, run `vercel env pull` on the client. 
 - Sign up for [vercel](https://vercel.com) and install the CLI
 - Run `vercel` from the root of this project to deploy an instance.
 - Go to the vercel dashboard, select the project you just deployed, select "Storage", and attach/add a Vercel KV database.
 - Back on your CLI, run `vercel env pull` to put access keys for your database into the `.env` file.
 - You are now ready!

### Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To learn more about the Next.js framework, see the [Next.js Documentation](https://nextjs.org/docs).
