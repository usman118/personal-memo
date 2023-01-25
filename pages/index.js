import { useEffect, useState } from "react";
import Home from "../components/main";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [login, setLogin] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    // if (!username || !privateKey) {
    //   alert("Please enter all fields");
    //   return;
    // }
    let SendRequest = async () => {
      // send POST request to API endpoint
      setLoading(true);
      const res = await fetch("/api/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          privateKey: privateKey,
        }),
      });
      const data = await res.json();
      setData(data);
      console.log(data);
      // if status code is not 200, throw an error
      if (data.message === "Wrong key") {
        alert("Wrong PIN");
        // reload page
        window.location.reload();

        return;
      }
      setLoading(false);
    };
    // check length of private key and username

    SendRequest();
    setLogin(true);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center bg-slate-700 w-full h-screen">
          <svg
            className="animate-spin -ml-1 mr-3 h-20 w-20 text-white mx-auto my-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      ) : login ? (
        <Home user={data.name} userKey={data.key} data={data} />
      ) : (
        <div className="flex flex-col bg-slate-700 w-full h-screen">
          <h1 className="text-4xl text-center text-white font-sans">
            PersonalMemo
          </h1>
          <div className="flex flex-col justify-center items-center my-auto">
            <div className="flex flex-col ">
              <h1 className="text-xl text-white p-4 mx-auto font-serif ">
                Login
              </h1>
              <form className="flex flex-col justify-center space-y-2">
                <label className="text-xl text-white">Username</label>
                <input
                  className="bg-slate-700 text-white border-2  w-96 h-10 text-center "
                  type="text"
                  placeholder="Username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <label className="text-xl text-white ">PrivateKey</label>
                <input
                  className="bg-slate-700 text-white border-2  w-96 h-10 text-center "
                  type="text"
                  placeholder="PrivateKey"
                  onChange={(e) => {
                    setPrivateKey(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-96 h-10"
                  // disabled={username.length < 3 || privateKey.length < 3}
                  onClick={() => {
                    if (username.length < 4 || privateKey.length < 4) {
                      alert("Username or PrivateKey is too short min 4 chars");
                      return;
                    } else {
                      onSubmit();
                    }
                  }}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
