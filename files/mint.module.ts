import axios, { AxiosError, AxiosInstance } from 'axios'
import Web3 from 'web3'
import { Account } from 'web3-core'
import { TransactionReceipt } from 'web3-core'
import HttpsProxyAgent from 'https-proxy-agent'
//@ts-ignore 
const { getParams } = require('./site/utils');

const web3 = new Web3('https://bsc-node.terncrypto.plus/http_rpc')

interface event {
    id: string,
    info: string,
    title: string,
    organizer: {
        lightInfo: {
            profileHandle: string
        }
    }
    lightInfo: {
        hasRaffle: boolean,
        hasW3ST: boolean,
    }
}

interface w3stStatus {
    canClaim: boolean,
    requirements? : {
        type?: string,
        handle?: string,
    }[]
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(''), ms * 1000))
}

export class Mint {
    private instance: AxiosInstance
    account: Account
    private nonce: number = 0
    private signingKey: string = ''     

    constructor(
        authToken: string,
        privateKey: string,
        proxie: string,
    ) {
        const [ip, port, username, password] = proxie.split(':')
        this.instance = axios.create({
            headers: {
                'authority': 'api.cyberconnect.dev',
                'accept': '*/*',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'authorization': authToken,
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'origin': 'https://link3.to',
                'pragma': 'no-cache',
                'referer': 'https://link3.to/',
                'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            },
            proxy: false,
            httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(`http://${username}:${password}@${ip}:${port}`)
        })
        this.account = web3.eth.accounts.privateKeyToAccount(privateKey)
    }

    async getUnclaimedEvents(): Promise<event[]> {
        this.nonce = await web3.eth.getTransactionCount(this.account.address) - 1
        const res = await this.instance.post('https://api.cyberconnect.dev/profile/',  
            {
                'query': '\n    query getUnclaimedEvents {\n  me {\n    status\n    message\n    data {\n      unclaimedEvents {\n        id\n        info\n        title\n        posterUrl\n        startTimestamp\n        endTimestamp\n        status\n        registrantsCount\n        registerStatus\n        organizer {\n          ...Organizer\n        }\n        lightInfo {\n          hasRaffle\n          hasW3ST\n        }\n      }\n    }\n  }\n}\n    \n    fragment Organizer on Organization {\n  twitterId\n  id\n  followersCount\n  verification\n  currentAccess\n  lightInfo {\n    isFollowing\n    displayName\n    profilePicture\n    profileHandle\n  }\n}\n    ',
                'operationName': 'getUnclaimedEvents'
            },
        )

        if(res.data.data.me.status === 'SUCCESS')
            return res.data.data.me.data.unclaimedEvents
        else
            throw(res.data.errors)
    }
    
    async getClaimW3stStatus(eventId: string): Promise<w3stStatus> {
        const res = await this.instance.post('https://api.cyberconnect.dev/profile/',
            {
                'query': '\n    query getClaimW3stStatus($id: ID!) {\n  event(id: $id) {\n    organizer {\n      ...Organizer\n    }\n    w3st {\n      eligible {\n        unclaimed\n        claiming\n        claimed\n        stayTime\n        readyToClaim\n        claimedByOther\n        firstClaim\n        requirements {\n          eligible\n          requirement {\n            type\n            value\n          }\n        }\n      }\n    }\n  }\n}\n    \n    fragment Organizer on Organization {\n  twitterId\n  id\n  followersCount\n  verification\n  currentAccess\n  lightInfo {\n    isFollowing\n    displayName\n    profilePicture\n    profileHandle\n  }\n}\n    ',
                'variables': {
                'id': eventId
                },
                'operationName': 'getClaimW3stStatus'
            },
        )
        
        let flag = true
        let requirements: {}[] = []
        if(res) {
            for(let i of res.data.data.event.w3st.eligible.requirements) {
                if(!i.eligible) {
                    flag = false
                    if(i.requirement.type === 'FOLLOW') {
                        requirements.push({
                            type: i.requirement.type,
                            handle: res.data.data.event.organizer.lightInfo.profileHandle
                        })
                    }
                    else {
                        requirements.push({
                            type:i.requirement.type
                        })
                    }
                }  
            }
            if(flag)
                return {canClaim: true}
            else
                return {
                    canClaim: false,
                    requirements: requirements
                }
        } else {
            return {canClaim: false}
        }

    }

    async registerSignedKey(signingKey: string): Promise<boolean | string> {
        const message = `I authorize Link3 from this device using signing key:\n${signingKey}`
        const signature = this.account.sign(message).signature
    
        const response = await this.instance.post(
            'https://api.cyberconnect.dev/profile/',
            {
                'operationName': 'registerSigningKey',
                'query': 'mutation registerSigningKey($input:RegisterSigningKeyRequest!) {\n      registerSigningKey(input: $input) {\n\t      status\n      }\n    }',
                'variables': {
                    'input': {
                        'address': this.account.address,
                        'message': message,
                        'signature': signature
                    }
                }
            },
        );
        if(response.data.errors) {
            if(response.data.errors[0].message === 'Server Internal Error')
                return false
        }
        if(response.data.data.registerSigningKey.status === 'SUCCESS') {
            console.log(response.data.data.registerSigningKey.status)
            this.signingKey = signingKey 
            return true
        }
        else {
            console.log(response.data.data.registerSigningKey)
            return false
        }
    }

    async followOnLink3(handle: string): Promise<boolean | undefined> {
        while(true) {
            const param = await getParams(handle, this.account.address)
            const status = this.signingKey? true: await this.registerSignedKey(param.signingKey)? true: false

            if(status) {
                const response = await this.instance.post(
                    'https://api.cyberconnect.dev/profile/',
                    {
                        'operationName': 'follow',
                        'query': 'mutation follow($input: FollowRequest!) {\n\t          follow(input: $input) {\n\t\t\t  status\n\t\t\t  tsInServer\n\t\t  }\n    }',
                        'variables': {
                            'input': param
                        }
                    },
                )
                if(response.data.data.follow) {
                    console.log(response.data.data.follow)
                    console.log('тут')
                    return true
                }
            }
            else{
                await sleep(5)
                console.log('че то с signing key')
                this.signingKey = ''
            }
        }


        // if(this.signingKey === '') {
        //     if(await this.registerSignedKey(param.signingKey) === true) {
        //         const response = await this.instance.post(
        //             'https://api.cyberconnect.dev/profile/',
        //             {
        //                 'operationName': 'follow',
        //                 'query': 'mutation follow($input: FollowRequest!) {\n\t          follow(input: $input) {\n\t\t\t  status\n\t\t\t  tsInServer\n\t\t  }\n    }',
        //                 'variables': {
        //                     'input': param
        //                 }
        //             },
        //         )
        //         if(response.data.data.follow) {
        //             console.log('успешно подписались на ' + handle + ' ' + this.account.address)
        //             return true
        //         }
        //     }
        //     else{
        //         throw 'че то с signing key'
        //     }
        // }

    }

    async claimBadge(eventId: string): Promise<TransactionReceipt | any> {
        this.nonce++
        const res = await this.instance.post('https://api.cyberconnect.dev/profile/',
            {
                'query': '\n    mutation claimBadge($eventId: ID!, $chainId: Int!) {\n  collectW3ST(eventId: $eventId, chainId: $chainId) {\n    status\n    gasLess\n    collector\n    profileId\n    essenceId\n    preData\n    collectId\n  }\n}\n    ',
                'variables': {
                'eventId': eventId,
                'chainId': 56
                },
                'operationName': 'claimBadge'
            },
        ).then(res => res.data.data.collectW3ST).catch(e => {
            console.log(e.response.data, 'жопа')
            throw 'что то не так с получением даты на клейм'
        })

        const contractAddress = web3.utils.toChecksumAddress('0x2723522702093601e6360cae665518c4f63e9da6')
        const ABI = [{"inputs":[{"components":[{"internalType":"address","name":"collector","type":"address"},{"internalType":"uint256","name":"profileId","type":"uint256"},{"internalType":"uint256","name":"essenceId","type":"uint256"}],"internalType":"struct DataTypes.CollectParams","name":"params","type":"tuple"},{"internalType":"bytes","name":"preData","type":"bytes"},{"internalType":"bytes","name":"postData","type":"bytes"}],"name":"collect","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
        const contract = new web3.eth.Contract(ABI as any, contractAddress)
        console.log(res)
        // if(res.status ==)
        if(res.status !== 'SUCCESS' || res.gasLess) {
            throw 'gassless tx'
        }
        const data = contract.methods.collect(
            [res.collector, res.profileId, res.essenceId],
            res.preData,
            '0x',
        ).encodeABI()

        console.log('тут')
        try {
            const rawTx = await this.account.signTransaction({
                to: "0x2723522702093601e6360CAe665518C4f63e9dA6",
                nonce: this.nonce,
                gas: '160000',
                gasPrice: web3.utils.toWei('3', 'Gwei'),
                data: data,
            })
            console.log(`отправлена транзакция ${rawTx.transactionHash} с адресса ${this.account.address}`)
            return await web3.eth.sendSignedTransaction(rawTx.rawTransaction!)
        } catch (e: any) {
            console.log('йцуйвфы')
            return e 
        }
    }
}