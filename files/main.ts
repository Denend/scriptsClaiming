import { Login } from "./login.module";
import { Mint } from "./mint.module";
import * as readline from 'readline'
import * as fs from 'fs'

async function read(fileName: string) {
    const array: string[] = []
    const readInterface = readline.createInterface({
        input: fs.createReadStream(fileName),
        crlfDelay: Infinity,
    })
    for await (const line of readInterface) {
        array.push(line)
    }
    return array
}

async function main() {
    const privateKeys = await read('privates.txt')
    const proxies = await read('proxie.txt')

    for(let [i, keys] of privateKeys.entries()) {
        (async () => {
            const proxie = proxies[i]
            console.log(keys)
            const privateKey = keys
            console.log('регистрируем authorize token... ')
            const authToken = await Login.login(privateKey, proxies[i])
            console.log('токен получен')
    
            const mint = new Mint(authToken, privateKey, proxie)
            console.log('получаем все весты...')
            const unclaimedEvents = await mint.getUnclaimedEvents()
            console.log('весты получены')
    
            let counter = 0
            let maxCounter = 15
            let babFlag = true
            for(let event of unclaimedEvents) {
                const status = await mint.getClaimW3stStatus(event.id)
                if(status.canClaim === false) {
                    const canClaim = await (async() => {for(let requirement of status.requirements!) {
                        if(requirement.type === 'FOLLOW') {
                            if(await mint.followOnLink3(event.organizer.lightInfo.profileHandle)) {
                                console.log('успешно подписались на ' + event.organizer.lightInfo.profileHandle + ' ' + mint.account.address)
                            }
                        } else {
                            console.log('нужна доп хуйня, скорее всего КУС. Скипиаем ' + event.organizer.lightInfo.profileHandle + ' ' + mint.account.address)
                            babFlag = false
                            return false
                        }
                        return true
                    }})()
                    
                    if(canClaim) {
                        console.log(`клеймим ${event.organizer.lightInfo.profileHandle.toUpperCase()}`)
                        mint.claimBadge(event.id)
                            .catch(e => {
                                console.log(e)
                                return
                            })
                            .then(res => {
                                if(!res) {
                                    return
                                }
                                if(res.message) {
                                    console.log(res.message)
                                } else {
                                    counter++
                                    console.log(res)
                                } 
                            })
                    }
                } else {
                    console.log(`клеймим ${event.organizer.lightInfo.profileHandle.toUpperCase()}`)
                    mint.claimBadge(event.id)
                        .catch(e => {
                            console.log(e)
                        })
                        .then(res => {
                            if(!res) {
                                return
                            }
                            if(res.message) {
                                console.log(res.message)
                            } else {
                                counter++
                                console.log(res)
                            } 
                        })
                }
                console.log(counter)
                if(counter >= maxCounter) {
                    return
                }
    
                if(babFlag) {
                    console.log('спим')
                    await new Promise(resolve => setTimeout(() => resolve(''), Math.floor(Math.random() * (12000 - 10000)) + 10000))
                }

                babFlag = true
            }
        })()
    }
}

main()