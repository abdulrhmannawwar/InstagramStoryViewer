let input = document.getElementById("input");
let button = document.querySelector("button");

let container = document.querySelector(".container");
let accountStatus = document.querySelector(".status");
let accountName = document.querySelector(".accountName");
let accountBio = document.querySelector(".accountBio");
let accountPicText = document.querySelector(".accountPicText");
let accountImg = document.querySelector(".accountImg");
let storiesText = document.querySelector(".stories");
let accountDate = document.querySelector(".accountDate");

button.addEventListener("click", () => {
    let user = input.value;
    if(!user) {
        accountStatus.textContent = 'You must enter a username first lol';
        accountImg.style.display = 'none';
        accountStatus.style.backgroundColor = '';
        accountName.textContent = "";
        accountBio.textContent = "";
        accountDate.textContent = "";
        accountPicText.textContent = "";
        storiesText.textContent = "";
        document.querySelectorAll('.storyImg').forEach(img => {
            img.remove();
        });
        return;
    }
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '24f347ef6bmsh21529e8581ca6bap1cb0aejsnaa0c38a1de64',
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
    };

    async function getUserData() {
        let AccountInfo = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${user}&include_about=true&url_embed_safe=true`;
        let story = `https://instagram-scraper-api2.p.rapidapi.com/v1/stories?username_or_id_or_url=${user}&url_embed_safe=true`;
        try {
            document.querySelectorAll('.storyImg').forEach(img => {
                img.remove();
            });
            accountStatus.textContent = 'Searching...';
            accountName.textContent = "";
            accountBio.textContent = "";
            accountDate.textContent = "";
            accountPicText.textContent = "";
            storiesText.textContent = "";
            accountStatus.style.backgroundColor = '';
            accountImg.style.display = 'none';
            let accountResponse = await fetch(AccountInfo, options);
            let accountResult = await accountResponse.json();
            let accountData = accountResult.data;

            let isPrivate = accountData.is_private;
            let profilePic = accountData.profile_pic_url;
            let fullName = accountData.full_name;
            let bio = accountData.biography;
            let date = accountData.about.date_joined;
            
            if(accountResponse.status==404){
                accountStatus.textContent = "User does not exist :(";
                accountStatus.style.backgroundColor = 'red';
                accountName.textContent = "";
                accountBio.textContent = "";
                accountDate.textContent = "";
                accountPicText.textContent = "";
                accountImg.style.display = 'none';
                storiesText.textContent = "";
            }
            else if(isPrivate){
                accountStatus.textContent = "This user is private :( , but here are some public things about him";
                accountStatus.style.backgroundColor = '#8d8d40';
                accountName.textContent = `Full name : ${fullName}`;
                accountBio.textContent = `Bio : ${bio}`;
                accountDate.textContent = `Joined : ${date}`;
                accountPicText.textContent = "Here's his picture";
                accountImg.style.display = 'block';
                accountImg.src = profilePic;
                accountImg.className = "accountImg";
            }
            else{
                accountStatus.textContent = "User found :)";
                accountStatus.style.backgroundColor = 'green';
                accountName.textContent = `Full name : ${fullName}`;
                accountBio.textContent = `Bio : ${bio}`;
                accountDate.textContent = `Joined : ${date}`;
                accountPicText.textContent = "Here's his picture";
                accountImg.src = profilePic;
                accountImg.style.display = 'block';
                accountImg.className = "accountImg";
                storiesText.textContent = "Searching for stories...";

                let storyResponse = await fetch(story, options);
                let storyResult = await storyResponse.json();
                let storyData = storyResult.data;
                let storyLength = storyData.items.length;
                if(storyLength){
                    storiesText.textContent = "Here's his stories";
                    for(let i=0 ; i < storyLength ; i++){
                        let img = document.createElement('img');
                        img.src = storyData.items[i].thumbnail_url;
                        img.className = "storyImg";
                        container.appendChild(img);
                    };
                } else{
                    storiesText.textContent = "This user has no stories currently";
                }
            }
        } 
        catch (e) {
            console.error(e);
            accountStatus.textContent = "Something went wrong";
            accountStatus.style.backgroundColor = 'red';
            accountName.textContent = "";
            accountBio.textContent = "";
            accountDate.textContent = "";
            accountPicText.textContent = "";
            accountImg.style.display = 'none';
            storiesText.textContent = "";
        }
    };
    getUserData();
});
