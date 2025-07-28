import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//     <App />
// );

// 开发环境启用 MSW
async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    console.log('开发环境，准备加载 MSW');
    const { worker } = await import('./mocks/browser');
    await worker.start({
    onUnhandledRequest: 'bypass', // 可选，调试时建议加上
    });
    console.log(' MSW 启动成功');
  } else {
    console.log(' 非开发环境，未启用 MSW');
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  );
});
