# escapist-action

文字列内の特殊文字をエスケープするGitHub Actionです。

## 使用方法

### 入力

- `string` (必須): エスケープしたい文字列
- `characters` (必須): エスケープする特殊文字（カンマ区切り）
  - デフォルト: `\,",\`,|,;,&,<,>,{,},[,],(,),$`

### 出力

- `escaped`: エスケープされた文字列

### 使用例

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
        # 出力: Hello \"World\" \& \<Friends\>
```

### カスタム特殊文字の指定

特定の文字のみをエスケープしたい場合：

```yaml
- uses: tom-023/escapist-action@v1
  with:
    string: 'Price: $100 | Quantity: 5'
    characters: '$,|'
  # 出力: Price: \$100 \| Quantity: 5
```

### シェルスクリプトでの使用例

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

## ライセンス

MIT
