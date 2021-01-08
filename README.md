# Gatsby Hanson

## gatsby new
以下のサイトを参考にしながら進めていく。  
https://www.gatsbyjs.com/docs/tutorial/part-zero/

まずは、Gatsbyのアプリを作成する。  
以下のコマンドを実行して、`node`のコンテナを起動する。  


```
docker run --rm -it -w="/code" -v $(pwd):/code node:14.15.3-alpine3.10 /bin/sh
```

コンテナの中で、以下のコマンドを実行する。  

```
apk add git
npm install -g gatsby-cli@2.17.0
gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
```

そうすると、ホストマシン上にも`hello-world`ディレクトリが作成される。  

コンテナ内で以下のコマンドを実行すると、初期化したアプリを実行することができる。  

## アプリの起動
先ほどのコンテナを停止して、今度はdocker-composeを利用して起動できる。  

```
docker-compose up
```

ビルドに成功したら、ブラウザで以下のURLにアクセスする。  
http://localhost:8000  


※`docker-compose.yaml`にあるように、以下のように`--host`を指定しないとホストマシンからアクセスできないので注意。  

```
gatsby develop --host=0.0.0.0
```

## ハンズオン
差分はコミットログ参照。

### 新しいページの追加
`src/pages`ディレクトリの中に、`*.js`を追加する。  
例えば、`about`ページを作成するなら、`src/pages/about.js`とする。  

このファイルの中身はReactコンポーネント。  
以下のようになる。  

```javascript
import React from "react"

export default function About() {
  return (
    <div style={{}}>
      <h1>About Gatsby</h1>
      <p>Such wow. Very React.</p>
    </div>
  )
}

```

このファイルを追加するだけで、`/about`にアクセスできるようになる。  
例えば、以下のようなURLになる。  

http://localhost:8000/about

### サブコンポーネント
ヘッダーなど、共通する部分をコンポーネントとして分割することができる。  
作成したサブコンポーネントを、それを使いたいところに`import`して使うという流れ。  
つまり、どこに何を格納するかは自由に決めて良いということ。  

ここでは、サブコンポーネントを格納するディレクトリとして、`src/components`を用意。  
その中に`*.js`を入れていく。このファイルの中も、先ほどの`pages`と同様にReactコンポーネントとなる。  

以下はサンプルの`src/components/header.js`。  

```javascript
import React from "react"

export default function Header(props) {
  return (
    <h1>{props.headerText}</h1>
  )
}
```

これは以下のように`import`して使うことができる。  

```javascript
import React from "react"
import Header from "../components/header"

export default function About() {
  return (
    <div style={{color: `teal`}}>
      <Header headerText="About Gatsby" />
      <p>Such wow. Very React.</p>
    </div>
  )
}
```

### リンク
Gatsbyで管理しているページ`src/pages`のページへのリンクを表示するには、`<Link />`コンポーネントを利用する。  
`<Link />`コンポーネントはGatsbyが提供しているものなので、`import`してから使う。  

例えば、`src/pages/contact.js`へのリンクを表示するには、以下のようにする。  

```javascript
import React from "react"
import { Link } from "gatsby"

export default function Home() {
  return (
    <div style={{ color: `purple`}}>
      <Link to="/contact/">Contact</Link>
    </div>
  )
}
```

ちなみに、Gatsbyで管理していない外部のページ（URL）にリンクするには、HTMLのデフォルトの`<a>`タグを使えばよい。  

### スタイル

#### CSSを直接読み込む
そのサイト全体に適用するCSSを直接読み込む場合、プロジェクト直下に`gatsby-browser.js`ファイルを作成して、その中に`import`すれば良い。  
このサンプルでは、`src/styles.global.css`ファイルを作成し、それを`gatsby-browser.js`で読み込んでいる。  

```javascript
import "./src/styles/global.css"
```
※このように、`gatsby-browser.js`に`import`するだけで、CSSを直接読み込むことができる。  


#### CSS Modulesを使う
CSSをモジュール化することができる。  
モジュール化したCSSをReactコンポーネントで`import`して使える。  
この際、クラス名は自動的にユニークな名前が割り当てられるため、サイトの中でクラス名が衝突する心配はない。  

ここでは、`src/components`ディレクトリに`container.js`を作成する。そして、この`Container`コンポーネントに適用するスタイルを`src/components/container.module.css`に記述する。  

※ここで、`*.module.css`というファイル名にするのは重要で、このパターンのファイル名にすることで、Gatsbyに「これはCSS Modulesのファイルだ」と認識させることができる。  

`container.js`では、以下のようにして`container.module.css`を`import`する。  

```javascript
import React from "react"
import containerStyles from "./container.module.css"

export default function Container({ children }) {
  return (
    <div className={containerStyles.container}>{children}</div>
  );
}
```

`className`に、`*.module.css`ファイルで定義したクラス名を指定する。  
例えば、`className={containerStyles.container}`という記述は以下のスタイルを参照している。  

```css
.container {
  margin: 3rem auto;
  max-width: 600px;
}
```

`import`したCSSは以下のようなオブジェクトになっている。  

```json
{
   "user":"about-css-modules-module--user--2CXbd",
   "avatar":"about-css-modules-module--avatar--2lRF7",
   "description":"about-css-modules-module--description--ev5yS",
   "username":"about-css-modules-module--username--2EBkm",
   "excerpt":"about-css-modules-module--excerpt--2Itwq"
}
```

これらは、`CSSで定義したクラス名`と`自動で割り当てられたユニークなクラス名`の連想配列になっている。  

