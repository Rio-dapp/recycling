const RecyclingToken = artifacts.require('RecyclingToken');
const RecyclingPlatform = artifacts.require('RecyclingPlatform');

contract('RecyclingPlatform', async (accounts) => {

    let recyclingToken;
    let recyclingPlatform;


    before(async () => {
        recyclingToken = await RecyclingToken.deployed();
        recyclingPlatform = await RecyclingPlatform.deployed();

    });

    it('Deploy', async () => {
        console.log('RCL: ' + recyclingToken.address);
        console.log('RecyclingPlatform: ' + recyclingPlatform.address);
        assert(true);
    });

    it('Buy RCL', async () => {

        const balanceBefore = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance Before: ' + balanceBefore.toString());

        await recyclingPlatform.buyRCL({from: accounts[2], value: '2000000000000000000'});

        const balanceAfter = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance After: ' + balanceAfter.toString());

        assert(true);
    });

    it('Exchange RCL', async () => {
        const balanceBefore = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance Before: ' + balanceBefore.toString());
        // await recyclingToken.approve(recyclingPlatform.address, balanceBefore, {from: accounts[2]});

        const totalPrice = await recyclingPlatform.getEthereumAmount.call(balanceBefore);
        console.log(totalPrice.toString());

        await recyclingPlatform.exchangeRCL(accounts[2], balanceBefore, {
            from: accounts[0],
            value: totalPrice.toString()
        });

        const balanceAfter = await recyclingToken.balanceOf(accounts[2]);
        console.log('Balance After: ' + balanceAfter.toString());

        assert(true);
    });

    it('Platform Exchange', async () => {
        await recyclingToken.mint(accounts[3], '50000000000000000000')
        await recyclingPlatform.sendETH({from: accounts[0], value: '2000000000000000000'})
        let balance_wei = await web3.eth.getBalance(recyclingPlatform.address);
        console.log('Platform Balance:', balance_wei.toString())



        await recyclingPlatform.exchangeRCLplatform(accounts[3], '5000000000000000000', '200000000000000000')

        assert(true)
    });


    it('Platform burn',async()=>{
        console.log('Balance:',(await recyclingToken.balanceOf(recyclingPlatform.address)).toString());
        await recyclingToken.mint(recyclingPlatform.address,'12345000000000000');
        console.log('Balance:',(await recyclingToken.balanceOf(recyclingPlatform.address)).toString());

        await recyclingPlatform.burnRCL('2345000000000000');
        console.log('Balance:',(await recyclingToken.balanceOf(recyclingPlatform.address)).toString());

        assert(true)
    })

});
