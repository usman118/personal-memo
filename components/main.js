/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
export default function Home(props) {
  let user = props.user || "";
  let userKey = props.userKey || "";
  let filterData = props.data || [];
  if (!Array.isArray(filterData.data)) {
    filterData.data = [filterData.data];
  }

  let [descriptionData, setDescriptionData] = useState(filterData.data);
  let [showForm, setShowForm] = useState(false);
  let [MemoValue, setMemoValue] = useState([]);
  const RefreshData = async () => {
    const res = await fetch("/api/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        privateKey: userKey,
      }),
    });

    const response = await res.json();
    console.log(response);

    if (!response) {
      console.log("No data found");
    } else {
      console.log("Data found");
      setDescriptionData(response.data);
    }
  };

  const OnDelete = (id) => {
    let newDescriptionData = descriptionData.filter((item) => item.id !== id);
    setDescriptionData(newDescriptionData);
    const SendRequest = async () => {
      const res = await fetch("/api/deleteData", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          privateKey: userKey,
          newData: id,
        }),
      });

      const response = await res.json();
      console.log(response);

      if (!response) {
        console.log("No data found");
      } else {
        console.log("Data deleted");
      }
    };
    SendRequest();
  };

  const onAddNew = (data) => {
    console.log(data, "dataNew");
    // let newDescriptionData = data;
    let newDescriptionData = descriptionData.filter(
      (item) => item.id !== data.id
    );
    console.log(newDescriptionData, "newDescriptionData");
    setDescriptionData(newDescriptionData);
    console.log(descriptionData, "newDescriptionData");
  };

  const OnEditData = (id) => {
    setShowForm(true);
    let newDescriptionData = descriptionData.filter((item) => item.id === id);
    setMemoValue(newDescriptionData);
  };
  return (
    <div className="h-screen ">
      <Navbar name={user} keyvalue={userKey} refresh={RefreshData} />
      <DisplayBoxes
        displaydata={descriptionData}
        deleteFunction={OnDelete}
        editFunction={OnEditData}
        formStatus={showForm}
        updateFormStatus={setShowForm}
        memoValue={MemoValue}
        setDisplayData={setDescriptionData}
        name={user}
        keyvalue={userKey}
        onAddNew={onAddNew}
      />
      {/* div at bottom */}
    </div>
  );
}

const Navbar = (props) => {
  return (
    <div className="sticky top-0 flex flex-row w-screen bg-black h-20">
      <div className="flex flex-row w-full justify-evenly items-center">
        <h1 className="text-xl text-center text-white">PersonalMemo</h1>
        <button
          className="text-xl text-center text-white "
          onClick={() => {
            props.refresh();
          }}
        >
          Refresh
        </button>
        <div className="flex flex-row justify-center items-center">
          <h1 className="text-xl text-center text-white">{props.name}</h1>
          {/* <h1 className="text-1xl text-center text-black hover:text-white">
            ({props.keyvalue})
          </h1> */}
        </div>
      </div>
    </div>
  );
};

const DisplayBoxes = (props) => {
  let mydata = props.displaydata;
  let OnDelete = props.deleteFunction;
  let OnEdit = props.editFunction;
  let showForm = props.formStatus;
  let setShowForm = props.updateFormStatus;
  let MemoValue = props.memoValue;
  let setDisplayData = props.setDisplayData;
  // console.log(mydata, "mydata");
  // create sharable link

  return (
    <div className="flex flex-col sm:justify-center items-center w-screen ">
      <div
        className={
          showForm
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-1 xl:gap-4 mt-2 opacity-50"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-1 xl:gap-4 mt-2 mx-auto"
        }
      >
        {mydata.map((item, index) => {
          return (
            <div
              className="flex flex-col w-screen sm:w-80 sm:h-64  bg-blue-200  sm:rounded-xl"
              key={item.id}
            >
              <div className="flex flex-row justify-between bg-blue-600  sm:rounded-t-xl">
                <h1 className="text-xl text-white text-start p-1 ">
                  {item.id}
                </h1>
                <h1 className="text-md text-white text-start p-1">
                  {item.date}
                </h1>
              </div>
              <div className="flex flex-row text-center justify-start bg-blue-500 ">
                <h1 className="ml-2 text-2xl text-white font-semibold">
                  {item.title.length < 20
                    ? item.title
                    : item.title.slice(0, 20) + "..."}
                </h1>
              </div>
              <p className="text-sm p-1 h-16 pt-4 mb-4">
                {item.description.length < 150
                  ? item.description
                  : item.description.slice(0, 150) + "..."}
                {item.description.length > 150 ? (
                  <button
                    className="text-md font-semibold "
                    onClick={() => {
                      OnEdit(item.id);
                    }}
                  >
                    Read More
                  </button>
                ) : (
                  ""
                )}
              </p>
              <div className="flex flex-row justify-evenly w-full items-center my-auto p-2 ">
                <button
                  className="bg-green-500 text-white w-1/4 h-10 rounded-md shadow-md"
                  onClick={() => {
                    OnEdit(item.id);
                  }}
                >
                  Edit
                </button>
                {item.id === "1" ? (
                  ""
                ) : (
                  <button
                    className="bg-red-500 text-white w-1/4 h-10 rounded-md shadow-md"
                    onClick={() => {
                      OnDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                )}
                {/* <button
                  className="bg-blue-600 text-white w-1/4 h-10 rounded-md shadow-md  "
                  onClick={() => {
                    createLink(item.id);
                  }}
                >
                  Share
                </button> */}
              </div>
            </div>
          );
        })}
        <AddNew
          DisplayData={mydata}
          setDisplayData={setDisplayData}
          name={props.name}
          keyvalue={props.keyvalue}
          onAddNew={props.onAddNew}
        />
      </div>
      {showForm ? (
        <DataForm
          setShowForm={setShowForm}
          idValue={MemoValue}
          setDisplayData={setDisplayData}
          DisplayData={mydata}
          name={props.name}
          keyvalue={props.keyvalue}
        />
      ) : (
        ""
      )}
    </div>
  );
};
const DataForm = (props) => {
  console.log("props", props);
  let setShowForm = props.setShowForm;
  let DisplayData = props.DisplayData;
  let setUpdatedValue = props.setDisplayData;
  const [title, setTitle] = useState(props.idValue[0].title || "");
  const [descriptions, setDescriptions] = useState(
    props.idValue[0].description || ""
  );
  const [date, setDate] = useState(props.idValue[0].date || "");
  const [id, setId] = useState(props.idValue[0].id || "");
  const onClickSave = () => {
    let data = {
      id: id,
      title: title,
      description: descriptions,
      date: date,
    };

    let index = DisplayData.findIndex((item) => item.id === data.id);
    DisplayData[index] = data;
    console.log("DisplayData", DisplayData);
    const SendRequest = async () => {
      const response = await fetch("/api/updateData", {
        method: "PUT",
        body: JSON.stringify({
          username: props.name,
          privateKey: props.keyvalue,
          newData: data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
    };
    SendRequest();
    setUpdatedValue(DisplayData);
  };

  return (
    <div
      className={
        title === "" || descriptions === "" || date === ""
          ? "fixed flex flex-row justify-center w-screen h-screen"
          : "fixed flex flex-col items-center justify-center bottom-0 w-screen h-screen"
      }
    >
      <div className="flex flex-col w-4/5 sm:w-3/6 sm:h-4/6 bg-white rounded-xl border-4 p-4 border-blue-400 shadow-2xl shadow-blue-600">
        <div className="flex flex-row justify-between">
          <button
            className="bg-red-500 text-white w-2/6 sm:w-1/6 h-10 rounded-md shadow-md"
            onClick={() => {
              setShowForm(false);
            }}
          >
            Close
          </button>
          <h1 className="text-sm sm:text-xl w-80 text-center sm:text-start p-1">
            {date}
          </h1>
          <button
            className="bg-blue-600 text-white w-2/4 sm:w-1/4 h-10 rounded-md shadow-md  "
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
        <div className="flex flex-col ">
          <label className="text-2xl text-start p-1 ">Title</label>
          <input
            type="text"
            className="rounded-md shadow-md p-2 border-black border-2 font-semibold "
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDate(
                new Date().toLocaleTimeString() +
                  " " +
                  new Date().toDateString()
              );
            }}
          />
          <label className="text-2xl text-start p-1 ">Descriptions</label>
          <textarea
            type="text"
            className="block max-h-fit h-96 rounded-md shadow-md p-2 border-black border-2 "
            value={descriptions}
            style={{ resize: "none" }}
            onChange={(e) => {
              setDescriptions(e.target.value);
              setDate(
                new Date().toLocaleTimeString() +
                  " " +
                  new Date().toDateString()
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AddNew = (props) => {
  // console.log("props", props);
  const [showForm, setShowForm] = useState(false);
  let DisplayData = props.DisplayData;
  let setUpdatedValue = props.setDisplayData;
  let maxId = DisplayData.map((item) => item.id);
  let max = Math.max(...maxId);
  // console.log("max", max + 1);
  let temp_data = [
    {
      id: (max + 1).toString(),
      title: "",
      description: "",
      date: "",
    },
  ];

  return (
    <>
      {!showForm ? (
        <div className="flex flex-col justify-center items-center ">
          <button
            onClick={() => {
              setShowForm(true);
            }}
          >
            <div className="flex flex-col w-40 h-40 sm:w-80 sm:h-64 bg-blue-300 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 sm:w-40 sm:h-40 text-white m-auto mt-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      ) : (
        // <DataForm idValue={temp_data} setShowForm={setShowForm} />
        <CreateNew
          setShowForm={setShowForm}
          idValue={temp_data}
          DisplayData={DisplayData}
          setUpdatedValue={setUpdatedValue}
          onAddNew={props.onAddNew}
          name={props.name}
          keyvalue={props.keyvalue}
        />
      )}
    </>
  );
};

const CreateNew = (props) => {
  // const [showForm, setShowForm] = useState(false);
  // console.log("props createnew", props);
  let setShowForm = props.setShowForm;
  let DisplayData = props.DisplayData;
  // let setUpdatedValue = props.setUpdatedValue;
  let onAddNew = props.onAddNew;

  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [date, setDate] = useState("");
  const onClickSave = () => {
    let data = {
      id: props.idValue[0].id,
      title: title,
      description: descriptions,
      date: date,
    };
    let index = DisplayData.findIndex((item) => item.id === data.id);
    if (index === -1) {
      DisplayData.push(data);
    } else {
      DisplayData[index] = data;
    }
    // console.log("DisplayData", DisplayData);
    const SendRequest = async () => {
      const response = await fetch("/api/addNew", {
        method: "POST",
        body: JSON.stringify({
          username: props.name,
          privateKey: props.keyvalue,
          newData: data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
    };
    SendRequest();
    onAddNew(DisplayData);
  };

  return (
    <div
      className={
        title === "" || descriptions === "" || date === ""
          ? "fixed flex flex-row justify-center right-0 w-screen "
          : "fixed flex flex-row justify-center right-0 w-screen "
      }
    >
      <div className="flex flex-col w-4/5 sm:w-3/6 sm:h-4/6 bg-white rounded-xl border-4 p-4 border-blue-400 shadow-2xl shadow-blue-600">
        <div className="flex flex-row justify-between">
          <button
            className="bg-red-500 text-white w-1/6 h-10 rounded-md shadow-md"
            onClick={() => {
              setShowForm(false);
            }}
          >
            Close
          </button>
          <h1 className="text-xl text-start  p-1">{date}</h1>
          <button
            className="bg-blue-600 text-white w-1/4 h-10 rounded-md shadow-md  "
            onClick={() => {
              if (title === "" || descriptions === "") {
                alert("Please fill all the fields");
                return;
              } else {
                onClickSave();
                setShowForm(false);
              }
            }}
          >
            Save
          </button>
        </div>
        <div className="flex flex-col ">
          <label className="text-2xl text-start p-1 ">Title</label>
          <input
            type="text"
            className="rounded-md shadow-md p-2 border-black border-2 font-semibold "
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDate(
                new Date().toLocaleTimeString() +
                  " " +
                  new Date().toDateString()
              );
            }}
          />
          <label className="text-2xl text-start p-1 ">Descriptions</label>
          <textarea
            type="text"
            className="block max-h-fit h-96 rounded-md shadow-md p-2 border-black border-2 "
            value={descriptions}
            style={{ resize: "none" }}
            onChange={(e) => {
              setDescriptions(e.target.value);
              setDate(
                new Date().toLocaleTimeString() +
                  " " +
                  new Date().toDateString()
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
