let app = new Vue({
  el: '#app',
  data: {
    searchValue: '',
    searchTerms: [],
    firstSearchComplete: false,
    loading: false,
    current: {},
  },
  methods: {
    async search() {
      try {
        this.firstSearchComplete = true;
        this.loading = true;
        this.searchTerms = this.searchValue.split(" ");
        var url = 'https://openlibrary.org/search.json?q=';
        var firstTerm = true;
        for (var term in this.searchTerms) {
          if(!firstTerm) {
            url += "+";
          }
          else {
            firstTerm = false;
          }
          url += this.searchTerms[term];
        }
        console.log(url);
        const response = await axios.get(url)
        this.current = response.data
        console.log(this.current)
        var html = '<p>' + this.current.docs.length + ' results found.</p>'
        for(var i = 0; i < this.current.docs.length; i++) {
          if(this.current.docs[i].isbn) {
            var url3 = "https://openlibrary.org/api/books?bibkeys=" + this.current.docs[i].isbn[0] + '&jscmd=details&format=json';
            const response2 = await axios.get(url3);
            var firstProperty;
            for( var key in response2.data) {
              if(response2.data.hasOwnProperty(key)) {
                firstProperty = response2.data[key];
                break;
              }
            }
            console.log(firstProperty);
            this.current.docs[i].thumbnail = firstProperty.thumbnail_url;
          }
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
