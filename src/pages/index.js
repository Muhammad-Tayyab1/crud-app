import React, { useEffect, useState } from "react";

import {
  TextField,
  makeStyles,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";


const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    padding: "100px 0",
    backgroundColor: "#efefef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#efefef",
    },
  },
  container: {
    background: "aqua",
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "8px",
  },
  mainHeader: {
    color: "black",
    fontWeight: "bold"
  },
  TextField: {
    width: "100%",
    color: "#fff",
  },
  conetentContainer: {
    background: "#bfefff",
    margin: "3px 0",
    borderRadius: "4px",
  },
  content: {
    color: "black",
  },
  loader: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
  },
}));

export default function Home() {
  const classes = useStyle();
  const [data, setData] = useState("");
  const [alltodos, setalltodos] = useState([]);
  const [updateTodo, setUpdateTodo] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


useEffect(() => {

    (async () => {

      ;await fetch("/.netlify/functions/todos-read-all")
        .then((res) => res.json())
        .then((dataa) => {
            setalltodos(dataa);
     });

    })();

  }, [data, isloading, isUpdating, isDeleting]);




const handleDelete = (id) => {
    setIsDeleting(true);
    fetch("/.netlify/functions/todos-delete", {
      method: "delete",
      body: JSON.stringify(id),
    })
      .then((res) => res.json())
      .then((datas) => {
        setIsDeleting(false);
        setalltodos(undefined);
      });
  };




   const handleUpdate = async(id) => {

    

    const todoUpdate = alltodos.find((todo) => todo.ref["@ref"].id === id);

    const mynewMessage = prompt("Enter New Message", todoUpdate.data.message)

    setIsUpdating(true);


    await fetch(`/.netlify/functions/todos-update`, {
        method: "put",  
        body: JSON.stringify({
          id: todoUpdate.ref["@ref"].id,
          message: mynewMessage}),
      })
        .then(res => res.json())
        .then(data => {
          setIsUpdating(false)
          setUpdateTodo(undefined)
          setIsLoading(false)
          setalltodos(undefined)
          setData("")
        })
    }
  

  const handleSubmit = (event) => {
      event.preventDefault()
    fetch("/.netlify/functions/todos-create", {
      method: "POST",
      body: JSON.stringify({
          id: updateTodo === undefined ? "": updateTodo.ref["@ref"].id,
          message: data}),
    })
      .then((res) => res.json())
      .then((data) => {
            setIsLoading(false);
        setalltodos(undefined);
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Box pb={4}>
          <Typography
            align="center"
            variant="h5"
            className={classes.mainHeader}
          >
          CRUD-APP
          </Typography>
        </Box>
     
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
            
              id="outlined-basic"
              label="Write Message"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => setData(e.target.value)}
              value={data}
            />
          </div>

          <div>
            <Box mt={2}>
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                fullWidth
                type="submit"
                disabled={isloading ? true : false}
                style={{ color: "black",width:'100px',backgroundColor:'goldenrod' }}
              >
                ADD
              </Button>
            </Box>
          </div>
        </form>

        <div>
          <Box mt={3}>
            {!alltodos ? (
              <div className={classes.loader}>
                <CircularProgress color="secondary" />
              </div>
            ) : (
              alltodos.map((todo) => (
                <div
                  className={classes.conetentContainer}
                  key={todo.ref["@ref"].id}
                >
                  <Box py={2} px={3}>
                    <Typography className={classes.content}>
                      {todo?.data?.message}
                    </Typography>
                    <Box p={1}></Box>
                    <Button
                      style={{ margin: "0 4px 0 0px ",color: "black",width:'100px',backgroundColor:'#3352cc' }}
                      variant="contained"
                      color={"primary"}
                      size="small"
                      onClick={() => handleUpdate(todo.ref["@ref"].id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color={"secondary"}
                      onClick={() => handleDelete(todo.ref["@ref"].id)}
                      size="small"
                      disabled={isDeleting ? true : false}
                      style={{color: "black",width:'100px',backgroundColor:'red' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </div>
              ))
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
