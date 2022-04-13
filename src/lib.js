import { sortObject } from './utils'
const { cosmosjs } = window
const secp256k1 = require('secp256k1')

var Buffer = require('buffer').Buffer
const CHAIN_ID = "signed-message-v1"


export function generateSignable(message) {
    let signableMessage = `${message.chain}\n${message.sender}\n${message.type}\n${message.item_hash}`

    let x = {
        chain_id: CHAIN_ID,
        account_number: "0",
        fee: {
            amount: [],
            gas: "0",
        },
        memo: "",
        sequence: "0",
        msgs: [{
            type: "signutil/MsgSignText",
            value: {
                message: signableMessage,
                signer: message.sender,
            }
        }]
    }

    window.xyz = x
    return x
}

export async function sign(account, message) {

    let signable = generateSignable(message)

    const cosmos = cosmosjs.network("...", CHAIN_ID)
    let signed = cosmos.sign(cosmos.newStdMsg(signable), Buffer.from(account.private_key, 'hex'))
    message.signature = JSON.stringify(signed?.tx?.signatures?.[0])

    let signature = signed?.tx?.signatures?.[0]?.signature
    console.log({signature})
    console.log(message.signature.signature)
    verifyMessage(account.public_key, signature,cosmos.newStdMsg(signable))
    return { message, signed }
}

export const getAccount = async (mnemonic, path, prefix) => {
    const cosmos = cosmosjs.network("...", CHAIN_ID)
    cosmos.setBech32MainPrefix(prefix)
    cosmos.setPath(path)

    let private_key = cosmos.getECPairPriv(mnemonic)

    return {
        'private_key': private_key.toString('hex'),
        'public_key': secp256k1.publicKeyCreate(private_key).toString('hex'),
        'mnemonic': mnemonic,
        'address': cosmos.getAddress(mnemonic),
        'prefix': prefix,
        'path': path,
    }
}

export const verifyMessage = async (publicKey, signature, msg) => {
    let signMessage = new Object;
    signMessage = msg.json;

    const json = JSON.stringify(sortObject(signMessage))
        .replace(/&/g, '\\u0026')
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')

    const hash = crypto.createHash('sha256').update(json).digest('hex');
    const buf = Uint8Array.from(Buffer.from(hash, 'hex'))
    var bool_ = secp256k1.verify(publicKey, signature, buf);
    console.log({bool_})
}

export const path = "m/44'/118'/0'/0/0"

export const prefix = "cosmos"

export const mnemonic = "casual subway profit cactus impact nature blossom table drift march congress cruel"