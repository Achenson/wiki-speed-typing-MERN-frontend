# wiki-speed-typing-MERN-frontend

This repository contains code for frontend part of an app hosted on Render.

Backend part of the app:

https://github.com/Achenson/wiki-speed-typing-MERN-backend

Previous monorepo code for Heroku (no longer working due to removal of Heroku free tier):

https://github.com/Achenson/wiki-speed-typing-MERN

Known issues compared to Heroku version:

After period of inactivity, backend part of the app spin up much slower. This results is noticable delay until the following functionalities are available: logging in, registering, token refreshing

## About

Test your typing speed using random* articles from English Wikipedia. Main results are displayed every 2 seconds, detailed results are available after the timer goes off. Press '?' button for more information.
Create an account to access your top score.  App structure described in appTree.txt

\* \- articles shorter than 370 characters or containing non-english characters are skipped. All text in brackets is edited out.

Technologies used: React, Redux, GraphQL (Apollo), JSON Web Token

## Live app

https://wikispeedtyping.onrender.com
