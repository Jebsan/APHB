**The Website for the weathering project**

Follow the steps below to get the project running.

---

**Instructions for mac-users**

Node.js, also called Node, is a runtime environment for writing server-side applications in JavaScript.

1. Download installer: https://nodejs.org/en/download/package-manager

2. verify installation: 
/ node -v

3. update npm: 
/ sudo npm install -g npm

4. use nmp to install ecpress-generator: 
/ sudo npm install -g express-generator

5. (Optional) Create a new app using desired view-engine: 
/ express myapp --view="pug"

6. (It varies) if the previous developer was working on Win we need to rebuild nodemodules for Mac
/ rm -rf node_modules

7. Install required dependencies (as listed in package.json): 
/myapp/ npm install

8. (Optional) if vulnerabilities are found fix: 
/myapp/ npm audit fix 

9. install nodemon (dev-tool to auto update on change): 
/myapp/ npm install --save-dev nodemon

10. run: 
/myapp/ npm run devstartmac 

---

**Instructions for windows-users**

Node.js, also called Node, is a runtime environment for writing server-side applications in JavaScript.

1. Download installer: https://nodejs.org/en/download/package-manager

2. verify installation: 
/ node -v

2.1 set default Node version across all terminals to access it everywhere
/ fnm env --use-on-cd | Out-String | Invoke-Expression

3. update npm: 
/ npm install -g npm

4. use nmp to install ecpress-generator: 
/ npm install -g express-generator

5. (Optional) Create a new app using desired view-engine: 
/ express myapp --view="pug"

6. (It varies) if the previous developer was working on Mac we need to rebuild nodemodules for Win
/ Remove-Item -Recurse -Force .\node_modules\

7. Install required dependencies (as listed in package.json): 
/myapp/ npm install

8. (Optional) if vulnerabilities are found fix: 
/myapp/ npm audit fix 

9. install nodemon (dev-tool to auto update on change): 
/myapp/ npm install --save-dev nodemon

10. run: 
/myapp/ npm run devstartwin 

