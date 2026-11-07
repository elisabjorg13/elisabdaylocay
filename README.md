# Where I am

Two pages:

- `/` shows a map of London, the latest dot, the older stops, and a line between them.
- `/updateloc` is the private page. Open it on your phone and press **Update my location**. **clearloc** removes the old dots so you can start again.

Each press adds a point. Locally that file is `data/location.json`. On Vercel the filesystem cannot be written, so the project needs a Blob store: open the project, go to Storage, create a Blob store, connect it, and redeploy. The site does not track after you leave the update page.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). No accounts or API keys are required.

On an iPhone, this computer’s `localhost` is the phone itself. To update from the phone, the site has to be on an HTTPS address the phone can reach. Safari will ask for location permission, and updates stop when you leave the page or lock the phone.

Anyone who opens `/updateloc` can move the dot. Don’t send that address to other people.
