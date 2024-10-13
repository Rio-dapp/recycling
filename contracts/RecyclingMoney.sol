// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interfaces/RawToken.sol";

contract RecyclingMoney is RawToken {

    uint256 public constant TROPICAL_YEAR  = 31556926; // ~365.24 day = 1 year = 31556926 sec


    uint256 base_price = 18000000000000000000000;
    uint256 deposit_price = 23000000000000000000000;
    uint256 benefits_period = TROPICAL_YEAR;
    uint256 interest_rate_future = 100000000000000000;
    uint256 interest_rate_resource = 250000000000000000;





    // TODO: set Address site
    constructor() RawToken("RecyclingMoney", "MONEY", "https://google.com"){

    }

    function setPurchaseRules(
        uint256 new_base_price,
        uint256 new_deposit_price,
        uint256 new_benefits_period,
        uint256 new_interest_rate_future,
        uint256 new_interest_rate_resource) public {
        require(hasRole(BACKEND_ROLE, _msgSender()), "RecyclingGlass: must have backend role to change price");
        base_price = new_base_price;
        deposit_price = new_deposit_price;
        benefits_period = new_benefits_period;
        interest_rate_future = new_interest_rate_future;
        interest_rate_resource = new_interest_rate_resource;
    }

    function getPurchaseRules() public override view returns (uint256, uint256, uint256, uint256, uint256) {
        return (base_price, deposit_price, benefits_period, interest_rate_future, interest_rate_resource);
    }

    function getTotalTokens() public override view returns (uint256, uint256){
        return (tokensToSaleF, tokensToSaleR);
    }



    function alreadyToSold(uint256 totalTokens, bool isResource) public override {
        require(hasRole(BACKEND_ROLE, _msgSender()), "RecyclingGlass: must have backend role to change total tokens");
        decrementAmountToSell(totalTokens, isResource);

    }

    function calcDividends(uint256 tokenId) public override view returns (uint256){
        ResourceToken storage info = tokenInfo[tokenId];
        uint256 period = block.timestamp - info.purchase_date;

        if (info.is_resource_token) {
            if (period > info.benefits_period) {
                return (info.deposit_price * info.interest_rate_resource) / (10 ** 18);
            } else {
                return (info.deposit_price * info.interest_rate_resource * period / info.benefits_period) / (10 ** 18);
            }
        } else {
            if (period > info.benefits_period) {
                return (info.deposit_price * info.interest_rate_future) / (10 ** 18);
            } else {
                return (info.deposit_price * info.interest_rate_future * period / info.benefits_period) / (10 ** 18);
            }
        }
    }

    function futureToResource(uint256 tokenId) public override {
        require(hasRole(BACKEND_ROLE, _msgSender()), "RecyclingGlass: must have backend role to change token type");
        require(!tokenInfo[tokenId].is_resource_token, 'RecyclingGlass: Token already is resource');
        require(block.timestamp - tokenInfo[tokenId].purchase_date
            <= tokenInfo[tokenId].benefits_period, 'RecyclingGlass: token expired');
        require(tokenInfo[tokenId].purchase_date / TROPICAL_YEAR == block.timestamp / TROPICAL_YEAR,
            'RecyclingGlass: forbidden - FToken was minted at past year');
        tokenInfo[tokenId].is_resource_token = true;
        tokenInfo[tokenId].purchase_date = block.timestamp;
    }
}
