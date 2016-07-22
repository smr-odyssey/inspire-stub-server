# tempory-file-storage-server

A small express server for uploading arbitrary files to a local repository.

# Installation

`npm install`

# Running

`node index.js`

Will bind to port 3001. You can now hit `http://localhost:3001/upload` with a multi-part POST request. Uploaded files will be stored inside the project folder at `store` and can be reached at `http://localhost:3001/store/[filename]`.
