let app = new Vue({
  el: '#app',
  data: {
    searchValue: '',
    searchTerms: [],
    firstSearchComplete: false,
    loading: false,
    current: {},
    searchPage: true,
    favorites: [],
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
            this.current.docs[i].thumbnail = firstProperty.thumbnail_url;
          }
          this.current.docs[i].favorited = false;
          for(fav in this.favorites) {
            console.log("a")
            if(this.favorites[fav].author_key) {
              console.log("b")
              if(this.current.docs[i].author_key && this.current.docs[i].author_key[0] == this.favorites[fav].author_key[0]) {
                console.log("c")
                if(this.favorites[fav].isbn) {
                  console.log("d")
                  if(this.current.docs[i].isbn && this.current.docs[i].isbn[0] == this.favorites[fav].isbn[0]) {
                    this.current.docs[i].favorited = true;
                  } 
                  else {
                    this.current.docs[i].favorited = false;
                  }
                }
                else if(this.current.docs[i].isbn) {
                  this.current.docs[i].favorited = false;
                }
                else {
                  console.log("HERE")
                  this.current.docs[i].favorited = true;
                }
              }
              else {
                this.current.docs[i].favorited = false;
              }
            }
            else if(this.current.docs[i].author_key) {
              this.current.docs[i].favorited = false;
            }
            else {
              if(this.favorites[fav].isbn) {
                if(this.current.docs[i].isbn && this.current.docs[i].isbn[0] == this.favorites[fav].isbn[0]) {
                  this.current.docs[i].favorited = true;
                }
                else {
                  this.current.docs[i].favorited = false;
                }
              }
              else if(this.current.docs[i].isbn) {
                this.current.docs[i].favorited = false;
              }
              else {
                this.current.docs[i].favorited = true;
              }    
            }
          }
        }
        console.log(this.current)
        this.loading = false;
        for(var i = 0; i < this.current.docs.length; i++) {
          if(this.current.docs[i].favorited) {
            document.getElementById("b" + i).innerHTML = "Unfavorite";
          }
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    pageSearch() {
      if(this.searchPage == false) {
        document.getElementById("searchButton").className = "page selected";
        document.getElementById("favoriteButton").className = "page";
        this.searchPage = true;
      }
    },
    pageFavorite() {
      if(this.searchPage == true) {
        document.getElementById("searchButton").className = "page";
        document.getElementById("favoriteButton").className = "page selected";
        this.searchPage = false;
      }
    },
    favoriteBook(index) {
      console.log(index)
      this.current.docs[index-1].favorited = !(this.current.docs[index-1].favorited);
      if(this.current.docs[index-1].favorited) {
        document.getElementById("b" + index).innerHTML = "Unfavorite";
        this.favorites.push(this.current.docs[index-1]);
      }
      else {
        console.log("there")
        document.getElementById("b" + index).innerHTML = "Favorite";
        var i = 0;
        for(fav in this.favorites) {
          if(this.favorites[fav].author_key) {
            if(this.current.docs[index-1].author_key && this.current.docs[index-1].author_key == this.favorites[fav].author_key) {
              if(this.favorites[fav].isbn) {
                if(this.current.docs[index-1].isbn && this.current.docs[index-1].isbn[0] == this.favorites[fav].isbn[0]) {
                  this.favorites.splice(i, 1);
                  break;
                }
              }
              else {
                this.favorites.splice(i, 1);
                break;
              }
            }
          }
          else if(this.favorites[fav].isbn) {
            if(this.current.docs[index-1].isbn && this.current.docs[index-1].isbn[0] == this.favorites[fav].isbn[0]) {
              this.favorites.splice(i, 1);
              break;
            }
          }
          i++;
        }
      }
      console.log(this.favorites)
      console.log(this.current)
    },
    unfavorite() {
      
    },
  },
});
