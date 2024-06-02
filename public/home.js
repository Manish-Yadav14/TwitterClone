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
// console.log(tweet_form);
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
let posts = document.getElementById('posts');
const showTweets = async ()=>{
  try {
    const {data: { Tweets },} = await axios.get("/allTweets");
    Tweets.forEach((tweet)=>{
      const tweetElem = document.createElement('div');
      tweetElem.classList.add('post-card');
      tweetElem.setAttribute('data-id', tweet._id);
      tweetElem.innerHTML +=`<div class="profile">
                            <img src="./images/profile-new.jpg" alt="Profile Picture">
                            <div class="profile-info">
                              <h2 class="name">${tweet.name}</h2>
                              <p class="username">${tweet.email}</p>
                            </div>
                          </div>
                          <p class="tweet">${tweet.msg}</p>
                          <div class="interactions">
                              <span class="like-button like"></span>
                              <span id="like-count">${tweet.likes}</span>
                          </div>`;
      posts.insertBefore(tweetElem, posts.firstChild)
    });
  } catch (error) {
    console.log(error);
  }
}

showTweets();

// ------------------Like Handling----------------------------------

document.addEventListener('DOMContentLoaded',()=>{
  let posts = document.getElementById('posts');
  posts.addEventListener('click', async(e) => {
    if (e.target.classList.contains('like-button')) {
      const tweetElement = e.target.closest('.post-card');
      const tweetId = tweetElement.getAttribute('data-id');
      console.log(tweetId);

      try {
        const res = await axios.patch(`/userTweets/${tweetId}`);
        console.log(res);
        const updatedTweet = res.data;
        console.log(updatedTweet);

        // Update the like count in the UI
        const likeCountElement = tweetElement.querySelector('#like-count');
        likeCountElement.textContent = updatedTweet.likes;

        // Change the button state to "Liked"
        e.target.classList.remove('like');
        e.target.classList.add('liked');
      } catch (error) {
        console.error('Error liking tweet:', error);
      }
    }
  })
})

