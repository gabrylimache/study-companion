# studyCompanion · React / TypeScript demo

This ready-to-run Vite project uses the exported studycompanion.avatar.json definition with
@bible-strong/avatar-react.

## Run the demo

```sh
npm install
npm run dev
```

Then open the local URL displayed by Vite. The demo includes controls for every exported animation
and expression.

## Production build

```sh
npm run build
```

The component is created once from the JSON definition with `createAvatar(definition)`. TypeScript
derives the accepted animation and expression prop keys from that imported JSON file.

## Deploy to GitHub Pages

The site can be published to GitHub Pages using the provided GitHub Actions workflow. The Vite build is configured to use the `/studycompanion/` base path when building for production, which matches the repository name.

```sh
# Ensure the repository is named `studycompanion` (or adjust the base path in vite.config.ts)
git push origin main   # Triggers the workflow
```

After the workflow completes, the site will be available at `https://<username>.github.io/studycompanion/`.

## Local Development

```sh
npm install
npm run dev
```

Visit `http://localhost:5173` to view the demo.
