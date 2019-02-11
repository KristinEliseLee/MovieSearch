from flask import Flask, render_template, redirect, request, jsonify
import requests
import os

app = Flask(__name__)
app.secret_key = os.environ['FLASK_KEY']
api_key = os.environ['API_KEY']

@app.route('/')
def show_homepage():
    """Shows the search page, which is the home page"""
    return render_template('home.html')

@app.route('/search/results.json')
def get_search_results():
    """Gets search results using TMDB, gets all pages worth of results, and returns the JSON"""
    search_val = request.args.get('searchVal')
    all_results = []
    search_params = {'api_key': api_key, 'language':'en-US', 'query':search_val, 'page': 1}
    r = requests.get('https://api.themoviedb.org/3/search/movie', params=search_params)
    r = r.json()
    all_results.extend(r['results'])
    for i in range(2, r['total_pages']+1):
        search_params['page'] += 1
        r = requests.get('https://api.themoviedb.org/3/search/movie', params=search_params)
        r = r.json()
        all_results.extend(r['results'])

    return jsonify({'results': all_results})

@app.route('/popular.json')
def get_popular_list():
    """Gets the current list of popular movies.
    since this changes daily, to avoid searching it multipul times a day, may implement
    saving the info to the server/db

    """
    r = requests.get(f'https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=en-US')
    r = r.json()
    return jsonify({'results': r['results']})

@app.route('/movie/<movie_id>')
def show_movie_info(movie_id):
    """ Shows the page for the move of the Movie ID using TMDB info"""

    r = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US')
    r = r.json()
    return render_template('movie_details.html', info=r)


if __name__ == '__main__':

    app.debug = True

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
