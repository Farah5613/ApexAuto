# Documentation of Challenges and Problems in the Car Gallery Project

## 1. Data File Not Found Error (Module Not Found)
* *Problem:* The cars.json file was located outside the app directory, and the page code (page.tsx) could not access it.
* *Solution:* Moved the cars.json file into the app directory and corrected the import path to ./cars.json.

## 2. External Images Error (Unsplash)
* *Problem:* The Next.js framework blocked loading images from external hosts due to security reasons.
* *Solution:* Added the images.unsplash.com domain to the next.config.ts configuration file.

## 3. Config File Structure Error and Server Disconnection
* *Problem:* Extra code existed in the next.config.ts file, and the development server stopped (ERR_CONNECTION_REFUSED).
* *Solution:* Cleaned up the configuration code and restarted the development server using the npm run dev command
## 4. Untracked .agents Folder Error
* *Problem:* The system generated an unwanted .agents folder/file that was accidentally tracked.
* *Solution:* Used git commands to remove it from tracking and committed the change.
* *Successful Commands Executed:*
```bash
git rm -r --cached .agents
git commit -m "Remove .agents from repositorygity"
