Moralis.initialize("3IcvId63X3g2jWHA2t2OCOFDHmfOw3PbF9etB6Mt");
Moralis.serverURL = 'https://k8lq9f7lkimp.moralis.io:2053/server'

init = async () => {
    window.web3 = await Morialis.web3.enable() ; 
    InitUser();

}



InitUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
    }else{
        hideElement(userProfileButton);
        showElement(userConnectButton);
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


hideElement = (element) => element.style.display = 'none';
showElement = (element) => element.style.display = 'block';

const userConnectButton = document.getElementById('btnConnect');
userConnectButton.onclick = login;
const userProfileButton = document.getElementById('btnUserInfo');


init();

