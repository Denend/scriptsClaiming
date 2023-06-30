import axios from 'axios'
import Web3 from 'web3'
import { BigNumber} from 'ethers'
import HttpsProxyAgent from 'https-proxy-agent'

const web3 = new Web3('https://rpc.ankr.com/bsc')

const instance = axios.create({
    timeout: 20000,
    headers: {
        'authority': 'api.cyberconnect.dev',
        'accept': '*/*',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'authorization': '',
        'content-type': 'application/json',
        'origin': 'https://link3.to',
        'referer': 'https://link3.to/',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    },
})

export class Login {
    private static async getNonce(walletAddress: string, proxy: string): Promise<string> {
        const [ip, port, username, password] = proxy.split(':')
        const res = await instance.post('https://api.cyberconnect.dev/profile/', 
            {
                'query': '\n    mutation nonce($address: EVMAddress!) {\n  nonce(request: {address: $address}) {\n    status\n    message\n    data\n  }\n}\n    ',
                'variables': {
                'address': `${walletAddress}`
                },
                'operationName': 'nonce'
            },
            {
                proxy: false,
                httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(`http://${username}:${password}@${ip}:${port}`)
            }
        )
        return res.data.data.nonce.data
    }

    static async login(privateKey: string, proxy: string): Promise<string> { 
        const [ip, port, username, password] = proxy.split(':')
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)
        const nonce = await this.getNonce(account.address, proxy)
        const walletAddress = account.address
        const issuedAt = new Date().toISOString()
        const expirationTime = new Date(BigNumber.from(Date.now().toString()).add(BigNumber.from(7.776 * 10**8)).toNumber()).toISOString()
        const msg = `link3.to wants you to sign in with your Ethereum account:\n${walletAddress}\n\n\nURI: https://link3.to\nVersion: 1\nChain ID: 1\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expirationTime}\nNot Before: ${issuedAt}`
        
        const signature = account.sign(msg).signature
        const res = await instance.post('https://api.cyberconnect.dev/profile/',   
            {
                'query': '\n    mutation login($address: EVMAddress!, $signature: String!, $signedMessage: String!, $token: String, $isEIP1271: Boolean, $chainId: Int) {\n  login(\n    request: {address: $address, signature: $signature, signedMessage: $signedMessage, token: $token, isEIP1271: $isEIP1271, chainId: $chainId}\n  ) {\n    status\n    message\n    data {\n      id\n      privateInfo {\n        address\n        accessToken\n        kolStatus\n      }\n    }\n  }\n}\n    ',
                'variables': {
                'signedMessage': msg,
                'token': '',
                'address': walletAddress,
                'chainId': 1,
                'signature': signature,
                'isEIP1271': false
                },
                'operationName': 'login'
            },
            {
                timeout: 60000,
                proxy: false,
                httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(`http://${username}:${password}@${ip}:${port}`)
            }
        )

        if(res.data.data.login.status === 'SUCCESS'){
            return res.data.data.login.data.privateInfo.accessToken
        }
        else
            throw(res.data)
    }
}
