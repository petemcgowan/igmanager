class Instagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      end_cursor: ''
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.makeRequest('https://www.instagram.com/womgbbqkazer/?__a=1');
  }

  handleScroll = (e) => {
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if(scrolledToBottom) {
      var url = 'https://www.instagram.com/womgbbqkazer/?__a=1&max_id='+this.state.end_cursor;
      this.makeRequest(url);
    }
  }

  makeRequest(url) {
    axios.get(url)
      .then(res => {
      var main = res.data.graphql.user.edge_owner_to_timeline_media;
      // [2] is the 320x320 image size
      var data = main.edges.map(obj => obj.node.thumbnail_resources[2].src);
      var end_cursor = main.page_info.end_cursor;

      this.setState(prevState => ({
        data: prevState.data.concat(data),
        end_cursor: end_cursor
      }));
    })
      .catch(() => {
      this.setState({data: ['error occured']});
    })
  }

  render() {
    var images = [];
    var data = this.state.data.slice(0);
    while(data.length) {
        images.push(data.splice(0, 3));
    }

    var images = images.map((subset,index) => <div>{subset.map((image,index) => <div className='imgCont'><img src={image}/></div>)}</div>);
    return(<div>{images}</div>);

  }
}

ReactDOM.render(<Instagram/>, document.getElementById('root'));
