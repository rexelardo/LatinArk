Moralis.initialize("3IcvId63X3g2jWHA2t2OCOFDHmfOw3PbF9etB6Mt");
Moralis.serverURL = 'https://k8lq9f7lkimp.moralis.io:2053/server'

init = async () => {
    hideElement(userInfo);
    hideElement(CreateItemForm);
    window.web3 = await Morialis.Web3.enable(); 
    initUser();
}



initUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openCreateItemButton);
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
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}


OpenUserInfo = async() =>{
    user = await Moralis.User.current();
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

createItem = async () => {
    if (CreateItemFile.files.length == 0){
        alert('Please select a file')
        return;
    } else if (CreateItemNameField.value.length == 0){
        alert('Please give the item a name')
        return;
    }
}





hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";


//NavBar
const userConnectButton = document.getElementById('btnConnect');
userConnectButton.onclick = login;

const userProfileButton = document.getElementById('btnUserInfo');
userProfileButton.onclick = OpenUserInfo;

const openCreateItemButton = document.getElementById('btnOpenCreateItem');
openCreateItemButton.onclick = () => showElement(CreateItemForm);


// User Profile
const userInfo = document.getElementById('userInfo');
const userUsernameField = document.getElementById('txtUsername');
const userEmailField = document.getElementById('txtEmail');
const userAvatarImage = document.getElementById('imgAvatar');
const userAvatarFile = document.getElementById('fileAvatar');


document.getElementById('btnCloseUserInfo').onclick = () => hideElement(userInfo);
document.getElementById('btnLogout').onclick = logout;
document.getElementById('btnSaveUserInfo').onclick = saveUserInfo;


// Item Creation
const CreateItemForm = document.getElementById('createItem');

const CreateItemNameField = document.getElementById('txtCreateItemName');
const CreateItemDescriptionField = document.getElementById('txtCreateItemDescription');
const CreateItemPriceField = document.getElementById('numCreateItemPrice');
const CreateItemStatusField = document.getElementById('selectCreateItemStatus');
const CreateItemFile = document.getElementById('fileCreateItemFile');
document.getElementById('btnCloseCreateItem').onclick = () => hideElement(CreateItemForm);

init();

