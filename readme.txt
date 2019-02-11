
1 - get an API key from The Movie Database (TMDB)
2 - set up python virtual environment and activate it
3 - pip install -r requirements.txt
4 - export the API key as an OS variable named API_KEY (I use a secrets.sh file, example below)
    secrets.sh
    export API_KEY=<<api key here>>

    in console:
    source secrets.sh

5 - run server.py
6 - go to localhost:5000
