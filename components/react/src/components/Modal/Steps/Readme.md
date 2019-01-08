```jsx
<StepsModal
    title="Steps Modal"
    handleConfirmation={() => {console.log(true)}}
    content={[
        (<div>one</div>),
        (<div>two</div>),
    ]}
    modalOpeningComponent={<div>Button</div>}
    modalAppRef= {'body'}
/>
```