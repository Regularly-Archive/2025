<script>
import { WebContainer } from '@webcontainer/api';

export default {
  name: 'MyComponent',
  data() {
    return {
      webContainer: null,
      iframeUrl: '',
      output: ''
    };
  },
  async mounted() {
    // 初始化 WebContainer
    this.webContainer = await WebContainer.boot();

    // 定义文件内容
    const files = {
      "index.js": {
        file: {
          contents: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
        },
      },
      "App.js": {
        file: {
          contents: `
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>计数器</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}

export default App;
`,
        },
      },
      "index.html": {
        file: {
          contents: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Counter App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
`,
        },
      },
      "package.json": {
        file: {
          contents: `
{
  "name": "react-counter-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}`,
        },
      },
    };

    // 挂载文件
    await this.webContainer.mount(files);

    // 安装依赖
    const self = this;
    const installProcess = await this.webContainer.spawn('npm', ['install']);
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        self.output += data;
      }
    }));

    // 启动应用
    const startProcess = await this.webContainer.spawn('npm', ['run', 'start']);
    startProcess.output.pipeTo(new WritableStream({
      write(data) {
        self.output += data
      }
    }));

    this.webContainer.on('server-ready', (port, url) => {
      self.iframeUrl = url;
    });
  },
};
</script>

<template>
<div style="display: flex; height: 100vh; width: 100vw;">
    <div style="flex: 3; padding: 20px; background-color: black; color: white; overflow-y: auto;">
      <h1>WebContainer 输出</h1>
      <pre>{{ output }}</pre>
    </div>
    <div style="flex: 7; padding: 20px; border-left: 2px solid #ccc;">
      <h1>应用展示</h1>
      <iframe
        :src="iframeUrl"
        style="width: 100%; height: 100%; border: none;"
      ></iframe>
    </div>
  </div>
</template>