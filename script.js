let input = document.getElementById("input");
let button = document.querySelector("button");

let container = document.querySelector(".container");
let userContainer = document.querySelector(".userContainer");
let userPfp = document.querySelector("#userPfp");
let postsNumber = document.querySelector(".postsCount");
let followersNumber = document.querySelector(".followersCount");
let followingNumber = document.querySelector(".followingCount");
let fullName = document.querySelector(".fullName");
let bio = document.querySelector(".bio");
let joinDate = document.querySelector(".joinDate");
let placeHolder = document.querySelector(".PlaceHolder");
let storiesStatues = document.querySelector(".storiesStatues");
let storiesContainer = document.querySelector(".storiesContainer");
async function getUserData(userName) {

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ce3ec604e9msh27e04273b8c670cp1e86c8jsna3ac6ca885f8',
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
    };
    const infoUrl = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${userName}&include_about=true&url_embed_safe=true`;
    const storiesUrl =`https://instagram-scraper-api2.p.rapidapi.com/v1/stories?username_or_id_or_url=${userName}&url_embed_safe=true`;
    
    try{
        userContainer.style.display = "none";
        placeHolder.textContent = 'searching...';
        document.querySelectorAll('.story').forEach(story => {
            story.remove();
        });
        storiesStatues.textContent = '';
        let infoResponse = await fetch(infoUrl, options);
        let infoData = await infoResponse.json();
        infoData = infoData.data;
        let full_name = infoData.full_name;
        let bio_text = infoData.biography;
        let joined_date = infoData.about.date_joined;
        let posts_count = infoData.media_count;
        let followers_count = infoData.follower_count;
        let following_count = infoData.following_count;
        let is_private = infoData.is_private;
        let pfpLink = infoData.profile_pic_url;
        userContainer.style.display = "flex";
        storiesContainer.style.display = "block";
        placeHolder.textContent = '';
        fullName.textContent = `Full Name : ${full_name}`;
        bio.textContent = `Bio : ${bio_text}`;
        joinDate.textContent = `Joined : ${joined_date}`;
        postsNumber.textContent = posts_count;
        followersNumber.textContent = followers_count;
        followingNumber.textContent = following_count;
        userPfp.src = pfpLink;
        
        if(is_private){
            storiesStatues.textContent = 'This account is private';
        } else{
            storiesStatues.textContent = 'searching for stories...';
            let storiesResponse = await fetch(storiesUrl, options);
            let storiesData = await storiesResponse.json();
            storiesData = storiesData.data;
            let storiesCount = storiesData.count;
            if(storiesCount){
                storiesStatues.textContent = 'Stories : ';
                for(let i = 0; i < storiesCount; i++){
                    let story = document.createElement("img");
                    story.src = storiesData.items[i].thumbnail_url;
                    story.className = "story";
                    storiesContainer.appendChild(story);
                }
            } else{
                storiesStatues.textContent = 'This user has no stories currently';
            }
        }
    }
    catch(e){
        console.error(e);
        placeHolder.textContent = 'Something went wrong :(';
        storiesContainer.style.display = "none";
        userContainer.style.display = "none";
        document.querySelectorAll('.story').forEach(story => {
            story.remove();
        });
    }
}
button.addEventListener("click", () => {
    let userName = input.value;
    if(!userName){
        placeHolder.textContent = 'You must enter a username first lol';
        userContainer.style.display = "none";
        storiesContainer.style.display = "none";
        return;
    }
    getUserData(userName);
});

