```jsx
<Input type="text" label="Input" required message="Error message" validFunctions={[
    (value) => {
        if(value.includes("error"))
        return {
            type: 'error',
            message: 'error message'
        }
    },
    (value) => {
        return {
            type: 'success'
        }
    }
]} />
```