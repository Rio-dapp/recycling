const PetToken = artifacts.require('PetToken');
const RecyclingToken = artifacts.require('RecyclingToken');
const RecyclingPlatform = artifacts.require('RecyclingPlatform');

contract('PetToken', accounts => {

    let petToken, recyclingToken, recyclingPlatform;


    before(async () => {
        petToken = await PetToken.deployed();
        recyclingToken = await RecyclingToken.deployed();
        recyclingPlatform = await RecyclingPlatform.deployed();
    });


    it('Deploy', async () => {
        console.log('PetToken: ' + petToken.address);
        console.log('RecyclingToken: ' + recyclingToken.address);
        console.log('RecyclingPlatform: ' + recyclingPlatform.address);
    });

    it('Buy token', async () => {

        await petToken.incrementAmountToSell('1000000000', false);


        await recyclingToken.mint(accounts[3], '180000000000000000000000');

        await recyclingPlatform.buyRawToken(petToken.address, false, {from: accounts[3]});

        const totalTosell = await petToken.getTotalTokens.call();

        console.log('Total tokens: ');
        console.log(Object.values(totalTosell).map(t => t.toNumber()));

        assert(true);
    });


    it('Buy tokens', async () => {


        await recyclingToken.mint(accounts[3], '1800000000000000000000000');

        await recyclingPlatform.buyRawTokens(petToken.address, false, 10, {from: accounts[3]});

        const totalTosell = await petToken.getTotalTokens.call();

        console.log('Total tokens: ');
        console.log(Object.values(totalTosell).map(t => t.toNumber()));

        assert(true);
    });


    it('Token Info', async () => {
        const lastId = await petToken.getLastTokenId();
        console.log('Last ID: ' + lastId);
        const info = await petToken.getTokenInfo(lastId.toString());
        console.log(info.toString());
        assert(true);
    });

    it('Future to Resource', async () => {
        const infoBefore = await petToken.getTokenInfo(0);
        console.log(infoBefore.toString());

        const dividents = await petToken.calcDividends(0);
        console.log(dividents.toString());

        await recyclingPlatform.futureToResource(petToken.address, 0);

        const info = await petToken.getTokenInfo(0);
        console.log(info.toString());

        assert(true);
    });

    it('Put token for sale', async () => {
        await petToken.setApprovalForAll(recyclingPlatform.address, true, {from: accounts[3]});

        await recyclingPlatform.putTokenForSale(petToken.address, 7, '5000000000000000000000', {from: accounts[3]});

        const tokensForSale = await recyclingPlatform.getTokensForSale.call();
        console.log(tokensForSale);
        assert(true);
    });

    it('Change price', async () => {
        await recyclingPlatform.changeTokenSalePrice(petToken.address, 7, '7000000000000000000000', {from: accounts[3]});

        const tokensForSale = await recyclingPlatform.getTokensForSale.call();
        console.log(tokensForSale);

        assert(true);
    });

    it('Reclaim', async () => {
        const ownerBefore = await petToken.ownerOf(7);
        console.log('Owner before: ' + ownerBefore);
        await recyclingPlatform.reclaimTokenToSale(petToken.address, 7, {from: accounts[3]});

        const ownerAfter = await petToken.ownerOf(7);
        console.log('Owner After: ' + ownerAfter);

        const tokensForSale = await recyclingPlatform.getTokensForSale.call();
        console.log(tokensForSale);

        assert(true);
    });

    //
    // it('Exchange Token', async()=>{
    //
    //     await recyclingToken.mint(accounts[4], '1800000000000000000000000');
    //     await recyclingToken.mint(accounts[5], '1000000000000000000000000');
    //
    //     await recyclingPlatform.buyRawTokens(petToken.address, false, 10, {from: accounts[4]});
    //
    //     const ownerBefore = await petToken.ownerOf(15);
    //     console.log('Owner Before: '+ ownerBefore);
    //
    //     await petToken.setApprovalForAll(recyclingPlatform.address, true, {from: accounts[4]});
    //
    //     await recyclingPlatform.putTokenForSale(petToken.address, 15, '5000000000000000000000', {from: accounts[4]});
    //
    //     await recyclingPlatform.buyTokenForSale(petToken.address, 15, {from: accounts[5]});
    //
    //     const rclbalance = await recyclingToken.balanceOf(accounts[5]);
    //     console.log('RCL balance: '+ rclbalance);
    //
    //     const ownerAfter = await petToken.ownerOf(15);
    //     console.log('Owner After: '+ ownerAfter);
    //
    //     assert(true);
    // });

});
