// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

abstract contract RawToken is
Context,
AccessControlEnumerable,
ERC721Enumerable,
ERC721Burnable {


    using Counters for Counters.Counter;

    bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");

    Counters.Counter private _tokenIdTracker;

    string private _baseTokenURI;

    uint256 tokensToSaleF = 0;
    uint256 tokensToSaleR = 0;


    struct ResourceToken {
        uint256 token_id; //номер токена
        bool is_resource_token; //2 основных состояния. false - future, true - resource
        uint256 purchase_date; //дата покупки токена текущим пользователем
        uint256 base_price; //базовая стоимость в RCL, стоимость продажи площадкой;
        uint256 deposit_price; //стоимость после продажи площадкой, на которую в дальнейшем начисляются проценты (для сырьевого токена);
        uint256 benefits_period; //срок действия токенов по данному типу контракта (по умолчанию год с момента даты передачи каждого токена от _ROOT к _CLIENT)
        uint256 interest_rate_future; //алгоритм начисления процентов или просто величина начисления в процентах за год. (для фьючерсного  токена);
        uint256 interest_rate_resource;//алгоритм начисления процентов или просто величина начисления в процентах за год. (для   сырьевого токена);
    }

    // TokenID => ResouceToken struct
    //    ResourceToken[] internal tokenInfo;
    mapping(uint256 => ResourceToken) tokenInfo;

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
     * account that deploys the contract.
     *
     * Token URIs will be autogenerated based on `baseURI` and their token IDs.
     * See {ERC721-tokenURI}.
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(BACKEND_ROLE, _msgSender());
    }


    function mintToken(bool isResource, address to, uint256 base_price, uint256 deposit_price, uint256 benefits_period,
        uint256 interest_rate_future, uint256 interest_rate_resource) public returns (uint256, uint256){
        uint256 tokenId = _tokenIdTracker.current();
        ResourceToken memory resourceTokenInfo = ResourceToken(
            tokenId,
            isResource,
            block.timestamp,
            base_price,
            deposit_price,
            benefits_period,
            interest_rate_future,
            interest_rate_resource
        );
//        tokenInfo.push(resourceTokenInfo);
        tokenInfo[tokenId] = resourceTokenInfo;
        mint(to);
        alreadyToSold(1, isResource);
        return (tokenId, block.timestamp);
    }

    function getTokenInfo(uint256 tokenId) public view returns (ResourceToken memory){
        return tokenInfo[tokenId];
    }

    function getLastTokenId() public view returns (uint256) {
        return _tokenIdTracker.current() - 1;
    }


    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Creates a new token for `to`. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event), and the token
     * URI autogenerated based on the base URI passed at construction.
     *
     * See {ERC721-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(address to) public virtual {
        require(hasRole(BACKEND_ROLE, _msgSender()), "RawToken: must have backend role to mint");

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }


    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {

        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function transfer(address to, uint256 tokenId) public {
        _transfer(msg.sender, to, tokenId);
    }

    function getPurchaseRules() public virtual view returns (uint256, uint256, uint256, uint256, uint256);

    function getTotalTokens() public virtual view returns (uint256, uint256);

    function incrementAmountToSell(uint256 totalTokens, bool isResource) public {
        require(hasRole(BACKEND_ROLE, _msgSender()), "PetToken: must have backend role to change total tokens");
        if (isResource) {
            tokensToSaleR += totalTokens;
        } else {
            tokensToSaleF += totalTokens;
        }
    }

    function decrementAmountToSell(uint256 totalTokens, bool isResource) public {
        require(hasRole(BACKEND_ROLE, _msgSender()), "PetToken: must have backend role to change total tokens");
        if (isResource) {
            if (tokensToSaleR - totalTokens >= 0) {
                tokensToSaleR -= totalTokens;
            } else {
                tokensToSaleR = 0;
            }
        } else {
            if (tokensToSaleF - totalTokens >= 0) {
                tokensToSaleF -= totalTokens;
            } else {
                tokensToSaleF = 0;
            }
        }
    }

    function alreadyToSold(uint256 totalTokens, bool isResource) public virtual;

    function calcDividends(uint256 tokenId) public virtual view returns (uint256);

    function futureToResource(uint256 tokenId) public virtual;

}
