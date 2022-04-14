import { useEffect } from "react"
import * as lib from "./lib"

function App() {

  useEffect(() => {
    (async () => {
      let message = {
        chain: 'cosmos',
        sender: 'xyz',
        type: 'cyd/auth',
        item_hash: 'fjnjkfbjkbg'
      }

      let account = await lib.getAccount("casual subway profit cactus impact nature blossom table drift march congress cruel", "m/44'/118'/0'/0/0", "cosmos")
      console.log({ account })
      let si = await lib.sign(account, message)
      window.si = si
      window.account = account
      console.log({ si })
    })()
  })
  window.lib = lib

  return (
    <div className="App">
      hi
    </div>
  );
}

export default App;