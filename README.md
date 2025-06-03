# escapist-action

A GitHub Action that escapes special characters in strings.

## Usage

### Inputs

- `string` (required): The string to escape
- `characters` (required): Special characters to escape (comma-separated)
  - Default: `\,",\`,|,;,&,<,>,{,},[,],(,),$`

### Outputs

- `escaped`: The escaped string

### Basic Example

```yaml
name: Escape Special Characters
on: [push]

jobs:
  escape:
    runs-on: ubuntu-latest
    steps:
      - uses: tom-023/escapist-action@v1
        id: escape
        with:
          string: 'Hello "World" & <Friends>'
          characters: '",&,<,>'

      - name: Show escaped string
        run: echo "${{ steps.escape.outputs.escaped }}"
        # Output: Hello \"World\" \& \<Friends\>
```

### Custom Character Set

To escape only specific characters:

```yaml
- uses: tom-023/escapist-action@v1
  with:
    string: 'Price: $100 | Quantity: 5'
    characters: '$,|'
  # Output: Price: \$100 \| Quantity: 5
```

### Shell Script Example

```yaml
- uses: tom-023/escapist-action@v1
  id: escape
  with:
    string: ${{ github.event.pull_request.title }}
    characters: '",`,$'

- name: Use escaped string in shell
  run: |
    SAFE_TITLE="${{ steps.escape.outputs.escaped }}"
    echo "PR Title: $SAFE_TITLE"
```

## License

MIT
