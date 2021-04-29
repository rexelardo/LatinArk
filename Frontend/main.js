Moralis.initialize("3IcvId63X3g2jWHA2t2OCOFDHmfOw3PbF9etB6Mt");
Moralis.serverURL = 'https://k8lq9f7lkimp.moralis.io:2053/server'

init = async () => {
    hideElement(userInfo);
    window.web3 = await Morialis.web3.enable(); 
    initUser();
}



initUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error)
    }
}


logout = async () => {
    await Moralis.user.logOut();
    hideElement(userInfo);
    initUser();
}


OpenUserInfo = async() =>{
    user = await Moralis.user.current();
    if (user){
        const email = user.get('email');
        if (email){
            userEmailField.value = email;
        }else{
            userEmailField.value = '';
        }
        userUsernameField.value = user.get('username');

        const userAvatar = user.get('avatar');
        if (userAvatar){
            userAvatarImage.src = userAvatar.url();
            showElement(userAvatarImage);
        }else{
            hideElement(userAvatarImage);
        }
        showElement(userInfo);
    }else{
        login();
    }
}

saveUserInfo = async() => {
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value)
    if (userAvatarFile.files.length > 0) {
        const file = userAvatarFile.files[0];
        const name = "avatar.jpg";
      
        const avatar = new Moralis.File(name, file);
        user.set('avatar',avatar);
      }
      await user.save();
      alert('User info saved successfully!');
      OpenUserInfo();
}


hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";

const userConnectButton = document.getElementById('btnConnect');
userConnectButton.onclick = login;

const userProfileButton = document.getElementById('btnUserInfo');
userProfileButton.onclick = OpenUserInfo;

const userInfo = document.getElementById('userInfo');
const userUser = document.getElementById('txtUsername');
const userEmailField = document.getElementById('txtEmail');
const userAvatarImage = document.getElementById('imgAvatar');
const userAvatarFile = document.getElementById('fileAvatar');


document.getElementById('btnCloseUserInfo').onclick = () => hideElement(userInfo);
document.getElementById('btnLogout').onclick = logout;
document.getElementById('btnSaveUserInfo').onclick = saveUserInfo;


init();

