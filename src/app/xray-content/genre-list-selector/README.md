# Genre Dropdown Selector

## Setup

```
tempControl = this.fb.control([])
items = ['Action', 'Drama', 'Thriller', 'Horror']

constructor(
  private fb: FormBuilder
) {}

ngOnInit() {
    this.tempControl.valueChanges.subscribe(data => console.log(data))
}
```

### General Usage:

```
<app-genre-list-selector
  [min]="50"
  [max]="100"
  [formControl]="tempControl"
  [items]="items"
></app-genre-list-selector>
```
