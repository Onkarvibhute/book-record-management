const { response, request } = require("express");
const express = require("express");
//json data import
const { users } = require("./data/users.json");
//importing route
const userRouter = require("./routes/users.js");
const bookRouter = require("./routes/books.js");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Server is up and running",
  });
});

app.use("/users", userRouter);
app.use("/books",bookRouter)

/**
 * Routes:/users
 * method:GET
 * Description:Get all users
 * Access: Public
 * Parameters:None
 */
app.get("/users", (request, response) =>
{
  response.status(200).json({
    success: true,
    data: users
  });
});

/**
 * Routes:/users/:id
 * method:GET
 * Description:Get all users by id
 * Access: Public
 * Parameters:None
 * kghyuhoi
 */
app.get("/users/:id", (request, response) =>
{
  const { id } = request.params
  const user = users.find((each) => each.id === id);
  if (!user)
  {
    return response.status(404).json({
      success: false,
      message: "user not found"
    })
  }
  return response.status(200).json({
    success: true,
    data: users,
  });
});
/**
 * Routes:/users
 * method:POST
 * Description:Create a new user
 * Access: Public
 * Parameters:None
 */
app.post("/users", (request, response) =>
{
  const { id, name, surname,email,subcriptionType, subcriptionDate } = request.body;
  const user = users.find((each) => each.id === id);

  
  if (user)
  {
    return response.status(404).json({
      success: false,
      message: "user exists with this id"
    });
  }

  users.push({
    id, name, email, surname, subcriptionType, subcriptionDate
  });
  return response.status(201).json({
    success: true,
    data: users,
  });
});

/**
 * Routes:/users/:id
 * method:PUT
 * Description:updating user data
 * Access: Public
 * Parameters:id
 */
app.put('/users/:id', (request, response) =>
{
  const { id } = request.params;
  const { data } = request.body;
  const user = users.find((each) => each.id === id);
  if (!user)
    return response.status(404).json({ success: false, message: "user not found" });
  
  const updateuser = users.map((each) =>{
    if (each.id === id)
    {
      return {
        ...each,
        ...data,
      };
    }
    return { each };
  });

  return response.status(200).json({
    success: true,
    data:updateuser,
  })
  });
  /**
   * Routes:/users/:id
   * method:DELETE
   * Description:delete a user by id
   * Access: Public
   * Parameters:id
   */
app.delete('/users/:id', (request, response) =>
{
  const { id } = request.params
  const user = users.find((each) => each.id === id);

  if (!user)
  {
    return response.status(404).json({
      success: false,
      message: "user to be deleted was not found",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);
  return response.status(202).json({
    success: true,
    data:users
  })

});

app.get("*", (request, response) => {
  response.status(404).json({
    message: "This route does not exist",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});



