const RecyclingToken = artifacts.require('RecyclingToken');

contract('RecyclingToken', accounts => {

    let recyclingToken;


    before(async () => {
        recyclingToken = await RecyclingToken.deployed();

    });

    it('Deployment',async ()=>{
        console.log('RCL: '+recyclingToken.address);
    })

    it('Burn test',async()=>{
       await recyclingToken.mint(accounts[2],'123000000000000000000');
        const balance1 = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance 1:',balance1.toString())

        await recyclingToken.burn('23000000000000000000',{from:accounts[2]})
        const balance2 = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance 2:',balance2.toString())

        assert(true)
    })


});
