from flask import Flask, render_template, flash, redirect, request, session, jsonify
import requests
import os

app = Flask(__name__)
app.secret_key = os.environ['FLASK_KEY']
api_key = os.environ['API_KEY']

@app.route('/')
def show_homepage():
    return render_template('home.html')

@app.route('/search/results.json')
def get_search_results():
    search_val = request.args.get('searchVal')
    search_params = {'api_key': api_key, 'language':'en-US', 'query':search_val}
    r = requests.get('https://api.themoviedb.org/3/search/movie', params=search_params)

    return r.json()


@app.route('/movie/<movie_id>')
def show_movie_info(movie_id):

    r = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US')

    return render_template('movie_details.html', info=r.json())


if __name__ == '__main__':

    app.debug = False

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(host="0.0.0.0")