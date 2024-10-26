## youtube api experiment

### why?
the main idea of this project was to refamiliarize myself with the html/css/js web development flow and to learn the youtube api. i've noticed that youtube music specifically is lacking a group queue feature, like spotify has. the end goal is to simulate that utilizing youtube music.

### future improvements
- document code (despite it being relatively easy to understand, it's nice for readability)
- implement where more than one user can connect to a server and add to the queue
- improve ui look, as it is currently plain


### how to run (why would you)
- set up a localhost server using python3, as the api cannot run just opening the files on the browser: ```python -m http.server 8000```
- set up a config json file with a API-KEY value from ```https://console.cloud.google.com```'s API services
- queue up some songs, then hit "update queue".
- hit play!

