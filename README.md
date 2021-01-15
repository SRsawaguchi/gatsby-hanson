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

### レイアウト

#### プラグインの利用
Gatsbyにはプラグインがたくさんある。  
ここでは、`Typography.js`のGatsbyプラグインを使ってみる。  

まずは、このハンズオンで必要なプラグインを`npm`でインストールする。  
※`docker-compose up`をしてコンテナが起動している状態で以下のコマンドを実行する。  
```
docker-compose exec web \
    npm install gatsby-plugin-typography react-typography typography typography-theme-fairy-gates
```

インストールが完了したら、`gatsby-config.js`を編集する。  
`gatsby-config.js`は特殊なファイルで、サイトに関する設定を記述できる。  

ここでは、先ほどインストールしたプラグイン`gatsby-plugin-typography`のための設定を追加する。  
※使い方は以下のURLを参照。  
https://www.gatsbyjs.com/plugins/gatsby-plugin-typography/

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
```

そして、先ほど設定した通り、`src/utils/typography`に各種設定を追加する。  
※ここら辺は利用するプラグインごとに、使い方をみて適宜必要な設定を追加する感じになる。  

あとは、`src/pages/index.js`などを編集したりアクセスしたりして`Typography.js`によって見た目が変更されていることを確認する。  
※プラグインの追加などを行った場合は、いちど開発サーバを再起動する必要がある。  

#### レイアウトコンポーネントの作成
Gatsbyでは、レイアウトにもReactコンポーネントを使う。  
※レイアウトのための特殊な仕組みが用意されているというわけではない。  

ここでは、`src/components/layout.js`というコンポーネントを作成する。  
今回は単純に各ページへのリンクがついたナビゲーションと、簡単なサイトのタイトルを表示するようなレイアウトを作成する。  

```javascript
import React from "react"
import { Children } from "react"
import { Link } from "gatsby"

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

export default function Layout({ children }) {
  return (
    <div style={{ margin: `3rem auto`, maxWidth: 650, padding: `0 1rem` }}>
      <header style={{ marginBottom: `1.5rem` }}>
        <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
          <h3 style={{ display: `inline`}}>MySweetSite</h3>
        </Link>
        <ul style={{ listStyle: `none`, float: `right` }}>
          <ListLink to="/">Home</ListLink>
          <ListLink to="/about/">About</ListLink>
          <ListLink to="/contact/">Contact</ListLink>
        </ul>
      </header>
      {children}
    </div>
  )
}
```

あとはこのようなレイアウト用のコンポーネントを各種ページで`import`して利用するだけ。  
通常のコンポーネントを利用する場合と同じ。  

以下は`src/pages/contact.js`でこのレイアウトを利用した場合の例。  

```javascript
import React from "react"
import Header from "../components/header"
import Layout from "../components/layout"

export default function About() {
  return (
    <Layout style={{color: `teal`}}>
      <Header headerText="About Gatsby" />
      <p>Such wow. Very React.</p>
    </Layout>
  )
}
```

### サイトのデータの扱い
GraphQLを使ってサイトのデータをReactコンポーネントの外に置く方法。  

まずは、このハンズオンで必要なプラグインを`npm`でインストールする。  
※前回のハンズオンで`Typography.js`などのインストールが完了しているため、差分のみインストールする。  
※`docker-compose up`をしてコンテナが起動している状態で以下のコマンドを実行する。  
```
docker-compose exec web \
    npm install typography-theme-kirkham gatsby-plugin-emotion @emotion/react
```

#### pages下でのGraphQLの利用
ここでは、サイトのタイトルを`gatsby-config.js`に書き出し、それを読み出してみる。  

以下のように、`gatsby-config.js`にサイトのタイトルを設定する。  
※`gatsby-config.js`に書いたものもGraphQLで取得できるみたい。  

```javascript
module.exports = {
  siteMetadata: {
    title: `Title from siteMetadata`,
  },
  plugins: [
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
```

これを`src/pages/about.js`で利用する。  
以下の点に注目。  

- Gatsbyが提供している`graphql`を`import`する。
- `query`という変数にGraphQLクエリを格納している。  
- GraphQLクエリの実行結果`About()`関数の引数`data`で取得できる。

```javascript
import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default function About({ data }) {
  return (
    <Layout>
      <h1>About {data.site.siteMetadata.title}</h1>
      <!-- 省略 -->
    </Layout>
  )
}

export const query = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
```

このように、複数のページで利用するデータを外に出しておくと、その値を編集するときに1カ所のみ変更すれば良くなる。(DRY)  
また、このように`pages`配下のコンポーネントは`page query`といって、そのページを描画するのに必要なデータをGraphQLで記述しておける。  
一方で、これは`pages`配下のコンポーネントしか使えない。  
例えば、`layout.js`のように、`pages`以外のコンポーネントでは、次に触れてみる`StaticQuery`を使う必要がある。  

#### pageコンポーネント以外でのGraphQLの利用
`page query`は`pages`配下のコンポーネントしか使えない。  
pageコンポーネント以外(`non-page component`)では、`StaticQuery`を使う。  
ここでは、`layout.js`を修正し、サイトのタイトルをGraphQLで取得する。  

```javascript
import React from "react"
// ...各種インポートを省略...
// StaticQueryを使うのに必要なgraphqlとuseStaticQueryをimportする。
import { graphql, useStaticQuery, Link } from "gatsby"

export default function Layout({ children }) {
  // StaticQueryを使ってデータを取得
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <!-- 省略 -->
    {data.site.siteMetadata.title}
    <!-- 省略 -->
  )
}
```

### SourcePlugins
前回はGraphQLを使って`gatsby-config.js`からデータを取得した。  
Gatsbyでは、それ以外にもAPIやファイル、DBやCMSなどからGraphQLを使ってデータを取得できる。  
それぞれのソースよりデータを取得するためには、取得したいソースに合った`SourcePlugin`をインストールする必要がある。  

#### SourcePluginのインストール
ここでは、ファイルシステムからからデータを取得してみる。  
まずは、以下のコマンドを実行して`gatsby-source-filesystem`をインストールする。  


※`docker-compose up`をしてコンテナが起動している状態で以下のコマンドを実行する。  

```
docker-compose exec web \
    npm install gatsby-source-filesystem
```

そして、`gatsby-config.js`にこのプラグインの設定を追加する。  

```javascript
module.exports = {
  // ... 省略
  plugins: [
    // ... 省略
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    // ... 省略
  ],
}
```

この記述を追加したら、開発サーバを再起動する。  
その後、GraphQLのIDEにアクセスすると、左側のExplorerに`file`と`allFiles`が追加されている。  
※GraphQLのIDEは以下のURLでアクセスする。  
http://localhost:8000/___graphql

GraphQLのIDEを使ってクエリを作って実行したりして試してみよう。  
例えば、`allFiles`をクリックして実行すると、ファイルの一覧が出てくるが、ファイル名がない。  
そこで、`base`をチェックして実行すると、ファイル名が表示される。  

#### SourcePluginの利用
ここでは、ファイル一覧を表示してみる。  
`src/pages/my-files.js`を作成して、以下のように記述する。  

```javascript
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

// 引数で`data`を受け取っておく。
export default function MyFiles({ data }) {
  return (
    <Layout>
      <h1>My Site's Files</h1>
      <table>
        <thead>
          <tr>
            <th>relativePath</th>
            <th>prettySize</th>
            <th>extension</th>
            <th>birthTime</th>
          </tr>
        </thead>
        <tbody>
          <!-- 取得したデータをmap()でHTMLにDOMに変換 -->
          {data.allFile.edges.map(({ node }, index) => (
            <tr key={index}>
              <td>{node.relativePath}</td>
              <td>{node.prettySize}</td>
              <td>{node.extension}</td>
              <td>{node.birthTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

// データを取得するQuery
export const query = graphql`
  query {
    allFile {
      edges {
        node {
          id
          relativePath
          prettySize
          extension
          birthTime(fromNow: true)
        }
      }
    }
  }
`
```

この状態で以下のURLにアクセスすると、ファイル一覧が表示される。  
http://localhost:8000/my-files

※クエリの作成はGraphQL IDEを使うとスムーズ。`Ctrl + space`の入力補完が使えたり、そもそもどんなデータを取得できるのかの一覧が見れたりする。その後、作成したクエリをコピーしてくると良い。  

### TransformerPlugins
TransformerPluginsを利用することで、データを便利な形に変換することができる。  
ここでは、Markdownで記述した記事をHTMLに変換してみる。  

#### TransformerPluginのインストール
まずは、プラグインをインストールする。  
これについては、これまでにやってきたのと同じ。  

まずは、npmを使って`gatsby-transformer-remark`をインストールする。  

```
docker-compose exec web \
    npm install gatsby-transformer-remark
```

インストールが完了したら、`gatsby-config.js`にプラグインを追加する。  

```javascript
module.exports = {
  // ...省略
  plugins: [
    // ...省略
    `gatsby-transformer-remark`,
    // ...省略
  ],
}
```

その後、開発サーバを再起動する。  

#### TransformerPluginの利用
ここでは実際にTransformerPlugin（`gatsby-transformer-remark`）を使ってみる。  
このプラグインの結果はGraphQLで取得できる。  
つまり、プラグインが有効になっていると、GraphQLで取得できるデータがその分増えると言うこと。  

GraphQL IDEにアクセスすると、左側のExplorerに`allMarkdownRemark`が現れており、GraphQLでこのデータを取得することで、TransformerPluginの出力結果を取得できる。

ここでは、その一連のプロセスを試してみる。  

まずは、Markdownのファイルを追加する。  
ここでは、`src/pages/sweet-pandas-eating-sweets.md`を作成し、以下の内容を保存する。  

```markdown
---
title: "Sweet Pandas Eating Sweets"
date: "2017-08-10"
---

Pandas are really sweet.

Here's a video of a panda eating sweets.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4n0xNbfJLR8" frameborder="0" allowfullscreen></iframe>
```

その後、GraphQL IDEにアクセスすると、Explorerに`allMarkdownRemark`というのが現れている。  
これをいくつか試すと、HTMLに変換したものが取得できることがわかる。  

つづいて、この情報を`index.js`に表示してみる。  
`src/pages/index.js`を以下のように書き換える。  

```javascript
import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
// ...各種インポートを省略...

export default function Home({ data }) {
  return (
    <Layout>
        <!-- 省略 -->
        <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
        <!-- ここでmarkdownから読み取ったデータを描画していく。 -->
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <h3>
              {node.frontmatter.title}{" "}
              <span> - {node.frontmatter.date}</span>
            </h3>
            <p>{node.excerpt}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

// GraphQLを使ってデータを取得(TransformerPluginより取得)
export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`
```

この状態で以下のURLにアクセスすると、記事の一覧が表示される。  
http://localhost:8000/  

### プログラム的ににページを生成する
Gatsbyを利用すれば、プログラム的にページを生成することができる。  
ここでは、Markdownからページを生成する。  

ページをプログラム的に生成するには、以下の2つの手順が必要。  

1. ページの`slug`を作成する。
1. ページを生成するコード（関数）を実行する。

#### slugを生成
slugを生成するには、プロジェクト直下にある`gatsby-node.js`を使う。（無ければ作る。）  
このファイルにはNodeが生成されたときのコールバックや、ページを生成する関数を`export`することができる。  
※`export`した関数はGatsbyに実行される。（名前が必ず一致していないといけない。）

ここでは`onCreateNode`という関数を`export`する。  
`onCreateNode`は、GraphQLの`nodes`が生成されたときに呼ばれる。  
ここでは、`MarkdownRemark`がNodeを作成した際に、そのNodeに`slug`とよばれるフィールドを追加する。  

```javascript
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, base: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
```
- `createFilePath()`は、`MarkdownRemark`の親ノード(`parent`)の`File`ノードにアクセスし、そこから`relativePath`を取得してパスを生成するGatsbyのヘルパープラグイン。  
- `createNodeField()`は、指定したNodeに、指定した名前と値でフィールドを追加する関数。
- 作成したフィールドは`fields.<name>`で取得できる。

詳しい説明は以下を参考にする。  
https://www.gatsbyjs.com/docs/tutorial/part-seven/

#### ページを作成
続いて、ページを作成していく。  
まずは、今回作成するページのテンプレートとなるReactコンポーネントを作成する。  
今回は`src/templates/blog-post.js`を作成する。  

```javascript
import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <Layout>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </Layout>
  )
}

// PageQueryを使ってMarkdownRemarkのnodeを抽出する。
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
```

そして`gatsby-node.js`で、`createPages`を`export`すると、これを実行してページを生成してくれる。  

```javascript
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)
// ...省略

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.fields.slug, // ここで`onCreateNode`で作成した`slug`フィールドを使う。
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        slug: node.fields.slug,
      }
    })
  })
}
```
先ほど作成した`fields.slug`を利用していることに注目。  
開発サーバを再起動したあと、以下のURLにアクセスすると、そのGatsbyサイトでアクセス可能なURLの一覧が表示される。  

http://localhost:8000/sdf  
※こちらは、単純に`404`のページに全てのリンクが表示されているというだけで、`sdf`という特殊なパスがあるわけではない。(キーボードの配列の`sdf`、つまり適当に入力したというだけ。)  

このように、全体としてやや込み入っているので注意が必要。  
以下の点を理解する必要がある。

- まずは`slug`をどのように作成するか考えること。
- `slug`は`gatsby-node.js`の`onCreateNode`などに書き、`export`すること。
- `slug`はReactコンポーネントなど、いくつかの部分で利用されるため、`createNodeField()`を使ってフィールド化しておくこと。
- 作成するページのテンプレートとなるReactコンポーネントを使うこと。（このコンポーネント中ではPageQueryが使える。）
- ページを作成する処理は`gatsby-node.js`の`createPages`として`export`すること。
- `gatsby-node.js`ではGraphQLの`node graph`をいったり来たりする必要がある。（GraphQL IDEを活用する。）

## サイトの公開

### Gatsbyのビルド
Gatsbyは以下のコマンドでビルドできる。  

```
gatsby build
```

コンテナ内で実行する場合は以下のようにする。  

```
docker-compose exec web \
    gatsby build
```

このコマンドを実行すると、`public`ディレクトリに静的なサイトとして出力される。  
そして、このサイトをローカルで実行するには次のようにする。  

```
gatsby serve --host=0.0.0.0
```

こちらも、コンテナ内で実行する場合は以下のようにする。  

```
docker-compose exec web \
    gatsby serve --host=0.0.0.0
```

### Auditツール（Lighthouse）の利用
※この項目では、コードの変更やパッケージのインストールなどは行わない。 

Gatsbyとはあまり関係ないが、Auditツールを使ってサイトの使いやすさ等を検証することができる。  
ここではGoogle製のAuditツールである`Lighthouse`を使う。  

このページからChromeの拡張機能をインストールする。  
https://developers.google.com/web/tools/lighthouse/

※コマンドラインで利用可能な`Lighthouse`もある。これを使えばCI/CDパイプラインにも組み込めるかもしれない。  


インストールが完了したら、`gatsby serve`で起動したビルド済みのサーバにアクセスする。  
そこで、Chromeの開発者ツールを起動して、`Lighthouse`タブにアクセスする。  
アクセスしたら、`Generate report`ボタンをクリックする。  

この設定が完了すると、以下のスコアが表示される。  

- Performance
- Accessibility
- Best Practices
- SEO
- Progressive Web App

これらのスコアを見ながらサイトを改善していくことができる。  
