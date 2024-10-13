const RecyclingToken = artifacts.require("RecyclingToken");
const RecyclingPlatform = artifacts.require("RecyclingPlatform");
const PetToken = artifacts.require("PetToken");
// const RecyclingGlass = artifacts.require("RecyclingGlass");
// const RecyclingPaper = artifacts.require("RecyclingPaper");
// const RecyclingMoney = artifacts.require("RecyclingMoney");

const delay = time => new Promise(res=>setTimeout(res,time));
module.exports = async function (deployer, network, addresses) {

    console.log('Deployment start...');

    await deployer.deploy(RecyclingToken);

    console.log('delay start1...');
    await delay(30000);
    console.log('delay end1...');

    recyclingToken = await RecyclingToken.deployed();
   
    console.log('delay start2...');
    await delay(10000);
    console.log('delay end2...');


    await deployer.deploy(PetToken);
    petToken = await PetToken.deployed();
    // await deployer.deploy(RecyclingGlass);
    // recyclingGlass = await RecyclingGlass.deployed();
    // await deployer.deploy(RecyclingPaper);
    // recyclingPaper = await RecyclingPaper.deployed();

    await deployer.deploy(RecyclingPlatform, recyclingToken.address);
    recyclingPlatform = await RecyclingPlatform.deployed();


    await recyclingToken.mint(recyclingPlatform.address, '888888999000000000000000000');

    const backendRole = await petToken.BACKEND_ROLE.call();
    console.log('Backend Role: ' + backendRole);


    await petToken.grantRole(backendRole.toString(), recyclingPlatform.address);
    await recyclingPlatform.addResourceContract(petToken.address);
    // await recyclingGlass.grantRole(backendRole.toString(), recyclingPlatform.address);
    // await recyclingPlatform.addResourceContract(recyclingGlass.address);
    // await recyclingPaper.grantRole(backendRole.toString(), recyclingPlatform.address);
    // await recyclingPlatform.addResourceContract(recyclingPaper.address);


    await recyclingToken.setPlatform(recyclingPlatform.address);


    // Deploy Resource Token for Tests
    //
    // await deployer.deploy(RecyclingMoney)
    // recyclingMoney = await RecyclingMoney.deployed()
    // console.log('Address RecyclingMoney', recyclingMoney.address)
    // const backendRole = await recyclingMoney.BACKEND_ROLE.call();
    // await recyclingMoney.grantRole(backendRole.toString(), '0x240697eED908e36Ae019689b1b2bb12e68898F59');
    //
    // console.log('Deployment completed');
    //
    //


    const andrei = '0x932a8A2DE9099592a7eD1FEb92dB0Ac6F03F2Cb4';

    console.log('Andrei...')
    await petToken.grantRole(backendRole.toString(), andrei);
    await petToken.grantRole('0x0', andrei);
    // await recyclingGlass.grantRole(backendRole.toString(), andrei);
    // await recyclingGlass.grantRole('0x0', andrei);
    // await recyclingPaper.grantRole(backendRole.toString(), andrei);
    // await recyclingPaper.grantRole('0x0', andrei);
    await recyclingToken.grantRole(backendRole.toString(), andrei);
    await recyclingToken.grantRole('0x0', andrei);
    await recyclingPlatform.grantRole(backendRole.toString(), andrei);
    await recyclingPlatform.grantRole('0x0', andrei);
    console.log('...grant role');


};
