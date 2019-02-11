/* global $ React :true*/

function SearchBar(props) {
  return (
    <form action='/search/results.json' id='searchbar' onSubmit={(evt) => {
      evt.preventDefault(); props.onSubmit(1);
    }}><div>
        <div>
          <input type='text' className="searchBar text-input form-control" value={props.value} name='searchVal' onChange={props.onChange}/>
          <input type='submit' name='Search' className='btn btn-outline-secondary'/>
        </div>
      </div>
    </form>
  );
}

function DisplayResults(props) {
  let allResults = [];
  let i = 0;
  let index = props.page-1
  let resultsToShow = props.results.slice(index*props.perPage, (index + 1)*props.perPage)
  for (let item of resultsToShow) {
    allResults.push(
      <tr key={i}>
        <td><a href={`/Movie/${item.id}`}>{item.title}({item.release_date})</a></td>
      </tr>
    );
    i += 1;
  }
  return (
    <table className='table col-8 offset-2'>
      <tbody>
        {allResults}
      </tbody>
    </table>
  );
}

function DisplayPages(props) {
  // props - numPages, page
  const allPages = [];
  if (props.page > 1) {
    allPages.push(<div key='prev' className='pages col-1' onClick={
      ()=>props.onClick(props.page - 1)}> {'<<prev'} </div>
    );
  } 
  // else {
  //   allPages.push(<div key='prev' className='col-1 currentPage'> {'<<prev'} </div>);
  // }
  const numPages = [];
  for (let i = 1; i <= props.numPages; i += 1) {
    if (i !== props.page) {
      numPages.push(
        <span key={i} className='pages' onClick={()=>props.onClick(i)}>{i}
        </span>
      );
    } else {
      numPages.push(<span key={i} className='currentPage'>{i}</span>);
    }
  }
  allPages.push(<div key='numPages' className='numpages col-6'>{numPages}</div>);
  if (props.page < props.numPages) {
    allPages.push(<div key='next' className='col-1 pages' onClick={
      ()=>props.onClick(props.page + 1)}> {'next>>'} </div>
    );
  } 
  // else {
  //   allPages.push(<div key='next' className='col-1 currentPage'>{'next>>'}</div>);
  // }
  if (props.numPages > 1) {
    return (
      <div key='allPages' className='row justify-content-center'>{allPages}
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
      searchResults: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.changePage = this.changePage.bind(this)
  }

  handleSearchChange(evt) {
    this.setState({ searchVal: evt.target.value });
  }

  changePage(num) {
    this.setState({page:num})
  }

  handleSearch() {
    // fetch has problems with URL parameters
    // let url = new URL('/patterns/search/results.json');
    // let params = {searchVal: newState.searchVal, page: newState.page};
    // url.search = new URLSearchParams(params);
    // fetch(url)
    // .then(response => response.json())
    // .then(data => this.setSearchResults(data))
    $.get('/search/results.json', { searchVal: this.state.searchVal
    },
      (response) => {
        // let data = JSON.parse(response);
        this.setState({ searchResults: response.results, page: 1, 
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
      <DisplayPages numPages={this.state.numPages}
        page={this.state.page} onClick={this.changePage}/>
      <DisplayResults results={this.state.searchResults} page={this.state.page}
      perPage={this.state.resultsPerPage} />
    </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
