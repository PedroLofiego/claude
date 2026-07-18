import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Code-splitting: cada app só é baixado quando a rota pede.
const App = lazy(() => import("./App.jsx"));
const JapanApp = lazy(() => import("./japan/JapanApp.jsx"));

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <div className="floaty mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-3xl shadow-soft">
          ✈️
        </div>
        <div className="mt-4 text-sm font-semibold tracking-widest text-slate-300">
          VOAJÁ
        </div>
        <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="loader-bar h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {route.startsWith("#/japao") ? <JapanApp /> : <App />}
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
