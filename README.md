## Installation

```
npm i accounting-napp-form
```

## Usage

```javascript
import { useState } from 'react'

import { FormComponent } from 'accounting-napp-form'

function App() {
    const [params, setParams] = useState({
        pmc: "your_own_pmc",
        walletLoginToken: "your_own_walletLoginToken",
        entityLoginToken: "your_own_entityLoginToken",
        apiUrl: "your_own_apiUrl",
        apiKey: "your_own_apiKey",
        token: "your_own_token",
        walletguid: "your_own_walletguid",
    })

    return (
        <>
        <FormComponent parameters={params} />
        </>
    )
}

export default App

```

Note: You should write your own css based on your theme.# Accounting-napp-form
