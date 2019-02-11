/* global $ React :true*/

function SearchBar(props) {
  // Creates the search bar at the top of the page
  // props are value, onSubmit, onChange
  return (
    <form action='/search/results.json' id='searchbar' onSubmit={(evt) => {
      evt.preventDefault(); props.onSubmit(1);
    }}>
        <input type='text' id='searchTexBar' value={props.value} name='searchVal' onChange={props.onChange}/>
        <input type='submit' name='Search' id='searchButton'/>
    </form>
  );
}

function DisplayResults(props) {
  // Shows single page of results
  // props are results, page, perPage, isPopular
  if (props.results.length === 0){
    return null
  }
  let allResults = [];
  let i = 0;
  let index = props.page-1
  let resultsToShow = props.results.slice(index*props.perPage, (index + 1)*props.perPage)
  for (let item of resultsToShow) {
    allResults.push(
      <tr key={i}>
        <td><a href={`/movie/${item.id}`}>{item.title}({item.release_date})</a></td>
      </tr>
    );
    i += 1;
  }
  if (props.isPopular === true){
      return (
        <div>
          <h3> Currently Popular</h3>
          <table id='results'>
            <tbody>
              {allResults}
            </tbody>
          </table>
        </div>
      )
    }
  return (
    <table id='results'>
      <tbody>
        {allResults}
      </tbody>
    </table>
  );
}

function DisplayPages(props) {
  // Handles pagination of results
  // props are page, numPages, onClick
  const allPages = [];
  if (props.page > 1) {
    allPages.push(<span key='prev' className='pages' onClick={
      ()=>props.onClick(props.page - 1)}> {'<<prev'} </span>
    );
  } 
  // const numPages = [];
  for (let i = 1; i <= props.numPages; i += 1) {
    if (i !== props.page) {
      allPages.push(
        <span key={i} className='pages' onClick={()=>props.onClick(i)}>{i}
        </span>
      );
    } else {
      allPages.push(<span key={i} id='currentPage'>{i}</span>);
    }
  }
  if (props.page < props.numPages) {
    allPages.push(<span key='next' className='pages' onClick={
      ()=>props.onClick(props.page + 1)}> {'next>>'} </span>
    );
  } 
  if (props.numPages > 1) {
    return (
      <div key='allPages'>{allPages}
      </div>
    );
  }
  return null;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultsPerPage:15,
      searchVal: '',
      numpages:0,
      page:1,
      searchResults: [],
      popular: [],
      showPopular:true
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.changePage = this.changePage.bind(this)
    // this.getPopular = this.getPopular.bind(this)
  }

  componentDidMount(){
    $.get('/popular.json',
      (response) => {
          this.setState({ popular: response.results, showPopular:true});
      }
    );  
  }

  handleSearchChange(evt) {
    // Keeps the SearchVal up to date with entered info
    this.setState({ searchVal: evt.target.value });
  }

  changePage(num) {
    // Used when changing page number
    this.setState({page:num})
  }

  handleSearch() {
    // uses the searchVal and issues a GET request from the server.
    $.get('/search/results.json', { searchVal: this.state.searchVal
    },
      (response) => {
        this.setState({ searchResults: response.results, page: 1, popular: [],
          showPopular: false,
          numPages:Math.ceil(response.results.length/this.state.resultsPerPage)
        });
      });
  }

  render() {
    return (<div>
      <div className='row search-text'>
        <h4> Search Movie By Title </h4>
      </div>
        <SearchBar onSubmit={this.handleSearch} onChange={this.handleSearchChange}
        value={this.state.searchVal} />
      <DisplayResults results={this.state.popular} page='1' perPage='15' isPopular={this.state.showPopular}/>
      <DisplayPages numPages={this.state.numPages}
        page={this.state.page} onClick={this.changePage}/>
      <DisplayResults results={this.state.searchResults} page={this.state.page}
      perPage={this.state.resultsPerPage} isPopular={this.state.showPopular}/>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
