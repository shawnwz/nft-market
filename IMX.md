must use node 14, doesn't work with 16


##启动
yarn dev

##Mint
###POST http://localhost:3000/imx/mint
###Body:
```json
{
"amount": 1,
"tokenId": 13,  
"wallet": "0x3F05315878CEc149e45c96dD2B5897d6A00b8ec0"
}
```

amount 是mint多少个token
每次mint tokenId不能重复，下次的tokenId = tokenId + amount
wallet 是 mint to 的钱包地址

mint完成后 用wallet钱包登陆 https://market.ropsten.x.immutable.com/  可以看到自己的token
