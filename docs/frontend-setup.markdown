# Frontend Setup
## requirements
* Node.js v10.X ([LTS Dubnium](https://nodejs.org/download/release/latest-dubnium/))

## Client

Based upon `create-react-app`. SASS is enabled, but only compiles to .css-files. 

1. Install dependencies `npm ci`
2. Create and setup `CLIENT_FOLDER/src/env.js` (use **env.example.js** as template and replace _http://example.com_ with your backend domain and _https_ if ssl is enabled)
3. For dev mode, run `npm start` and open `http://localhost:3000`
4. For a production build run `npm run build`

Build process should contain these two commands:

```
npm ci
npm run build
```
