Moralis.initialize("3IcvId63X3g2jWHA2t2OCOFDHmfOw3PbF9etB6Mt");
Moralis.serverURL = 'https://k8lq9f7lkimp.moralis.io:2053/server'
const TOKEN_CONTRACT_ADDRESS = "0x9fA230c6465ad8ceDa74A97946bDc4Ab2DD29F6e"

init = async () => {
	hideElement(userItemsSection);
    hideElement(userInfo);
    hideElement(CreateItemForm);
    window.web3 = await Moralis.Web3.enable(); 
	window.tokenContract = new web3.eth.Contract(tokenContractAbi, TOKEN_CONTRACT_ADDRESS);
	
    initUser();
	loadUserItems(); 
}



initUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
		showElement(openUserItemsButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openCreateItemButton);
		hideElement(openUserItemsButton);
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
        showElement(userItemsSection);
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

    const nftFile = new Moralis.File('NFTfile.jpg', CreateItemFile.files[0]);
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    const metadata = {
        name: CreateItemNameField.value,
        description: CreateItemDescriptionField.value,
        image: nftFilePath,
    };


openUserItems = async() =>{
    user = await Moralis.User.current();
    if (user){
        showElement(userItemsSection);
        
	}else{
        login();
    }
}


loadUserItems = async() =>{
    const ownedItems = await Moralis.Cloud.run("getUserItems");
	console.log(ownedItems);
}




    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await nftFileMetadataFile.saveIPFS();

    const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
    const nftFileMetadataFileHash = nftFileMetadataFile.hash();
	
	
	const nftId = await mintNft(nftFileMetadataFilePath);
	
	

    // Simple syntax to create a new subclass of Moralis.Object.
    const Item = Moralis.Object.extend("Item");
    // Create a new instance of that class.
    const item = new Item();
    item.set('name', CreateItemNameField.value);
    item.set('description', CreateItemDescriptionField.value);
    item.set('nftFilePath', nftFilePath);
    item.set('nftFileHash', nftFileHash);
    item.set('nftFileMetadataFilePath', nftFileMetadataFilePath);
    item.set('nftFileMetadataFileHash', nftFileMetadataFileHash);
	item.set('nftId', nftId);
	item.set('nftContractAddress', TOKEN_CONTRACT_ADDRESS);
    await item.save();
    console.log(item);
}

mintNft = async (metadataUrl) => {
	const receipt = await tokenContract.methods.createItem(metadataUrl).send({from: ethereum.selectedAddress});
	console.log(receipt);
	return receipt.events.Transfer.returnValues.tokenId;
	
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
document.getElementById('btnCreateItem').onclick = createItem;



//User Items
const userItemsSection = document.getElementById('userItems');

const userItems = document.getElementById('userItemsList');
document.getElementById('btnCloseUserItems').onclick = () => hideElement(userItemsSection);
const openUserItemsButton = document.getElementById('btnMyItems');
openUserItemsButton.onclick = openUserItems;

init();

