// -----------------------------------Authentication-------------------------------------------
const token = localStorage.getItem("token");
fetch("/home", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (response.status === 201) {
      console.log("You are authenticated");
    } else {
      window.location.href = "/index.html";
    }
  })
  .catch((error) => console.log("Error:", error));


// -----------------------------------------Post Tweet---------------------------------------
let tweet_form = document.getElementById("tweet-form");
console.log(tweet_form);
tweet_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let decodedToken = JSON.parse(atob(token?.split(".")[1]));
  // console.log(decodedToken);
  let email = decodedToken?.email;
  let name = decodedToken?.name;
  let msg = document.getElementById("mypost")?.value;
  try {
    const res = await axios.post("/tweet", { email, name, msg });
    if (res.status === 201) {
      document.getElementById('posts').innerHTML ="";
      showTweets();
      document.getElementById("mypost").value = "";
    } else {
      alert("error occured in posting tweet");
      console.log("cant able to post your tweet");
    }
  } catch (error) {
    console.log(error);
    alert("Error!!!!");
  }
});

// _____________________________________Show Tweets____________________________________________

// function changeLikeBtn(){
//   document.getElementById('like-icon').addEventListener('click',(e)=>{
//     console.log(e);
//   })
// }
// changeLikeBtn();

let posts = document.getElementById('posts');
const showTweets = async ()=>{
  try {
    const {data: { Tweets },} = await axios.get("/allTweets");
    console.log(Tweets);
    Tweets.forEach((tweet)=>{
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
  } catch (error) {
    console.log(error);
  }
}

showTweets();

// ------------------Like Handling----------------------------------

