let name = document.getElementById('name');
let emailfield = document.getElementById('email');

const token = localStorage.getItem('token');

let decodedToken = JSON.parse(atob(token?.split(".")[1]));
name.innerText = decodedToken?.name;
emailfield.innerText = decodedToken?.email;
let email = decodedToken?.email;


// --------------------------------------Show User Tweets-------------------------------------
let posts = document.getElementById('posts');
const showTweets = async()=>{
    const Tweets = await axios.post('/userTweets',{email});
    const {tweets} = Tweets.data;
    console.log(tweets);
    tweets.map((tweet)=>{
        const tweetElem = document.createElement('div');
        tweetElem.innerHTML +=`<div class="post-card">
                            <div class="profile">
                              <img src="./images/profile-new.jpg" alt="Profile Picture">
                              <div class="profile-info">
                                <h2 class="name">${tweet.name}</h2>
                                <p class="username">${tweet.email}</p>
                              </div>
                            </div>
                            <p class="tweet">${tweet.msg}</p>
                            <div class="interactions">
                                <span id="like-icon"></span>
                                <span id="like-count">10</span>
                            </div>  
                          </div>`;
        posts.insertBefore(tweetElem, posts.firstChild)
      });
}

showTweets();