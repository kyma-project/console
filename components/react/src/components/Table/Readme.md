```jsx
<Table title="Example Table" columns={[{
    name: 'Name',
    size: 0.3,
    accesor: el => el.name,
}, {
    name: 'Name2',
    size: 0.4,
    accesor: el => el.name2,
}, {
    name: 'Name3',
    size: 0.3,
    accesor: el => el.name3,
    cell: <span style={{color: 'red'}}>Red</span>
}]} data={[
    {
        name: '1',
        name2: '2',
        name3: '3',
    }, {
        name: '1',
        name2: '2',
        name3: '3',
    }, {
        name: '1',
        name2: '2',
        name3: '3',
    }, {
        name: '1',
        name2: '2',
        name3: '3',
    }
]} loading/>
```